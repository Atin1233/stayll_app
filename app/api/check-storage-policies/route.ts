import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not configured' },
        { status: 500 }
      );
    }

    console.log('Checking storage policies...');

    // List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return NextResponse.json(
        { error: `Failed to list buckets: ${bucketsError.message}` },
        { status: 500 }
      );
    }

    const leasesBucket = buckets?.find(bucket => bucket.name === 'leases');
    
    if (!leasesBucket) {
      return NextResponse.json({
        error: 'Leases bucket not found',
        suggestion: 'Create a bucket named "leases" in Supabase dashboard'
      });
    }

    // Try to get bucket policies (this might not work due to RLS)
    let policies = null;
    try {
      const { data: policiesData, error: policiesError } = await supabase
        .from('storage.policies')
        .select('*')
        .eq('bucket_id', 'leases');
      
      if (!policiesError) {
        policies = policiesData;
      }
    } catch (e) {
      console.log('Could not fetch policies due to RLS restrictions');
    }

    // Test upload with detailed error
    const testFileName = `policy-test-${Date.now()}.txt`;
    const testContent = 'Testing RLS policies';
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('leases')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      });

    // Clean up test file if it was created
    if (uploadData) {
      await supabase.storage
        .from('leases')
        .remove([testFileName]);
    }

    return NextResponse.json({
      success: uploadError ? false : true,
      bucket: {
        name: leasesBucket.name,
        id: leasesBucket.id,
        public: leasesBucket.public,
        created_at: leasesBucket.created_at
      },
      uploadTest: {
        success: !uploadError,
        error: uploadError ? uploadError.message : null,
        details: uploadError
      },
      suggestions: uploadError ? [
        '1. Go to Supabase Dashboard → Storage → Policies',
        '2. Click "New Policy" for the leases bucket',
        '3. Set Policy Name: "Allow authenticated uploads"',
        '4. Set Target roles: "authenticated"',
        '5. Set Policy definition: "true" (allow all authenticated users)',
        '6. Or disable RLS for the leases bucket entirely'
      ] : [
        'Storage is working correctly!'
      ]
    });

  } catch (error) {
    console.error('Storage policy check error:', error);
    return NextResponse.json(
      { error: `Policy check failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 