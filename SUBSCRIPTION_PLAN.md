# Subscription Implementation Plan

## Pricing Model (Confirmed)

| Tier | Portfolio Size | Annual Price | Monthly (if offered) |
|------|----------------|--------------|---------------------|
| **Essential** | 0–500 leases | $25,000/year | ~$2,083/month |
| **Professional** | 500–1,500 leases | $60,000/year | ~$5,000/month |
| **Enterprise** | 1,500–3,000 leases | $120,000/year | ~$10,000/month |
| **Enterprise Plus** | 3,000+ leases | Custom pricing | Custom |

## Database Schema Updates Needed

### Add to `organizations` table:
```sql
ALTER TABLE organizations 
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'trial',
  -- 'trial' | 'essential' | 'professional' | 'enterprise' | 'enterprise_plus'
  
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing',
  -- 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  
  ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS max_leases INTEGER DEFAULT 0; -- 0 = unlimited (enterprise_plus)
```

### Tier Limits:
- **Essential:** max_leases = 500
- **Professional:** max_leases = 1500
- **Enterprise:** max_leases = 3000
- **Enterprise Plus:** max_leases = 0 (unlimited)

## Implementation Steps

### 1. Stripe Products Setup
- Create 4 Stripe Products (Essential, Professional, Enterprise, Enterprise Plus)
- Create annual prices for each
- Optionally: Create monthly prices (with annual discount)
- Set up webhook endpoint at `/api/stripe/webhook`

### 2. Subscription API Routes
- `POST /api/stripe/create-checkout` - Create checkout session for new subscription
- `POST /api/stripe/create-portal` - Create billing portal session
- `POST /api/stripe/webhook` - Handle Stripe webhooks (subscription updates, cancellations)
- `GET /api/subscriptions/current` - Get current subscription status

### 3. Frontend Components
- `SubscriptionTierSelector` - Choose tier on signup/upgrade
- `SubscriptionStatus` - Display current tier, renewal date, usage
- `UpgradePrompt` - Show when user hits tier limit
- `BillingPortal` - Link to Stripe Customer Portal

### 4. Usage Tracking
- Query lease count on upload: `SELECT COUNT(*) FROM leases WHERE org_id = ?`
- Compare against `max_leases` for current tier
- Block upload if at limit, show upgrade prompt

## Stripe Integration Flow

### Signup Flow:
1. User signs up → Creates organization
2. User selects tier → Calls `/api/stripe/create-checkout`
3. Stripe Checkout → User pays
4. Webhook fires → Updates organization with subscription info
5. User redirected to dashboard

### Upgrade Flow:
1. User clicks "Upgrade" → Calls `/api/stripe/create-checkout` with new tier
2. Stripe Checkout → User pays (prorated)
3. Webhook fires → Updates organization tier and limits

### Billing Portal:
1. User clicks "Manage Billing" → Calls `/api/stripe/create-portal`
2. Redirects to Stripe Customer Portal
3. User can update payment method, cancel, view invoices

## Environment Variables Needed

```bash
STRIPE_SECRET_KEY=sk_live_... # or sk_test_... for development
STRIPE_PUBLISHABLE_KEY=pk_live_... # or pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # from Stripe dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Webhook Events to Handle

- `checkout.session.completed` - New subscription created
- `customer.subscription.updated` - Tier changed, billing updated
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed (set status to 'past_due')

## Files to Create/Update

### New Files:
- `app/api/stripe/create-checkout/route.ts`
- `app/api/stripe/create-portal/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/api/subscriptions/current/route.ts`
- `components/subscription/SubscriptionTierSelector.tsx`
- `components/subscription/SubscriptionStatus.tsx`
- `components/subscription/UpgradePrompt.tsx`
- `lib/stripe.ts` - Stripe client initialization

### Update Files:
- `types/v5.0.ts` - Add subscription fields to Organization interface
- `lib/v5/organization.ts` - Add subscription management methods
- `app/app/settings/page.tsx` - Add subscription management section
- `components/pricing.tsx` - Update to subscription model (if not already)

## Testing Checklist

- [ ] Create subscription via Stripe Checkout
- [ ] Webhook updates organization correctly
- [ ] Tier limits enforced on upload
- [ ] Upgrade flow works (prorated billing)
- [ ] Downgrade flow works
- [ ] Billing portal accessible
- [ ] Cancellation handled gracefully
- [ ] Payment failures handled (past_due status)
- [ ] Usage tracking accurate

