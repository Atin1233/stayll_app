import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyAddress = formData.get('propertyAddress') as string;
    const tenantName = formData.get('tenantName') as string;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    // For testing, just return success without storing
    const testLease = {
      id: `test-${Date.now()}`,
      user_id: 'test-user-id',
      tenant_name: tenantName || 'Not specified',
      property_address: propertyAddress || 'Not specified',
      file_url: 'https://example.com/test-file.pdf',
      file_name: file.name,
      file_size: file.size,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Test upload successful:', {
      fileName: file.name,
      fileSize: file.size,
      propertyAddress,
      tenantName
    });

    return NextResponse.json({
      success: true,
      lease: testLease,
      message: 'Test upload successful (no storage configured)'
    });

  } catch (error) {
    console.error('Test upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 