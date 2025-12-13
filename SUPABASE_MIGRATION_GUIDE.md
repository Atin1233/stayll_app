# Supabase Migration Guide

## Overview

This guide walks you through migrating STAYLL to a new Supabase project (`ktmgqbgrntgkzencxqhs`).

## Migration Checklist

### ✅ 1. Environment Configuration

The `.env.local` file has been created with the new Supabase credentials:
- **Project URL**: `https://ktmgqbgrntgkzencxqhs.supabase.co`
- **Project Ref**: `ktmgqbgrntgkzencxqhs`

All necessary environment variables have been configured including:
- Public Supabase URL and Anon Key
- Storage configuration
- Service Role Key (for server-side operations)
- Direct Postgres connection strings

### 🔧 2. Database Setup

You need to run the database setup scripts in your new Supabase project.

#### Step 1: Run the V5 Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ktmgqbgrntgkzencxqhs
2. Navigate to **SQL Editor** (left sidebar)
3. Create a new query
4. Copy and paste the contents of `STAYLL_V5_DATABASE_SCHEMA.sql`
5. Click **Run** to execute

**What this creates:**
- ✅ `organizations` table - Multi-tenant support
- ✅ `user_profiles` table - User roles and organization membership
- ✅ `leases` table - Updated with v5.0 fields
- ✅ `lease_fields` table - Atomic field extraction storage
- ✅ `obligations` table - Calendar events and deadlines
- ✅ `audit_events` table - Immutable audit trail
- ✅ `api_keys` table - API integration support
- ✅ `lease_analyses` table - Analysis history
- ✅ Row Level Security (RLS) policies for all tables
- ✅ Indexes for performance optimization

#### Step 2: Verify Schema Installation

Run this verification query in the SQL Editor:

```sql
-- Check all tables exist
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

-- Should return 8 tables
```

### 📦 3. Storage Bucket Setup

#### Create the "leases" Storage Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Click **Create a new bucket**
3. Name it: `leases`
4. Set as **Private** bucket
5. Click **Create bucket**

#### Configure Storage Policies

Run this SQL in the SQL Editor:

```sql
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

### 🔐 4. Authentication Setup

#### Configure Auth Providers

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure email templates if needed
4. Optional: Enable OAuth providers (Google, GitHub, etc.)

#### Set Site URL and Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: 
   - Local: `http://localhost:3000`
   - Production: `https://your-domain.vercel.app`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback` (for production)

### 👥 5. Create Initial Organization

For users to access the system, they need to be part of an organization. Run this SQL to create your first organization:

```sql
-- Create your first organization
INSERT INTO organizations (name, billing_status)
VALUES ('My Organization', 'active')
RETURNING id;

-- Note the returned UUID - you'll need it for the next step
```

### 🧪 6. Test User Registration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to: `http://localhost:3000/auth/register`

3. Register a new user

4. After registration, manually assign the user to your organization:

```sql
-- Get your user ID (check after registration)
SELECT id, email FROM auth.users;

-- Update user profile with organization
UPDATE user_profiles
SET organization_id = '<your-org-id-from-step-5>',
    role = 'org_admin'
WHERE id = '<user-id>';
```

### 📤 7. Test File Upload

1. Log in with your test user
2. Navigate to: `http://localhost:3000/app/leases`
3. Upload a test PDF lease document
4. Verify:
   - ✅ File appears in Storage → leases bucket
   - ✅ Lease record created in `leases` table
   - ✅ Audit event logged in `audit_events` table

### 🔍 8. Verify Everything Works

Run these verification queries:

```sql
-- Check organizations
SELECT * FROM organizations;

-- Check user profiles
SELECT 
  up.id,
  up.full_name,
  up.role,
  o.name as organization_name
FROM user_profiles up
LEFT JOIN organizations o ON up.organization_id = o.id;

-- Check leases
SELECT 
  l.id,
  l.tenant_name,
  l.property_address,
  l.verification_status,
  l.created_at,
  o.name as organization_name
FROM leases l
LEFT JOIN organizations o ON l.org_id = o.id;

-- Check audit events
SELECT 
  event_type,
  COUNT(*) as count
FROM audit_events
GROUP BY event_type
ORDER BY count DESC;
```

## Post-Migration Tasks

### Security Checklist

- [ ] Verify RLS policies are working (test with different users)
- [ ] Ensure storage bucket is private (not public)
- [ ] Test that users can only see their organization's data
- [ ] Verify service role key is kept server-side only

### Performance Optimization

- [ ] Monitor database performance in Supabase Dashboard
- [ ] Review slow queries in **Database** → **Query Performance**
- [ ] Add additional indexes if needed

### Backup & Monitoring

- [ ] Enable daily database backups (Settings → Database → Backups)
- [ ] Set up email alerts for critical errors
- [ ] Monitor API usage and rate limits

## Troubleshooting

### Common Issues

#### "Organization not found"
**Solution**: Make sure the user has `organization_id` set in `user_profiles` table.

```sql
-- Fix: Assign user to organization
UPDATE user_profiles
SET organization_id = '<org-id>'
WHERE id = '<user-id>';
```

#### "RLS policy violation"
**Solution**: Verify that:
1. User is authenticated
2. User's `organization_id` matches the lease's `org_id`
3. RLS policies are correctly created

#### Storage upload fails
**Solution**: 
1. Check that 'leases' bucket exists
2. Verify storage policies are created
3. Check that user is authenticated

#### Cannot access files
**Solution**: Files are stored in folders named by user ID. Verify the path structure: `{user_id}/{filename}`

## Migration from Old Supabase Project

If you have data in an old Supabase project:

### Export Data

```sql
-- Export organizations
COPY organizations TO '/tmp/organizations.csv' CSV HEADER;

-- Export user_profiles
COPY user_profiles TO '/tmp/user_profiles.csv' CSV HEADER;

-- Export leases
COPY leases TO '/tmp/leases.csv' CSV HEADER;
```

### Import Data

1. Download the CSV files from your old project
2. Upload them to the new project using Supabase Dashboard → Table Editor → Import Data
3. Verify foreign key relationships are intact

### Migrate Storage Files

Use the Supabase CLI or API to copy files between buckets:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to old project
supabase link --project-ref old-project-ref

# Copy bucket
# (Manual process - may need custom script)
```

## Next Steps

1. ✅ Test all major features:
   - User registration/login
   - Lease upload
   - Lease viewing
   - Lease deletion

2. ✅ Deploy to Vercel:
   - Add environment variables to Vercel
   - Update Site URL and Redirect URLs in Supabase
   - Test production deployment

3. ✅ Configure monitoring:
   - Set up error tracking (e.g., Sentry)
   - Configure log drains
   - Set up uptime monitoring

## Support

For issues or questions:
- **Supabase Docs**: https://supabase.com/docs
- **STAYLL Setup Guide**: See `STAYLL_V5_SETUP_GUIDE.md`
- **Database Schema**: See `STAYLL_V5_DATABASE_SCHEMA.sql`

## Environment Variables Reference

All required environment variables are in `.env.local`:

```bash
# Core Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ktmgqbgrntgkzencxqhs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
STORAGE_SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Storage
STORAGE_SUPABASE_URL=https://ktmgqbgrntgkzencxqhs.supabase.co
STORAGE_POSTGRES_URL=<postgres-connection-string>

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

**Migration Date**: December 12, 2025  
**Project Ref**: ktmgqbgrntgkzencxqhs  
**Status**: ✅ Environment configured, pending database setup
