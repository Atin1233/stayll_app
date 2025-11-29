/**
 * STAYLL v5.0 - Compliance Calendar API
 * Generate and export compliance events
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ComplianceCalendarService } from '@/lib/v5/complianceCalendar';
import { OrganizationService } from '@/lib/v5/organization';

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
    const leaseId = searchParams.get('lease_id');
    const format = searchParams.get('format') || 'json'; // json, ics, csv
    const orgId = searchParams.get('org_id');

    // Get organization
    let targetOrgId = orgId;
    if (!targetOrgId) {
      const orgResult = await OrganizationService.getCurrentOrganization();
      if (orgResult.success && orgResult.organization) {
        targetOrgId = orgResult.organization.id;
      }
    }

    if (!targetOrgId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 400 }
      );
    }

    // Get lease(s)
    let leases;
    if (leaseId) {
      const { data: lease, error } = await supabase
        .from('leases')
        .select('*')
        .eq('id', leaseId)
        .eq('org_id', targetOrgId)
        .single();

      if (error || !lease) {
        return NextResponse.json(
          { error: 'Lease not found' },
          { status: 404 }
        );
      }

      leases = [lease];
    } else {
      // Get all leases for organization
      const { data: orgLeases, error } = await supabase
        .from('leases')
        .select('*')
        .eq('org_id', targetOrgId);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch leases' },
          { status: 500 }
        );
      }

      leases = orgLeases || [];
    }

    // Get lease fields for all leases
    const leaseIds = leases.map(l => l.id);
    const { data: fields } = await supabase
      .from('lease_fields')
      .select('*')
      .in('lease_id', leaseIds);

    // Generate events for each lease
    const allEvents: any[] = [];

    for (const lease of leases) {
      const leaseFields = (fields || []).filter(f => f.lease_id === lease.id);
      
      // Build lease schema (simplified - in production would be more complete)
      const leaseSchema = {
        lease_id: lease.id,
        term: {
          commencement_date: leaseFields.find(f => f.field_name === 'lease_start')?.value_normalized?.date,
          expiration_date: leaseFields.find(f => f.field_name === 'lease_end')?.value_normalized?.date,
          renewal_options: [] // TODO: Parse from fields
        },
        economics: {
          escalations: [] // TODO: Parse from fields
        },
        obligations: {
          notice_events: [] // TODO: Parse from fields
        }
      };

      const events = ComplianceCalendarService.generateEvents(leaseSchema as any);
      allEvents.push(...events);
    }

    // Export in requested format
    if (format === 'ics') {
      const icsContent = ComplianceCalendarService.exportToICS(allEvents);
      return new NextResponse(icsContent, {
        headers: {
          'Content-Type': 'text/calendar',
          'Content-Disposition': 'attachment; filename="compliance-calendar.ics"'
        }
      });
    }

    if (format === 'csv') {
      const csvContent = ComplianceCalendarService.exportToCSV(allEvents);
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="compliance-calendar.csv"'
        }
      });
    }

    // Default: JSON
    return NextResponse.json({
      success: true,
      events: allEvents,
      count: allEvents.length
    });
  } catch (error) {
    console.error('Compliance calendar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

