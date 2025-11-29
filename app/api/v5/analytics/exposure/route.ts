/**
 * STAYLL v5.0 - Portfolio Exposure API
 * Calculate total exposure and future obligations
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

    const result = await PortfolioAnalyticsService.calculateExposure(targetOrgId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      exposure: result.exposure
    });
  } catch (error) {
    console.error('Exposure calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

