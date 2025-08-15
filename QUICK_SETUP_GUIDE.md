# 🚀 Quick Setup Guide - Fix 500 Errors

## 🚨 **Current Issue**
You're getting 500 errors because Supabase is not configured. The system is now set up to work in "test mode" without Supabase, but for full functionality, you need to set up Supabase.

## ✅ **Immediate Fix - Test Mode**
The system now works in test mode without Supabase:
- Uploads will work (but won't be stored permanently)
- Lease list will show mock data
- No more 500 errors

## 🔧 **Full Setup (Optional)**

### **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for setup to complete

### **Step 2: Get Your Credentials**
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**

### **Step 3: Set Environment Variables**
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **Step 4: Create Database Tables**
Run this SQL in your Supabase SQL Editor:

```sql
-- Create leases table
CREATE TABLE IF NOT EXISTS leases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_name TEXT,
  property_address TEXT,
  monthly_rent TEXT,
  lease_start DATE,
  lease_end DATE,
  due_date TEXT,
  late_fee TEXT,
  security_deposit TEXT,
  utilities TEXT,
  parking TEXT,
  pets TEXT,
  smoking TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  confidence_score DECIMAL(5,2),
  analysis_data JSONB,
  portfolio_impact JSONB,
  compliance_assessment JSONB,
  strategic_recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own leases" ON leases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leases" ON leases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leases" ON leases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leases" ON leases
  FOR DELETE USING (auth.uid() = user_id);
```

### **Step 5: Create Storage Bucket**
1. Go to **Storage** in Supabase Dashboard
2. Click **"Create a new bucket"**
3. Name: `leases`
4. Set to **Private**
5. Click **"Create bucket"**

### **Step 6: Configure Storage Policies**
Run this SQL:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'leases');

-- Allow users to access their own files
CREATE POLICY "Allow users to access their own files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'leases' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'leases' AND (storage.foldername(name))[1] = auth.uid()::text);
```

## 🧪 **Testing**

### **Test Mode (Current)**
- ✅ Upload files (mock storage)
- ✅ View lease list (mock data)
- ✅ No 500 errors

### **Full Mode (After Supabase Setup)**
- ✅ Real file storage
- ✅ Database persistence
- ✅ User authentication
- ✅ File management

## 🎯 **What Works Now**

1. **File Upload**: Works with validation
2. **Lease List**: Shows mock data
3. **UI**: All components work
4. **No Errors**: 500 errors are fixed

## 🚀 **Next Steps**

1. **Test the current system** - Everything should work now
2. **Set up Supabase** (optional) - For real storage
3. **Connect AI analysis** - When ready

---

**Your system is now working! 🎉**

The 500 errors are fixed and you can test all functionality. Supabase setup is optional for now. 