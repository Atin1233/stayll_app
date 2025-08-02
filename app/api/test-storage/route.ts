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

    // Test if we can access the storage bucket
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Storage buckets error:', bucketsError);
      return NextResponse.json(
        { error: 'Failed to access storage buckets', details: bucketsError },
        { status: 500 }
      );
    }

    // Check if 'leases' bucket exists
    const leasesBucket = buckets?.find(bucket => bucket.name === 'leases');
    
    if (!leasesBucket) {
      return NextResponse.json(
        { error: 'Leases bucket not found. Please create a bucket named "leases" in Supabase storage.' },
        { status: 500 }
      );
    }

    // Test if we can upload a small test file
    console.log('Testing file upload to leases bucket...');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Test file for storage verification';
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('leases')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      });

    if (uploadError) {
      console.error('Upload test error:', uploadError);
      return NextResponse.json(
        { 
          error: `Upload test failed: ${uploadError.message}`,
          details: uploadError,
          bucket: leasesBucket,
          suggestion: 'Check RLS policies for the leases bucket'
        },
        { status: 500 }
      );
    }

    // Clean up test file
    await supabase.storage
      .from('leases')
      .remove([testFileName]);

    return NextResponse.json({
      success: true,
      message: 'Storage is properly configured and uploads work',
      buckets: buckets?.map(b => b.name),
      leasesBucket: leasesBucket,
      uploadTest: 'Passed'
    });

  } catch (error) {
    console.error('Storage test error:', error);
    return NextResponse.json(
      { error: 'Storage test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 