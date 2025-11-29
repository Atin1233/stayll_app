/**
 * STAYLL v5.0 - QA Tasks API
 * Simplified version - fix root issues first
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Return empty result for now - we'll add DB back
    return NextResponse.json({
      success: true,
      tasks: [],
      count: 0,
      meta: {
        limit: 50,
        offset: 0,
        org_id: 'default-org',
        user_id: 'default-user'
      }
    });
  } catch (error) {
    console.error('QA tasks error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch QA tasks'
      },
      { status: 500 }
    );
  }
}
