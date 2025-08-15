-- =============================================================================
-- SUPABASE DATABASE SETUP FOR STAYLL
-- =============================================================================
-- Run these commands in your Supabase SQL Editor
-- =============================================================================

-- Create leases table
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

-- Enable Row Level Security
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for leases table
CREATE POLICY "Users can view their own leases" ON leases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leases" ON leases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leases" ON leases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leases" ON leases
  FOR DELETE USING (auth.uid() = user_id);

-- Create lease_analyses table for analysis history
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

-- Create RLS policies for lease_analyses
CREATE POLICY "Users can view their own analyses" ON lease_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON lease_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_profiles table
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

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================================================
-- STORAGE POLICIES (Run after creating the 'leases' bucket)
-- =============================================================================

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'leases');

-- Allow users to access their own files
CREATE POLICY "Allow users to access their own files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'leases' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own files
CREATE POLICY "Allow users to update their own files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'leases' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'leases' AND (storage.foldername(name))[1] = auth.uid()::text);

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check if tables were created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('leases', 'lease_analyses', 'user_profiles');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('leases', 'lease_analyses', 'user_profiles'); 