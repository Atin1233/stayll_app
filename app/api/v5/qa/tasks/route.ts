/**
 * STAYLL v5.0 - QA Tasks API
 * Returns fields that need QA review
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * GET /api/v5/qa/tasks
 * Fetch all fields that need QA review
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('org_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query for fields that need QA
    let query = supabase
      .from('lease_fields')
      .select(`
        id,
        lease_id,
        field_name,
        value_text,
        extraction_confidence,
        validation_state,
        source_clause_location,
        leases!inner(
          id,
          tenant_name,
          property_address,
          org_id
        )
      `)
      .in('validation_state', ['flagged', 'rule_fail', 'candidate'])
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by organization if provided
    if (orgId) {
      query = query.eq('leases.org_id', orgId);
    }

    const { data: fields, error } = await query;

    if (error) {
      console.error('Error fetching QA tasks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch QA tasks' },
        { status: 500 }
      );
    }

    // Transform to QA task format
    const tasks = fields?.map((field: any) => ({
      id: field.id,
      lease_id: field.lease_id,
      field_id: field.id,
      field_name: field.field_name,
      field_label: formatFieldName(field.field_name),
      current_value: field.value_text,
      confidence: field.extraction_confidence || 0,
      validation_state: field.validation_state,
      source_page: field.source_clause_location?.page,
      source_snippet: field.source_clause_location?.clause_text,
      tenant_name: field.leases.tenant_name,
      property_address: field.leases.property_address,
      reason_codes: extractReasonCodes(field),
    })) || [];

    return NextResponse.json({
      success: true,
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('QA tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Format field name to readable label
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract reason codes from field validation
 */
function extractReasonCodes(field: any): string[] {
  const codes: string[] = [];

  if (field.extraction_confidence < 70) {
    codes.push('LOW_CONFIDENCE');
  }

  if (field.validation_state === 'rule_fail') {
    codes.push('VALIDATION_FAILED');
  }

  if (!field.value_text) {
    codes.push('FIELD_NOT_FOUND');
  }

  if (!field.source_clause_location) {
    codes.push('NO_SOURCE_CLAUSE');
  }

  return codes;
}
