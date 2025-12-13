/**
 * STAYLL v5.0 - Escalation Projection API
 * 5-year cashflow projections with various escalation types
 */

import { NextRequest, NextResponse } from 'next/server';
import { EscalationEngine } from '@/lib/v5/escalationEngine';
import type { ProjectionParams } from '@/lib/v5/escalationEngine';

/**
 * Generate escalation projection
 * POST /api/v5/analytics/escalation-projection
 */
export async function POST(request: NextRequest) {
  try {
    const params: ProjectionParams = await request.json();

    // Validate required fields
    if (!params.current_rent || !params.start_year || !params.escalation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: current_rent, start_year, escalation',
        },
        { status: 400 }
      );
    }

    console.log('[Escalation API] Generating projection:', params);

    // Generate projection
    const projections = EscalationEngine.projectEscalation(params);

    // Calculate NPV with default discount rate
    const npv = EscalationEngine.calculateNPV(projections, 0.05);

    // Calculate effective rate
    const firstYear = projections[0];
    const lastYear = projections[projections.length - 1];
    const effectiveRate = EscalationEngine.calculateEffectiveRate(
      firstYear.annual_rent,
      lastYear.annual_rent,
      projections.length
    );

    // Generate chart data
    const chartData = EscalationEngine.generateChartData(projections);

    return NextResponse.json({
      success: true,
      projections,
      summary: {
        total_years: projections.length,
        starting_rent: firstYear.annual_rent,
        ending_rent: lastYear.annual_rent,
        total_rent: lastYear.cumulative_rent,
        average_annual: lastYear.cumulative_rent / projections.length,
        effective_rate: effectiveRate,
        npv_5_percent: npv,
      },
      chart_data: chartData,
    });
  } catch (error) {
    console.error('[Escalation API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate projection',
      },
      { status: 500 }
    );
  }
}

/**
 * Compare multiple escalation scenarios
 * POST /api/v5/analytics/escalation-projection/compare
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { base_rent, start_year, scenarios } = body;

    if (!base_rent || !start_year || !scenarios || !Array.isArray(scenarios)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: base_rent, start_year, and scenarios array required',
        },
        { status: 400 }
      );
    }

    console.log('[Escalation Compare] Comparing', scenarios.length, 'scenarios');

    const comparison = EscalationEngine.compareScenarios(
      base_rent,
      start_year,
      scenarios
    );

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error) {
    console.error('[Escalation Compare] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compare scenarios',
      },
      { status: 500 }
    );
  }
}

/**
 * Parse escalation clause from text
 * POST /api/v5/analytics/escalation-projection/parse
 */
export async function PATCH(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'text field required' },
        { status: 400 }
      );
    }

    const escalation = EscalationEngine.parseEscalationClause(text);

    return NextResponse.json({
      success: true,
      escalation,
      original_text: text,
    });
  } catch (error) {
    console.error('[Escalation Parse] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse escalation clause',
      },
      { status: 500 }
    );
  }
}

/**
 * Export projection as CSV
 * GET /api/v5/analytics/escalation-projection?lease_id=xxx&format=csv
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const leaseId = searchParams.get('lease_id');

    if (format === 'csv' && leaseId) {
      // TODO: Fetch lease data and generate projection
      const csv = 'Year,Annual Rent,Escalation Rate,Escalation Amount,Cumulative Rent\n';
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="escalation-projection-${leaseId}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Use POST to generate escalation projection',
    });
  } catch (error) {
    console.error('[Escalation GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export projection' },
      { status: 500 }
    );
  }
}
