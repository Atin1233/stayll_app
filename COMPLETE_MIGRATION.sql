-- =============================================================================
-- STAYLL COMPLETE DATABASE MIGRATION SCRIPT
-- New Supabase Project: ktmgqbgrntgkzencxqhs
-- =============================================================================
-- Run this entire script in your Supabase SQL Editor
-- This will set up all tables, RLS policies, storage policies, and indexes
-- =============================================================================

-- =============================================================================
-- PART 1: ORGANIZATIONS (Multi-tenant support)
-- =============================================================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  billing_status TEXT DEFAULT 'active', -- 'active', 'suspended', 'trial'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see organizations they belong to
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- =============================================================================
-- PART 2: USER PROFILES (Extended with org and role)
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  role TEXT DEFAULT 'analyst', -- 'org_admin', 'analyst', 'reviewer', 'auditor', 'integration'
  full_name TEXT,
  company TEXT,
  portfolio_size INTEGER,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_org_id ON user_profiles(organization_id);

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- RLS: Users can view profiles in their organization
CREATE POLICY "Users can view their organization profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS: Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================================================
-- PART 3: LEASES (Updated for v5.0)
-- =============================================================================
CREATE TABLE IF NOT EXISTS leases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Basic lease information
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
  
  -- File information
  file_url TEXT,
  file_name TEXT,
  file_key TEXT, -- S3 path
  file_size INTEGER,
  
  -- Analysis data
  confidence_score DECIMAL(5,2),
  analysis_data JSONB,
  analysis_summary JSONB, -- Short executive summary
  portfolio_impact JSONB,
  compliance_assessment JSONB,
  strategic_recommendations JSONB,
  
  -- Structured data
  rent_schedule JSONB, -- Normalized rent rows: [{period_start, period_end, amount, frequency}]
  
  -- Status tracking
  verification_status TEXT DEFAULT 'unverified', -- 'unverified'|'in_review'|'verified'|'rejected'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for leases
CREATE INDEX IF NOT EXISTS idx_leases_org_id ON leases(org_id);
CREATE INDEX IF NOT EXISTS idx_leases_user_id ON leases(user_id);
CREATE INDEX IF NOT EXISTS idx_leases_verification_status ON leases(verification_status);
CREATE INDEX IF NOT EXISTS idx_leases_uploader_id ON leases(uploader_id);
CREATE INDEX IF NOT EXISTS idx_leases_created_at ON leases(created_at);

-- Enable RLS
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view leases in their organization
CREATE POLICY "Users can view leases in their organization" ON leases
  FOR SELECT USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS: Users can insert leases in their organization
CREATE POLICY "Users can insert leases in their organization" ON leases
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    ) AND
    uploader_id = auth.uid()
  );

-- RLS: Users can update leases in their organization
CREATE POLICY "Users can update leases in their organization" ON leases
  FOR UPDATE USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS: Users can delete leases in their organization
CREATE POLICY "Users can delete leases in their organization" ON leases
  FOR DELETE USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- =============================================================================
-- PART 4: LEASE_FIELDS (Atomic, evidence-linked extracted fields)
-- =============================================================================
CREATE TABLE IF NOT EXISTS lease_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE NOT NULL,
  field_name TEXT NOT NULL, -- e.g. 'lease_start', 'escalation_rate_yr1', 'base_rent'
  value_text TEXT,
  value_normalized JSONB, -- Numeric/date/structured data
  source_clause_location JSONB, -- {page: int, bounding_box: [x,y,w,h], clause_id: uuid}
  extraction_confidence NUMERIC(5,2), -- 0-100
  validation_state TEXT DEFAULT 'candidate', -- 'candidate'|'auto_pass'|'rule_fail'|'flagged'|'human_pass'|'human_edit'
  validation_notes TEXT,
  value_hash TEXT, -- HMAC for immutability verification
  last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique field per lease
  UNIQUE(lease_id, field_name)
);

-- Indexes for lease_fields
CREATE INDEX IF NOT EXISTS idx_lease_fields_lease_id ON lease_fields(lease_id);
CREATE INDEX IF NOT EXISTS idx_lease_fields_field_name ON lease_fields(field_name);
CREATE INDEX IF NOT EXISTS idx_lease_fields_validation_state ON lease_fields(validation_state);
CREATE INDEX IF NOT EXISTS idx_lease_fields_created_at ON lease_fields(created_at);

-- Enable RLS
ALTER TABLE lease_fields ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view fields for leases in their organization
CREATE POLICY "Users can view lease fields in their organization" ON lease_fields
  FOR SELECT USING (
    lease_id IN (
      SELECT id FROM leases WHERE org_id IN (
        SELECT organization_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- RLS: Only reviewers/org_admins can update fields
CREATE POLICY "Reviewers can update lease fields" ON lease_fields
  FOR UPDATE USING (
    lease_id IN (
      SELECT id FROM leases WHERE org_id IN (
        SELECT organization_id FROM user_profiles 
        WHERE id = auth.uid() AND role IN ('reviewer', 'org_admin')
      )
    )
  );

-- RLS: Users can insert fields for leases in their organization
CREATE POLICY "Users can insert lease fields in their organization" ON lease_fields
  FOR INSERT WITH CHECK (
    lease_id IN (
      SELECT id FROM leases WHERE org_id IN (
        SELECT organization_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- =============================================================================
-- PART 5: OBLIGATIONS (Calendar events from verified fields)
-- =============================================================================
CREATE TABLE IF NOT EXISTS obligations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE NOT NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  obligation_type TEXT NOT NULL, -- 'renewal_notice', 'escalation', 'payment_due', 'inspection'
  date DATE NOT NULL,
  due_window JSONB, -- {start: date, end: date}
  linked_field_id UUID REFERENCES lease_fields(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'overdue', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_obligations_lease_id ON obligations(lease_id);
CREATE INDEX IF NOT EXISTS idx_obligations_org_id ON obligations(org_id);
CREATE INDEX IF NOT EXISTS idx_obligations_date ON obligations(date);
CREATE INDEX IF NOT EXISTS idx_obligations_status ON obligations(status);

-- Enable RLS
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view obligations in their organization
CREATE POLICY "Users can view obligations in their organization" ON obligations
  FOR SELECT USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS: Users can manage obligations in their organization
CREATE POLICY "Users can manage obligations in their organization" ON obligations
  FOR ALL USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- =============================================================================
-- PART 6: AUDIT_EVENTS (Append-only event log)
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'UPLOAD', 'OCR_COMPLETE', 'FIELD_EXTRACTED', 'FIELD_APPROVED', 'FIELD_EDITED', 'EXPORT_GENERATED'
  payload JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for audit_events
CREATE INDEX IF NOT EXISTS idx_audit_events_org_id ON audit_events(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_lease_id ON audit_events(lease_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);

-- Enable RLS
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view audit events in their organization
CREATE POLICY "Users can view audit events in their organization" ON audit_events
  FOR SELECT USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- RLS: System can insert audit events
CREATE POLICY "System can insert audit events" ON audit_events
  FOR INSERT WITH CHECK (true);

-- =============================================================================
-- PART 7: LEASE_ANALYSES (Analysis history)
-- =============================================================================
CREATE TABLE IF NOT EXISTS lease_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  confidence_score DECIMAL(5,2),
  processing_time_ms INTEGER,
  analyzer_version TEXT, -- e.g., 'v5.0-2025-01-15'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lease_analyses_lease_id ON lease_analyses(lease_id);
CREATE INDEX IF NOT EXISTS idx_lease_analyses_user_id ON lease_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_lease_analyses_created_at ON lease_analyses(created_at);

-- Enable RLS
ALTER TABLE lease_analyses ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view analyses in their organization
CREATE POLICY "Users can view analyses in their organization" ON lease_analyses
  FOR SELECT USING (
    lease_id IN (
      SELECT id FROM leases WHERE org_id IN (
        SELECT organization_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- RLS: Users can insert analyses in their organization
CREATE POLICY "Users can insert analyses in their organization" ON lease_analyses
  FOR INSERT WITH CHECK (
    lease_id IN (
      SELECT id FROM leases WHERE org_id IN (
        SELECT organization_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- =============================================================================
-- PART 8: API_KEYS (For machine integrations)
-- =============================================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  key_hash TEXT NOT NULL, -- Hashed API key (never store plain text)
  name TEXT, -- Human-readable name for the key
  scopes JSONB, -- Array of allowed scopes: ['read:leases', 'write:exports']
  last_used TIMESTAMP WITH TIME ZONE,
  revoked BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_org_id ON api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_revoked ON api_keys(revoked);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS: Only org_admins can view/manage API keys
CREATE POLICY "Org admins can manage API keys" ON api_keys
  FOR ALL USING (
    org_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );

-- =============================================================================
-- PART 9: HELPER FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leases_updated_at ON leases;
CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lease_fields_updated_at ON lease_fields;
CREATE TRIGGER update_lease_fields_updated_at BEFORE UPDATE ON lease_fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_obligations_updated_at ON obligations;
CREATE TRIGGER update_obligations_updated_at BEFORE UPDATE ON obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- PART 10: STORAGE POLICIES (Run AFTER creating 'leases' bucket)
-- =============================================================================
-- NOTE: You must create the 'leases' bucket first in Supabase Dashboard → Storage
-- Then run these policies:

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
-- PART 11: VERIFICATION QUERIES
-- =============================================================================

-- Check all tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('organizations', 'leases', 'lease_fields', 'obligations', 
                        'audit_events', 'api_keys', 'lease_analyses', 'user_profiles') 
    THEN '✅'
    ELSE '❌'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'organizations', 
  'leases', 
  'lease_fields', 
  'obligations', 
  'audit_events', 
  'api_keys',
  'lease_analyses',
  'user_profiles'
)
ORDER BY table_name;

-- Check RLS status (should all be true)
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  CASE 
    WHEN rowsecurity = true THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables 
WHERE tablename IN (
  'organizations',
  'leases', 
  'lease_fields',
  'obligations',
  'audit_events',
  'api_keys',
  'lease_analyses',
  'user_profiles'
)
ORDER BY tablename;

-- Check indexes
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN (
  'organizations',
  'leases', 
  'lease_fields',
  'obligations',
  'audit_events',
  'api_keys',
  'lease_analyses',
  'user_profiles'
)
ORDER BY tablename, indexname;

-- =============================================================================
-- PART 12: SEED DATA (Optional - Create first organization)
-- =============================================================================

-- Uncomment and run this to create your first organization:
-- INSERT INTO organizations (name, billing_status)
-- VALUES ('My Organization', 'active');

-- To get the organization ID for assigning users:
-- SELECT id, name FROM organizations;

-- =============================================================================
-- MIGRATION COMPLETE! ✅
-- =============================================================================
-- 
-- Next Steps:
-- 1. Create 'leases' storage bucket in Supabase Dashboard → Storage
-- 2. Create your first organization (Part 12 above)
-- 3. Register a test user at http://localhost:3000/auth/register
-- 4. Assign user to organization:
--    UPDATE user_profiles 
--    SET organization_id = '<org-id>', role = 'org_admin' 
--    WHERE id = '<user-id>';
-- 5. Test file upload at http://localhost:3000/app/leases
--
-- =============================================================================
