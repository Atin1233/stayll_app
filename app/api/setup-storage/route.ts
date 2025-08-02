import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not configured' },
        { status: 500 }
      );
    }

    console.log('Setting up storage buckets...');

    // List existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json(
        { error: `Failed to list buckets: ${listError.message}` },
        { status: 500 }
      );
    }

    console.log('Existing buckets:', existingBuckets?.map(b => b.name));

    // Check if leases bucket exists
    const leasesBucket = existingBuckets?.find(bucket => bucket.name === 'leases');
    
    if (leasesBucket) {
      return NextResponse.json({
        success: true,
        message: 'Leases bucket already exists',
        bucket: leasesBucket
      });
    }

    // Create the leases bucket
    console.log('Creating leases bucket...');
    const { data: newBucket, error: createError } = await supabase.storage.createBucket('leases', {
      public: false,
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 52428800, // 50MB
    });

    if (createError) {
      console.error('Error creating bucket:', createError);
      
      // Check if it's an RLS policy error
      if (createError.message.includes('row-level security policy')) {
        return NextResponse.json(
          { 
            error: 'RLS policy error: Cannot create bucket due to security policies. Please create the bucket manually in Supabase dashboard or disable RLS for storage.',
            details: createError.message,
            solution: 'See SUPABASE_STORAGE_SETUP.md for manual setup instructions'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to create bucket: ${createError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Leases bucket created successfully',
      bucket: newBucket
    });

  } catch (error) {
    console.error('Setup storage error:', error);
    return NextResponse.json(
      { error: `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 