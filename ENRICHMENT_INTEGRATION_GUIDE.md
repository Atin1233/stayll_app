# Data Enrichment Integration Guide

## Overview

The Stayll AI platform now includes integrated data enrichment services that automatically enhance lease records with geocoding, currency conversion, and economic indicators. This guide explains how everything connects and how to ensure features actually work.

## Architecture

### 1. **Upload Flow**
```
User uploads lease → Next.js API route (/api/v5/leases/upload)
  ↓
Lease record created in Supabase
  ↓
Enrichment triggered asynchronously (non-blocking)
  ↓
Edge Function (/functions/enrich) processes enrichment
  ↓
Lease record updated with enrichment data
```

### 2. **Enrichment Services**

#### **Geocoding** (Google Maps API)
- **When**: Triggered automatically after lease upload if property address exists
- **What**: Converts address to lat/lng, place ID, formatted address
- **Stored in**: `leases.latitude`, `leases.longitude`, `leases.place_id`, `leases.geocoding_metadata`
- **API**: Google Maps Geocoding API (free tier: $200/month credit)

#### **Currency Conversion** (Exchange Rates API)
- **When**: Triggered if lease has rent in non-base currency
- **What**: Converts rent amount to base currency (USD default)
- **Stored in**: `leases.currency`, `leases.base_currency`
- **API**: exchangerate.host (free, unlimited, no API key)

#### **Economic Data** (FRED API)
- **When**: Triggered if lease has start date and rent amount
- **What**: Calculates CPI-based inflation adjustments and escalation projections
- **Stored in**: `leases.cpi_base_date`, `leases.cpi_series_id`, `leases.inflation_adjusted_rent`
- **API**: FRED (100% free, requires API key)

### 3. **Portfolio Optimization**
- **Service**: `lib/services/portfolioOptimizer.ts`
- **API Route**: `/api/enrichment/portfolio-optimizer`
- **When**: Called from dashboard/insights pages
- **What**: Optimizes lease portfolio allocation using mean-variance optimization

## Integration Points

### Upload Integration

**File**: `app/api/v5/leases/upload/route.ts`

After lease record is created, enrichment is triggered asynchronously:

```typescript
// Trigger enrichment asynchronously (non-blocking)
if (propertyAddress) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const enrichFunctionUrl = `${supabaseUrl}/functions/v1/enrich`;
  
  fetch(enrichFunctionUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      leaseId: leaseRecord.id,
      enrichments: ['geocoding', 'currency', 'economic'],
    }),
  }).catch(console.error); // Non-fatal
}
```

### Edge Function Enrichment

**File**: `supabase/functions/enrich/index.ts`

This Edge Function:
1. Authenticates the request
2. Fetches lease data
3. Calls enrichment APIs (Google Maps, Exchange Rates, FRED)
4. Updates the lease record with enrichment data

### Frontend Enrichment Client

**File**: `lib/services/enrichmentClient.ts`

Provides client-side functions for manual enrichment triggers:
- `enrichLease()` - Trigger enrichment for a specific lease
- `geocodeAddress()` - Geocode an address
- `convertCurrency()` - Convert currency amounts
- `getEconomicData()` - Fetch FRED economic data

## Database Schema

### Lease Enrichment Fields

```sql
-- Added in migration: 20241108070000_enrichment_fields.sql
ALTER TABLE leases
  ADD COLUMN currency TEXT DEFAULT 'USD',
  ADD COLUMN base_currency TEXT DEFAULT 'USD',
  ADD COLUMN latitude NUMERIC(10, 7),
  ADD COLUMN longitude NUMERIC(10, 7),
  ADD COLUMN place_id TEXT,
  ADD COLUMN geocoding_metadata JSONB,
  ADD COLUMN cpi_base_date DATE,
  ADD COLUMN cpi_series_id TEXT,
  ADD COLUMN inflation_adjusted_rent JSONB;
```

### Enrichment Cache

```sql
CREATE TABLE enrichment_cache (
  id UUID PRIMARY KEY,
  cache_key TEXT UNIQUE NOT NULL,
  cache_type TEXT NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Environment Variables

Add these to `.env.local`:

```bash
# Google Maps Geocoding API (free tier: $200/month)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# FRED API (100% free)
FRED_API_KEY=your_fred_api_key_here

# Exchange Rates API (free, no key needed)
# Uses exchangerate.host by default

# Supabase (required for Edge Functions)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Making Features Actually Work

### 1. **Deploy Edge Functions**

```bash
# Deploy the enrich function
npx supabase functions deploy enrich

# Set environment variables as secrets
npx supabase secrets set GOOGLE_MAPS_API_KEY=your_key
npx supabase secrets set FRED_API_KEY=your_key
```

### 2. **Run Database Migration**

```bash
# Apply the enrichment fields migration
npx supabase db push

# Or manually in Supabase SQL Editor:
# Run: supabase/migrations/20241108070000_enrichment_fields.sql
```

### 3. **Test the Flow**

#### Test Upload with Enrichment

1. Upload a lease with a property address
2. Check Supabase logs for enrichment function execution
3. Query the lease to verify enrichment data:

```sql
SELECT 
  id,
  property_address,
  latitude,
  longitude,
  place_id,
  currency,
  cpi_base_date,
  inflation_adjusted_rent
FROM leases
WHERE id = 'your-lease-id';
```

#### Test Manual Enrichment

```typescript
import { enrichLease } from '@/lib/services/enrichmentClient'

const result = await enrichLease({
  leaseId: 'lease-uuid',
  enrichments: ['geocoding', 'currency', 'economic']
})

if (result.success) {
  console.log('Enrichment data:', result.data)
}
```

### 4. **Frontend Integration**

#### Display Enrichment Data

Update lease display components to show:
- Map view using `latitude`/`longitude`
- Currency conversion info
- Inflation-adjusted rent projections
- Escalation calculations

Example:

```typescript
const lease = await fetchLease(leaseId)

if (lease.latitude && lease.longitude) {
  // Show on map
  <MapView lat={lease.latitude} lng={lease.longitude} />
}

if (lease.inflation_adjusted_rent) {
  // Show inflation-adjusted rent
  <div>
    Original: ${lease.monthly_rent}
    Adjusted: ${lease.inflation_adjusted_rent.adjusted}
    Inflation: {lease.inflation_adjusted_rent.inflationRate}%
  </div>
}
```

#### Portfolio Optimization

```typescript
import { optimizeLeasePortfolio } from '@/lib/services/portfolioOptimizer'

const leases = await fetchLeases() // From your lease service
const result = await optimizeLeasePortfolio(leases)

if (result) {
  console.log('Optimized weights:', result.optimizedWeights)
  console.log('Expected return:', result.expectedReturn)
  console.log('Risk (volatility):', result.volatility)
}
```

## Troubleshooting

### Enrichment Not Running

1. **Check Edge Function logs**:
   ```bash
   npx supabase functions logs enrich
   ```

2. **Verify environment variables**:
   ```bash
   npx supabase secrets list
   ```

3. **Check function deployment**:
   ```bash
   npx supabase functions list
   ```

### Missing Data in Lease Records

1. **Verify migration applied**:
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'leases' 
   AND column_name IN ('latitude', 'currency', 'cpi_base_date');
   ```

2. **Check enrichment cache**:
   ```sql
   SELECT * FROM enrichment_cache ORDER BY created_at DESC LIMIT 10;
   ```

3. **Manual enrichment trigger**:
   - Use `enrichLease()` client function
   - Or call Edge Function directly with lease ID

### API Rate Limits

1. **Google Maps**: Monitor usage in Google Cloud Console
2. **FRED**: No rate limits (100% free)
3. **Exchange Rates**: No rate limits (unlimited free)

## Next Steps

1. ✅ Geocoding integrated into upload flow
2. ✅ Currency conversion ready for multi-currency leases
3. ✅ Economic data (CPI, inflation) integrated
4. ✅ Portfolio optimization service available
5. 🔄 **Wire up frontend components to display enrichment data**
6. 🔄 **Add map view component for geocoded leases**
7. 🔄 **Display inflation-adjusted rent in dashboard**
8. 🔄 **Add portfolio optimization to insights page**

## Service Files Reference

- `lib/services/geocoding.ts` - Google Maps Geocoding integration
- `lib/services/exchangeRates.ts` - Currency conversion
- `lib/services/fred.ts` - FRED economic data
- `lib/services/enrichment.ts` - Unified enrichment orchestrator
- `lib/services/enrichmentClient.ts` - Frontend enrichment client
- `lib/services/portfolioOptimizer.ts` - Portfolio optimization
- `supabase/functions/enrich/index.ts` - Enrichment Edge Function
- `app/api/enrichment/geocode/route.ts` - Geocoding API route
- `app/api/enrichment/exchange-rates/route.ts` - Currency API route
- `app/api/enrichment/fred/route.ts` - FRED API route
- `app/api/enrichment/portfolio-optimizer/route.ts` - Portfolio API route

