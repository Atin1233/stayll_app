-- =============================================================================
-- Stayll AI - Leases Storage Bucket
-- Creates the 'leases' bucket for lease document storage
-- =============================================================================

-- Create leases bucket (idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('leases', 'leases', false, 52428800, ARRAY['application/pdf']::text[])
ON CONFLICT (id) DO UPDATE
SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf']::text[];

-- Storage policies for leases bucket
-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Leases: authenticated upload" ON storage.objects;
CREATE POLICY "Leases: authenticated upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'leases');

-- Allow authenticated users to read files
DROP POLICY IF EXISTS "Leases: authenticated read" ON storage.objects;
CREATE POLICY "Leases: authenticated read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'leases');

-- Allow authenticated users to update files
DROP POLICY IF EXISTS "Leases: authenticated update" ON storage.objects;
CREATE POLICY "Leases: authenticated update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'leases')
  WITH CHECK (bucket_id = 'leases');

-- Allow authenticated users to delete files
DROP POLICY IF EXISTS "Leases: authenticated delete" ON storage.objects;
CREATE POLICY "Leases: authenticated delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'leases');

