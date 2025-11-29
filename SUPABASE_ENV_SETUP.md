# Supabase Environment Variables Setup Guide

## Quick Setup

### 1. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. You'll find:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Configure Environment Variables

#### For Local Development (`.env.local`)

Create or edit `.env.local` in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site URL (for authentication redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Service Role Key (for admin operations)
# Only use this in server-side code, never expose to client
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### For Production (Vercel/Deployment)

1. Go to your **Vercel Dashboard** (or your hosting platform)
2. Navigate to your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://your-preview-url.vercel.app` | Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | Production, Preview (optional) |

### 3. Verify Your Setup

After setting environment variables:

1. **Restart your development server** (if running locally):
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. **Redeploy your application** (if on Vercel):
   - Push a commit or trigger a redeploy
   - Environment variables are loaded on build

3. **Test the connection**:
   - Visit `/api/v5/test` in your app
   - Should return: `{"success":true,"message":"API routes are working"}`

## Step-by-Step Instructions

### Step 1: Get Supabase Project URL

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Click on your project
3. Go to **Settings** (gear icon) → **API**
4. Copy the **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)

### Step 2: Get Supabase Anon Key

1. In the same **Settings** → **API** page
2. Find **Project API keys**
3. Copy the **anon/public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - ⚠️ **Important**: Use the `anon` key, NOT the `service_role` key for client-side code

### Step 3: Create `.env.local` File

In your project root directory, create `.env.local`:

```bash
# Copy this template and fill in your values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Add to `.gitignore`

Make sure `.env.local` is in your `.gitignore` (it should be by default):

```bash
# .env.local should already be ignored
# Never commit environment variables to git!
```

### Step 5: Configure Vercel (Production)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL
   - Environment: Select all (Production, Preview, Development)
6. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SITE_URL`

### Step 6: Verify Configuration

Test your setup:

```bash
# Check if variables are loaded (local development)
# In your terminal, after starting the dev server:
curl http://localhost:3000/api/v5/test
```

Or visit in browser: `http://localhost:3000/api/v5/test`

## Storage Bucket Setup

### Option 1: Automatic Setup (Recommended)

Call the setup endpoint:

```bash
# From your app or using curl
curl -X POST http://localhost:3000/api/v5/setup-bucket
```

Or visit: `http://localhost:3000/api/v5/setup-bucket` (POST request)

### Option 2: Manual Setup

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"Create a new bucket"**
3. Configure:
   - **Name**: `leases`
   - **Public**: No (Private)
   - **File size limit**: 50MB
   - **Allowed MIME types**: `application/pdf`
4. Click **"Create bucket"**

### Option 3: SQL Migration

Run the migration file in Supabase SQL Editor:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open `supabase/migrations/20241108060000_storage_buckets.sql`
3. Copy and paste the SQL
4. Click **Run**

## Database Tables Setup

### Run Database Migrations

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run these migration files in order:
   - `supabase/migrations/20241108054500_stayll_v5_core.sql`
   - `supabase/migrations/20241108060000_storage_buckets.sql`
   - `supabase/migrations/20241108061000_feedback.sql`
   - `supabase/migrations/20241108070000_enrichment_fields.sql`

Or use the Supabase CLI:

```bash
# If you have Supabase CLI installed
npx supabase db push
```

## Troubleshooting

### Issue: "Supabase client not configured"

**Solution:**
- Check that `.env.local` exists and has the correct variables
- Restart your dev server after adding environment variables
- Verify variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue: "Failed to create Supabase client"

**Solution:**
- Verify your Supabase URL is correct (should end with `.supabase.co`)
- Check your anon key is correct (should start with `eyJ`)
- Make sure you're using the `anon` key, not `service_role` key

### Issue: "Storage bucket not found"

**Solution:**
1. Create the bucket manually in Supabase Dashboard
2. Or call `/api/v5/setup-bucket` endpoint
3. Verify bucket name is exactly `leases` (lowercase)

### Issue: "Database tables not set up"

**Solution:**
1. Run the migration files in Supabase SQL Editor
2. Or use: `npx supabase db push` if you have CLI

### Issue: Environment variables not working in production

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify all variables are added
3. Redeploy the application (variables are loaded at build time)
4. Check that variable names match exactly (case-sensitive)

## Security Best Practices

1. **Never commit `.env.local`** to git
2. **Use `anon` key for client-side**, `service_role` only for server-side
3. **Rotate keys** if accidentally exposed
4. **Use different projects** for development and production
5. **Enable RLS** (Row Level Security) on all tables

## Quick Checklist

- [ ] Supabase project created
- [ ] Environment variables added to `.env.local`
- [ ] Environment variables added to Vercel (production)
- [ ] Storage bucket `leases` created
- [ ] Database migrations run
- [ ] Test endpoint works: `/api/v5/test`
- [ ] Upload endpoint works: `/api/v5/leases/upload`

## Next Steps

After setup is complete:

1. Test upload: Try uploading a PDF file
2. Check storage: Verify file appears in Supabase Storage
3. Check database: Verify lease record is created
4. Test list: Verify leases appear in the list

---

**Need Help?** Check the error message in your browser console or deployment logs for specific details.

