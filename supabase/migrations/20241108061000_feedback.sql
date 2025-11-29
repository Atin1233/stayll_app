-- =============================================================================
-- Stayll AI Feedback Table
-- =============================================================================

create table if not exists feedback (
  id uuid default gen_random_uuid() primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  lease_id uuid references leases(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  category text,
  message text,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table feedback enable row level security;

drop policy if exists "Feedback: org read" on feedback;
drop policy if exists "Feedback: org insert" on feedback;
create policy "Feedback: org read" on feedback
  for select using (
    org_id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );

create policy "Feedback: org insert" on feedback
  for insert with check (
    org_id in (
      select organization_id from user_profiles where id = auth.uid()
    )
  );
