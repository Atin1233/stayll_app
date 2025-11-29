/**
 * STAYLL v5.0 - QA API Endpoints
 * Human-in-the-loop quality assurance
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { QAService } from '@/lib/v5/qaService';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('org_id');
    const minConfidence = searchParams.get('min_confidence') 
      ? parseInt(searchParams.get('min_confidence')!) 
      : undefined;
    const validationStates = searchParams.get('validation_states')
      ? searchParams.get('validation_states')!.split(',') as any[]
      : undefined;
    const financialThreshold = searchParams.get('financial_threshold')
      ? parseFloat(searchParams.get('financial_threshold')!)
      : undefined;

    const result = await QAService.getQAQueue({
      org_id: orgId || undefined,
      min_confidence: minConfidence,
      validation_states: validationStates,
      financial_value_threshold: financialThreshold
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tasks: result.tasks,
      count: result.tasks?.length || 0
    });
  } catch (error) {
    console.error('QA GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, field_id, lease_id, updates, notes } = body;

    if (action === 'approve_field') {
      if (!field_id) {
        return NextResponse.json(
          { error: 'field_id is required' },
          { status: 400 }
        );
      }

      const result = await QAService.approveField(field_id, user.id, notes);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'edit_field') {
      if (!field_id || !updates) {
        return NextResponse.json(
          { error: 'field_id and updates are required' },
          { status: 400 }
        );
      }

      const result = await QAService.editField(field_id, user.id, updates);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        field: result.field
      });
    }

    if (action === 'approve_lease') {
      if (!lease_id) {
        return NextResponse.json(
          { error: 'lease_id is required' },
          { status: 400 }
        );
      }

      const result = await QAService.approveLease(lease_id, user.id, notes);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('QA POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

