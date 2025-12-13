-- STAYLL v5.0 - Field Edit Log Migration
-- Immutable audit trail for all field modifications

-- Create field_edit_log table
CREATE TABLE IF NOT EXISTS field_edit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  field_id UUID REFERENCES lease_fields(id) ON DELETE SET NULL,
  field_name VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  old_value_normalized JSONB,
  new_value_normalized JSONB,
  edit_reason VARCHAR(255),
  edited_by UUID NOT NULL REFERENCES auth.users(id),
  edited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  confidence_before NUMERIC(5,2),
  confidence_after NUMERIC(5,2),
  validation_state_before VARCHAR(50),
  validation_state_after VARCHAR(50),
  
  -- Metadata
  session_id UUID,
  batch_id UUID, -- For bulk edits
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_field_edit_log_lease_id ON field_edit_log(lease_id);
CREATE INDEX IF NOT EXISTS idx_field_edit_log_field_id ON field_edit_log(field_id);
CREATE INDEX IF NOT EXISTS idx_field_edit_log_field_name ON field_edit_log(field_name);
CREATE INDEX IF NOT EXISTS idx_field_edit_log_edited_by ON field_edit_log(edited_by);
CREATE INDEX IF NOT EXISTS idx_field_edit_log_edited_at ON field_edit_log(edited_at DESC);

-- Create RLS policies
ALTER TABLE field_edit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view edit logs for their organization's leases
CREATE POLICY "Users can view org edit logs"
  ON field_edit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leases
      WHERE leases.id = field_edit_log.lease_id
        AND leases.org_id IN (
          SELECT organization_id FROM user_profiles
          WHERE id = auth.uid()
        )
    )
  );

-- Policy: Only authenticated users can insert edit logs
CREATE POLICY "Authenticated users can insert edit logs"
  ON field_edit_log
  FOR INSERT
  WITH CHECK (auth.uid() = edited_by);

-- Policy: No one can update or delete edit logs (immutable)
-- (No UPDATE or DELETE policies = no one can modify)

-- Create a function to automatically log field edits
CREATE OR REPLACE FUNCTION log_field_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if value actually changed
  IF (OLD.value_text IS DISTINCT FROM NEW.value_text) 
     OR (OLD.value_normalized IS DISTINCT FROM NEW.value_normalized)
     OR (OLD.validation_state IS DISTINCT FROM NEW.validation_state) THEN
    
    INSERT INTO field_edit_log (
      lease_id,
      field_id,
      field_name,
      old_value,
      new_value,
      old_value_normalized,
      new_value_normalized,
      confidence_before,
      confidence_after,
      validation_state_before,
      validation_state_after,
      edited_by,
      edited_at
    ) VALUES (
      NEW.lease_id,
      NEW.id,
      NEW.field_name,
      OLD.value_text,
      NEW.value_text,
      OLD.value_normalized,
      NEW.value_normalized,
      OLD.extraction_confidence,
      NEW.extraction_confidence,
      OLD.validation_state,
      NEW.validation_state,
      auth.uid(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to lease_fields table
DROP TRIGGER IF EXISTS track_field_edits ON lease_fields;
CREATE TRIGGER track_field_edits
  AFTER UPDATE ON lease_fields
  FOR EACH ROW
  EXECUTE FUNCTION log_field_edit();

-- Create view for easy field edit history retrieval
CREATE OR REPLACE VIEW field_edit_history AS
SELECT 
  fel.id,
  fel.lease_id,
  fel.field_id,
  fel.field_name,
  fel.old_value,
  fel.new_value,
  fel.edit_reason,
  fel.edited_at,
  up.full_name AS edited_by_name,
  up.email AS edited_by_email,
  fel.confidence_before,
  fel.confidence_after,
  fel.validation_state_before,
  fel.validation_state_after,
  l.tenant_name,
  l.property_address
FROM field_edit_log fel
JOIN auth.users u ON u.id = fel.edited_by
LEFT JOIN user_profiles up ON up.id = fel.edited_by
JOIN leases l ON l.id = fel.lease_id
ORDER BY fel.edited_at DESC;

-- Grant permissions
GRANT SELECT ON field_edit_history TO authenticated;

COMMENT ON TABLE field_edit_log IS 'Immutable audit trail for all lease field modifications';
COMMENT ON COLUMN field_edit_log.edited_at IS 'Timestamp of edit (immutable)';
COMMENT ON COLUMN field_edit_log.ip_address IS 'IP address of editor (for security audit)';
COMMENT ON TRIGGER track_field_edits ON lease_fields IS 'Automatically logs all field changes to field_edit_log';
