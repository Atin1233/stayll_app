# Supabase Database Setup Guide for STAYLL

## 🗄️ **Database Tables Setup**

### **1. Create the `leases` Table**

Run this SQL in your Supabase SQL Editor:

```sql
-- Create leases table for storing lease analysis history
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
  analysis_data JSONB, -- Store full STAYLL analysis results
  portfolio_impact JSONB, -- Store portfolio analysis
  compliance_assessment JSONB, -- Store compliance results
  strategic_recommendations JSONB, -- Store strategic insights
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leases_user_id ON leases(user_id);
CREATE INDEX IF NOT EXISTS idx_leases_created_at ON leases(created_at);
CREATE INDEX IF NOT EXISTS idx_leases_confidence_score ON leases(confidence_score);

-- Enable Row Level Security
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

### **2. Create the `lease_analyses` Table (Optional - for detailed analysis history)**

```sql
-- Create lease_analyses table for storing detailed analysis history
CREATE TABLE IF NOT EXISTS lease_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- 'STAYLL', 'basic', 'compliance', etc.
  analysis_data JSONB NOT NULL, -- Full analysis results
  confidence_score DECIMAL(5,2),
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lease_analyses_lease_id ON lease_analyses(lease_id);
CREATE INDEX IF NOT EXISTS idx_lease_analyses_user_id ON lease_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_lease_analyses_created_at ON lease_analyses(created_at);

-- Enable RLS
ALTER TABLE lease_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own analyses" ON lease_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON lease_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **3. Create the `user_profiles` Table (Optional - for user preferences)**

```sql
-- Create user_profiles table for storing user preferences and settings
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company TEXT,
  role TEXT,
  portfolio_size INTEGER,
  preferences JSONB, -- Store user preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 🗂️ **Storage Bucket Setup**

### **1. Create Storage Bucket**

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"Create a new bucket"**
3. Set bucket name: **`leases`**
4. Set to **Private**
5. Set file size limit: **50MB**
6. Set allowed MIME types: **`application/pdf`**
7. Click **"Create bucket"**

### **2. Configure Storage RLS Policies**

```sql
-- Allow authenticated users to upload files to leases bucket
CREATE POLICY "Allow authenticated users to upload lease files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'leases');

-- Allow users to view their own uploaded files
CREATE POLICY "Allow users to view their own lease files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'leases');

-- Allow users to update their own uploaded files
CREATE POLICY "Allow users to update their own lease files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'leases');

-- Allow users to delete their own uploaded files
CREATE POLICY "Allow users to delete their own lease files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'leases');
```

## 🔧 **Environment Variables**

Make sure you have these in your `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL for authentication redirects
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 🧪 **Testing the Setup**

### **1. Test Database Connection**

Create a test API endpoint:

```typescript
// app/api/test-db/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('leases')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Database test failed' 
    }, { status: 500 });
  }
}
```

### **2. Test Storage Connection**

```typescript
// app/api/test-storage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test storage connection
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leasesBucket = buckets?.find(bucket => bucket.name === 'leases');

    return NextResponse.json({ 
      success: true, 
      message: 'Storage connection successful',
      buckets: buckets?.map(b => b.name),
      leasesBucketExists: !!leasesBucket
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Storage test failed' 
    }, { status: 500 });
  }
}
```

## 📊 **Database Functions (Optional)**

### **1. Create Function to Get User's Lease History**

```sql
-- Function to get user's lease history with analysis data
CREATE OR REPLACE FUNCTION get_user_lease_history(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  tenant_name TEXT,
  property_address TEXT,
  monthly_rent TEXT,
  lease_start DATE,
  lease_end DATE,
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE,
  analysis_summary JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.tenant_name,
    l.property_address,
    l.monthly_rent,
    l.lease_start,
    l.lease_end,
    l.confidence_score,
    l.created_at,
    l.analysis_data
  FROM leases l
  WHERE l.user_id = user_uuid
  ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **2. Create Function to Get Portfolio Summary**

```sql
-- Function to get user's portfolio summary
CREATE OR REPLACE FUNCTION get_user_portfolio_summary(user_uuid UUID)
RETURNS TABLE (
  total_leases INTEGER,
  total_monthly_revenue DECIMAL(12,2),
  average_confidence_score DECIMAL(5,2),
  recent_analyses INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_leases,
    COALESCE(SUM(CAST(REPLACE(REPLACE(l.monthly_rent, '$', ''), ',', '') AS DECIMAL(12,2))), 0) as total_monthly_revenue,
    COALESCE(AVG(l.confidence_score), 0) as average_confidence_score,
    COUNT(CASE WHEN l.created_at >= NOW() - INTERVAL '30 days' THEN 1 END)::INTEGER as recent_analyses
  FROM leases l
  WHERE l.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🚀 **Next Steps**

1. **Run the SQL scripts** in your Supabase SQL Editor
2. **Create the storage bucket** in Supabase Dashboard
3. **Test the connections** using the test endpoints
4. **Update your app** to use the new database schema
5. **Deploy and test** the complete storage system

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **RLS Policy Errors**
   - Check that RLS policies are correctly configured
   - Verify user authentication is working
   - Test with authenticated requests

2. **Storage Upload Failures**
   - Verify bucket exists and is named `leases`
   - Check file size limits
   - Ensure correct MIME type

3. **Database Connection Issues**
   - Verify environment variables
   - Check Supabase project status
   - Test with simple queries first

### **Debug Steps:**
1. Check Supabase logs for detailed errors
2. Test database and storage separately
3. Verify RLS policies are working
4. Check authentication flow
5. Test with sample data

---

**Your complete database and storage system is ready! 🚀** 