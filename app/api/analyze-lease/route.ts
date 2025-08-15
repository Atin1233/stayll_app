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

    const { leaseId, analysisData } = await request.json();

    if (!leaseId || !analysisData) {
      return NextResponse.json(
        { error: 'Lease ID and analysis data are required' },
        { status: 400 }
      );
    }

    // Verify the lease belongs to the user
    const { data: lease, error: leaseError } = await supabase
      .from('leases')
      .select('*')
      .eq('id', leaseId)
      .eq('user_id', userId)
      .single();

    if (leaseError || !lease) {
      return NextResponse.json(
        { error: 'Lease not found' },
        { status: 404 }
      );
    }

    // Update the lease with analysis data
    const updateData = {
      analysis_data: analysisData,
      confidence_score: analysisData.confidence || 0,
      updated_at: new Date().toISOString()
    };

    // Add extracted fields if they exist in analysis
    if (analysisData.extractedFields) {
      const fields = analysisData.extractedFields;
      Object.assign(updateData, {
        monthly_rent: fields.monthlyRent || lease.monthly_rent,
        lease_start: fields.leaseStart || lease.lease_start,
        lease_end: fields.leaseEnd || lease.lease_end,
        due_date: fields.dueDate || lease.due_date,
        late_fee: fields.lateFee || lease.late_fee,
        security_deposit: fields.securityDeposit || lease.security_deposit,
        utilities: fields.utilities || lease.utilities,
        parking: fields.parking || lease.parking,
        pets: fields.pets || lease.pets,
        smoking: fields.smoking || lease.smoking
      });
    }

    const { data: updatedLease, error: updateError } = await supabase
      .from('leases')
      .update(updateData)
      .eq('id', leaseId)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to save analysis results' },
        { status: 500 }
      );
    }

    // Create analysis record for history
    const analysisRecord = {
      lease_id: leaseId,
      user_id: userId,
      analysis_type: 'STAYLL',
      analysis_data: analysisData,
      confidence_score: analysisData.confidence || 0,
      processing_time_ms: analysisData.processingTime || 0,
      created_at: new Date().toISOString()
    };

    const { error: analysisError } = await supabase
      .from('lease_analyses')
      .insert(analysisRecord);

    if (analysisError) {
      console.error('Analysis history insert error:', analysisError);
      // Don't fail the request if history insert fails
    }

    return NextResponse.json({
      success: true,
      lease: updatedLease,
      analysis: analysisData,
      message: 'Lease analysis completed and saved'
    });

  } catch (error) {
    console.error('Analyze lease error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 