import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Starting comprehensive storage diagnosis...');
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not configured' },
        { status: 500 }
      );
    }

    const diagnosis = {
      supabase_configured: true,
      bucket_listing: null as any,
      leases_bucket: null as any,
      upload_test: null as any,
      rls_policies: null as any,
      recommendations: [] as string[]
    };

    // Step 1: Test bucket listing
    console.log('Step 1: Testing bucket listing...');
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        diagnosis.bucket_listing = {
          success: false,
          error: bucketsError.message
        };
        diagnosis.recommendations.push('Cannot list buckets - check Supabase configuration');
      } else {
        diagnosis.bucket_listing = {
          success: true,
          buckets: buckets?.map(b => ({ name: b.name, public: b.public, created_at: b.created_at }))
        };
        console.log('Available buckets:', buckets?.map(b => b.name));
      }
    } catch (error) {
      diagnosis.bucket_listing = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Step 2: Check for leases bucket
    console.log('Step 2: Checking for leases bucket...');
    if (diagnosis.bucket_listing?.success) {
      const buckets = diagnosis.bucket_listing.buckets;
      const leasesBucket = buckets?.find((b: any) => b.name === 'leases');
      
      if (leasesBucket) {
        diagnosis.leases_bucket = {
          found: true,
          bucket: leasesBucket
        };
        console.log('Leases bucket found:', leasesBucket);
      } else {
        diagnosis.leases_bucket = {
          found: false,
          available_buckets: buckets?.map((b: any) => b.name)
        };
        diagnosis.recommendations.push('Create a bucket named "leases" in Supabase dashboard');
      }
    }

    // Step 3: Test upload if bucket exists
    console.log('Step 3: Testing upload...');
    if (diagnosis.leases_bucket?.found) {
      try {
        const testFileName = `diagnostic-test-${Date.now()}.txt`;
        const testContent = 'Storage diagnostic test file';
        
        console.log('Attempting upload...');
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('leases')
          .upload(testFileName, testContent, {
            contentType: 'text/plain'
          });

        if (uploadError) {
          diagnosis.upload_test = {
            success: false,
            error: uploadError.message,
            details: uploadError
          };
          
          // Provide specific recommendations based on error
          if (uploadError.message.includes('row-level security')) {
            diagnosis.recommendations.push('RLS policy blocking upload - check storage policies in Supabase dashboard');
            diagnosis.recommendations.push('Consider disabling RLS for storage or creating appropriate policies');
          } else if (uploadError.message.includes('not found')) {
            diagnosis.recommendations.push('Bucket not accessible - check bucket permissions');
          } else if (uploadError.message.includes('unauthorized')) {
            diagnosis.recommendations.push('Unauthorized access - check Supabase API keys and permissions');
          }
        } else {
          diagnosis.upload_test = {
            success: true,
            file: uploadData
          };
          console.log('Upload successful, cleaning up...');
          
          // Clean up test file
          await supabase.storage
            .from('leases')
            .remove([testFileName]);
        }
      } catch (error) {
        diagnosis.upload_test = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown upload error'
        };
      }
    }

    // Step 4: Check RLS policies (if we can)
    console.log('Step 4: Checking RLS policies...');
    try {
      // Try to get bucket info which might reveal RLS status
      const { data: bucketInfo, error: bucketInfoError } = await supabase.storage.getBucket('leases');
      
      if (bucketInfoError) {
        diagnosis.rls_policies = {
          accessible: false,
          error: bucketInfoError.message
        };
      } else {
        diagnosis.rls_policies = {
          accessible: true,
          bucket_info: bucketInfo
        };
      }
    } catch (error) {
      diagnosis.rls_policies = {
        accessible: false,
        error: error instanceof Error ? error.message : 'Cannot check RLS policies'
      };
    }

    // Generate summary
    const allTestsPassed = diagnosis.bucket_listing?.success && 
                          diagnosis.leases_bucket?.found && 
                          diagnosis.upload_test?.success;

    console.log('Diagnosis complete. All tests passed:', allTestsPassed);

    return NextResponse.json({
      success: allTestsPassed,
      diagnosis: diagnosis,
      summary: {
        bucket_listing_works: diagnosis.bucket_listing?.success,
        leases_bucket_exists: diagnosis.leases_bucket?.found,
        uploads_work: diagnosis.upload_test?.success,
        rls_accessible: diagnosis.rls_policies?.accessible
      }
    });

  } catch (error) {
    console.error('Storage diagnosis error:', error);
    return NextResponse.json(
      { 
        error: 'Storage diagnosis failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 