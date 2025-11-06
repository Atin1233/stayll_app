/**
 * STAYLL v5.0 - Lease Fields Service
 * Atomic field extraction and management
 */

import { supabase } from '@/lib/supabase';
import type { LeaseField, ValidationState, SourceClauseLocation } from '@/types/v5.0';
import { ValidationEngine } from './validation';

export class LeaseFieldsService {
  /**
   * Create or update a lease field
   */
  static async upsertField(params: {
    lease_id: string;
    field_name: string;
    value_text?: string;
    value_normalized?: LeaseField['value_normalized'];
    source_clause_location?: SourceClauseLocation;
    extraction_confidence?: number;
    validation_state?: ValidationState;
    validation_notes?: string;
  }): Promise<{ success: boolean; field?: LeaseField; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Check if field already exists
      const { data: existing } = await supabase
        .from('lease_fields')
        .select('*')
        .eq('lease_id', params.lease_id)
        .eq('field_name', params.field_name)
        .single();

      let field: LeaseField;
      
      if (existing) {
        // Update existing field
        const { data: updated, error } = await supabase
          .from('lease_fields')
          .update({
            value_text: params.value_text,
            value_normalized: params.value_normalized,
            source_clause_location: params.source_clause_location,
            extraction_confidence: params.extraction_confidence,
            validation_state: params.validation_state || existing.validation_state,
            validation_notes: params.validation_notes,
            last_modified_by: user.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error || !updated) {
          return { success: false, error: 'Failed to update field' };
        }
        field = updated;
      } else {
        // Create new field
        const { data: created, error } = await supabase
          .from('lease_fields')
          .insert({
            lease_id: params.lease_id,
            field_name: params.field_name,
            value_text: params.value_text,
            value_normalized: params.value_normalized,
            source_clause_location: params.source_clause_location,
            extraction_confidence: params.extraction_confidence,
            validation_state: params.validation_state || 'candidate',
            validation_notes: params.validation_notes,
            last_modified_by: user.id
          })
          .select()
          .single();

        if (error || !created) {
          return { success: false, error: 'Failed to create field' };
        }
        field = created;
      }

      // Run validation if validation_state is candidate or auto
      if (field.validation_state === 'candidate' || field.validation_state === 'auto_pass') {
        const validationResult = ValidationEngine.validateField(field);
        
        if (validationResult.requires_qa || validationResult.overall_state !== 'auto_pass') {
          // Update field with validation result
          await supabase
            .from('lease_fields')
            .update({
              validation_state: validationResult.overall_state,
              validation_notes: validationResult.rules
                .filter(r => !r.passed)
                .map(r => r.message)
                .join('; ')
            })
            .eq('id', field.id);
          
          field.validation_state = validationResult.overall_state;
        }
      }

      return { success: true, field };
    } catch (error) {
      console.error('Upsert field error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get all fields for a lease
   */
  static async getLeaseFields(leaseId: string): Promise<{ 
    success: boolean; 
    fields?: LeaseField[]; 
    error?: string 
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: fields, error } = await supabase
        .from('lease_fields')
        .select('*')
        .eq('lease_id', leaseId)
        .order('field_name', { ascending: true });

      if (error) {
        return { success: false, error: 'Failed to fetch fields' };
      }

      return { success: true, fields: fields || [] };
    } catch (error) {
      console.error('Get lease fields error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update field (for reviewers)
   */
  static async updateField(
    fieldId: string, 
    updates: {
      value_text?: string;
      value_normalized?: LeaseField['value_normalized'];
      validation_state: ValidationState;
      validation_notes?: string;
    }
  ): Promise<{ success: boolean; field?: LeaseField; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
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
      const { data: updated, error } = await supabase
        .from('lease_fields')
        .update({
          ...updates,
          last_modified_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', fieldId)
        .select()
        .single();

      if (error || !updated) {
        return { success: false, error: 'Failed to update field' };
      }

      // Log audit event
      const { AuditService } = await import('./audit');
      await AuditService.logEvent({
        lease_id: field.lease_id,
        event_type: updates.validation_state === 'human_pass' ? 'FIELD_APPROVED' : 'FIELD_EDITED',
        payload: {
          field_id: fieldId,
          field_name: field.field_name,
          old_value: field.value_text,
          new_value: updates.value_text,
          validation_state: updates.validation_state
        }
      });

      return { success: true, field: updated };
    } catch (error) {
      console.error('Update field error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get fields that need QA review
   */
  static async getQAFields(orgId?: string): Promise<{ 
    success: boolean; 
    fields?: LeaseField[]; 
    error?: string 
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      let query = supabase
        .from('lease_fields')
        .select('*')
        .in('validation_state', ['flagged', 'rule_fail', 'candidate']);

      // If org_id provided, filter by leases in that org
      if (orgId) {
        query = query.eq('leases.org_id', orgId);
      }

      const { data: fields, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: 'Failed to fetch QA fields' };
      }

      return { success: true, fields: fields || [] };
    } catch (error) {
      console.error('Get QA fields error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Bulk create fields (for extraction results)
   */
  static async bulkCreateFields(
    leaseId: string,
    fields: Array<{
      field_name: string;
      value_text?: string;
      value_normalized?: LeaseField['value_normalized'];
      source_clause_location?: SourceClauseLocation;
      extraction_confidence?: number;
    }>
  ): Promise<{ success: boolean; created?: number; errors?: string[] }> {
    const errors: string[] = [];
    let created = 0;

    for (const fieldData of fields) {
      const result = await this.upsertField({
        lease_id: leaseId,
        ...fieldData
      });

      if (result.success) {
        created++;
      } else {
        errors.push(`${fieldData.field_name}: ${result.error}`);
      }
    }

    return {
      success: errors.length === 0,
      created,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

