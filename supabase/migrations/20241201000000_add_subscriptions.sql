-- =============================================================================
-- Add Subscription Fields to Organizations
-- =============================================================================
-- Run this migration to add Stripe subscription support

ALTER TABLE organizations 
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'trial',
  -- 'trial' | 'essential' | 'professional' | 'enterprise' | 'enterprise_plus'
  
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing',
  -- 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  
  ADD COLUMN IF NOT EXISTS subscription_billing_interval TEXT,
  -- 'month' | 'year'
  
  ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS max_leases INTEGER DEFAULT 0;
  -- 0 = unlimited (enterprise_plus), otherwise based on tier

-- Create indexes for subscription lookups
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer_id ON organizations(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_tier ON organizations(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_status ON organizations(subscription_status);

-- Update existing organizations to have tier limits
UPDATE organizations 
SET max_leases = CASE 
  WHEN subscription_tier = 'essential' THEN 500
  WHEN subscription_tier = 'professional' THEN 1500
  WHEN subscription_tier = 'enterprise' THEN 3000
  ELSE 0
END
WHERE subscription_tier IN ('essential', 'professional', 'enterprise');

-- Comments
COMMENT ON COLUMN organizations.subscription_tier IS 'Current subscription tier: trial, essential, professional, enterprise, enterprise_plus';
COMMENT ON COLUMN organizations.stripe_customer_id IS 'Stripe customer ID for this organization';
COMMENT ON COLUMN organizations.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN organizations.subscription_status IS 'Current subscription status from Stripe';
COMMENT ON COLUMN organizations.subscription_billing_interval IS 'Billing frequency: month or year';
COMMENT ON COLUMN organizations.max_leases IS 'Maximum leases allowed for this tier (0 = unlimited)';

