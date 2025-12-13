# Migration Checklist

Copy this to track your migration progress.

## Phase 1: Pre-Migration ✅
- [x] New Supabase credentials received
- [x] `.env.local` file created
- [x] Environment variables configured
- [x] Documentation created

## Phase 2: Database Setup
- [ ] Open Supabase SQL Editor
- [ ] Run `COMPLETE_MIGRATION.sql`
- [ ] Verify 8 tables created
- [ ] Verify RLS enabled on all tables
- [ ] Check indexes created

### Verification Query:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'organizations', 'leases', 'lease_fields', 'obligations', 
  'audit_events', 'api_keys', 'lease_analyses', 'user_profiles'
)
ORDER BY table_name;
```
Expected: 8 rows

## Phase 3: Storage Setup
- [ ] Create 'leases' bucket in Storage
- [ ] Set bucket to private
- [ ] Verify storage policies created (4 policies)
- [ ] Test upload from dashboard

### Verification Query:
```sql
SELECT * FROM storage.buckets WHERE name = 'leases';
SELECT * FROM storage.objects_policies WHERE bucket_id = 'leases';
```

## Phase 4: Organization Setup
- [ ] Create first organization
- [ ] Save organization ID: `________________`

### SQL:
```sql
INSERT INTO organizations (name, billing_status)
VALUES ('My Organization', 'active')
RETURNING id;
```

## Phase 5: Local Development
- [ ] Run `pnpm install`
- [ ] Run `pnpm dev`
- [ ] Server starts successfully on port 3000
- [ ] No console errors about env vars
- [ ] Navigate to http://localhost:3000

## Phase 6: User Registration
- [ ] Go to /auth/register
- [ ] Register with real email
- [ ] Receive confirmation email
- [ ] Enter 6-digit code
- [ ] Confirmation successful
- [ ] Get user ID from Supabase Dashboard
- [ ] User ID: `________________`

## Phase 7: User-Organization Assignment
- [ ] Run user assignment SQL
- [ ] Verify assignment in database

### SQL:
```sql
UPDATE user_profiles
SET organization_id = '<org-id>', role = 'org_admin'
WHERE id = '<user-id>';

-- Verify
SELECT up.*, o.name as org_name 
FROM user_profiles up 
LEFT JOIN organizations o ON up.organization_id = o.id
WHERE up.id = '<user-id>';
```

## Phase 8: Authentication Test
- [ ] Go to /auth/login
- [ ] Sign in with credentials
- [ ] Redirect to /app successful
- [ ] No authentication errors
- [ ] User profile loads

## Phase 9: File Upload Test
- [ ] Navigate to /app/leases
- [ ] Upload area visible
- [ ] Upload test PDF file
- [ ] Upload completes successfully
- [ ] Lease appears in list
- [ ] No errors in console

### Verification:
```sql
-- Check lease created
SELECT * FROM leases ORDER BY created_at DESC LIMIT 1;

-- Check file in storage
SELECT * FROM storage.objects 
WHERE bucket_id = 'leases' 
ORDER BY created_at DESC LIMIT 1;

-- Check audit event
SELECT * FROM audit_events 
WHERE event_type = 'UPLOAD' 
ORDER BY timestamp DESC LIMIT 1;
```

## Phase 10: Lease Management Test
- [ ] View lease details
- [ ] PDF viewer loads (if implemented)
- [ ] Delete lease
- [ ] Lease removed from list
- [ ] File deleted from storage

### Verification:
```sql
-- Check lease deleted
SELECT COUNT(*) FROM leases;

-- Check file deleted
SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'leases';
```

## Phase 11: Multi-Tenant Isolation (Optional)
- [ ] Create second organization
- [ ] Register second test user
- [ ] Assign to second organization
- [ ] Sign in as second user
- [ ] Verify cannot see first user's leases
- [ ] Upload lease as second user
- [ ] Verify only sees own lease

### Verification:
```sql
-- Should show leases from both orgs but users see their own only
SELECT l.id, o.name as org, u.email as uploader
FROM leases l
LEFT JOIN organizations o ON l.org_id = o.id
LEFT JOIN auth.users u ON l.uploader_id = u.id;
```

## Phase 12: Security Verification
- [ ] RLS prevents cross-org access
- [ ] Storage policies prevent cross-user access
- [ ] Audit events logged for all actions
- [ ] Service role key not exposed client-side

### Test:
```sql
-- As user 1, try to see user 2's lease (should fail with RLS)
SELECT * FROM leases WHERE user_id != auth.uid();
```

## Phase 13: Performance Check
- [ ] Query performance acceptable
- [ ] File upload speed reasonable
- [ ] Page load times under 2 seconds
- [ ] No memory leaks in browser

## Phase 14: Production Prep (When Ready)
- [ ] Update Site URL in Supabase for production domain
- [ ] Add production redirect URLs
- [ ] Add environment variables to Vercel
- [ ] Test on production domain
- [ ] Configure monitoring
- [ ] Set up error tracking

## Troubleshooting Used
Document any issues you encountered:

| Issue | Solution | Time Spent |
|-------|----------|------------|
|       |          |            |
|       |          |            |
|       |          |            |

## Notes

### Organization ID
```
<write your org ID here>
```

### User IDs
```
Test User 1: <user-id-1>
Test User 2: <user-id-2>
```

### Test Files Used
```
- <file-name-1.pdf>
- <file-name-2.pdf>
```

## Final Status

- [ ] All phases complete
- [ ] Application functioning correctly
- [ ] Ready for development
- [ ] Team notified

**Completed By**: ________________  
**Date**: ________________  
**Time Taken**: ________________

---

## Quick Commands Reference

### Start Dev Server
```bash
pnpm dev
```

### Check Tables
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

### Check Users
```sql
SELECT u.email, up.role, o.name as org
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
LEFT JOIN organizations o ON up.organization_id = o.id;
```

### Check Leases
```sql
SELECT l.tenant_name, o.name as org, l.created_at
FROM leases l
LEFT JOIN organizations o ON l.org_id = o.id
ORDER BY l.created_at DESC;
```

### Check Storage
```sql
SELECT name, created_at, metadata->>'size' as size
FROM storage.objects
WHERE bucket_id = 'leases'
ORDER BY created_at DESC;
```

---

## Resources

- `QUICK_START.md` - 5-minute quick start
- `MIGRATION_COMPLETE_SUMMARY.md` - Full overview
- `MIGRATION_TESTING_GUIDE.md` - Detailed testing guide
- `SUPABASE_MIGRATION_GUIDE.md` - Complete setup guide
- `STORAGE_SETUP_QUICK_GUIDE.md` - Storage help
- `COMPLETE_MIGRATION.sql` - Database migration script

---

**Project**: ktmgqbgrntgkzencxqhs  
**Migration Date**: December 12, 2025
