/**
 * STAYLL v5.0 - Lease Upload API
 * Multi-tenant upload with job queue structure
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AuditService } from '@/lib/v5/audit';
import { OrganizationService } from '@/lib/v5/organization';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get organization
    const orgResult = await OrganizationService.getCurrentOrganization();
    if (!orgResult.success || !orgResult.organization) {
      return NextResponse.json(
        { error: 'Organization not found. Please set up your organization first.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyAddress = formData.get('property_address') as string;
    const tenantName = formData.get('tenant_name') as string;
    const portfolioTag = formData.get('portfolio_tag') as string;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileKey = `${orgResult.organization.id}/${timestamp}-${file.name}`;

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
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('leases')
      .getPublicUrl(fileKey);

    // Create lease record in database
    const leaseData = {
      org_id: orgResult.organization.id,
      uploader_id: user.id,
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
        // If database insert fails, delete the uploaded file
        await supabase.storage.from('leases').remove([fileKey]);
        return NextResponse.json(
          { error: 'Failed to save lease record. Please ensure the database schema is set up.' },
          { status: 500 }
        );
      }
      leaseRecord = data;
    } catch (tableError) {
      console.error('Table not found error:', tableError);
      // If table doesn't exist, delete the uploaded file
      await supabase.storage.from('leases').remove([fileKey]);
      return NextResponse.json(
        { error: 'Database table not found. Please run the STAYLL_V5_DATABASE_SCHEMA.sql script in Supabase SQL Editor.' },
        { status: 500 }
      );
    }

    // Log audit event
    await AuditService.logEvent({
      org_id: orgResult.organization.id,
      lease_id: leaseRecord.id,
      user_id: user.id,
      event_type: 'UPLOAD',
      payload: {
        file_name: file.name,
        file_size: file.size,
        property_address: propertyAddress,
        tenant_name: tenantName
      }
    });

    // TODO: Create ingest job in queue
    // For now, we'll return a mock job_id
    // In production, this would enqueue a job to process the lease
    const jobId = `job-${leaseRecord.id}-${Date.now()}`;

    // In a real implementation, you would:
    // 1. Create an ingest_job record or enqueue to SQS/Redis
    // 2. Trigger OCR worker
    // 3. Return job_id for tracking

    return NextResponse.json({
      success: true,
      lease: leaseRecord,
      job_id: jobId,
      fileUrl: publicUrl,
      message: 'Lease uploaded successfully. Processing will begin shortly.'
    });

  } catch (error) {
    console.error('Upload lease error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

