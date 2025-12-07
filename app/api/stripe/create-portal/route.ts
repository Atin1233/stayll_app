/**
 * Stripe Customer Portal API
 * Creates a portal session for managing subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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
      .select('stripe_customer_id')
      .eq('id', profile.organization_id)
      .single();

    if (!organization?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Create portal session
    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: organization.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/app/settings`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });

  } catch (error) {
    console.error('Create portal error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create portal session',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

