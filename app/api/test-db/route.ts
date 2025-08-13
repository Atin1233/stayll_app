import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database and storage connections...');

    // Test database connection
    console.log('Testing database connection...');
    const { data: dbData, error: dbError } = await supabase
      .from('leases')
      .select('count')
      .limit(1);

    if (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ 
        success: false,
        error: 'Database connection failed',
        details: dbError.message 
      }, { status: 500 });
    }

    console.log('Database connection successful');

    // Test storage connection
    console.log('Testing storage connection...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

    if (storageError) {
      console.error('Storage connection failed:', storageError);
      return NextResponse.json({ 
        success: false,
        error: 'Storage connection failed',
        details: storageError.message 
      }, { status: 500 });
    }

    console.log('Storage connection successful');

    const leasesBucket = buckets?.find(bucket => bucket.name === 'leases');
    const bucketExists = !!leasesBucket;

    // Test table structure
    console.log('Testing table structure...');
    const { data: tableData, error: tableError } = await supabase
      .from('leases')
      .select('id, user_id, tenant_name, property_address, monthly_rent, confidence_score, analysis_data, portfolio_impact, compliance_assessment, strategic_recommendations, created_at')
      .limit(1);

    if (tableError) {
      console.error('Table structure test failed:', tableError);
      return NextResponse.json({ 
        success: false,
        error: 'Table structure test failed',
        details: tableError.message 
      }, { status: 500 });
    }

    console.log('Table structure test successful');

    return NextResponse.json({ 
      success: true, 
      message: 'Database and storage connections successful',
      database: {
        connected: true,
        table_exists: true,
        columns_available: tableData !== null
      },
      storage: {
        connected: true,
        buckets_available: buckets?.map(b => b.name) || [],
        leases_bucket_exists: bucketExists,
        leases_bucket_name: leasesBucket?.name || null
      },
      environment: {
        supabase_url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_key_configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        site_url_configured: !!process.env.NEXT_PUBLIC_SITE_URL
      }
    });

  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 