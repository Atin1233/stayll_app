/**
 * STAYLL v5.0 - Get Lease Fields API
 * Returns all extracted fields for a lease
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { LeaseFieldsService } from '@/lib/v5/leaseFields';
import { OrganizationService } from '@/lib/v5/organization';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leaseId: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const orgResult = await OrganizationService.getCurrentOrganization();
    if (!orgResult.success || !orgResult.organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 403 }
      );
    }

    const { leaseId } = await params;

    // Verify lease belongs to organization
    const { data: lease, error: leaseError } = await supabase
      .from('leases')
      .select('id, org_id')
      .eq('id', leaseId)
      .eq('org_id', orgResult.organization.id)
      .single();

    if (leaseError || !lease) {
      return NextResponse.json(
        { error: 'Lease not found' },
        { status: 404 }
      );
    }

    // Get fields
    const fieldsResult = await LeaseFieldsService.getLeaseFields(leaseId);

    if (!fieldsResult.success) {
      return NextResponse.json(
        { error: fieldsResult.error || 'Failed to fetch fields' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fields: fieldsResult.fields || [],
      lease_id: leaseId,
      count: fieldsResult.fields?.length || 0
    });

  } catch (error) {
    console.error('Get fields error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

