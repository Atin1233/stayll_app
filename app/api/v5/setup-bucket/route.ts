/**
 * STAYLL v5.0 - Setup Storage Bucket
 * Creates the leases bucket if it doesn't exist
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase client not configured' },
        { status: 500 }
      );
    }

    // Check if bucket already exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to list buckets',
          details: listError.message
        },
        { status: 500 }
      );
    }

    const leasesBucket = existingBuckets?.find(bucket => bucket.name === 'leases');
    
    if (leasesBucket) {
      return NextResponse.json({
        success: true,
        message: 'Leases bucket already exists',
        bucket: {
          name: leasesBucket.name,
          id: leasesBucket.id,
          public: leasesBucket.public,
          created_at: leasesBucket.created_at
        }
      });
    }

    // Create the leases bucket
    const { data: newBucket, error: createError } = await supabase.storage.createBucket('leases', {
      public: false, // Private bucket
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 52428800, // 50MB
    });

    if (createError) {
      console.error('Error creating bucket:', createError);
      
      // If bucket creation fails due to permissions, provide helpful message
      if (createError.message?.includes('permission') || createError.message?.includes('policy')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Permission denied. Please create the bucket manually in Supabase Dashboard or configure RLS policies.',
            details: createError.message,
            instructions: [
              '1. Go to Supabase Dashboard → Storage',
              '2. Click "Create a new bucket"',
              '3. Name: "leases"',
              '4. Set to Private',
              '5. File size limit: 50MB',
              '6. Allowed MIME types: application/pdf'
            ]
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create bucket',
          details: createError.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Leases bucket created successfully',
      bucket: {
        name: newBucket.name,
        id: newBucket.id,
        public: newBucket.public
      }
    });

  } catch (error) {
    console.error('Setup bucket error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to setup bucket'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase client not configured' },
        { status: 500 }
      );
    }

    // Check if bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to list buckets' },
        { status: 500 }
      );
    }

    const leasesBucket = buckets?.find(b => b.name === 'leases');

    return NextResponse.json({
      success: true,
      exists: !!leasesBucket,
      bucket: leasesBucket ? {
        name: leasesBucket.name,
        id: leasesBucket.id,
        public: leasesBucket.public,
        created_at: leasesBucket.created_at
      } : null
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to check bucket' },
      { status: 500 }
    );
  }
}

