import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // For testing purposes, use a default user ID if not authenticated
    let userId = user?.id;
    if (!userId) {
      console.log('No authenticated user found, using test user ID');
      userId = 'test-user-id'; // Temporary for testing
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const propertyAddress = searchParams.get('propertyAddress');
    const tenantName = searchParams.get('tenantName');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('leases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add filters if provided
    if (propertyAddress) {
      query = query.ilike('property_address', `%${propertyAddress}%`);
    }
    if (tenantName) {
      query = query.ilike('tenant_name', `%${tenantName}%`);
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
    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // For testing purposes, use a default user ID if not authenticated
    let userId = user?.id;
    if (!userId) {
      console.log('No authenticated user found, using test user ID');
      userId = 'test-user-id'; // Temporary for testing
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
      .select('file_url, file_name')
      .eq('id', leaseId)
      .eq('user_id', userId)
      .single();

    if (leaseError || !lease) {
      return NextResponse.json(
        { error: 'Lease not found' },
        { status: 404 }
      );
    }

    // Delete the lease record
    const { error: deleteError } = await supabase
      .from('leases')
      .delete()
      .eq('id', leaseId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Database delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete lease' },
        { status: 500 }
      );
    }

    // Delete the file from storage if it exists
    if (lease.file_url) {
      try {
        // Extract file path from URL
        const urlParts = lease.file_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${userId}/${fileName}`;
        
        await supabase.storage
          .from('leases')
          .remove([filePath]);
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