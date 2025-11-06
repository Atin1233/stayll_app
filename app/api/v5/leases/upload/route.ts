/**
 * STAYLL v5.0 - Lease Upload API
 * Multi-tenant upload with job queue structure
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AuditService } from '@/lib/v5/audit';
import { OrganizationService } from '@/lib/v5/organization';
import { ExtractionService } from '@/lib/v5/extraction';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // For MVP without auth, use a default organization
    // In production, this would require authentication
    let orgId = 'default-org';
    let userId = 'default-user';
    
    // Try to get user if authenticated, but don't require it
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      const orgResult = await OrganizationService.getCurrentOrganization();
      if (orgResult.success && orgResult.organization) {
        orgId = orgResult.organization.id;
      }
    }
    
    // Create default org if it doesn't exist (for MVP)
    if (orgId === 'default-org') {
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', 'default-org')
        .single();
      
      if (!existingOrg) {
        const { data: newOrg } = await supabase
          .from('organizations')
          .insert({ id: 'default-org', name: 'Default Organization', billing_status: 'trial' })
          .select()
          .single();
        if (newOrg) orgId = newOrg.id;
      }
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
      org_id: orgId,
      lease_id: leaseRecord.id,
      user_id: userId,
      event_type: 'UPLOAD',
      payload: {
        file_name: file.name,
        file_size: file.size,
        property_address: propertyAddress,
        tenant_name: tenantName
      }
    });

    // Automatically trigger extraction (using free PDF parsing)
    let extractionResult = null;
    try {
      // Convert file to buffer for extraction
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Trigger extraction
      extractionResult = await ExtractionService.extractLeaseFields(
        leaseRecord.id,
        orgId,
        buffer
      );

      // Update lease with extraction results
      if (extractionResult.success) {
        await supabase
          .from('leases')
          .update({
            confidence_score: extractionResult.confidence,
            verification_status: extractionResult.fields.some(f => 
              f.validation_state === 'flagged' || f.validation_state === 'rule_fail'
            ) ? 'in_review' : 'unverified',
            updated_at: new Date().toISOString()
          })
          .eq('id', leaseRecord.id);
      }
    } catch (extractionError) {
      console.error('Auto-extraction error (non-fatal):', extractionError);
      // Don't fail the upload if extraction fails
      // User can manually trigger extraction later
    }

    return NextResponse.json({
      success: true,
      lease: leaseRecord,
      extraction: extractionResult ? {
        success: extractionResult.success,
        fields_extracted: extractionResult.fields.length,
        confidence: extractionResult.confidence
      } : null,
      fileUrl: publicUrl,
      message: extractionResult?.success 
        ? 'Lease uploaded and analyzed successfully.'
        : 'Lease uploaded successfully. Extraction may be available shortly.'
    });

  } catch (error) {
    console.error('Upload lease error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

