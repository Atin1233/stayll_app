-- =============================================================================
-- Stayll AI v5 Core Schema Migration
-- =============================================================================
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Organizations (multi-tenant root)
-- -----------------------------------------------------------------------------
create table if not exists organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  billing_status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- User profiles (extends auth.users)
-- -----------------------------------------------------------------------------
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  role text default 'analyst',
  organization_id uuid references organizations(id) on delete set null,
  portfolio_size integer,
  preferences jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_user_profiles_org_id on user_profiles(organization_id);

alter table user_profiles enable row level security;

drop policy if exists "Users can view their organization profiles" on user_profiles;
drop policy if exists "Users can view their own profile" on user_profiles;
drop policy if exists "Users can update their own profile" on user_profiles;
drop policy if exists "Users can insert their own profile" on user_profiles;
create policy "Users can view their organization profiles" on user_profiles
  for select using (
    auth.uid() = id or
    organization_id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );
create policy "Users can update their own profile" on user_profiles
  for update using (auth.uid() = id);
create policy "Users can insert their own profile" on user_profiles
  for insert with check (auth.uid() = id);

alter table organizations enable row level security;

drop policy if exists "Users can view their organization" on organizations;
create policy "Users can view their organization" on organizations
  for select using (
    id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Leases (ingested documents)
-- -----------------------------------------------------------------------------
create table if not exists leases (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) on delete cascade,
  uploader_id uuid references auth.users(id) on delete set null,
  tenant_name text,
  property_address text,
  monthly_rent text,
  lease_start date,
  lease_end date,
  due_date text,
  late_fee text,
  security_deposit text,
  utilities text,
  parking text,
  pets text,
  smoking text,
  file_key text,
  file_url text,
  file_name text,
  file_size integer,
  confidence_score numeric(5,2),
  rent_schedule jsonb,
  verification_status text default 'unverified',
  analysis_data jsonb,
  analysis_summary jsonb,
  portfolio_impact jsonb,
  compliance_assessment jsonb,
  strategic_recommendations jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_leases_org_id on leases(org_id);
create index if not exists idx_leases_verification_status on leases(verification_status);
create index if not exists idx_leases_uploader_id on leases(uploader_id);

alter table leases enable row level security;

drop policy if exists "Users can view their own leases" on leases;
drop policy if exists "Users can insert their own leases" on leases;
drop policy if exists "Users can update their own leases" on leases;
drop policy if exists "Users can delete their own leases" on leases;
drop policy if exists "Users can view leases in their organization" on leases;
drop policy if exists "Users can insert leases in their organization" on leases;
drop policy if exists "Users can update leases in their organization" on leases;
drop policy if exists "Users can delete leases in their organization" on leases;
create policy "Users can view leases in their organization" on leases
  for select using (
    org_id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );
create policy "Users can insert leases in their organization" on leases
  for insert with check (
    org_id in (
      select organization_id from user_profiles where id = auth.uid()
    ) and
    uploader_id = auth.uid()
  );
create policy "Users can update leases in their organization" on leases
  for update using (
    org_id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );
create policy "Users can delete leases in their organization" on leases
  for delete using (
    org_id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Lease fields (atomic structured outputs)
-- -----------------------------------------------------------------------------
create table if not exists lease_fields (
  id uuid default gen_random_uuid() primary key,
  lease_id uuid references leases(id) on delete cascade not null,
  field_name text not null,
  value_text text,
  value_normalized jsonb,
  source_clause_location jsonb,
  extraction_confidence numeric(5,2),
  validation_state text default 'candidate',
  validation_notes text,
  value_hash text,
  last_modified_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(lease_id, field_name)
);

create index if not exists idx_lease_fields_lease_id on lease_fields(lease_id);
create index if not exists idx_lease_fields_field_name on lease_fields(field_name);
create index if not exists idx_lease_fields_validation_state on lease_fields(validation_state);
create index if not exists idx_lease_fields_created_at on lease_fields(created_at);

alter table lease_fields enable row level security;

drop policy if exists "Users can view lease fields in their organization" on lease_fields;
drop policy if exists "Reviewers can update lease fields" on lease_fields;
create policy "Users can view lease fields in their organization" on lease_fields
  for select using (
    lease_id in (
      select id from leases where org_id in (
        select organization_id from user_profiles where id = auth.uid()
      )
    )
  );
create policy "Reviewers can update lease fields" on lease_fields
  for update using (
    lease_id in (
      select id from leases where org_id in (
        select organization_id from user_profiles
        where id = auth.uid() and role in ('reviewer','org_admin','auditor')
      )
    )
  );

-- -----------------------------------------------------------------------------
-- Obligations (calendar events)
-- -----------------------------------------------------------------------------
create table if not exists obligations (
  id uuid default gen_random_uuid() primary key,
  lease_id uuid references leases(id) on delete cascade not null,
  org_id uuid references organizations(id) on delete cascade not null,
  obligation_type text not null,
  date date not null,
  due_window jsonb,
  linked_field_id uuid references lease_fields(id) on delete set null,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_obligations_lease_id on obligations(lease_id);
create index if not exists idx_obligations_org_id on obligations(org_id);
create index if not exists idx_obligations_date on obligations(date);
create index if not exists idx_obligations_status on obligations(status);

alter table obligations enable row level security;

drop policy if exists "Users can view obligations in their organization" on obligations;
create policy "Users can view obligations in their organization" on obligations
  for select using (
    org_id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Audit events (immutable event log)
-- -----------------------------------------------------------------------------
create table if not exists audit_events (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) on delete cascade,
  lease_id uuid references leases(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  payload jsonb,
  timestamp timestamptz default now()
);

create index if not exists idx_audit_events_org_id on audit_events(org_id);
create index if not exists idx_audit_events_lease_id on audit_events(lease_id);
create index if not exists idx_audit_events_user_id on audit_events(user_id);
create index if not exists idx_audit_events_event_type on audit_events(event_type);
create index if not exists idx_audit_events_timestamp on audit_events(timestamp);

alter table audit_events enable row level security;

drop policy if exists "Users can view audit events in their organization" on audit_events;
create policy "Users can view audit events in their organization" on audit_events
  for select using (
    org_id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- API keys (hashed machine tokens)
-- -----------------------------------------------------------------------------
create table if not exists api_keys (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) on delete cascade not null,
  key_hash text not null,
  name text,
  scopes jsonb,
  last_used timestamptz,
  revoked boolean default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  expires_at timestamptz
);

create index if not exists idx_api_keys_org_id on api_keys(org_id);
create index if not exists idx_api_keys_key_hash on api_keys(key_hash);
create index if not exists idx_api_keys_revoked on api_keys(revoked);

alter table api_keys enable row level security;

drop policy if exists "Org admins can manage API keys" on api_keys;
create policy "Org admins can manage API keys" on api_keys
  for all using (
    org_id in (
      select organization_id from user_profiles
      where id = auth.uid() and role = 'org_admin'
    )
  );

-- -----------------------------------------------------------------------------
-- Lease analyses (history of AI runs)
-- -----------------------------------------------------------------------------
create table if not exists lease_analyses (
  id uuid default gen_random_uuid() primary key,
  lease_id uuid references leases(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  analysis_type text not null,
  analysis_data jsonb not null,
  confidence_score numeric(5,2),
  processing_time_ms integer,
  analyzer_version text,
  created_at timestamptz default now()
);

alter table lease_analyses enable row level security;

drop policy if exists "Users can view their own analyses" on lease_analyses;
drop policy if exists "Users can insert their own analyses" on lease_analyses;
drop policy if exists "Users can view analyses in their organization" on lease_analyses;
drop policy if exists "Users can insert analyses in their organization" on lease_analyses;
create policy "Users can view analyses in their organization" on lease_analyses
  for select using (
    lease_id in (
      select id from leases where org_id in (
        select organization_id from user_profiles where id = auth.uid()
      )
    )
  );
create policy "Users can insert analyses in their organization" on lease_analyses
  for insert with check (
    lease_id in (
      select id from leases where org_id in (
        select organization_id from user_profiles where id = auth.uid()
      )
    )
  );

-- -----------------------------------------------------------------------------
-- Updated_at triggers
-- -----------------------------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_organizations_updated_at before update on organizations
  for each row execute function update_updated_at_column();

create trigger update_user_profiles_updated_at before update on user_profiles
  for each row execute function update_updated_at_column();

create trigger update_leases_updated_at before update on leases
  for each row execute function update_updated_at_column();

create trigger update_lease_fields_updated_at before update on lease_fields
  for each row execute function update_updated_at_column();

create trigger update_obligations_updated_at before update on obligations
  for each row execute function update_updated_at_column();
