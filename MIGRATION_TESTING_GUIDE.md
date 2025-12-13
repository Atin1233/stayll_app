# Migration Testing Guide

## Quick Start Testing

After completing the migration setup, follow these steps to verify everything works:

---

## ✅ Phase 1: Database Setup

### Step 1: Run Database Migration

1. Go to your Supabase Dashboard:  
   **https://supabase.com/dashboard/project/ktmgqbgrntgkzencxqhs**

2. Navigate to **SQL Editor** (left sidebar)

3. Create a new query and paste the entire contents of:  
   `COMPLETE_MIGRATION.sql`

4. Click **Run** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

5. Verify success - you should see output showing tables created

### Step 2: Verify Tables Created

Run this query in SQL Editor:

```sql
-- Should return 8 tables
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
```

**Expected Result**: 8 rows showing all table names

### Step 3: Verify RLS Enabled

```sql
-- All should show rowsecurity = true
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN (
  'organizations', 'leases', 'lease_fields', 
  'obligations', 'audit_events', 'api_keys',
  'lease_analyses', 'user_profiles'
)
ORDER BY tablename;
```

**Expected Result**: All tables show `rowsecurity = true`

---

## ✅ Phase 2: Storage Setup

### Step 1: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Configure:
   - **Name**: `leases`
   - **Public**: OFF (keep private)
   - **File size limit**: 50 MB
4. Click **Create bucket**

### Step 2: Verify Storage Policies

The policies should be created automatically from the migration SQL. Verify them:

```sql
-- Check storage policies exist
SELECT * FROM storage.objects_policies 
WHERE bucket_id = 'leases';
```

**Expected Result**: 4 policies (INSERT, SELECT, UPDATE, DELETE)

### Step 3: Test Upload from Dashboard

1. Go to **Storage** → **leases** bucket
2. Try uploading a test PDF
3. Verify you can see and download it
4. Delete the test file

---

## ✅ Phase 3: Authentication Setup

### Step 1: Configure Auth Settings

1. Go to **Authentication** → **Providers**
2. Verify **Email** is enabled (should be by default)
3. Go to **Authentication** → **URL Configuration**
4. Set:
   - **Site URL**: `http://localhost:3000`
   - Add **Redirect URLs**:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/*` (wildcard)

### Step 2: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize if needed (optional for testing)
3. For testing, default templates work fine

---

## ✅ Phase 4: Create Organization

### Step 1: Create Your First Organization

Run this in SQL Editor:

```sql
-- Create organization
INSERT INTO organizations (name, billing_status)
VALUES ('Test Organization', 'active')
RETURNING id, name, created_at;
```

**Expected Result**: Should return the new organization's UUID

### Step 2: Save Organization ID

Copy the `id` value - you'll need it in the next step!

---

## ✅ Phase 5: Local Development Setup

### Step 1: Verify Environment Variables

Check that `.env.local` exists and has correct values:

```bash
cat .env.local | grep SUPABASE_URL
```

**Expected Output**: Should show `https://ktmgqbgrntgkzencxqhs.supabase.co`

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Start Development Server

```bash
pnpm dev
```

**Expected Output**: Server should start on `http://localhost:3000`

---

## ✅ Phase 6: Test User Registration

### Step 1: Register New User

1. Open browser to: **http://localhost:3000/auth/register**
2. Enter test email (use a real email you can access)
3. Enter a strong password
4. Click **Create account**

### Step 2: Check Email for Confirmation Code

1. Check your email inbox
2. Look for email from Supabase with subject: "Confirm Your Signup"
3. Copy the 6-digit confirmation code

### Step 3: Confirm Email

1. Enter the 6-digit code in the confirmation form
2. Click **Confirm Email**
3. Should redirect to login page

### Step 4: Find Your User ID

Go to Supabase Dashboard → **Authentication** → **Users**

Find your test user and copy their **UUID**

### Step 5: Assign User to Organization

Run this SQL (replace the UUIDs with your actual values):

```sql
-- Replace <user-id> with your user UUID
-- Replace <org-id> with your organization UUID from Phase 4
UPDATE user_profiles
SET 
  organization_id = '<org-id>',
  role = 'org_admin',
  full_name = 'Test User'
WHERE id = '<user-id>';

-- Verify it worked
SELECT 
  up.id,
  up.full_name,
  up.role,
  o.name as organization
FROM user_profiles up
LEFT JOIN organizations o ON up.organization_id = o.id
WHERE up.id = '<user-id>';
```

**Expected Result**: Should show your user with organization assigned

---

## ✅ Phase 7: Test Login

### Step 1: Sign In

1. Go to: **http://localhost:3000/auth/login**
2. Enter your email and password
3. Click **Sign in**

**Expected Result**: Should redirect to `/app`

### Step 2: Verify Authentication

Check browser console (F12) - should not show authentication errors

---

## ✅ Phase 8: Test File Upload

### Step 1: Navigate to Leases Page

1. Go to: **http://localhost:3000/app/leases**
2. Should see the leases page with upload area

### Step 2: Upload Test Lease

1. Find or create a test PDF file (any PDF will work for testing)
2. Drag and drop the PDF onto the upload area, or click to browse
3. Wait for upload to complete

**Expected Behavior**:
- Upload progress indicator appears
- File uploads successfully
- New lease appears in the list
- No errors in browser console

### Step 3: Verify in Database

Run this SQL:

```sql
-- Check lease was created
SELECT 
  l.id,
  l.tenant_name,
  l.property_address,
  l.file_name,
  l.verification_status,
  l.created_at,
  o.name as organization
FROM leases l
LEFT JOIN organizations o ON l.org_id = o.id
ORDER BY l.created_at DESC
LIMIT 5;
```

**Expected Result**: Should show your uploaded lease

### Step 4: Verify in Storage

1. Go to Supabase Dashboard → **Storage** → **leases**
2. Navigate to folder with your user UUID
3. Should see the uploaded PDF file

### Step 5: Verify Audit Event

```sql
-- Check audit event was logged
SELECT 
  event_type,
  payload->>'file_name' as file_name,
  timestamp
FROM audit_events
ORDER BY timestamp DESC
LIMIT 5;
```

**Expected Result**: Should show 'UPLOAD' event

---

## ✅ Phase 9: Test Lease Management

### Step 1: View Lease Details

1. In the leases list, click on your uploaded lease
2. Should see lease details
3. PDF viewer should load (if implemented)

### Step 2: Test Lease Deletion

1. Click delete button on a lease
2. Confirm deletion
3. Lease should disappear from list

### Step 3: Verify Deletion in Storage

1. Go to Supabase Dashboard → **Storage** → **leases**
2. File should be deleted from storage bucket

---

## ✅ Phase 10: Test Multi-User Isolation (Optional)

### Step 1: Create Second Organization

```sql
INSERT INTO organizations (name, billing_status)
VALUES ('Second Organization', 'active')
RETURNING id;
```

### Step 2: Register Second User

1. Sign out of first account
2. Register another test user (different email)
3. Confirm email
4. Assign to second organization:

```sql
UPDATE user_profiles
SET 
  organization_id = '<second-org-id>',
  role = 'org_admin'
WHERE id = '<second-user-id>';
```

### Step 3: Verify Isolation

1. Sign in as second user
2. Go to leases page
3. Should NOT see first user's leases (RLS working!)

### Step 4: Upload Lease as Second User

1. Upload a test lease
2. Should only see this new lease

### Step 5: Verify in Database

```sql
-- Both users' leases should exist but in different orgs
SELECT 
  l.tenant_name,
  o.name as organization,
  u.email as uploader
FROM leases l
LEFT JOIN organizations o ON l.org_id = o.id
LEFT JOIN auth.users u ON l.uploader_id = u.id
ORDER BY l.created_at DESC;
```

---

## 🐛 Troubleshooting Guide

### Issue: "Authentication service not configured"

**Cause**: Environment variables not loaded

**Fix**:
1. Verify `.env.local` exists in project root
2. Restart dev server (`pnpm dev`)
3. Clear browser cache and reload

### Issue: "Organization not found"

**Cause**: User not assigned to organization

**Fix**:
```sql
-- Assign user to organization
UPDATE user_profiles
SET organization_id = '<org-id>'
WHERE id = '<user-id>';
```

### Issue: "RLS policy violation" on upload

**Cause**: User's organization_id doesn't match or is NULL

**Fix**:
```sql
-- Check user's organization
SELECT id, organization_id, role 
FROM user_profiles 
WHERE id = '<user-id>';

-- Fix if NULL
UPDATE user_profiles
SET organization_id = '<org-id>'
WHERE id = '<user-id>';
```

### Issue: Cannot upload to storage

**Cause**: Storage bucket or policies not configured

**Fix**:
1. Verify bucket exists: Dashboard → Storage → leases
2. Verify policies exist (see Phase 2)
3. Check user is authenticated

### Issue: Email confirmation code not received

**Solutions**:
1. Check spam folder
2. Wait a few minutes (Supabase free tier may have delays)
3. Use magic link option instead (toggle in register form)
4. Check Supabase → Authentication → Logs for email errors

### Issue: TypeScript errors in IDE

**Fix**:
```bash
# Regenerate types
pnpm install
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📊 Verification Checklist

Use this checklist to verify complete migration:

- [ ] Database tables created (8 tables)
- [ ] RLS enabled on all tables
- [ ] Storage bucket 'leases' created
- [ ] Storage policies configured (4 policies)
- [ ] Organization created
- [ ] Test user registered
- [ ] User assigned to organization
- [ ] User can sign in
- [ ] File upload works
- [ ] Lease appears in database
- [ ] File appears in storage
- [ ] Audit event logged
- [ ] Lease deletion works
- [ ] File deleted from storage
- [ ] Multi-tenant isolation works (optional)

---

## 🚀 Next Steps After Testing

Once all tests pass:

### 1. Production Deployment Prep

- [ ] Update environment variables in Vercel
- [ ] Update Site URL in Supabase (production domain)
- [ ] Add production redirect URLs
- [ ] Test production deployment

### 2. Configure Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure Supabase alerts
- [ ] Set up uptime monitoring

### 3. Enable Additional Features

- [ ] Configure Stripe (if using subscriptions)
- [ ] Set up AI services (if using)
- [ ] Configure data enrichment APIs

---

## 📞 Support

If you encounter issues:

1. **Check Logs**:
   - Browser Console (F12)
   - Supabase Dashboard → Logs
   - Terminal output

2. **Common Resources**:
   - `SUPABASE_MIGRATION_GUIDE.md` - Detailed setup
   - `COMPLETE_MIGRATION.sql` - Database schema
   - `STORAGE_SETUP_QUICK_GUIDE.md` - Storage details

3. **Verify Environment**:
   ```bash
   # Check environment variables
   cat .env.local
   
   # Restart server
   pnpm dev
   ```

---

**Migration Status**: Ready for testing  
**Project**: ktmgqbgrntgkzencxqhs  
**Last Updated**: December 12, 2025
