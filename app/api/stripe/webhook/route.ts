/**
 * Stripe Webhook Handler
 * Handles subscription events from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { TIER_LIMITS } from '@/lib/stripe';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }
  return secret;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const stripe = getStripe();
    let event: Stripe.Event;
    try {
      const webhookSecret = getWebhookSecret();
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(supabase, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(supabase: any, session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organization_id;
  const tier = session.metadata?.tier;
  const billingInterval = session.metadata?.billing_interval;

  if (!organizationId || !tier) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Get subscription from session
  const subscriptionId = typeof session.subscription === 'string' 
    ? session.subscription 
    : session.subscription?.id;

  if (!subscriptionId) {
    console.error('No subscription ID in checkout session');
    return;
  }

  // Fetch full subscription details
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdate(supabase, subscription, tier, billingInterval);
}

async function handleSubscriptionUpdate(
  supabase: any, 
  subscription: Stripe.Subscription,
  tier?: string,
  billingInterval?: string
) {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  // Find organization by customer ID
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!organization) {
    console.error('Organization not found for customer:', customerId);
    return;
  }

  // Determine tier from subscription metadata or price
  let subscriptionTier = tier;
  let subscriptionBillingInterval = billingInterval;

  if (!subscriptionTier || !subscriptionBillingInterval) {
    // Try to get from subscription metadata
    subscriptionTier = subscription.metadata?.tier || organization.subscription_tier || 'trial';
    subscriptionBillingInterval = subscription.metadata?.billing_interval || organization.subscription_billing_interval || 'year';
    
    // Fallback: determine from price amount (this is less reliable)
    if (!subscriptionTier && subscription.items.data.length > 0) {
      const price = subscription.items.data[0].price;
      const amount = price.unit_amount || 0;
      const interval = price.recurring?.interval || 'year';
      subscriptionBillingInterval = interval;
      
      // Map price to tier (this is fragile, better to store in metadata)
      // For production, you should create Stripe Products with metadata
    }
  }

  const maxLeases = subscriptionTier ? TIER_LIMITS[subscriptionTier as keyof typeof TIER_LIMITS] : 0;
  const status = mapStripeStatusToSubscriptionStatus(subscription.status);

  // Update organization
  await supabase
    .from('organizations')
    .update({
      subscription_tier: subscriptionTier,
      stripe_subscription_id: subscription.id,
      subscription_status: status,
      subscription_billing_interval: subscriptionBillingInterval,
      subscription_current_period_start: (subscription as any).current_period_start
        ? new Date((subscription as any).current_period_start * 1000).toISOString()
        : null,
      subscription_current_period_end: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000).toISOString()
        : null,
      max_leases: maxLeases,
      billing_status: status === 'active' || status === 'trialing' ? 'active' : 'suspended',
      updated_at: new Date().toISOString(),
    })
    .eq('id', organization.id);
}

async function handleSubscriptionDeleted(supabase: any, subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!organization) {
    return;
  }

  // Set subscription to canceled and revert to trial
  await supabase
    .from('organizations')
    .update({
      subscription_tier: 'trial',
      subscription_status: 'canceled',
      max_leases: 0,
      billing_status: 'suspended',
      updated_at: new Date().toISOString(),
    })
    .eq('id', organization.id);
}

async function handlePaymentSucceeded(supabase: any, invoice: Stripe.Invoice) {
  if (!invoice.customer) return;
  
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer.id;

  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (organization) {
    await supabase
      .from('organizations')
      .update({
        subscription_status: 'active',
        billing_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', organization.id);
  }
}

async function handlePaymentFailed(supabase: any, invoice: Stripe.Invoice) {
  if (!invoice.customer) return;
  
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer.id;

  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (organization) {
    await supabase
      .from('organizations')
      .update({
        subscription_status: 'past_due',
        billing_status: 'suspended',
        updated_at: new Date().toISOString(),
      })
      .eq('id', organization.id);
  }
}

function mapStripeStatusToSubscriptionStatus(stripeStatus: Stripe.Subscription.Status): 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' {
  switch (stripeStatus) {
    case 'trialing':
      return 'trialing';
    case 'active':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
    case 'unpaid':
      return stripeStatus === 'canceled' ? 'canceled' : 'unpaid';
    default:
      return 'unpaid';
  }
}

