/**
 * STAYLL v5.0 - Leases API
 * List and manage leases
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OrganizationService } from '@/lib/v5/organization';
import type { VerificationStatus } from '@/types/v5.0';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get organization
    const orgResult = await OrganizationService.getCurrentOrganization();
    if (!orgResult.success || !orgResult.organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as VerificationStatus | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('leases')
      .select('*', { count: 'exact' })
      .eq('org_id', orgResult.organization.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add filters
    if (status) {
      query = query.eq('verification_status', status);
    }

    if (search) {
      query = query.or(`property_address.ilike.%${search}%,tenant_name.ilike.%${search}%,file_name.ilike.%${search}%`);
    }

    const { data: leases, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leases' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leases: leases || [],
      count: count || 0,
      pagination: {
        limit,
        offset,
        hasMore: (leases?.length || 0) === limit
      }
    });

  } catch (error) {
    console.error('Fetch leases error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get organization
    const orgResult = await OrganizationService.getCurrentOrganization();
    if (!orgResult.success || !orgResult.organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 403 }
      );
    }

    const { leaseId } = await request.json();

    if (!leaseId) {
      return NextResponse.json(
        { error: 'Lease ID is required' },
        { status: 400 }
      );
    }

    // Get the lease to find the file path
    const { data: lease, error: leaseError } = await supabase
      .from('leases')
      .select('file_key, org_id')
      .eq('id', leaseId)
      .eq('org_id', orgResult.organization.id)
      .single();

    if (leaseError || !lease) {
      return NextResponse.json(
        { error: 'Lease not found' },
        { status: 404 }
      );
    }

    // Delete the lease record (cascading deletes will handle related records)
    const { error: deleteError } = await supabase
      .from('leases')
      .delete()
      .eq('id', leaseId);

    if (deleteError) {
      console.error('Database delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete lease' },
        { status: 500 }
      );
    }

    // Delete the file from storage if it exists
    if (lease.file_key) {
      try {
        await supabase.storage
          .from('leases')
          .remove([lease.file_key]);
      } catch (storageError) {
        console.error('Storage delete error:', storageError);
        // Don't fail the request if file deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lease deleted successfully'
    });

  } catch (error) {
    console.error('Delete lease error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

