# Supabase Storage Setup Guide

## 🔧 **Storage Setup Issue**

The error "new row violates row-level security policy" means your Supabase project has Row Level Security (RLS) enabled, but the policies aren't configured to allow storage bucket creation.

## 🚀 **Quick Fix Options**

### **Option 1: Disable RLS for Storage (Easiest)**
1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** → **Policies**
3. Click **"Disable RLS"** for storage buckets
4. This allows all authenticated users to create buckets

### **Option 2: Create Bucket Manually (Recommended)**
1. Go to your **Supabase Dashboard**
2. Navigate to **Storage**
3. Click **"Create a new bucket"**
4. Set bucket name: **`leases`**
5. Set to **Private**
6. Click **"Create bucket"**

### **Option 3: Configure RLS Policies (Advanced)**
If you want to keep RLS enabled, create these policies:

#### **Bucket Creation Policy:**
```sql
CREATE POLICY "Allow authenticated users to create buckets" ON storage.buckets
FOR INSERT TO authenticated
WITH CHECK (true);
```

#### **File Upload Policy:**
```sql
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'leases');
```

#### **File Access Policy:**
```sql
CREATE POLICY "Allow users to access their own files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'leases');
```

## 📋 **Step-by-Step Manual Setup**

### **1. Create Storage Bucket:**
1. **Supabase Dashboard** → **Storage**
2. **"Create a new bucket"**
3. **Name:** `leases`
4. **Public:** No (keep private)
5. **File size limit:** 50MB
6. **Allowed MIME types:** `application/pdf`
7. **Click "Create bucket"**

### **2. Configure RLS Policies:**
1. **Storage** → **Policies**
2. **Click "New Policy"**
3. **Policy Name:** `Allow PDF uploads`
4. **Target roles:** `authenticated`
5. **Policy definition:**
   ```sql
   (bucket_id = 'leases' AND (storage.foldername(name))[1] = 'leases')
   ```

### **3. Test the Setup:**
1. Go back to your app
2. Click **"🗄️ Test Storage"**
3. Should show **"✅ Storage OK"**

## 🔍 **Alternative: Use Public Bucket**

If you're still having issues, you can create a public bucket:

1. **Create bucket** named `leases`
2. **Set to Public**
3. **Disable RLS** for this bucket
4. **Test upload** in your app

## ⚠️ **Security Note**

- **Private buckets** are more secure but require proper RLS setup
- **Public buckets** are easier but less secure
- **For development/testing**, public buckets are fine
- **For production**, use private buckets with proper RLS

## 🎯 **Next Steps**

1. **Choose one of the options above**
2. **Set up the storage bucket**
3. **Test with "🗄️ Test Storage" button**
4. **Try uploading a PDF lease**

## 📞 **Need Help?**

If you're still having issues:
1. **Check Supabase logs** for detailed errors
2. **Verify your API keys** are correct
3. **Ensure storage is enabled** in your project
4. **Contact Supabase support** if needed

---

**Recommended:** Use **Option 2 (Manual Creation)** for the quickest fix! 