/**
 * STAYLL v5.0 - Audit Service
 * Immutable event logging for compliance and traceability
 */

import { supabase } from '@/lib/supabase';
import type { AuditEvent, AuditEventType } from '@/types/v5.0';

export class AuditService {
  /**
   * Log an audit event
   */
  static async logEvent(params: {
    org_id?: string;
    lease_id?: string;
    user_id?: string;
    event_type: AuditEventType;
    payload?: Record<string, any>;
  }): Promise<{ success: boolean; event?: AuditEvent; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Get current user if not provided
      let userId = params.user_id;
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }

      // Get org_id if not provided
      let orgId = params.org_id;
      if (!orgId && params.lease_id) {
        const { data: lease } = await supabase
          .from('leases')
          .select('org_id')
          .eq('id', params.lease_id)
          .single();
        orgId = lease?.org_id;
      }

      const { data: event, error } = await supabase
        .from('audit_events')
        .insert({
          org_id: orgId,
          lease_id: params.lease_id,
          user_id: userId,
          event_type: params.event_type,
          payload: params.payload || {},
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error || !event) {
        console.error('Audit log error:', error);
        return { success: false, error: 'Failed to log audit event' };
      }

      return { success: true, event };
    } catch (error) {
      console.error('Audit service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get audit events for a lease
   */
  static async getLeaseAuditEvents(leaseId: string): Promise<{ 
    success: boolean; 
    events?: AuditEvent[]; 
    error?: string 
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: events, error } = await supabase
        .from('audit_events')
        .select('*')
        .eq('lease_id', leaseId)
        .order('timestamp', { ascending: false });

      if (error) {
        return { success: false, error: 'Failed to fetch audit events' };
      }

      return { success: true, events: events || [] };
    } catch (error) {
      console.error('Get audit events error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get audit events for an organization
   */
  static async getOrganizationAuditEvents(orgId: string, limit = 100): Promise<{ 
    success: boolean; 
    events?: AuditEvent[]; 
    error?: string 
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: events, error } = await supabase
        .from('audit_events')
        .select('*')
        .eq('org_id', orgId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: 'Failed to fetch audit events' };
      }

      return { success: true, events: events || [] };
    } catch (error) {
      console.error('Get audit events error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

