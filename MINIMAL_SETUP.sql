-- =============================================================================
-- MINIMAL SETUP - Only creates what's actually missing
-- =============================================================================

-- First, let's see what we have
SELECT '=== CHECKING CURRENT SETUP ===' as info;

-- Check tables
SELECT 
  'TABLE: ' || table_name as item,
  CASE 
    WHEN table_name IN ('leases', 'lease_analyses', 'user_profiles') THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('leases', 'lease_analyses', 'user_profiles');

-- Check storage bucket
SELECT 
  'STORAGE BUCKET: leases' as item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'leases') THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status;

-- Check storage policies
SELECT 
  'STORAGE POLICY: ' || policyname as item,
  '✅ EXISTS' as status
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%leases%';

-- Now create only what's missing
SELECT '=== CREATING MISSING ITEMS ===' as info;

-- Create storage bucket if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'leases') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('leases', 'leases', false);
        RAISE NOTICE 'Created storage bucket: leases';
    ELSE
        RAISE NOTICE 'Storage bucket already exists: leases';
    END IF;
END $$;

-- Create tables if missing (only the ones that don't exist)
DO $$
BEGIN
    -- Create leases table if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leases' AND table_schema = 'public') THEN
        CREATE TABLE leases (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          tenant_name TEXT,
          property_address TEXT,
          monthly_rent TEXT,
          lease_start DATE,
          lease_end DATE,
          due_date TEXT,
          late_fee TEXT,
          security_deposit TEXT,
          utilities TEXT,
          parking TEXT,
          pets TEXT,
          smoking TEXT,
          file_url TEXT,
          file_name TEXT,
          file_size INTEGER,
          confidence_score DECIMAL(5,2),
          analysis_data JSONB,
          portfolio_impact JSONB,
          compliance_assessment JSONB,
          strategic_recommendations JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created table: leases';
    ELSE
        RAISE NOTICE 'Table already exists: leases';
    END IF;

    -- Create lease_analyses table if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lease_analyses' AND table_schema = 'public') THEN
        CREATE TABLE lease_analyses (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          analysis_type TEXT NOT NULL,
          analysis_data JSONB NOT NULL,
          confidence_score DECIMAL(5,2),
          processing_time_ms INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created table: lease_analyses';
    ELSE
        RAISE NOTICE 'Table already exists: lease_analyses';
    END IF;

    -- Create user_profiles table if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
        CREATE TABLE user_profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          full_name TEXT,
          company TEXT,
          role TEXT,
          portfolio_size INTEGER,
          preferences JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created table: user_profiles';
    ELSE
        RAISE NOTICE 'Table already exists: user_profiles';
    END IF;
END $$;

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Final status check
SELECT '=== FINAL STATUS ===' as info;
SELECT 'Setup completed! Your system should now work with real storage.' as result; 