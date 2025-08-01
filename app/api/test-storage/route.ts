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

    return NextResponse.json({
      success: true,
      message: 'Storage is properly configured',
      buckets: buckets?.map(b => b.name),
      leasesBucket: leasesBucket
    });

  } catch (error) {
    console.error('Storage test error:', error);
    return NextResponse.json(
      { error: 'Storage test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 