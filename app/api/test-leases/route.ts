import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return mock lease data for testing
    const mockLeases = [
      {
        id: 'test-lease-1',
        user_id: 'test-user-id',
        tenant_name: 'John Doe',
        property_address: '123 Main St, City, State',
        monthly_rent: '$1,500',
        lease_start: '2024-01-01',
        lease_end: '2024-12-31',
        due_date: '1st of each month',
        late_fee: '$50',
        security_deposit: '$1,500',
        utilities: 'Included',
        parking: '1 space included',
        pets: 'No pets allowed',
        smoking: 'No smoking',
        file_url: 'https://example.com/lease1.pdf',
        file_name: 'lease1.pdf',
        file_size: 1024000,
        confidence_score: 85,
        analysis_data: null,
        portfolio_impact: null,
        compliance_assessment: null,
        strategic_recommendations: null,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 'test-lease-2',
        user_id: 'test-user-id',
        tenant_name: 'Jane Smith',
        property_address: '456 Oak Ave, City, State',
        monthly_rent: '$2,000',
        lease_start: '2024-02-01',
        lease_end: '2025-01-31',
        due_date: '1st of each month',
        late_fee: '$75',
        security_deposit: '$2,000',
        utilities: 'Tenant pays',
        parking: '2 spaces included',
        pets: 'Small pets allowed',
        smoking: 'No smoking',
        file_url: 'https://example.com/lease2.pdf',
        file_name: 'lease2.pdf',
        file_size: 2048000,
        confidence_score: 92,
        analysis_data: null,
        portfolio_impact: null,
        compliance_assessment: null,
        strategic_recommendations: null,
        created_at: '2024-02-01T14:20:00Z',
        updated_at: '2024-02-01T14:20:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      leases: mockLeases,
      count: mockLeases.length,
      pagination: {
        limit: 50,
        offset: 0,
        hasMore: false
      }
    });

  } catch (error) {
    console.error('Test leases error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 