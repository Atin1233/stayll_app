/**
 * STAYLL v5.0 - QA Service
 * Human-in-the-loop quality assurance
 */

import { supabase } from '@/lib/supabase';
import type { LeaseField, ValidationState } from '@/types/v5.0';
import type { LeaseSchema } from '@/types/leaseSchema';
import { AuditService } from './audit';

export interface QATask {
  id: string;
  lease_id: string;
  field_id: string;
  field_name: string;
  current_value: any;
  validation_state: ValidationState;
  confidence: number;
  source_clause?: string;
  flags?: string[];
  created_at: string;
}

export interface QAQueueFilter {
  org_id?: string;
  min_confidence?: number;
  validation_states?: ValidationState[];
  financial_value_threshold?: number;
}

export class QAService {
  /**
   * Get QA queue based on filters
   */
  static async getQAQueue(filter: QAQueueFilter = {}): Promise<{
    success: boolean;
    tasks?: QATask[];
    error?: string;
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      let query = supabase
        .from('lease_fields')
        .select(`
          *,
          leases!inner(
            id,
            org_id,
            base_rent,
            confidence_score
          )
        `)
        .in('validation_state', filter.validation_states || ['flagged', 'rule_fail', 'candidate']);

      // Filter by org
      if (filter.org_id) {
        query = query.eq('leases.org_id', filter.org_id);
      }

      // Filter by confidence
      if (filter.min_confidence !== undefined) {
        query = query.lt('extraction_confidence', filter.min_confidence);
      }

      const { data: fields, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: 'Failed to fetch QA queue' };
      }

      // Convert to QA tasks
      const tasks: QATask[] = (fields || []).map(field => ({
        id: field.id,
        lease_id: field.lease_id,
        field_id: field.id,
        field_name: field.field_name,
        current_value: field.value_text || field.value_normalized,
        validation_state: field.validation_state,
        confidence: field.extraction_confidence || 0,
        source_clause: field.source_clause_location?.clause_text,
        flags: field.validation_notes ? [field.validation_notes] : [],
        created_at: field.created_at
      }));

      // Filter by financial value if threshold provided
      let filteredTasks = tasks;
      if (filter.financial_value_threshold) {
        filteredTasks = tasks.filter(task => {
          const lease = (field as any)?.leases;
          const baseRent = lease?.base_rent || 0;
          return baseRent >= filter.financial_value_threshold!;
        });
      }

      // Sort by priority (high confidence issues first, then by financial value)
      filteredTasks.sort((a, b) => {
        // Higher priority for lower confidence
        if (a.confidence !== b.confidence) {
          return a.confidence - b.confidence;
        }
        return 0;
      });

      return { success: true, tasks: filteredTasks };
    } catch (error) {
      console.error('Get QA queue error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Approve a field (mark as human-verified)
   */
  static async approveField(
    fieldId: string,
    userId: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Get field to check lease ownership
      const { data: field } = await supabase
        .from('lease_fields')
        .select('*, leases!inner(org_id)')
        .eq('id', fieldId)
        .single();

      if (!field) {
        return { success: false, error: 'Field not found' };
      }

      // Update field
      const { error: updateError } = await supabase
        .from('lease_fields')
        .update({
          validation_state: 'human_pass',
          validation_notes: notes,
          last_modified_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', fieldId);

      if (updateError) {
        return { success: false, error: 'Failed to approve field' };
      }

      // Log audit event
      await AuditService.logEvent({
        lease_id: field.lease_id,
        user_id: userId,
        event_type: 'FIELD_APPROVED',
        payload: {
          field_id: fieldId,
          field_name: field.field_name,
          notes
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Approve field error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Edit a field (human override)
   */
  static async editField(
    fieldId: string,
    userId: string,
    updates: {
      value_text?: string;
      value_normalized?: LeaseField['value_normalized'];
      validation_notes?: string;
    }
  ): Promise<{ success: boolean; field?: LeaseField; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Get field
      const { data: field } = await supabase
        .from('lease_fields')
        .select('*')
        .eq('id', fieldId)
        .single();

      if (!field) {
        return { success: false, error: 'Field not found' };
      }

      // Update field
      const { data: updated, error: updateError } = await supabase
        .from('lease_fields')
        .update({
          ...updates,
          validation_state: 'human_edit',
          last_modified_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', fieldId)
        .select()
        .single();

      if (updateError || !updated) {
        return { success: false, error: 'Failed to update field' };
      }

      // Log audit event
      await AuditService.logEvent({
        lease_id: field.lease_id,
        user_id: userId,
        event_type: 'FIELD_EDITED',
        payload: {
          field_id: fieldId,
          field_name: field.field_name,
          old_value: field.value_text || field.value_normalized,
          new_value: updates.value_text || updates.value_normalized,
          notes: updates.validation_notes
        }
      });

      return { success: true, field: updated };
    } catch (error) {
      console.error('Edit field error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Approve entire lease (mark all fields as approved)
   */
  static async approveLease(
    leaseId: string,
    userId: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Get all fields for lease
      const { data: fields } = await supabase
        .from('lease_fields')
        .select('id')
        .eq('lease_id', leaseId);

      if (!fields || fields.length === 0) {
        return { success: false, error: 'No fields found for lease' };
      }

      // Update all fields
      const { error: updateError } = await supabase
        .from('lease_fields')
        .update({
          validation_state: 'human_pass',
          last_modified_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('lease_id', leaseId)
        .in('validation_state', ['flagged', 'rule_fail', 'candidate']);

      if (updateError) {
        return { success: false, error: 'Failed to approve lease' };
      }

      // Update lease verification status
      await supabase
        .from('leases')
        .update({
          verification_status: 'verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', leaseId);

      // Log audit event
      await AuditService.logEvent({
        lease_id: leaseId,
        user_id: userId,
        event_type: 'LEASE_VERIFIED',
        payload: {
          fields_approved: fields.length,
          notes
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Approve lease error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get fields that need QA for a specific lease
   */
  static async getLeaseQAFields(leaseId: string): Promise<{
    success: boolean;
    fields?: LeaseField[];
    error?: string;
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: fields, error } = await supabase
        .from('lease_fields')
        .select('*')
        .eq('lease_id', leaseId)
        .in('validation_state', ['flagged', 'rule_fail', 'candidate'])
        .order('extraction_confidence', { ascending: true });

      if (error) {
        return { success: false, error: 'Failed to fetch QA fields' };
      }

      return { success: true, fields: fields || [] };
    } catch (error) {
      console.error('Get lease QA fields error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

