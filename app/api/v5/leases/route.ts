/**
 * STAYLL v5.0 - Leases API
 * Fetch leases for the current organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    let supabase;
    try {
      supabase = createRouteHandlerClient({ cookies });
    } catch (supabaseError) {
      console.error('Failed to create Supabase client:', supabaseError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to initialize database connection',
          details: process.env.NODE_ENV === 'development' ? String(supabaseError) : undefined
        },
        { status: 500 }
      );
    }
    
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase client not configured' },
        { status: 500 }
      );
    }

    // Get organization ID (with fallback to default-org)
    let orgId = 'default-org';
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get user's organization
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();
        
        if (profile?.organization_id) {
          orgId = profile.organization_id;
        }
      }
    } catch (authError) {
      console.error('Auth check error (non-fatal):', authError);
      // Continue with default org
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('leases')
      .select('*', { count: 'exact' })
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    // Add filters
    if (status) {
      query = query.eq('verification_status', status);
    }
    
    if (search) {
      query = query.or(`property_address.ilike.%${search}%,tenant_name.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: leases, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      
      // Check if table doesn't exist
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Database tables not set up. Please run the database setup script in Supabase SQL Editor.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch leases',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
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
    console.error('Get leases error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch leases'
      },
      { status: 500 }
    );
  }
}
