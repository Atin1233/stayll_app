# Setup Instructions - Quick Start

## Step 1: Configure Supabase Environment Variables

### Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create one)
3. Go to **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Add to `.env.local` (Local Development)

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Add to Vercel (Production)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
   - `NEXT_PUBLIC_SITE_URL` = Your production URL
4. **Redeploy** your application

## Step 2: Create the Leases Bucket

### Option A: Run SQL (Fastest)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste this:

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

### Option B: Manual Setup

1. **Supabase Dashboard** → **Storage**
2. Click **"Create a new bucket"**
3. Name: `leases` (exactly, lowercase)
4. Public: **No** (Private)
5. File size limit: **50MB**
6. Allowed MIME types: `application/pdf`
7. Click **"Create bucket"**

### Option C: API Endpoint

After environment variables are set, call:

```bash
curl -X POST https://your-app.vercel.app/api/v5/setup-bucket
```

## Step 3: Run Database Migrations

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run these files in order (from `supabase/migrations/`):
   - `20241108054500_stayll_v5_core.sql`
   - `20241108060001_leases_bucket.sql`
   - `20241108061000_feedback.sql`
   - `20241108070000_enrichment_fields.sql`

Or use Supabase CLI:
```bash
npx supabase db push
```

## Step 4: Verify Setup

1. **Test API**: Visit `/api/v5/test` - should return success
2. **Test Bucket**: Visit `/api/v5/setup-bucket` (GET) - should show bucket exists
3. **Test Upload**: Try uploading a PDF file

## That's It!

Your setup is complete. The upload should now work.

For detailed instructions, see `SUPABASE_ENV_SETUP.md`

