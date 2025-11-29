/**
 * STAYLL v5.0 - Lease Upload API
 * Upload lease PDF and save to database
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
    
    // Get user/org context
    let orgId = 'default-org';
    let userId = 'default-user';
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    }
    
    // Ensure default org exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', 'default-org')
      .single();
    
    if (!existingOrg) {
      await supabase
        .from('organizations')
        .insert({ id: 'default-org', name: 'Default Organization', billing_status: 'trial' });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const propertyAddress = formData.get('property_address') as string | null;
    const tenantName = formData.get('tenant_name') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileKey = `${orgId}/${timestamp}-${file.name}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('leases')
      .upload(fileKey, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('leases')
      .getPublicUrl(fileKey);

    // Create lease record in database
    const leaseData = {
      org_id: orgId,
      uploader_id: userId,
      tenant_name: tenantName || null,
      property_address: propertyAddress || null,
      file_url: publicUrl,
      file_key: fileKey,
      file_name: file.name,
      file_size: file.size,
      verification_status: 'unverified' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: leaseRecord, error: dbError } = await supabase
      .from('leases')
      .insert(leaseData)
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Try to delete uploaded file
      await supabase.storage.from('leases').remove([fileKey]);
      
      // Check if it's a table not found error
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Database tables not set up. Please run the database setup script in Supabase.'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to save lease record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lease: leaseRecord,
      fileUrl: publicUrl,
      message: 'Lease uploaded successfully'
    });

  } catch (error) {
    console.error('Upload lease error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      },
      { status: 500 }
    );
  }
}
