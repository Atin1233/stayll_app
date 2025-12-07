/**
 * Stripe Checkout Session API
 * Creates a checkout session for new subscription or upgrade
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { TIER_PRICING } from '@/lib/stripe';

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

    // Get request body
    const body = await request.json();
    const { tier, billingInterval } = body;

    if (!tier || !billingInterval) {
      return NextResponse.json(
        { error: 'Missing tier or billingInterval' },
        { status: 400 }
      );
    }

    // Validate tier
    const validTiers = ['essential', 'professional', 'enterprise', 'enterprise_plus'];
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // Validate billing interval
    if (!['month', 'year'].includes(billingInterval)) {
      return NextResponse.json(
        { error: 'Invalid billing interval' },
        { status: 400 }
      );
    }

    // Check if custom pricing tier
    if (tier === 'enterprise_plus') {
      return NextResponse.json(
        { error: 'Enterprise Plus requires custom pricing. Please contact sales.' },
        { status: 400 }
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

    // Get or create Stripe customer
    const stripe = getStripe();
    let customerId = organization.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          organization_id: organization.id,
          user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to organization
      await supabase
        .from('organizations')
        .update({ stripe_customer_id: customerId })
        .eq('id', organization.id);
    }

    // Get price from tier pricing
    const priceInCents = TIER_PRICING[tier as keyof typeof TIER_PRICING][billingInterval as 'annual' | 'monthly'];
    
    if (!priceInCents) {
      return NextResponse.json(
        { error: 'Pricing not available for this tier' },
        { status: 400 }
      );
    }

    // Create Stripe Price ID (you'll need to create these in Stripe Dashboard first)
    // For now, we'll use price lookup by amount
    // In production, you should create prices in Stripe and store the IDs
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Stayll ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
              description: billingInterval === 'year' 
                ? `Annual subscription - ${tier} tier`
                : `Monthly subscription - ${tier} tier`,
            },
            recurring: {
              interval: billingInterval,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        organization_id: organization.id,
        tier,
        billing_interval: billingInterval,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/app/settings?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/app/settings?subscription=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

