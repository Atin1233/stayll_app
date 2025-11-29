# Stayll Data Enrichment Services

This directory contains API integrations for enriching lease data with external sources.

## Available Services

### 1. Exchange Rates (`exchangeRates.ts`)
**Purpose**: Convert multi-currency lease rents to a base currency for portfolio rollups.

**API**: exchangerate.host (FREE, unlimited requests, no API key required)

**Usage**:
```typescript
import { convertCurrency, convertRentSchedule } from '@/lib/services/exchangeRates'

// Convert single amount
const result = await convertCurrency(1000, 'EUR', 'USD')
// { fromCurrency: 'EUR', toCurrency: 'USD', amount: 1000, convertedAmount: 1085, rate: 1.085, date: '2025-01-08' }

// Convert rent schedule
const schedule = [
  { amount: 5000, currency: 'EUR', period: '2025-Q1' },
  { amount: 5200, currency: 'EUR', period: '2025-Q2' },
]
const converted = await convertRentSchedule(schedule, 'USD')
```

**API Route**: `GET /api/enrichment/exchange-rates?base=USD`
**API Route**: `POST /api/enrichment/exchange-rates` with `{ amount, fromCurrency, toCurrency }`

---

### 2. Geocoding (`geocoding.ts`)
**Purpose**: Enrich property addresses with coordinates, place IDs, and location metadata.

**API**: Google Maps Geocoding API (FREE tier: $200/month credit = ~40,000 requests)

**Usage**:
```typescript
import { geocodeAddress, reverseGeocode } from '@/lib/services/geocoding'

// Geocode address
const result = await geocodeAddress('125 Market Street, San Francisco, CA')
// { address: '...', formattedAddress: '...', latitude: 37.7749, longitude: -122.4194, placeId: '...', ... }

// Reverse geocode
const address = await reverseGeocode(37.7749, -122.4194)
```

**API Route**: `GET /api/enrichment/geocode?address=125 Market Street`
**API Route**: `GET /api/enrichment/geocode?lat=37.7749&lng=-122.4194`
**API Route**: `POST /api/enrichment/geocode` with `{ addresses: [...] }` for batch

---

### 3. FRED Economic Data (`fred.ts`)
**Purpose**: Get inflation indices, CPI, and escalation data for lease analysis.

**API**: FRED (Federal Reserve Economic Data) - **FREE API key required**

**Usage**:
```typescript
import { 
  getFREDSeries, 
  calculateInflationRate, 
  adjustRentForInflation,
  FRED_SERIES 
} from '@/lib/services/fred'

// Get CPI series
const cpiData = await getFREDSeries(FRED_SERIES.CPI_ALL, '2020-01-01', '2024-12-31')

// Calculate inflation rate
const inflation = await calculateInflationRate('2020-01-01', '2024-12-31')

// Adjust rent for inflation
const adjusted = await adjustRentForInflation(5000, '2020-01-01', '2024-12-31')
// Returns: 5000 * (CPI_2024 / CPI_2020)
```

**API Route**: `GET /api/enrichment/fred?seriesId=CPIAUCSL&startDate=2020-01-01`
**API Route**: `GET /api/enrichment/fred?action=inflation&startDate=2020-01-01&endDate=2024-12-31`
**API Route**: `GET /api/enrichment/fred?action=adjust&amount=5000&baseDate=2020-01-01&targetDate=2024-12-31`

**Common FRED Series**:
- `CPIAUCSL`: Consumer Price Index (All Urban Consumers)
- `CUSR0000SEHA`: CPI for Rent of Primary Residence
- `PPICON`: Producer Price Index for Construction

---

### 4. Portfolio Optimizer (`portfolioOptimizer.ts`)
**Purpose**: Optimize CRE lease portfolio allocation and risk analysis using mean-variance optimization.

**API**: Portfolio Optimizer (FREE, unlimited requests, no API key required)

**Usage**:
```typescript
import { optimizeLeasePortfolio, calculateEfficientFrontier } from '@/lib/services/portfolioOptimizer'

// Optimize lease portfolio allocation
const leases = [
  { id: 'lease-1', annualRent: 120000, propertyValue: 2000000, tenantCreditRisk: 0.1, vacancyRisk: 0.05 },
  { id: 'lease-2', annualRent: 80000, propertyValue: 1500000, tenantCreditRisk: 0.15, vacancyRisk: 0.1 },
]

const result = await optimizeLeasePortfolio(leases, {
  minWeight: 0.1, // Minimum 10% allocation per lease
  maxWeight: 0.4, // Maximum 40% allocation per lease
})
// Returns: { optimizedWeights: { 'lease-1': 0.35, 'lease-2': 0.65 }, expectedReturn: 0.06, volatility: 0.12, ... }

// Calculate efficient frontier
const frontier = await calculateEfficientFrontier(assets, 20)
// Returns array of risk/return points showing optimal portfolio allocations
```

**API Route**: `POST /api/enrichment/portfolio-optimizer` with:
- `{ action: 'optimize-leases', leases: [...], constraints: {...} }`
- `{ action: 'efficient-frontier', assets: [...], numberOfPoints: 20 }`
- `{ action: 'risk', assets: [...], weights: {...} }`

---

## Setup

1. **Exchange Rates**: 
   - ✅ **No setup required!** Uses exchangerate.host by default (completely free, unlimited)
   - Works out of the box

2. **FRED Economic Data**:
   - Get free API key: https://fred.stlouisfed.org/docs/api/api_key.html (takes 2 minutes)
   - Add to `.env.local`: `FRED_API_KEY=your_key`
   - No billing required, unlimited requests

3. **Portfolio Optimizer**:
   - ✅ **No setup required!** Completely free, unlimited requests, no API key needed
   - Works out of the box

4. **Geocoding** (Optional):
   - Get API key: https://console.cloud.google.com/google/maps-apis
   - Enable "Geocoding API" and set up billing (free $200/month credit applies automatically)
   - Add to `.env.local`: `GOOGLE_MAPS_API_KEY=your_key`

---

## Database Schema

The enrichment data is stored in the `leases` table:

```sql
-- Currency fields
currency text default 'USD'
base_currency text default 'USD'

-- Geocoding fields
latitude numeric(10, 7)
longitude numeric(10, 7)
place_id text
geocoding_metadata jsonb

-- Economic indicator fields
cpi_base_date date
cpi_series_id text
inflation_adjusted_rent jsonb
```

An `enrichment_cache` table stores API responses to reduce external calls.

---

## Setup Summary

| Service | Cost | API Key Required | Setup Time |
|---------|------|------------------|------------|
| Exchange Rates | **FREE** (unlimited) | No | 0 minutes |
| FRED Economic Data | **FREE** (unlimited) | Yes (free) | 2 minutes |
| Portfolio Optimizer | **FREE** (unlimited) | No | 0 minutes |
| Google Maps Geocoding | **FREE** ($200/month credit) | Yes (requires billing setup) | 5 minutes |

All services are free to use within their generous free tiers, making them perfect for MVP and early-stage products.

