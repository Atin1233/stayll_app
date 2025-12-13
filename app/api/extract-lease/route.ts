import { NextRequest, NextResponse } from 'next/server';
import { EXTRACTION_PATTERNS, validateExtractedValue } from '@/lib/v5/extractionPatterns';
import { ConfidenceScorer } from '@/lib/v5/confidenceScoring';
import type { SourceClauseLocation } from '@/types/v5.0';

export async function POST(request: NextRequest) {
  try {
    console.log('[Extract] Starting extraction...');
    const formData = await request.formData();
    const fileData = formData.get('fileData') as string;

    if (!fileData) {
      console.log('[Extract] No file data provided');
      return NextResponse.json(
        { success: false, error: 'No file data provided' },
        { status: 400 }
      );
    }

    console.log('[Extract] File data received, length:', fileData.length);

    // Convert base64 back to buffer
    const base64Data = fileData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    console.log('[Extract] Buffer created, size:', buffer.length, 'bytes');

    // Extract text from PDF
    let pdfText = '';
    try {
      console.log('[Extract] Loading pdf-parse module (v2)...');
      // pdf-parse v2 uses class-based API
      const { PDFParse } = require('pdf-parse');
      console.log('[Extract] Creating PDF parser instance...');
      const parser = new PDFParse({ data: buffer });
      console.log('[Extract] Extracting text...');
      const result = await parser.getText();
      pdfText = result.text;
      console.log('[Extract] ✓ Extracted text length:', pdfText.length);
      console.log('[Extract] First 200 chars:', pdfText.substring(0, 200));
    } catch (pdfError) {
      console.error('[Extract] PDF parse error:', pdfError);
      return NextResponse.json({
        success: false,
        error: 'Failed to parse PDF',
        details: pdfError instanceof Error ? pdfError.message : String(pdfError),
        extracted: {},
      });
    }

    // Extract all 20+ fields using enhanced patterns
    const extractedFields: any = {};
    const fieldDetails: any = {};
    let totalFieldsAttempted = 0;
    let fieldsFound = 0;

    console.log('[Extract] Starting enhanced extraction with', EXTRACTION_PATTERNS.length, 'field patterns');

    // Process each field pattern
    for (const patternDef of EXTRACTION_PATTERNS) {
      const fieldName = patternDef.field_name;
      totalFieldsAttempted++;
      
      let bestMatch: { value: string; matchIndex: number; contextWindow: string } | null = null;
      let patternsMatched = 0;

      // Try each pattern for this field
      for (const pattern of patternDef.patterns) {
        const match = pdfText.match(pattern);
        if (match && match[1]) {
          patternsMatched++;
          const matchIndex = match.index || 0;
          const value = match[1].trim();
          
          // Keep the best match (first one found, or we could prioritize)
          if (!bestMatch) {
            const contextStart = Math.max(0, matchIndex - 100);
            const contextEnd = Math.min(pdfText.length, matchIndex + 200);
            const contextWindow = pdfText.substring(contextStart, contextEnd);
            
            bestMatch = { value, matchIndex, contextWindow };
          }
        }
      }

      // If we found a match, validate and store it
      if (bestMatch) {
        const { value, matchIndex, contextWindow } = bestMatch;
        
        // Validate the extracted value
        const validation = validateExtractedValue(fieldName, value);
        
        // Calculate confidence score for this field
        const confidenceResult = ConfidenceScorer.calculateConfidence({
          field_name: fieldName,
          value_text: value,
          extraction_method: 'regex',
          pattern_matches: patternsMatched,
          patterns_total: patternDef.patterns.length,
          context_window: contextWindow,
          format_valid: validation.valid,
          multiple_sources_agree: patternsMatched > 1,
        });

        // Store the field
        extractedFields[fieldName] = validation.normalized || value;
        fieldsFound++;

        // Store field details
        fieldDetails[fieldName] = {
          value_text: value,
          value_normalized: validation.normalized,
          confidence_score: confidenceResult.score,
          confidence_explanation: ConfidenceScorer.explainConfidence(confidenceResult),
          reason_codes: confidenceResult.reason_codes,
          needs_qa: ConfidenceScorer.needsQA(confidenceResult.score, fieldName),
          source_location: {
            text_snippet: contextWindow.substring(0, 200),
            // Page number would need PDF parsing with page detection
            // For now, estimate based on position in text
            page: Math.floor(matchIndex / 2000) + 1,
          },
          priority: patternDef.priority,
          field_type: patternDef.field_type,
        };

        console.log(`[Extract] ✓ ${fieldName}: "${value}" (confidence: ${confidenceResult.score}%)`);
      } else {
        console.log(`[Extract] ✗ ${fieldName}: not found`);
        
        // Store as missing field
        fieldDetails[fieldName] = {
          value_text: null,
          confidence_score: 0,
          confidence_explanation: 'Field not found in document',
          reason_codes: ['FIELD_NOT_FOUND'],
          needs_qa: true,
          priority: patternDef.priority,
          field_type: patternDef.field_type,
        };
      }
    }

    // Calculate overall confidence
    const overallConfidence = fieldsFound > 0
      ? Math.round((fieldsFound / totalFieldsAttempted) * 100)
      : 0;

    // Count critical fields found
    const criticalFields = EXTRACTION_PATTERNS.filter(p => p.priority === 'critical');
    const criticalFieldsFound = criticalFields.filter(p => extractedFields[p.field_name]).length;

    console.log('[Extract] Extraction complete:', {
      fieldsFound,
      totalFieldsAttempted,
      overallConfidence,
      criticalFieldsFound: `${criticalFieldsFound}/${criticalFields.length}`,
    });

    return NextResponse.json({
      success: true,
      extracted: extractedFields,
      field_details: fieldDetails,
      summary: {
        fields_found: fieldsFound,
        fields_attempted: totalFieldsAttempted,
        overall_confidence: overallConfidence,
        critical_fields_found: criticalFieldsFound,
        critical_fields_total: criticalFields.length,
        needs_qa: Object.values(fieldDetails).filter((f: any) => f.needs_qa).length,
      },
      textLength: pdfText.length,
      message: `Extracted ${fieldsFound} of ${totalFieldsAttempted} fields (${criticalFieldsFound}/${criticalFields.length} critical)`,
    });

  } catch (error) {
    console.error('[Extract] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Extraction failed',
      },
      { status: 500 }
    );
  }
}
