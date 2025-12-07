# Vercel Deployment Checklist

**Date:** December 2025  
**Status:** Code pushed to GitHub ✅

## What Was Pushed

✅ **All code changes committed and pushed to `main` branch**
- PRD v8.0 implementation
- Landing page "Industry Killer" copy
- Subscription system implementation
- Security fixes (React 19.2.1, Next.js 15.5.7)
- Bug fixes (GET /api/v5/leases endpoint)

## Vercel Deployment

If your GitHub repository is connected to Vercel, the deployment should automatically trigger. Check your Vercel dashboard at: https://vercel.com/dashboard

## Required Environment Variables

Make sure these are set in your Vercel project settings:

### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

### Stripe (Required for Subscriptions)
```
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... or pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional (if you use these features)
```
LEAD_WEBHOOK_URL=your-slack-webhook-url
GOOGLE_MAPS_API_KEY=your-google-maps-key
FRED_API_KEY=your-fred-api-key
```

## Database Migration Required

**IMPORTANT:** After deployment, you must run the database migration:

1. Go to your Supabase SQL Editor
2. Run the migration file: `supabase/migrations/20241201000000_add_subscriptions.sql`
3. This adds subscription fields to the `organizations` table

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel

## Verification Steps

After deployment:

1. ✅ Check Vercel dashboard - deployment should show "Ready"
2. ✅ Visit your site and verify landing page loads
3. ✅ Test authentication flow (sign in/up)
4. ✅ Verify environment variables are set correctly
5. ✅ Run database migration in Supabase
6. ✅ Set up Stripe webhook endpoint
7. ✅ Test subscription flow (if enabled)

## Troubleshooting

### Build Fails
- Check environment variables are set in Vercel
- Verify Node.js version (should be 20+)
- Check build logs in Vercel dashboard

### Database Errors
- Run the migration SQL script in Supabase
- Verify Supabase environment variables are correct
- Check RLS policies are set up correctly

### Stripe Errors
- Verify Stripe API keys are set
- Check webhook secret is correct
- Verify webhook endpoint is accessible

## Next Steps

1. **Monitor deployment** in Vercel dashboard
2. **Set environment variables** if not already done
3. **Run database migration** in Supabase
4. **Configure Stripe webhook** in Stripe dashboard
5. **Test the application** end-to-end

---

**Your code is now pushed to GitHub and Vercel should automatically deploy if connected!**

