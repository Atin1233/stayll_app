import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envStatus = {
      supabase_url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_key_configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      site_url_configured: !!process.env.NEXT_PUBLIC_SITE_URL,
      node_env: process.env.NODE_ENV,
      supabase_url_value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
      supabase_key_value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
      site_url_value: process.env.NEXT_PUBLIC_SITE_URL || 'Not Set'
    };

    // Try to create Supabase client
    let supabaseClient = null;
    let supabaseError = null;
    
    try {
      supabaseClient = createRouteHandlerClient({ cookies });
      console.log('Supabase client created successfully');
    } catch (error) {
      supabaseError = error;
      console.error('Failed to create Supabase client:', error);
    }

    // Test database connection if client was created
    let dbTest = null;
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('leases')
          .select('count')
          .limit(1);
        
        if (error) {
          dbTest = { success: false, error: error.message };
        } else {
          dbTest = { success: true, message: 'Database connection successful' };
        }
      } catch (error) {
        dbTest = { success: false, error: error.message };
      }
    }

    // Test storage connection
    let storageTest = null;
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.storage.listBuckets();
        if (error) {
          storageTest = { success: false, error: error.message };
        } else {
          const leasesBucket = data.find(bucket => bucket.name === 'leases');
          storageTest = { 
            success: true, 
            buckets: data.map(b => b.name),
            leases_bucket_exists: !!leasesBucket
          };
        }
      } catch (error) {
        storageTest = { success: false, error: error.message };
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envStatus,
      supabase_client: supabaseClient ? 'Created' : 'Failed',
      supabase_error: supabaseError,
      database_test: dbTest,
      storage_test: storageTest,
      recommendations: [
        'Check if environment variables are set correctly in Vercel',
        'Verify Supabase project is active and accessible',
        'Run MINIMAL_SETUP.sql in Supabase SQL Editor if database test fails',
        'Create storage bucket named "leases" if storage test fails'
      ]
    });

  } catch (error) {
    console.error('Test DB error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 