-- =============================================================================
-- Stayll AI Storage Buckets & Policies
-- =============================================================================

-- Buckets (idempotent)
insert into storage.buckets (id, name, public)
values
  ('contract-uploads', 'contract-uploads', false),
  ('reports', 'reports', false)
on conflict (id) do nothing;

-- Contract uploads policies
drop policy if exists "Contracts: authenticated read" on storage.objects;
create policy "Contracts: authenticated read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'contract-uploads' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Contracts: owner upload" on storage.objects;
create policy "Contracts: owner upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'contract-uploads' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Contracts: owner update" on storage.objects;
create policy "Contracts: owner update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'contract-uploads' and
    (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'contract-uploads' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Contracts: owner delete" on storage.objects;
create policy "Contracts: owner delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'contract-uploads' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Reports policies (analysts and admins)
drop policy if exists "Reports: authenticated read" on storage.objects;
create policy "Reports: authenticated read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'reports' and
    (
      (storage.foldername(name))[1] = auth.uid()::text or
      exists (
        select 1 from user_profiles up
        where up.id = auth.uid() and up.role in ('org_admin','reviewer','auditor')
      )
    )
  );

drop policy if exists "Reports: admin upload" on storage.objects;
create policy "Reports: admin upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'reports' and
    exists (
      select 1 from user_profiles up
      where up.id = auth.uid() and up.role in ('org_admin','reviewer')
    )
  );

drop policy if exists "Reports: admin update" on storage.objects;
create policy "Reports: admin update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'reports' and
    exists (
      select 1 from user_profiles up
      where up.id = auth.uid() and up.role in ('org_admin','reviewer')
    )
  )
  with check (
    bucket_id = 'reports' and
    exists (
      select 1 from user_profiles up
      where up.id = auth.uid() and up.role in ('org_admin','reviewer')
    )
  );

drop policy if exists "Reports: admin delete" on storage.objects;
create policy "Reports: admin delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'reports' and
    exists (
      select 1 from user_profiles up
      where up.id = auth.uid() and up.role in ('org_admin','reviewer')
    )
  );
