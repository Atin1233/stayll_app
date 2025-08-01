import { NextRequest, NextResponse } from 'next/server';
import { analyzeLeasePDF } from '@/lib/leaseAnalysis';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

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

    console.log('Testing PDF analysis for file:', file.name, 'Size:', file.size);
    
    // Test PDF analysis only
    const analysis = await analyzeLeasePDF(file);
    console.log('Test analysis result:', analysis);

    return NextResponse.json({
      success: true,
      analysis: analysis,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('PDF test error:', error);
    return NextResponse.json(
      { error: 'PDF test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 