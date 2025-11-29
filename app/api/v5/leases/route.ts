/**
 * STAYLL v5.0 - Leases API
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
      leases: [],
      count: 0,
      pagination: {
        limit: 50,
        offset: 0,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Get leases error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch leases'
      },
      { status: 500 }
    );
  }
}
