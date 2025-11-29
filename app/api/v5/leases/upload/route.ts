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
    // Create Supabase client
    let supabase;
    try {
      supabase = createRouteHandlerClient({ cookies });
    } catch (supabaseError) {
      console.error('Failed to create Supabase client:', supabaseError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to initialize database connection',
          details: process.env.NODE_ENV === 'development' ? String(supabaseError) : undefined
        },
        { status: 500 }
      );
    }
    
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase client not configured' },
        { status: 500 }
      );
    }
    
    // Get user/org context
    let orgId = 'default-org';
    let userId = 'default-user';
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch (authError) {
      console.error('Auth check error (non-fatal):', authError);
      // Continue with default user
    }
    
    // Ensure default org exists (don't fail if table doesn't exist)
    try {
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', 'default-org')
        .single();
      
      if (!existingOrg) {
        const { error: insertError } = await supabase
          .from('organizations')
          .insert({ id: 'default-org', name: 'Default Organization', billing_status: 'trial' });
        
        if (insertError && !insertError.message?.includes('does not exist')) {
          console.error('Failed to create default org:', insertError);
        }
      }
    } catch (orgError) {
      console.error('Org check error (non-fatal):', orgError);
      // Continue - org might not exist yet
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
    let publicUrl: string;
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('leases')
        .upload(fileKey, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Check if bucket doesn't exist
        if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('does not exist')) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Storage bucket not configured. Please create a "leases" bucket in Supabase Storage.'
            },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to upload file to storage',
            details: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
          },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('leases')
        .getPublicUrl(fileKey);
      
      publicUrl = urlData.publicUrl;
    } catch (storageError) {
      console.error('Storage error:', storageError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Storage service error',
          details: process.env.NODE_ENV === 'development' ? String(storageError) : undefined
        },
        { status: 500 }
      );
    }

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

    let leaseRecord;
    try {
      const { data, error: dbError } = await supabase
        .from('leases')
        .insert(leaseData)
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Try to delete uploaded file
        try {
          await supabase.storage.from('leases').remove([fileKey]);
        } catch (deleteError) {
          console.error('Failed to delete uploaded file:', deleteError);
        }
        
        // Check if it's a table not found error
        if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Database tables not set up. Please run the database setup script in Supabase SQL Editor.',
              details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
            },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to save lease record',
            details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
          },
          { status: 500 }
        );
      }
      
      leaseRecord = data;
    } catch (dbException) {
      console.error('Database exception:', dbException);
      // Try to delete uploaded file
      try {
        await supabase.storage.from('leases').remove([fileKey]);
      } catch (deleteError) {
        console.error('Failed to delete uploaded file:', deleteError);
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Database error occurred',
          details: process.env.NODE_ENV === 'development' ? String(dbException) : undefined
        },
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
