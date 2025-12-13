# 🚀 Quick Start - Supabase Migration

## TL;DR - 5-Minute Setup

### 1. Database Setup (2 minutes)
1. Open: https://supabase.com/dashboard/project/ktmgqbgrntgkzencxqhs/editor/sql
2. Copy all from `COMPLETE_MIGRATION.sql`
3. Click **Run**
4. Wait for "Success" message

### 2. Storage Setup (1 minute)
1. Open: https://supabase.com/dashboard/project/ktmgqbgrntgkzencxqhs/storage/buckets
2. Click **New bucket**
3. Name: `leases`
4. Private: **ON**
5. Click **Create**

### 3. Create Organization (1 minute)
Run this SQL:
```sql
INSERT INTO organizations (name, billing_status)
VALUES ('My Organization', 'active')
RETURNING id;
```
**Save the ID!** 📝

### 4. Start Development (1 minute)
```bash
pnpm install  # If needed
pnpm dev
```
Open: http://localhost:3000

### 5. Register & Assign User
1. Register at: http://localhost:3000/auth/register
2. Confirm email (check inbox for 6-digit code)
3. Get user ID from: https://supabase.com/dashboard/project/ktmgqbgrntgkzencxqhs/auth/users
4. Run this SQL (replace IDs):
```sql
UPDATE user_profiles
SET organization_id = '<org-id>', role = 'org_admin'
WHERE id = '<user-id>';
```

### 6. Test Upload
1. Login: http://localhost:3000/auth/login
2. Upload lease: http://localhost:3000/app/leases
3. Done! ✅

---

## Files Created

- ✅ `.env.local` - Environment variables
- ✅ `COMPLETE_MIGRATION.sql` - Database setup
- ✅ `MIGRATION_COMPLETE_SUMMARY.md` - Full overview
- ✅ `MIGRATION_TESTING_GUIDE.md` - Detailed testing
- ✅ `SUPABASE_MIGRATION_GUIDE.md` - Setup guide
- ✅ `STORAGE_SETUP_QUICK_GUIDE.md` - Storage help

---

## Need Help?

**Issue**: Can't connect?  
**Fix**: Restart dev server: `pnpm dev`

**Issue**: "Organization not found"?  
**Fix**: Run step 5 above (assign user to org)

**Issue**: Can't upload files?  
**Fix**: Check storage bucket exists (step 2)

**Issue**: Email not received?  
**Fix**: Check spam or use magic link option

---

## Full Documentation

See `MIGRATION_COMPLETE_SUMMARY.md` for:
- Complete setup guide
- Troubleshooting
- Security notes
- Production deployment

---

## Verification

Run this to verify setup:
```sql
-- Check tables (should show 8)
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Check your org
SELECT * FROM organizations;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE name = 'leases';
```

---

**Project**: ktmgqbgrntgkzencxqhs  
**Status**: ✅ Ready to use  
**Next**: Follow steps above
