/**
 * Stripe Client Configuration
 */

import Stripe from 'stripe';

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return key;
}

// Create stripe client lazily to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(getStripeSecretKey(), {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export for convenience - use getStripe() in route handlers to avoid build-time errors
export const stripe = typeof window === 'undefined' && process.env.STRIPE_SECRET_KEY 
  ? getStripe() 
  : null as any;

// Subscription tier pricing (in cents)
export const TIER_PRICING = {
  essential: {
    annual: 2500000, // $25,000/year
    monthly: 220000, // $2,200/month (~10% premium for monthly)
  },
  professional: {
    annual: 6000000, // $60,000/year
    monthly: 530000, // $5,300/month (~10% premium for monthly)
  },
  enterprise: {
    annual: 12000000, // $120,000/year
    monthly: 1060000, // $10,600/month (~10% premium for monthly)
  },
  enterprise_plus: {
    annual: null, // Custom pricing
    monthly: null,
  },
} as const;

// Tier limits
export const TIER_LIMITS = {
  trial: 0, // No leases on trial
  essential: 500,
  professional: 1500,
  enterprise: 3000,
  enterprise_plus: 0, // Unlimited
} as const;

// Get tier limit
export function getTierLimit(tier: keyof typeof TIER_LIMITS): number {
  return TIER_LIMITS[tier];
}

// Check if tier allows unlimited leases
export function isUnlimited(tier: keyof typeof TIER_LIMITS): boolean {
  return TIER_LIMITS[tier] === 0 && tier !== 'trial';
}

