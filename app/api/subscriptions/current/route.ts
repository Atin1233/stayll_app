/**
 * Get Current Subscription Status
 * Returns subscription information for the current organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get organization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    const { data: organization } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', profile.organization_id)
      .single();

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get lease count for usage tracking
    const { count: leaseCount } = await supabase
      .from('leases')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', organization.id);

    return NextResponse.json({
      success: true,
      subscription: {
        tier: organization.subscription_tier || 'trial',
        status: organization.subscription_status || 'trialing',
        billing_interval: organization.subscription_billing_interval || null,
        current_period_start: organization.subscription_current_period_start || null,
        current_period_end: organization.subscription_current_period_end || null,
        max_leases: organization.max_leases || 0,
      },
      usage: {
        lease_count: leaseCount || 0,
        lease_limit: organization.max_leases || 0,
        is_unlimited: (organization.max_leases || 0) === 0 && organization.subscription_tier === 'enterprise_plus',
      },
      organization: {
        id: organization.id,
        name: organization.name,
        billing_status: organization.billing_status,
      },
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch subscription',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

