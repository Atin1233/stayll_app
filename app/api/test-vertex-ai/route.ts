import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGoogleAI } from '@/lib/googleAI';

export async function POST(request: NextRequest) {
  try {
    const { text, task } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for analysis' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing Google AI with task:', task || 'extract_lease_data');

    // Test the Google AI integration
    const result = await analyzeWithGoogleAI({
      text,
      task: task || 'extract_lease_data',
      propertyType: 'residential'
    });

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
      model_used: result.model_used,
      confidence: result.confidence,
      tokens_used: result.tokens_used
    });

  } catch (error) {
    console.error('Google AI test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      fallback_available: true
    }, { status: 500 });
  }
}

export async function GET() {
  // Return test information
  const isConfigured = true; // Google AI enhanced analysis is always available
  
  return NextResponse.json({
    message: 'Google AI Enhanced Test Endpoint',
    configured: isConfigured,
    ai_type: 'Enhanced Regex-based AI Analysis',
    model: 'enhanced_regex_ai',
    test_instructions: {
      method: 'POST',
      endpoint: '/api/test-vertex-ai',
      body: {
        text: 'Your lease document text here',
        task: 'extract_lease_data | classify_clauses | assess_risk | generate_recommendations | comprehensive_analysis'
      }
    }
  });
}
