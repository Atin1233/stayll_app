import { NextRequest, NextResponse } from 'next/server';
import { analyzeLeaseWithSTAYLL } from '@/lib/stayllAI';
import { extractTextFromPDF } from '@/lib/leaseAnalysis';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyType = (formData.get('propertyType') as 'residential' | 'commercial') || 'residential';

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

    console.log('🤖 STAYLL AI: Starting analysis for file:', file.name, 'Property type:', propertyType);
    
    // Extract text from PDF
    const text = await extractTextFromPDF(file);
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from PDF' },
        { status: 400 }
      );
    }

    // Perform STAYLL AI analysis
    const stayllAnalysis = await analyzeLeaseWithSTAYLL(text, propertyType);
    
    console.log('🤖 STAYLL AI: Analysis completed successfully');
    console.log('Risk Level:', stayllAnalysis.risk_analysis.risk_level);
    console.log('Confidence Score:', stayllAnalysis.confidence_score);

    return NextResponse.json({
      success: true,
      analysis: stayllAnalysis,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        propertyType: propertyType
      }
    });

  } catch (error) {
    console.error('STAYLL AI analysis error:', error);
    return NextResponse.json(
      { 
        error: 'STAYLL AI analysis failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 