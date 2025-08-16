import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // For testing purposes, use a default user ID if not authenticated
    let userId = user?.id;
    if (!userId) {
      console.log('No authenticated user found, using test user ID');
      userId = 'test-user-id'; // Temporary for testing
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyAddress = formData.get('propertyAddress') as string;
    const tenantName = formData.get('tenantName') as string;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${userId}/${timestamp}-${file.name}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('leases')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('leases')
      .getPublicUrl(fileName);

    // Create lease record in database
    const leaseData = {
      user_id: userId,
      tenant_name: tenantName || 'Not specified',
      property_address: propertyAddress || 'Not specified',
      file_url: publicUrl,
      file_name: file.name,
      file_size: file.size,
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
        // If database insert fails, delete the uploaded file
        await supabase.storage.from('leases').remove([fileName]);
        return NextResponse.json(
          { error: 'Failed to save lease record. Please run the database setup script.' },
          { status: 500 }
        );
      }
      leaseRecord = data;
    } catch (tableError) {
      console.error('Table not found error:', tableError);
      // If table doesn't exist, delete the uploaded file
      await supabase.storage.from('leases').remove([fileName]);
      return NextResponse.json(
        { error: 'Database table not found. Please run the MINIMAL_SETUP.sql script in Supabase SQL Editor.' },
        { status: 500 }
      );
    }

    // Return success response with lease data
    return NextResponse.json({
      success: true,
      lease: leaseRecord,
      fileUrl: publicUrl,
      message: 'Lease uploaded successfully'
    });

  } catch (error) {
    console.error('Upload lease error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 