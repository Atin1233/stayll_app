/**
 * STAYLL v5.0 - Lease Field Update API
 * Allows reviewers to approve or edit extracted fields
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { FieldUpdateRequest, ValidationState } from '@/types/v5.0';
import { AuditService } from '@/lib/v5/audit';

const DEFAULT_ORG_ID = 'default-org';
const DEFAULT_USER_ID = 'default-user';
const VERIFIED_STATES: ValidationState[] = ['human_pass', 'human_edit', 'auto_pass'];
const PENDING_STATES: ValidationState[] = ['flagged', 'rule_fail', 'candidate'];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ leaseId: string; fieldId: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { leaseId, fieldId } = await context.params;

    const payload = (await request.json()) as FieldUpdateRequest;
    if (!payload || !payload.validation_state) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    let orgId = DEFAULT_ORG_ID;
    let userId = DEFAULT_USER_ID;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profile?.organization_id) {
        orgId = profile.organization_id;
      }
    }

    const { data: field, error: fieldError } = await supabase
      .from('lease_fields')
      .select('id, lease_id, field_name, value_text, validation_state, validation_notes, leases:leases!inner(org_id)')
      .eq('id', fieldId)
      .eq('lease_id', leaseId)
      .single();

    if (fieldError || !field) {
      return NextResponse.json({ error: 'Field not found' }, { status: 404 });
    }

    if (field.leases?.org_id && field.leases.org_id !== orgId) {
      return NextResponse.json({ error: 'Access denied for this organization' }, { status: 403 });
    }

    const updatePayload: Record<string, any> = {
      validation_state: payload.validation_state,
      validation_notes: payload.validation_notes ?? null,
      last_modified_by: userId,
      updated_at: new Date().toISOString(),
    };

    if (payload.value_text !== undefined) {
      updatePayload.value_text = payload.value_text;
    }

    if (payload.value_normalized !== undefined) {
      updatePayload.value_normalized = payload.value_normalized;
    }

    const { data: updatedField, error: updateError } = await supabase
      .from('lease_fields')
      .update(updatePayload)
      .eq('id', fieldId)
      .select('id, lease_id, field_name, value_text, validation_state, extraction_confidence, source_clause_location, updated_at')
      .single();

    if (updateError || !updatedField) {
      console.error('Field update error:', updateError);
      return NextResponse.json({ error: 'Failed to update field' }, { status: 500 });
    }

    await AuditService.logEvent({
      org_id: orgId,
      lease_id: leaseId,
      user_id: userId,
      event_type: payload.validation_state === 'human_pass' ? 'FIELD_APPROVED' : 'FIELD_EDITED',
      payload: {
        field_id: fieldId,
        field_name: field.field_name,
        previous_state: field.validation_state,
        new_state: payload.validation_state,
        previous_value: field.value_text,
        new_value: payload.value_text ?? field.value_text,
        notes: payload.validation_notes,
      },
    });

    const { data: leaseFields } = await supabase
      .from('lease_fields')
      .select('id, validation_state, extraction_confidence')
      .eq('lease_id', leaseId);

    if (leaseFields) {
      const hasPending = leaseFields.some((f) => PENDING_STATES.includes(f.validation_state as ValidationState));
      const allVerified = leaseFields.length > 0 && leaseFields.every((f) => VERIFIED_STATES.includes(f.validation_state as ValidationState));
      const verifiedCount = leaseFields.filter((f) => VERIFIED_STATES.includes(f.validation_state as ValidationState)).length;
      const confidenceAverage = leaseFields.reduce((sum, f) => sum + (f.extraction_confidence || 0), 0) / (leaseFields.length || 1);

      await supabase
        .from('leases')
        .update({
          verification_status: hasPending ? 'in_review' : allVerified ? 'verified' : 'unverified',
          confidence_score: Math.round(confidenceAverage),
          updated_at: new Date().toISOString(),
        })
        .eq('id', leaseId);

      if (allVerified && verifiedCount === leaseFields.length) {
        await AuditService.logEvent({
          org_id: orgId,
          lease_id: leaseId,
          user_id: userId,
          event_type: 'LEASE_VERIFIED',
          payload: {
            fields_verified: verifiedCount,
            confidence_score: Math.round(confidenceAverage),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      field: updatedField,
    });
  } catch (error) {
    console.error('Lease field update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
