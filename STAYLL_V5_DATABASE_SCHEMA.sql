-- =============================================================================
-- STAYLL AI v5.0 - DATABASE SCHEMA
-- Financial-Grade Contract Data Layer - Proof-of-Accuracy MVP
-- =============================================================================
-- Run these commands in your Supabase SQL Editor
-- =============================================================================

-- =============================================================================
-- 1. ORGANIZATIONS (Multi-tenant support)
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

-- RLS Policies: Users can only see organizations they belong to (via user_profiles)
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- =============================================================================
-- 2. USER PROFILES (Extended with org and role)
-- =============================================================================
-- Update user_profiles to include organization_id and role
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'analyst'; -- 'org_admin', 'analyst', 'reviewer', 'auditor', 'integration'

CREATE INDEX IF NOT EXISTS idx_user_profiles_org_id ON user_profiles(organization_id);

-- RLS: Users can view profiles in their organization
DROP POLICY IF EXISTS "Users can view their organization profiles" ON user_profiles;
CREATE POLICY "Users can view their organization profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- =============================================================================
-- 3. LEASES (Updated for v5.0)
-- =============================================================================
-- Update leases table for v5.0 structure
ALTER TABLE leases 
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS file_key TEXT, -- S3 path
  ADD COLUMN IF NOT EXISTS rent_schedule JSONB, -- Normalized rent rows: [{period_start, period_end, amount, frequency}]
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified', -- 'unverified'|'in_review'|'verified'|'rejected'
  ADD COLUMN IF NOT EXISTS analysis_summary JSONB; -- Short executive summary

-- Update existing leases to have org_id (if user_profiles exists)
UPDATE leases l
SET org_id = up.organization_id
FROM user_profiles up
WHERE l.user_id = up.id AND l.org_id IS NULL;

-- Migrate user_id to uploader_id for existing records
UPDATE leases SET uploader_id = user_id WHERE uploader_id IS NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leases_org_id ON leases(org_id);
CREATE INDEX IF NOT EXISTS idx_leases_verification_status ON leases(verification_status);
CREATE INDEX IF NOT EXISTS idx_leases_uploader_id ON leases(uploader_id);

-- Update RLS policies for org-based access
DROP POLICY IF EXISTS "Users can view their own leases" ON leases;
DROP POLICY IF EXISTS "Users can insert their own leases" ON leases;
DROP POLICY IF EXISTS "Users can update their own leases" ON leases;
DROP POLICY IF EXISTS "Users can delete their own leases" ON leases;

CREATE POLICY "Users can view leases in their organization" ON leases
  FOR SELECT USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert leases in their organization" ON leases
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    ) AND
    uploader_id = auth.uid()
  );

CREATE POLICY "Users can update leases in their organization" ON leases
  FOR UPDATE USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete leases in their organization" ON leases
  FOR DELETE USING (
    org_id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- =============================================================================
-- 4. LEASE_FIELDS (Atomic, evidence-linked extracted fields)
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

-- =============================================================================
-- 5. OBLIGATIONS (Calendar events from verified fields)
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

-- =============================================================================
-- 6. AUDIT_EVENTS (Append-only event log)
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

-- =============================================================================
-- 7. API_KEYS (For machine integrations)
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
-- 8. UPDATE LEASE_ANALYSES (Add analyzer_version)
-- =============================================================================
ALTER TABLE lease_analyses 
  ADD COLUMN IF NOT EXISTS analyzer_version TEXT; -- e.g., 'v5.0-2025-01-15'

-- Update RLS for org-based access
DROP POLICY IF EXISTS "Users can view their own analyses" ON lease_analyses;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON lease_analyses;

CREATE POLICY "Users can view analyses in their organization" ON lease_analyses
  FOR SELECT USING (
    lease_id IN (
      SELECT id FROM leases WHERE org_id IN (
        SELECT organization_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert analyses in their organization" ON lease_analyses
  FOR INSERT WITH CHECK (
    lease_id IN (
      SELECT id FROM leases WHERE org_id IN (
        SELECT organization_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- =============================================================================
-- 9. HELPER FUNCTIONS
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
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lease_fields_updated_at BEFORE UPDATE ON lease_fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obligations_updated_at BEFORE UPDATE ON obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 10. VERIFICATION QUERIES
-- =============================================================================

-- Check if all tables were created
SELECT table_name 
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

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
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

