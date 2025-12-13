/**
 * STAYLL v5.0 - Get Lease Fields API
 * Returns all extracted fields for a lease
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { LeaseFieldsService } from '@/lib/v5/leaseFields';
import { OrganizationService } from '@/lib/v5/organization';

// Helper to convert lease data to fields format for test mode
function convertLeaseToFields(lease: any) {
  const fields: any[] = [];
  
  // Map common lease fields to field objects
  const fieldMappings = [
    { name: 'property_address', label: 'Property Address', key: 'property_address' },
    { name: 'tenant_name', label: 'Tenant Name', key: 'tenant_name' },
    { name: 'monthly_rent', label: 'Monthly Rent', key: 'monthly_rent' },
    { name: 'lease_start', label: 'Lease Start Date', key: 'lease_start' },
    { name: 'lease_end', label: 'Lease End Date', key: 'lease_end' },
    { name: 'security_deposit', label: 'Security Deposit', key: 'security_deposit' },
    { name: 'late_fee', label: 'Late Fee', key: 'late_fee' },
  ];
  
  fieldMappings.forEach((mapping, index) => {
    const value = lease[mapping.key];
    if (value) {
      fields.push({
        id: `field-${lease.id}-${mapping.name}`,
        lease_id: lease.id,
        field_name: mapping.name,
        value_text: String(value),
        value_normalized: mapping.name.includes('rent') || mapping.name.includes('deposit') || mapping.name.includes('fee')
          ? { numeric: parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0 }
          : mapping.name.includes('date') || mapping.name.includes('start') || mapping.name.includes('end')
          ? { date: value }
          : null,
        extraction_confidence: lease.confidence_score || 0,
        validation_state: 'auto_pass',
        validation_notes: null,
        source_clause_location: null,
        created_at: lease.created_at,
        updated_at: lease.updated_at
      });
    }
  });
  
  return fields;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leaseId: string }> }
) {
  try {
    const { leaseId } = await params;
    console.log('[Fields API] Fetching fields for lease:', leaseId);

    // TEST MODE: Return fields from request headers (passed from client)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('[Fields API] Test mode - checking for lease data in headers');
      
      // Get lease data from request header (client will send it)
      const leaseDataHeader = request.headers.get('x-lease-data');
      console.log('[Fields API] Header present:', !!leaseDataHeader);
      
      if (leaseDataHeader) {
        try {
          const lease = JSON.parse(decodeURIComponent(leaseDataHeader));
          console.log('[Fields API] Parsed lease data:', lease);
          
          const fields = convertLeaseToFields(lease);
          console.log('[Fields API] Converted to fields:', fields.length, 'fields');
          
          return NextResponse.json({
            success: true,
            fields,
            lease_id: leaseId,
            count: fields.length,
            testMode: true
          });
        } catch (parseError) {
          console.error('[Fields API] Failed to parse lease data:', parseError);
          return NextResponse.json({
            success: false,
            error: 'Failed to parse lease data',
            details: parseError instanceof Error ? parseError.message : String(parseError)
          }, { status: 500 });
        }
      }
      
      console.log('[Fields API] No lease data provided, returning empty');
      // Return empty if no data provided
      return NextResponse.json({
        success: true,
        fields: [],
        lease_id: leaseId,
        count: 0,
        testMode: true,
        message: 'No data available - lease may still be processing'
      });
    }

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

