/**
 * STAYLL v5.0 - Compliance Calendar Service
 * Generate events from renewal options, escalations, and obligations
 */

import type { LeaseSchema, NoticeEvent } from '@/types/leaseSchema';
import type { Obligation, ObligationType, ObligationStatus } from '@/types/v5.0';

export interface CalendarEvent {
  lease_id: string;
  date: string; // ISO date
  event_type: ObligationType;
  description: string;
  related_field_id?: string;
  due_window?: {
    start: string;
    end: string;
  };
  status: ObligationStatus;
}

export class ComplianceCalendarService {
  /**
   * Generate compliance events from lease schema
   */
  static generateEvents(leaseSchema: LeaseSchema): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    // 1. Generate renewal option events
    if (leaseSchema.term?.renewal_options) {
      for (const option of leaseSchema.term.renewal_options) {
        if (leaseSchema.term.expiration_date && option.notice_required_days) {
          const expirationDate = new Date(leaseSchema.term.expiration_date);
          const noticeDeadline = new Date(expirationDate);
          noticeDeadline.setDate(noticeDeadline.getDate() - option.notice_required_days);

          events.push({
            lease_id: leaseSchema.lease_id,
            date: noticeDeadline.toISOString().split('T')[0],
            event_type: 'renewal_notice',
            description: `Renewal Option ${option.option_number} Notice Deadline`,
            status: this.calculateStatus(noticeDeadline),
            due_window: {
              start: new Date(noticeDeadline.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days before
              end: noticeDeadline.toISOString().split('T')[0]
            }
          });
        }
      }
    }

    // 2. Generate escalation events
    if (leaseSchema.economics?.escalations) {
      for (const escalation of leaseSchema.economics.escalations) {
        if (escalation.effective_date) {
          events.push({
            lease_id: leaseSchema.lease_id,
            date: escalation.effective_date,
            event_type: 'escalation',
            description: `Rent Escalation: ${escalation.type} ${escalation.value}${escalation.type === 'percent' ? '%' : ''} ${escalation.frequency}`,
            status: this.calculateStatus(new Date(escalation.effective_date)),
            due_window: {
              start: escalation.effective_date,
              end: escalation.effective_date
            }
          });
        } else if (leaseSchema.term?.commencement_date && escalation.frequency !== 'one_time') {
          // Calculate next escalation date based on frequency
          const nextDate = this.calculateNextEscalationDate(
            leaseSchema.term.commencement_date,
            escalation.frequency
          );
          
          if (nextDate) {
            events.push({
              lease_id: leaseSchema.lease_id,
              date: nextDate.toISOString().split('T')[0],
              event_type: 'escalation',
              description: `Rent Escalation: ${escalation.type} ${escalation.value}${escalation.type === 'percent' ? '%' : ''} ${escalation.frequency}`,
              status: this.calculateStatus(nextDate),
              due_window: {
                start: nextDate.toISOString().split('T')[0],
                end: nextDate.toISOString().split('T')[0]
              }
            });
          }
        }
      }
    }

    // 3. Generate notice events from obligations
    if (leaseSchema.obligations?.notice_events) {
      for (const noticeEvent of leaseSchema.obligations.notice_events) {
        events.push({
          lease_id: leaseSchema.lease_id,
          date: noticeEvent.notice_date,
          event_type: this.mapNoticeTypeToObligationType(noticeEvent.event_type),
          description: noticeEvent.description || `Notice Required: ${noticeEvent.event_type}`,
          status: this.calculateStatus(new Date(noticeEvent.notice_date)),
          due_window: noticeEvent.days_before_event ? {
            start: new Date(new Date(noticeEvent.notice_date).getTime() - (noticeEvent.days_before_event + 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: noticeEvent.notice_date
          } : undefined
        });
      }
    }

    // 4. Generate lease expiration event
    if (leaseSchema.term?.expiration_date) {
      events.push({
        lease_id: leaseSchema.lease_id,
        date: leaseSchema.term.expiration_date,
        event_type: 'compliance_check',
        description: 'Lease Expiration Date',
        status: this.calculateStatus(new Date(leaseSchema.term.expiration_date)),
        due_window: {
          start: new Date(new Date(leaseSchema.term.expiration_date).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days before
          end: leaseSchema.term.expiration_date
        }
      });
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return events;
  }

  /**
   * Calculate next escalation date based on frequency
   */
  private static calculateNextEscalationDate(
    commencementDate: string,
    frequency: 'monthly' | 'quarterly' | 'annual'
  ): Date | null {
    const start = new Date(commencementDate);
    const now = new Date();
    
    if (start > now) {
      return null; // Lease hasn't started yet
    }

    let nextDate = new Date(start);

    if (frequency === 'annual') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      while (nextDate <= now) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
    } else if (frequency === 'quarterly') {
      nextDate.setMonth(nextDate.getMonth() + 3);
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 3);
      }
    } else if (frequency === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
    }

    return nextDate;
  }

  /**
   * Calculate event status based on date
   */
  private static calculateStatus(date: Date): ObligationStatus {
    const now = new Date();
    const daysDiff = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff < 0) {
      return 'overdue';
    } else if (daysDiff <= 30) {
      return 'pending';
    } else {
      return 'pending';
    }
  }

  /**
   * Map notice event type to obligation type
   */
  private static mapNoticeTypeToObligationType(
    noticeType: NoticeEvent['event_type']
  ): ObligationType {
    switch (noticeType) {
      case 'renewal_notice':
        return 'renewal_notice';
      case 'termination_notice':
        return 'compliance_check';
      case 'expansion_notice':
        return 'compliance_check';
      case 'rent_escalation':
        return 'escalation';
      default:
        return 'compliance_check';
    }
  }

  /**
   * Export events to ICS format
   */
  static exportToICS(events: CalendarEvent[]): string {
    let ics = 'BEGIN:VCALENDAR\n';
    ics += 'VERSION:2.0\n';
    ics += 'PRODID:-//Stayll AI//Compliance Calendar//EN\n';
    ics += 'CALSCALE:GREGORIAN\n';

    for (const event of events) {
      ics += 'BEGIN:VEVENT\n';
      ics += `UID:${event.lease_id}-${event.date}@stayll.ai\n`;
      ics += `DTSTART:${event.date.replace(/-/g, '')}\n`;
      ics += `SUMMARY:${event.description}\n`;
      ics += `DESCRIPTION:Lease ${event.lease_id} - ${event.description}\n`;
      ics += `STATUS:${event.status.toUpperCase()}\n`;
      ics += 'END:VEVENT\n';
    }

    ics += 'END:VCALENDAR\n';
    return ics;
  }

  /**
   * Export events to CSV format
   */
  static exportToCSV(events: CalendarEvent[]): string {
    const headers = ['Date', 'Lease ID', 'Event Type', 'Description', 'Status', 'Due Window Start', 'Due Window End'];
    const rows = events.map(event => [
      event.date,
      event.lease_id,
      event.event_type,
      event.description,
      event.status,
      event.due_window?.start || '',
      event.due_window?.end || ''
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }
}

