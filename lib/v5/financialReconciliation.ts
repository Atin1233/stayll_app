/**
 * STAYLL v5.0 - Financial Reconciliation Engine
 * Validate financial data and catch inconsistencies
 */

import type { LeaseSchema, ReconciliationWarning, ValidationError } from '@/types/leaseSchema';
import type { LeaseField } from '@/types/v5.0';

export interface ReconciliationResult {
  warnings: ReconciliationWarning[];
  errors: ValidationError[];
  passed: boolean;
}

export class FinancialReconciliationService {
  /**
   * Reconcile lease financial data
   */
  static reconcile(leaseSchema: Partial<LeaseSchema>, fields: LeaseField[]): ReconciliationResult {
    const warnings: ReconciliationWarning[] = [];
    const errors: ValidationError[] = [];

    // 1. Validate term dates
    const termValidation = this.validateTermDates(leaseSchema, fields);
    errors.push(...termValidation.errors);
    warnings.push(...termValidation.warnings);

    // 2. Reconcile rent schedule
    const rentReconciliation = this.reconcileRentSchedule(leaseSchema, fields);
    warnings.push(...rentReconciliation.warnings);
    errors.push(...rentReconciliation.errors);

    // 3. Validate escalations
    const escalationValidation = this.validateEscalations(leaseSchema, fields);
    errors.push(...escalationValidation.errors);
    warnings.push(...escalationValidation.warnings);

    // 4. Cross-check financial summaries
    const summaryCheck = this.checkFinancialSummaries(leaseSchema, fields);
    warnings.push(...summaryCheck.warnings);

    // 5. Rule-based red flags
    const redFlags = this.checkRedFlags(leaseSchema, fields);
    warnings.push(...redFlags.warnings);
    errors.push(...redFlags.errors);

    return {
      warnings,
      errors,
      passed: errors.length === 0
    };
  }

  /**
   * Validate term dates (start < end, reasonable dates)
   */
  private static validateTermDates(
    leaseSchema: Partial<LeaseSchema>,
    fields: LeaseField[]
  ): { errors: ValidationError[]; warnings: ReconciliationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ReconciliationWarning[] = [];

    const term = leaseSchema.term;
    if (!term) return { errors, warnings };

    // Check commencement < expiration
    if (term.commencement_date && term.expiration_date) {
      const start = new Date(term.commencement_date);
      const end = new Date(term.expiration_date);

      if (start >= end) {
        errors.push({
          field_name: 'term',
          error_type: 'logic',
          message: 'Commencement date must be before expiration date',
          severity: 'critical'
        });
      }

      // Check reasonable lease term (not too short, not too long)
      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (years < 0.5) {
        warnings.push({
          field_name: 'term',
          message: `Lease term is very short (${years.toFixed(1)} years)`,
          variance_percent: undefined
        });
      }
      if (years > 50) {
        warnings.push({
          field_name: 'term',
          message: `Lease term is very long (${years.toFixed(1)} years)`,
          variance_percent: undefined
        });
      }
    }

    // Check possession date is reasonable
    if (term.possession_date && term.commencement_date) {
      const possession = new Date(term.possession_date);
      const start = new Date(term.commencement_date);
      const daysDiff = (possession.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff < -90 || daysDiff > 365) {
        warnings.push({
          field_name: 'possession_date',
          message: `Possession date is ${Math.abs(daysDiff).toFixed(0)} days from commencement`,
          variance_percent: undefined
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Reconcile rent schedule with base rent
   */
  private static reconcileRentSchedule(
    leaseSchema: Partial<LeaseSchema>,
    fields: LeaseField[]
  ): { warnings: ReconciliationWarning[]; errors: ValidationError[] } {
    const warnings: ReconciliationWarning[] = [];
    const errors: ValidationError[] = [];

    const economics = leaseSchema.economics;
    if (!economics || !economics.base_rent_schedule || economics.base_rent_schedule.length === 0) {
      return { warnings, errors };
    }

    const schedule = economics.base_rent_schedule;
    const term = leaseSchema.term;

    // Check schedule covers term
    if (term?.commencement_date && term?.expiration_date) {
      const termStart = new Date(term.commencement_date);
      const termEnd = new Date(term.expiration_date);
      const scheduleStart = new Date(schedule[0].start_date);
      const scheduleEnd = new Date(schedule[schedule.length - 1].end_date);

      const startGap = (scheduleStart.getTime() - termStart.getTime()) / (1000 * 60 * 60 * 24);
      const endGap = (termEnd.getTime() - scheduleEnd.getTime()) / (1000 * 60 * 60 * 24);

      if (startGap > 30) {
        warnings.push({
          field_name: 'base_rent_schedule',
          message: `Rent schedule starts ${startGap.toFixed(0)} days after lease commencement`,
          variance_percent: undefined
        });
      }

      if (endGap > 30) {
        warnings.push({
          field_name: 'base_rent_schedule',
          message: `Rent schedule ends ${endGap.toFixed(0)} days before lease expiration`,
          variance_percent: undefined
        });
      }
    }

    // Calculate total annual rent from schedule
    const totalAnnualRent = this.calculateTotalAnnualRent(schedule);

    // Check for negative or zero rents
    for (const entry of schedule) {
      if (entry.amount <= 0) {
        errors.push({
          field_name: 'base_rent_schedule',
          error_type: 'financial',
          message: `Rent schedule entry has non-positive amount: $${entry.amount}`,
          severity: 'high'
        });
      }
    }

    // Check for gaps or overlaps in schedule
    for (let i = 0; i < schedule.length - 1; i++) {
      const currentEnd = new Date(schedule[i].end_date);
      const nextStart = new Date(schedule[i + 1].start_date);
      const daysDiff = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff > 1) {
        warnings.push({
          field_name: 'base_rent_schedule',
          message: `Gap of ${daysDiff.toFixed(0)} days between rent periods`,
          variance_percent: undefined
        });
      } else if (daysDiff < -1) {
        warnings.push({
          field_name: 'base_rent_schedule',
          message: `Overlap of ${Math.abs(daysDiff).toFixed(0)} days between rent periods`,
          variance_percent: undefined
        });
      }
    }

    return { warnings, errors };
  }

  /**
   * Validate escalations
   */
  private static validateEscalations(
    leaseSchema: Partial<LeaseSchema>,
    fields: LeaseField[]
  ): { errors: ValidationError[]; warnings: ReconciliationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ReconciliationWarning[] = [];

    const escalations = leaseSchema.economics?.escalations || [];

    for (const escalation of escalations) {
      // Validate percentage escalations
      if (escalation.type === 'percent') {
        if (escalation.value < 0 || escalation.value > 20) {
          warnings.push({
            field_name: 'escalations',
            message: `Escalation percentage (${escalation.value}%) seems unusual`,
            variance_percent: undefined
          });
        }
      }

      // Validate cap/floor logic
      if (escalation.cap !== undefined && escalation.floor !== undefined) {
        if (escalation.floor > escalation.cap) {
          errors.push({
            field_name: 'escalations',
            error_type: 'logic',
            message: `Escalation floor (${escalation.floor}%) is greater than cap (${escalation.cap}%)`,
            severity: 'high'
          });
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Check financial summaries (if lease has a summary section)
   */
  private static checkFinancialSummaries(
    leaseSchema: Partial<LeaseSchema>,
    fields: LeaseField[]
  ): { warnings: ReconciliationWarning[] } {
    const warnings: ReconciliationWarning[] = [];

    // Look for summary fields in extracted fields
    const summaryRentField = fields.find(f => 
      f.field_name.includes('summary') && f.field_name.includes('rent')
    );

    if (summaryRentField && leaseSchema.economics?.base_rent_schedule) {
      const calculatedTotal = this.calculateTotalAnnualRent(leaseSchema.economics.base_rent_schedule);
      const summaryValue = summaryRentField.value_normalized?.numeric;

      if (summaryValue) {
        const variance = Math.abs(calculatedTotal - summaryValue) / summaryValue;
        if (variance > 0.02) { // 2% threshold
          warnings.push({
            field_name: 'base_rent_schedule',
            expected_value: summaryValue,
            actual_value: calculatedTotal,
            variance_percent: variance * 100,
            message: `Rent schedule total ($${calculatedTotal.toLocaleString()}) differs from summary ($${summaryValue.toLocaleString()}) by ${(variance * 100).toFixed(1)}%`
          });
        }
      }
    }

    return { warnings };
  }

  /**
   * Check rule-based red flags
   */
  private static checkRedFlags(
    leaseSchema: Partial<LeaseSchema>,
    fields: LeaseField[]
  ): { warnings: ReconciliationWarning[]; errors: ValidationError[] } {
    const warnings: ReconciliationWarning[] = [];
    const errors: ValidationError[] = [];

    // Check for renewal options mentioned but not extracted
    const renewalMentioned = fields.some(f => 
      f.value_text?.toLowerCase().includes('renewal') ||
      f.value_text?.toLowerCase().includes('option to renew')
    );
    
    if (renewalMentioned && (!leaseSchema.term?.renewal_options || leaseSchema.term.renewal_options.length === 0)) {
      warnings.push({
        field_name: 'renewal_options',
        message: 'Renewal options mentioned in text but not extracted',
        variance_percent: undefined
      });
    }

    // Check for free rent mentioned but not in schedule
    const freeRentMentioned = fields.some(f =>
      f.value_text?.toLowerCase().includes('free rent') ||
      f.value_text?.toLowerCase().includes('rent abatement')
    );

    if (freeRentMentioned && (!leaseSchema.term?.free_rent_periods || leaseSchema.term.free_rent_periods.length === 0)) {
      warnings.push({
        field_name: 'free_rent_periods',
        message: 'Free rent mentioned in text but not extracted',
        variance_percent: undefined
      });
    }

    // Check for notice requirements mentioned but not extracted
    const noticeMentioned = fields.some(f =>
      f.value_text?.toLowerCase().includes('notice') &&
      f.value_text?.toLowerCase().match(/\d+\s*days/)
    );

    if (noticeMentioned && (!leaseSchema.obligations?.notice_events || leaseSchema.obligations.notice_events.length === 0)) {
      warnings.push({
        field_name: 'notice_events',
        message: 'Notice requirements mentioned but not extracted',
        variance_percent: undefined
      });
    }

    return { warnings, errors };
  }

  /**
   * Calculate total annual rent from schedule
   */
  private static calculateTotalAnnualRent(schedule: LeaseSchema['economics']['base_rent_schedule']): number {
    let total = 0;

    for (const entry of schedule) {
      const start = new Date(entry.start_date);
      const end = new Date(entry.end_date);
      const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44); // Average days per month

      if (entry.frequency === 'monthly') {
        total += entry.amount * months;
      } else if (entry.frequency === 'quarterly') {
        total += entry.amount * (months / 3);
      } else if (entry.frequency === 'annual') {
        total += entry.amount * (months / 12);
      }
    }

    return total;
  }
}

