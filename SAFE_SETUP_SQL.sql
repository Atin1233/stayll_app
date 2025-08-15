-- =============================================================================
-- SAFE SUPABASE SETUP - Only creates missing components
-- =============================================================================
-- This script won't cause errors if components already exist
-- =============================================================================

-- Create leases table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS leases (
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

-- Enable RLS (safe to run multiple times)
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only if they don't exist)
DO $$
BEGIN
    -- Users can view their own leases
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leases' 
        AND policyname = 'Users can view their own leases'
    ) THEN
        CREATE POLICY "Users can view their own leases" ON leases
        FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Users can insert their own leases
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leases' 
        AND policyname = 'Users can insert their own leases'
    ) THEN
        CREATE POLICY "Users can insert their own leases" ON leases
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Users can update their own leases
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leases' 
        AND policyname = 'Users can update their own leases'
    ) THEN
        CREATE POLICY "Users can update their own leases" ON leases
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Users can delete their own leases
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leases' 
        AND policyname = 'Users can delete their own leases'
    ) THEN
        CREATE POLICY "Users can delete their own leases" ON leases
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create lease_analyses table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS lease_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  confidence_score DECIMAL(5,2),
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for lease_analyses
ALTER TABLE lease_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lease_analyses (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'lease_analyses' 
        AND policyname = 'Users can view their own analyses'
    ) THEN
        CREATE POLICY "Users can view their own analyses" ON lease_analyses
        FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'lease_analyses' 
        AND policyname = 'Users can insert their own analyses'
    ) THEN
        CREATE POLICY "Users can insert their own analyses" ON lease_analyses
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Create user_profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company TEXT,
  role TEXT,
  portfolio_size INTEGER,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" ON user_profiles
        FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" ON user_profiles
        FOR UPDATE USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" ON user_profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Create storage policies (only if they don't exist)
DO $$
BEGIN
    -- Allow authenticated users to upload files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow authenticated users to upload files'
    ) THEN
        CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'leases');
    END IF;

    -- Allow users to access their own files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow users to access their own files'
    ) THEN
        CREATE POLICY "Allow users to access their own files" ON storage.objects
        FOR SELECT TO authenticated
        USING (bucket_id = 'leases' AND (storage.foldername(name))[1] = auth.uid()::text);
    END IF;

    -- Allow users to delete their own files
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow users to delete their own files'
    ) THEN
        CREATE POLICY "Allow users to delete their own files" ON storage.objects
        FOR DELETE TO authenticated
        USING (bucket_id = 'leases' AND (storage.foldername(name))[1] = auth.uid()::text);
    END IF;
END $$;

-- Show setup status
SELECT 'Setup completed successfully!' as status; 