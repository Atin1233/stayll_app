# STAYLL AI v5.0 - Setup & Migration Guide

## Overview

This guide will help you set up and migrate to STAYLL v5.0, the new financial-grade contract data layer architecture.

## Key Changes from MVP

1. **Multi-tenant Architecture**: Organizations, roles, and RBAC
2. **Atomic Field Extraction**: Individual fields stored in `lease_fields` table
3. **Validation Engine**: Deterministic rule-based validation
4. **Audit Trail**: Comprehensive event logging
5. **Evidence Linking**: Source clause location tracking
6. **Job Queue Structure**: Async processing pipeline (mocked for now)

## Prerequisites

- Supabase project configured
- Node.js 18+ and pnpm installed
- Database access to run SQL scripts

## Setup Steps

### 1. Database Schema Migration

Run the v5.0 database schema SQL in your Supabase SQL Editor:

```bash
# Open Supabase Dashboard > SQL Editor
# Copy and paste contents of STAYLL_V5_DATABASE_SCHEMA.sql
# Run the script
```

**What this creates:**
- `organizations` table
- Updated `leases` table with org_id, verification_status, rent_schedule
- `lease_fields` table for atomic field storage
- `obligations` table for calendar events
- `audit_events` table for immutable logging
- `api_keys` table for integrations
- Updated RLS policies for multi-tenant access

### 2. Update Existing User Profiles

If you have existing users, you need to:

1. Create an organization for each user (or migrate to a shared org)
2. Update `user_profiles` to set `organization_id` and `role`

```sql
-- Example: Create default organization and assign existing users
INSERT INTO organizations (name, billing_status)
VALUES ('Default Organization', 'active')
RETURNING id;

-- Update existing user profiles (replace org_id with actual ID)
UPDATE user_profiles
SET organization_id = '<org_id>', role = 'org_admin'
WHERE organization_id IS NULL;
```

### 3. Migrate Existing Leases

If you have existing leases, migrate them to the new schema:

```sql
-- Create default organization if needed
-- Then update existing leases
UPDATE leases
SET org_id = (
  SELECT organization_id 
  FROM user_profiles 
  WHERE user_profiles.id = leases.user_id
  LIMIT 1
),
uploader_id = user_id,
verification_status = 'unverified'
WHERE org_id IS NULL;
```

### 4. Environment Variables

No new environment variables required if using Supabase. The existing setup should work.

### 5. Test the New Upload Flow

1. Navigate to `/app/leases` (or create new upload page)
2. Upload a test PDF
3. Check that:
   - Lease is created with `org_id`
   - Verification status is `unverified`
   - File is stored correctly
   - Audit event is logged

## Architecture Overview

### New Services

- `lib/v5/organization.ts` - Organization and role management
- `lib/v5/audit.ts` - Audit event logging
- `lib/v5/validation.ts` - Deterministic validation rules
- `lib/v5/leaseFields.ts` - Atomic field management
- `lib/v5/leaseStorage.ts` - Updated lease storage service

### New API Routes

- `/api/v5/leases/upload` - New upload endpoint with org support
- `/api/v5/leases` - List/delete leases with org filtering

### Type Definitions

All v5.0 types are in `types/v5.0.ts`:
- `Organization`, `UserProfile`, `UserRole`
- `Lease` (updated schema)
- `LeaseField`, `ValidationState`
- `Obligation`, `AuditEvent`
- API request/response types

## Next Steps (Development Roadmap)

### Phase 1: Core Infrastructure ✅
- [x] Database schema
- [x] Type definitions
- [x] Organization service
- [x] Audit service
- [x] Validation engine
- [x] Lease fields service
- [x] Updated upload API

### Phase 2: Field Extraction (In Progress)
- [ ] OCR integration (AWS Textract or free alternative)
- [ ] Clause segmentation
- [ ] LLM extraction pipeline
- [ ] Deterministic parser
- [ ] Field extraction service

### Phase 3: QA/Review UI
- [ ] QA queue page
- [ ] Review workarea component
- [ ] Field approval/rejection flow
- [ ] Evidence viewer

### Phase 4: Obligations & Exports
- [ ] Obligation generation
- [ ] Calendar view
- [ ] CSV export
- [ ] JSON export
- [ ] Evidence pack PDF generation

### Phase 5: Advanced Features
- [ ] Job queue implementation (Redis/BullMQ)
- [ ] Real-time processing updates
- [ ] API keys management
- [ ] Webhook integration
- [ ] Admin dashboard

## Testing

### Manual Testing Checklist

1. **Organization Setup**
   - [ ] Create organization
   - [ ] Assign user to organization
   - [ ] Verify role-based access

2. **Upload Flow**
   - [ ] Upload PDF successfully
   - [ ] Verify org_id is set
   - [ ] Check audit event is logged
   - [ ] Verify file storage

3. **Lease Management**
   - [ ] List leases (filtered by org)
   - [ ] View lease details
   - [ ] Delete lease (cascading deletes work)

4. **Field Management** (when implemented)
   - [ ] Extract fields
   - [ ] View fields
   - [ ] Update field (reviewer role)
   - [ ] QA workflow

## Troubleshooting

### Common Issues

**"Organization not found" error:**
- Ensure user has `organization_id` set in `user_profiles`
- Create organization if needed

**RLS policy errors:**
- Verify RLS policies are created correctly
- Check that user's organization_id matches lease's org_id

**Missing tables:**
- Run `STAYLL_V5_DATABASE_SCHEMA.sql` again
- Check Supabase logs for errors

**Type errors:**
- Ensure `types/v5.0.ts` is imported correctly
- Check TypeScript compilation

## Migration Notes

### Backward Compatibility

- Old API routes (`/api/upload-lease`, `/api/leases`) still work
- Old `leases` table structure is maintained (with new columns added)
- Existing leases will work after migration

### Breaking Changes

- New uploads require organization (user must have org_id)
- RLS policies now enforce org-based access
- Some fields moved to `lease_fields` table (when extraction is implemented)

## Support

For questions or issues:
1. Check Supabase logs
2. Review database schema
3. Check browser console for errors
4. Review API route logs

## Next Development Session

Focus areas:
1. OCR integration (free alternative: pdf-lib or pdf-parse)
2. Basic field extraction from mock text
3. QA UI components
4. Obligation generation logic

