-- =============================================================================
-- Stayll AI - Data Enrichment Fields Migration
-- Adds support for currency conversion, geocoding, and economic indicators
-- =============================================================================

-- Add currency and location fields to leases
alter table leases
  add column if not exists currency text default 'USD',
  add column if not exists base_currency text default 'USD',
  add column if not exists latitude numeric(10, 7),
  add column if not exists longitude numeric(10, 7),
  add column if not exists place_id text,
  add column if not exists geocoding_metadata jsonb,
  add column if not exists cpi_base_date date,
  add column if not exists cpi_series_id text,
  add column if not exists inflation_adjusted_rent jsonb;

-- Add index for location-based queries
create index if not exists idx_leases_location on leases(latitude, longitude) where latitude is not null and longitude is not null;
create index if not exists idx_leases_currency on leases(currency) where currency is not null;

-- Add enrichment cache table for API responses
create table if not exists enrichment_cache (
  id uuid default gen_random_uuid() primary key,
  cache_key text not null unique,
  cache_type text not null, -- 'exchange_rate', 'geocoding', 'fred', 'property', 'tenant'
  data jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create index if not exists idx_enrichment_cache_key on enrichment_cache(cache_key);
create index if not exists idx_enrichment_cache_type on enrichment_cache(cache_type);
create index if not exists idx_enrichment_cache_expires on enrichment_cache(expires_at);

-- Function to clean expired cache entries
create or replace function cleanup_expired_cache()
returns void as $$
begin
  delete from enrichment_cache where expires_at < now();
end;
$$ language plpgsql;

-- Add tenant credit fields (reserved for future integration - not currently implemented)
create table if not exists tenant_credit_scores (
  id uuid default gen_random_uuid() primary key,
  lease_id uuid references leases(id) on delete cascade,
  tenant_name text not null,
  credit_score numeric(5, 2),
  credit_rating text,
  provider text, -- 'dun_bradstreet', 'experian', etc.
  metadata jsonb,
  last_updated timestamptz default now(),
  created_at timestamptz default now(),
  unique(lease_id, tenant_name, provider)
);

create index if not exists idx_tenant_credit_lease_id on tenant_credit_scores(lease_id);
create index if not exists idx_tenant_credit_tenant_name on tenant_credit_scores(tenant_name);

alter table tenant_credit_scores enable row level security;

create policy "Users can view tenant credit in their organization" on tenant_credit_scores
  for select using (
    lease_id in (
      select id from leases where org_id in (
        select organization_id from user_profiles where id = auth.uid()
      )
    )
  );
