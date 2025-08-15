# 🗄️ Complete Storage Setup Guide for Stayll

## 🎯 **What This Setup Provides**

Your storage system now includes:
- ✅ **Secure file uploads** to Supabase Storage
- ✅ **Database records** for each lease with metadata
- ✅ **User-specific access** with Row Level Security
- ✅ **Analysis data storage** with confidence scores
- ✅ **File management** (view, edit, delete)
- ✅ **Search and filtering** capabilities
- ✅ **Complete audit trail** of all operations

## 🚀 **Quick Setup (5 minutes)**

### **1. Create Storage Bucket**

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage**
3. Click **"Create a new bucket"**
4. Set bucket name: **`leases`**
5. Set to **Private**
6. Click **"Create bucket"**

### **2. Configure RLS Policies**

Run this SQL in your **Supabase SQL Editor**:

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

### **3. Verify Database Tables**

Ensure your database has the required tables (from `SUPABASE_DATABASE_SETUP.md`):

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('leases', 'lease_analyses', 'user_profiles');
```

## 🔧 **Environment Variables**

Add these to your `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL (for authentication redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧪 **Testing Your Setup**

### **Test 1: Upload a Lease**

1. Go to `/app/leases` in your app
2. Fill in property address and tenant name
3. Upload a PDF file
4. Check for success message

### **Test 2: View Uploaded Files**

1. Check the leases list appears
2. Click on a lease to view details
3. Verify file URL works

### **Test 3: Check Storage**

1. Go to **Supabase Dashboard** → **Storage** → **leases**
2. Verify files are uploaded in user-specific folders
3. Check file permissions

## 📊 **Storage Structure**

### **File Organization**
```
leases/
├── user-id-1/
│   ├── 2024-01-15T10-30-45-123Z-lease1.pdf
│   └── 2024-01-16T14-20-30-456Z-lease2.pdf
└── user-id-2/
    └── 2024-01-17T09-15-22-789Z-lease3.pdf
```

### **Database Records**
Each lease creates:
- **leases** table record with metadata
- **lease_analyses** table record (when analyzed)
- **user_profiles** table record (if not exists)

## 🔒 **Security Features**

### **Row Level Security (RLS)**
- Users can only access their own files
- Database records are user-scoped
- File paths include user ID for isolation

### **File Validation**
- PDF files only
- 50MB size limit
- Virus scanning (Supabase handles this)

### **Access Control**
- Authentication required for all operations
- User-specific file paths
- Secure URL generation

## 📈 **Performance Optimizations**

### **File Upload**
- Chunked uploads for large files
- Progress tracking
- Automatic retry on failure

### **Database Queries**
- Indexed on user_id and created_at
- Pagination support
- Efficient filtering

### **Storage Access**
- CDN caching for file downloads
- Optimized image processing
- Bandwidth optimization

## 🛠️ **API Endpoints**

### **Upload Lease**
```
POST /api/upload-lease
Content-Type: multipart/form-data

Form data:
- file: PDF file
- propertyAddress: string (optional)
- tenantName: string (optional)
```

### **Fetch Leases**
```
GET /api/leases?propertyAddress=123&tenantName=John&limit=50&offset=0
```

### **Save Analysis**
```
POST /api/analyze-lease
Content-Type: application/json

{
  "leaseId": "uuid",
  "analysisData": { ... }
}
```

### **Delete Lease**
```
DELETE /api/leases
Content-Type: application/json

{
  "leaseId": "uuid"
}
```

## 🔍 **Monitoring & Debugging**

### **Check Upload Status**
```javascript
// In browser console
const response = await fetch('/api/upload-lease', {
  method: 'POST',
  body: formData
});
console.log(await response.json());
```

### **Check Storage Bucket**
```sql
-- In Supabase SQL Editor
SELECT * FROM storage.objects WHERE bucket_id = 'leases';
```

### **Check Database Records**
```sql
-- In Supabase SQL Editor
SELECT * FROM leases WHERE user_id = auth.uid();
```

## 🚨 **Common Issues & Solutions**

### **Issue: "Storage bucket not found"**
**Solution:**
1. Create the `leases` bucket in Supabase Storage
2. Ensure bucket name is exactly `leases`

### **Issue: "Permission denied"**
**Solution:**
1. Check RLS policies are applied
2. Verify user is authenticated
3. Check bucket permissions

### **Issue: "File upload failed"**
**Solution:**
1. Check file size (max 50MB)
2. Verify file is PDF
3. Check network connection

### **Issue: "Database insert failed"**
**Solution:**
1. Verify database tables exist
2. Check RLS policies on tables
3. Ensure user has proper permissions

## 📱 **Mobile & Accessibility**

### **Responsive Design**
- Mobile-optimized upload interface
- Touch-friendly file selection
- Responsive lease list

### **Accessibility**
- Screen reader support
- Keyboard navigation
- High contrast mode support

## 🔄 **Backup & Recovery**

### **Automatic Backups**
- Supabase handles database backups
- Storage files are replicated
- Point-in-time recovery available

### **Manual Backup**
```sql
-- Export lease data
SELECT * FROM leases WHERE user_id = auth.uid();
```

## 🎉 **Next Steps**

1. **Test the complete workflow** - Upload, view, delete
2. **Add analysis integration** - Connect AI analysis
3. **Implement search** - Add advanced filtering
4. **Add bulk operations** - Multi-lease management
5. **Set up notifications** - Email alerts for uploads

## 📞 **Support**

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase dashboard logs
3. Test with a simple PDF file
4. Check environment variables
5. Review RLS policies

---

**Your complete storage system is ready! 🚀**

Users can now upload, store, and manage their lease documents securely with full access control and data persistence. 