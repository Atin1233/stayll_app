-- =============================================================================
-- CHECK SUPABASE SETUP STATUS
-- =============================================================================
-- Run these queries to see what's already configured
-- =============================================================================

-- Check if tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('leases', 'lease_analyses', 'user_profiles') THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('leases', 'lease_analyses', 'user_profiles');

-- Check if RLS is enabled on tables
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status
FROM pg_tables 
WHERE tablename IN ('leases', 'lease_analyses', 'user_profiles');

-- Check existing policies on leases table
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'leases';

-- Check if storage bucket exists
SELECT 
  name as bucket_name,
  CASE 
    WHEN name = 'leases' THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM storage.buckets 
WHERE name = 'leases';

-- Check storage policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%leases%'; 