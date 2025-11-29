/**
 * STAYLL v5.0 - QA Tasks API
 * Returns lease fields that require human review
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { QATask } from '@/types/v5.0';

const DEFAULT_ORG_ID = 'default-org';
const DEFAULT_USER_ID = 'default-user';

const QA_STATES = ['flagged', 'rule_fail', 'candidate'];

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Determine user/org context (auth optional for MVP)
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
      } else {
        const orgResult = await supabase
          .from('organizations')
          .select('id')
          .eq('id', DEFAULT_ORG_ID)
          .single();

        if (!orgResult.data) {
          await supabase
            .from('organizations')
            .insert({ id: DEFAULT_ORG_ID, name: 'Default Organization', billing_status: 'trial' });
        }
      }
    } else {
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', DEFAULT_ORG_ID)
        .single();

      if (!existingOrg) {
        await supabase
          .from('organizations')
          .insert({ id: DEFAULT_ORG_ID, name: 'Default Organization', billing_status: 'trial' });
      }
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const { data: rows, error, count } = await supabase
      .from('lease_fields')
      .select(`
        id,
        lease_id,
        field_name,
        value_text,
        extraction_confidence,
        validation_state,
        validation_notes,
        source_clause_location,
        created_at,
        leases:leases!inner(
          id,
          org_id,
          property_address,
          tenant_name,
          verification_status,
          confidence_score
        )
      `, { count: 'exact' })
      .eq('leases.org_id', orgId)
      .in('validation_state', QA_STATES)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('QA tasks query error:', error);
      // Check if it's a table not found error
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          tasks: [],
          count: 0,
          meta: {
            limit,
            offset,
            org_id: orgId,
            user_id: userId,
          },
          message: 'Database tables not set up. Please run the database setup script.'
        });
      }
      return NextResponse.json({ 
        success: false,
        error: 'Failed to fetch QA tasks',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    const tasks: QATask[] = (rows || []).map((field) => ({
      id: `${field.id}`,
      lease_id: field.lease_id,
      field_id: field.id,
      field_name: field.field_name,
      current_value: field.value_text || '',
      validation_state: field.validation_state,
      confidence: field.extraction_confidence || 0,
      source_clause: field.source_clause_location || undefined,
      created_at: field.created_at,
    }));

    return NextResponse.json({
      success: true,
      tasks,
      count: count || tasks.length,
      meta: {
        limit,
        offset,
        org_id: orgId,
        user_id: userId,
      },
    });
  } catch (error) {
    console.error('QA tasks API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
