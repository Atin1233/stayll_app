# Quick Bucket Setup Guide

## Create the Leases Bucket

### Option 1: Run SQL Migration (Fastest)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste this SQL:

```sql
-- Create leases bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('leases', 'leases', false, 52428800, ARRAY['application/pdf']::text[])
ON CONFLICT (id) DO UPDATE
SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf']::text[];

-- Storage policies
DROP POLICY IF EXISTS "Leases: authenticated upload" ON storage.objects;
CREATE POLICY "Leases: authenticated upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'leases');

DROP POLICY IF EXISTS "Leases: authenticated read" ON storage.objects;
CREATE POLICY "Leases: authenticated read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'leases');

DROP POLICY IF EXISTS "Leases: authenticated update" ON storage.objects;
CREATE POLICY "Leases: authenticated update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'leases')
  WITH CHECK (bucket_id = 'leases');

DROP POLICY IF EXISTS "Leases: authenticated delete" ON storage.objects;
CREATE POLICY "Leases: authenticated delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'leases');
```

3. Click **Run**

### Option 2: Manual Setup

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"Create a new bucket"**
3. Configure:
   - **Name**: `leases` (exactly, lowercase)
   - **Public**: No (Private)
   - **File size limit**: 50MB
   - **Allowed MIME types**: `application/pdf`
4. Click **"Create bucket"**

### Option 3: API Endpoint

Call the setup endpoint after configuring environment variables:

```bash
curl -X POST https://your-app.vercel.app/api/v5/setup-bucket
```

Or visit: `https://your-app.vercel.app/api/v5/setup-bucket` (POST request)

## Verify Bucket Exists

Check if bucket was created:

```bash
curl https://your-app.vercel.app/api/v5/setup-bucket
```

Should return: `{"success":true,"exists":true,...}`

