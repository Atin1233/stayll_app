# Storage Bucket Setup Guide

## Quick Setup Steps

### 1. Create the "leases" Bucket

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/ktmgqbgrntgkzencxqhs
2. Click **Storage** in the left sidebar
3. Click **Create a new bucket** button
4. Configure the bucket:
   - **Name**: `leases`
   - **Public bucket**: **OFF** (keep it private)
   - **File size limit**: 50 MB (recommended)
   - **Allowed MIME types**: Leave empty or add: `application/pdf`
5. Click **Create bucket**

### 2. Verify Storage Policies

After creating the bucket, the storage policies should be automatically created by running `COMPLETE_MIGRATION.sql`.

If you need to verify or recreate them, run this SQL:

```sql
-- List existing storage policies
SELECT * FROM storage.objects_policies;

-- If policies don't exist, create them:

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
```

### 3. Test Storage Upload

You can test storage directly from the Supabase Dashboard:

1. Go to **Storage** → **leases** bucket
2. Try uploading a test PDF file
3. Verify you can see and download it

### 4. File Organization Structure

Files are organized by user ID:

```
leases/
  ├── {user-uuid-1}/
  │   ├── lease-document-1.pdf
  │   └── lease-document-2.pdf
  ├── {user-uuid-2}/
  │   └── lease-document-3.pdf
  └── ...
```

This structure ensures:
- ✅ User isolation (RLS policies enforce this)
- ✅ Easy cleanup when user is deleted
- ✅ Simple organization and retrieval

## Troubleshooting

### Cannot upload files

**Symptom**: Upload fails with "Policy violation" error

**Solution**:
1. Verify user is authenticated
2. Check that storage policies exist
3. Verify bucket name is exactly `leases`
4. Check browser console for detailed error

### Cannot download/view files

**Symptom**: Files upload successfully but cannot be viewed

**Solution**:
1. Check that SELECT policy exists
2. Verify file path format: `{user_id}/{filename}`
3. Try accessing via Supabase Dashboard first

### Storage quota exceeded

**Symptom**: Upload fails with quota error

**Solution**:
1. Check your Supabase plan limits (free tier: 1GB)
2. Delete old test files
3. Consider upgrading plan if needed

## Storage Configuration in Code

The application uses these environment variables for storage:

```bash
# From .env.local
STORAGE_SUPABASE_URL="https://ktmgqbgrntgkzencxqhs.supabase.co"
STORAGE_SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY="eyJhbGci..."
```

### Client-side Upload (Browser)

```typescript
import { supabase } from '@/lib/supabase'

const uploadFile = async (file: File, userId: string) => {
  const filePath = `${userId}/${file.name}`
  
  const { data, error } = await supabase.storage
    .from('leases')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  return data
}
```

### Server-side Upload (API Route)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.STORAGE_SUPABASE_URL!,
  process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY!
)

const uploadFile = async (file: File, userId: string) => {
  const filePath = `${userId}/${file.name}`
  
  const { data, error } = await supabaseAdmin.storage
    .from('leases')
    .upload(filePath, file)
  
  if (error) throw error
  return data
}
```

### Get Public URL (with signed URL)

```typescript
const getFileUrl = async (filePath: string) => {
  const { data } = await supabase.storage
    .from('leases')
    .createSignedUrl(filePath, 3600) // 1 hour expiry
  
  return data?.signedUrl
}
```

## Security Best Practices

### ✅ DO:
- Keep bucket private (not public)
- Use signed URLs for temporary access
- Validate file types on upload
- Set reasonable file size limits
- Use user-specific folders

### ❌ DON'T:
- Make bucket public
- Store sensitive data without encryption
- Allow unlimited file sizes
- Use predictable file names (use UUIDs)
- Share service role key client-side

## File Naming Convention

Recommended file naming:

```typescript
const generateFileName = (originalName: string) => {
  const timestamp = Date.now()
  const randomId = crypto.randomUUID().slice(0, 8)
  const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${timestamp}-${randomId}-${sanitized}`
}
```

Example: `1702425600000-a1b2c3d4-lease-agreement.pdf`

## Monitoring Storage Usage

Check storage usage in Supabase Dashboard:

1. Go to **Settings** → **Usage**
2. Look at **Storage** section
3. Monitor:
   - Total storage used
   - Number of files
   - Bandwidth usage

## Cleanup Strategy

For production, implement periodic cleanup:

```sql
-- Find orphaned files (no matching lease record)
SELECT name, created_at
FROM storage.objects
WHERE bucket_id = 'leases'
AND name NOT IN (
  SELECT file_key FROM leases WHERE file_key IS NOT NULL
)
AND created_at < NOW() - INTERVAL '30 days';

-- Delete old test files (be careful!)
DELETE FROM storage.objects
WHERE bucket_id = 'leases'
AND metadata->>'uploaded_by' = 'test_user'
AND created_at < NOW() - INTERVAL '7 days';
```

## Migration from Old Storage

If you have files in an old Supabase project:

1. **Download all files** from old project:
   ```bash
   # Using Supabase CLI
   supabase storage download leases --project-ref old-project-ref
   ```

2. **Upload to new project**:
   ```bash
   supabase storage upload leases --project-ref ktmgqbgrntgkzencxqhs
   ```

3. **Update database references**:
   ```sql
   -- Update file URLs in leases table
   UPDATE leases
   SET file_url = REPLACE(
     file_url, 
     'old-project-ref.supabase.co',
     'ktmgqbgrntgkzencxqhs.supabase.co'
   );
   ```

## Quick Verification

Run this to verify storage is working:

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE name = 'leases';

-- Check policies exist
SELECT * FROM storage.objects_policies WHERE bucket_id = 'leases';

-- Check files (after uploading some)
SELECT 
  name,
  bucket_id,
  owner,
  created_at,
  pg_size_pretty(metadata->>'size')::text as file_size
FROM storage.objects
WHERE bucket_id = 'leases'
ORDER BY created_at DESC
LIMIT 10;
```

---

**Status**: ✅ Configuration ready  
**Bucket Name**: leases  
**Privacy**: Private  
**Policies**: User-isolated access
