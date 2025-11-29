/**
 * STAYLL v5.0 - Portfolio Analytics API
 * Rent roll and exposure calculations
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PortfolioAnalyticsService } from '@/lib/v5/portfolioAnalytics';
import { OrganizationService } from '@/lib/v5/organization';

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

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('org_id');
    const year = searchParams.get('year') 
      ? parseInt(searchParams.get('year')!) 
      : undefined;
    const format = searchParams.get('format') || 'json'; // json, csv

    // Get organization
    let targetOrgId = orgId;
    if (!targetOrgId) {
      const orgResult = await OrganizationService.getCurrentOrganization();
      if (orgResult.success && orgResult.organization) {
        targetOrgId = orgResult.organization.id;
      }
    }

    if (!targetOrgId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 400 }
      );
    }

    const result = await PortfolioAnalyticsService.generateRentRoll(targetOrgId, year);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    if (format === 'csv' && result.rentRoll) {
      const csvContent = PortfolioAnalyticsService.exportRentRollToCSV(result.rentRoll);
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="rent-roll-${result.rentRoll.year}.csv"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      rentRoll: result.rentRoll
    });
  } catch (error) {
    console.error('Rent roll error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

