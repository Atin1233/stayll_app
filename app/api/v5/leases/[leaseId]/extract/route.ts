/**
 * STAYLL v5.0 - Extract Fields from Lease
 * Triggers extraction pipeline for an uploaded lease
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ExtractionService } from '@/lib/v5/extraction';
import { OrganizationService } from '@/lib/v5/organization';
import { AuditService } from '@/lib/v5/audit';

export async function POST(
  request: NextRequest,
  { params }: { params: { leaseId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const orgResult = await OrganizationService.getCurrentOrganization();
    if (!orgResult.success || !orgResult.organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 403 }
      );
    }

    const leaseId = params.leaseId;

    // Get lease to verify ownership and get file
    const { data: lease, error: leaseError } = await supabase
      .from('leases')
      .select('file_key, org_id, verification_status')
      .eq('id', leaseId)
      .eq('org_id', orgResult.organization.id)
      .single();

    if (leaseError || !lease) {
      return NextResponse.json(
        { error: 'Lease not found' },
        { status: 404 }
      );
    }

    // Download file from storage
    if (!lease.file_key) {
      return NextResponse.json(
        { error: 'File not found for this lease' },
        { status: 404 }
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('leases')
      .download(lease.file_key);

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: 'Failed to download file' },
        { status: 500 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Update lease status
    await supabase
      .from('leases')
      .update({ 
        verification_status: 'in_review',
        updated_at: new Date().toISOString()
      })
      .eq('id', leaseId);

    // Log audit event
    await AuditService.logEvent({
      org_id: orgResult.organization.id,
      lease_id: leaseId,
      user_id: user.id,
      event_type: 'FIELD_EXTRACTED',
      payload: { action: 'extraction_started' }
    });

    // Extract fields
    const extractionResult = await ExtractionService.extractLeaseFields(
      leaseId,
      orgResult.organization.id,
      buffer
    );

    if (!extractionResult.success) {
      // Update lease status to indicate extraction failed
      await supabase
        .from('leases')
        .update({ 
          verification_status: 'unverified',
          updated_at: new Date().toISOString()
        })
        .eq('id', leaseId);

      return NextResponse.json(
        { 
          error: 'Extraction failed',
          details: extractionResult.errors
        },
        { status: 500 }
      );
    }

    // Calculate overall confidence and update lease
    const avgConfidence = extractionResult.confidence;
    await supabase
      .from('leases')
      .update({ 
        confidence_score: avgConfidence,
        updated_at: new Date().toISOString()
      })
      .eq('id', leaseId);

    return NextResponse.json({
      success: true,
      message: 'Extraction completed',
      fields_extracted: extractionResult.fields.length,
      confidence: avgConfidence,
      fields: extractionResult.fields
    });

  } catch (error) {
    console.error('Extraction error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

