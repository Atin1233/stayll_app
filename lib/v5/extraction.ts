/**
 * STAYLL v5.0 - Field Extraction Service
 * Two-stage extraction: LLM + Deterministic parser
 */

import { PDFExtractionService } from './pdfExtraction';
import { LeaseFieldsService } from './leaseFields';
import { ValidationEngine } from './validation';
import { AuditService } from './audit';
import type { LeaseField, SourceClauseLocation, ClauseSegment } from '@/types/v5.0';

export interface ExtractionResult {
  success: boolean;
  fields: LeaseField[];
  confidence: number;
  errors?: string[];
}

export class ExtractionService {
  /**
   * Extract fields from lease PDF
   */
  static async extractLeaseFields(
    leaseId: string,
    orgId: string,
    pdfBuffer: Buffer
  ): Promise<ExtractionResult> {
    try {
      // Step 1: Extract text from PDF
      const ocrResult = await PDFExtractionService.extractTextWithPages(pdfBuffer);
      ocrResult.lease_id = leaseId;

      // Step 2: Segment into clauses
      const clauses = PDFExtractionService.segmentClauses(ocrResult);

      // Step 3: Extract fields using two-stage approach
      const allText = ocrResult.pages.map(p => p.text).join('\n\n');
      
      // Stage 1: Deterministic parser (always runs first)
      const deterministicFields = this.extractWithDeterministicParser(allText, clauses, leaseId);
      
      // Stage 2: LLM extraction (if available, otherwise use enhanced deterministic)
      const llmFields = await this.extractWithLLM(allText, clauses, leaseId);
      
      // Merge results (LLM takes precedence, deterministic fills gaps)
      const mergedFields = this.mergeExtractionResults(deterministicFields, llmFields);

      // Step 4: Store fields in database
      const bulkResult = await LeaseFieldsService.bulkCreateFields(leaseId, mergedFields);

      // Step 5: Run validation on all fields
      const validationResults = await this.validateAllFields(leaseId, mergedFields);

      // Step 6: Log audit event
      await AuditService.logEvent({
        org_id: orgId,
        lease_id: leaseId,
        event_type: 'FIELD_EXTRACTED',
        payload: {
          fields_extracted: mergedFields.length,
          confidence_avg: this.calculateAverageConfidence(mergedFields),
          validation_results: validationResults
        }
      });

      return {
        success: true,
        fields: mergedFields.map((f, i) => ({
          ...f,
          id: `temp-${i}` // Will be replaced by actual DB IDs
        })) as LeaseField[],
        confidence: this.calculateAverageConfidence(mergedFields),
        errors: bulkResult.errors
      };
    } catch (error) {
      console.error('Extraction error:', error);
      return {
        success: false,
        fields: [],
        confidence: 0,
        errors: [error instanceof Error ? error.message : 'Unknown extraction error']
      };
    }
  }

  /**
   * Deterministic parser - regex and pattern matching
   */
  private static extractWithDeterministicParser(
    text: string,
    clauses: ClauseSegment[],
    leaseId: string
  ): Array<{
    field_name: string;
    value_text?: string;
    value_normalized?: LeaseField['value_normalized'];
    source_clause_location?: SourceClauseLocation;
    extraction_confidence?: number;
  }> {
    const fields: Array<{
      field_name: string;
      value_text?: string;
      value_normalized?: LeaseField['value_normalized'];
      source_clause_location?: SourceClauseLocation;
      extraction_confidence?: number;
    }> = [];

    // Extract base rent
    const rentMatch = text.match(/(?:base rent|monthly rent|rent amount)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/i);
    if (rentMatch) {
      const amount = parseFloat(rentMatch[1].replace(/,/g, ''));
      const clause = this.findClauseContaining(text, clauses, 'rent');
      fields.push({
        field_name: 'base_rent',
        value_text: `$${amount.toLocaleString()}`,
        value_normalized: { numeric: amount },
        source_clause_location: clause,
        extraction_confidence: 85
      });
    }

    // Extract lease start date
    const startDateMatch = text.match(/(?:lease start|commencement|beginning|effective)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
    if (startDateMatch) {
      const clause = this.findClauseContaining(text, clauses, 'start');
      fields.push({
        field_name: 'lease_start',
        value_text: startDateMatch[1],
        value_normalized: { date: this.parseDate(startDateMatch[1]) },
        source_clause_location: clause,
        extraction_confidence: 80
      });
    }

    // Extract lease end date
    const endDateMatch = text.match(/(?:lease end|expiration|termination)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
    if (endDateMatch) {
      const clause = this.findClauseContaining(text, clauses, 'end');
      fields.push({
        field_name: 'lease_end',
        value_text: endDateMatch[1],
        value_normalized: { date: this.parseDate(endDateMatch[1]) },
        source_clause_location: clause,
        extraction_confidence: 80
      });
    }

    // Extract tenant name
    const tenantMatch = text.match(/(?:tenant|lessee|resident)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i);
    if (tenantMatch) {
      const clause = this.findClauseContaining(text, clauses, 'tenant');
      fields.push({
        field_name: 'tenant_name',
        value_text: tenantMatch[1].trim(),
        source_clause_location: clause,
        extraction_confidence: 75
      });
    }

    // Extract property address
    const addressMatch = text.match(/(?:property|premises|address)[:\s]+([0-9]+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)[,\s]+[A-Za-z\s,]+(?:[A-Z]{2}\s*\d{5})?)/i);
    if (addressMatch) {
      const clause = this.findClauseContaining(text, clauses, 'property');
      fields.push({
        field_name: 'property_address',
        value_text: addressMatch[1].trim(),
        source_clause_location: clause,
        extraction_confidence: 70
      });
    }

    // Extract security deposit
    const depositMatch = text.match(/(?:security deposit|deposit)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/i);
    if (depositMatch) {
      const amount = parseFloat(depositMatch[1].replace(/,/g, ''));
      const clause = this.findClauseContaining(text, clauses, 'deposit');
      fields.push({
        field_name: 'security_deposit',
        value_text: `$${amount.toLocaleString()}`,
        value_normalized: { numeric: amount },
        source_clause_location: clause,
        extraction_confidence: 85
      });
    }

    // Extract late fee
    const lateFeeMatch = text.match(/(?:late fee|late payment|late charge)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/i);
    if (lateFeeMatch) {
      const amount = parseFloat(lateFeeMatch[1].replace(/,/g, ''));
      const clause = this.findClauseContaining(text, clauses, 'late');
      fields.push({
        field_name: 'late_fee',
        value_text: `$${amount.toLocaleString()}`,
        value_normalized: { numeric: amount },
        source_clause_location: clause,
        extraction_confidence: 80
      });
    }

    return fields;
  }

  /**
   * LLM extraction (mock for now - will integrate real LLM later)
   */
  private static async extractWithLLM(
    text: string,
    clauses: ClauseSegment[],
    leaseId: string
  ): Promise<Array<{
    field_name: string;
    value_text?: string;
    value_normalized?: LeaseField['value_normalized'];
    source_clause_location?: SourceClauseLocation;
    extraction_confidence?: number;
  }>> {
    // For now, return empty array - will integrate LLM later
    // This allows deterministic parser to work standalone
    return [];
  }

  /**
   * Merge deterministic and LLM results
   */
  private static mergeExtractionResults(
    deterministic: Array<any>,
    llm: Array<any>
  ): Array<any> {
    const merged = new Map<string, any>();

    // Add deterministic fields first
    deterministic.forEach(field => {
      merged.set(field.field_name, field);
    });

    // LLM fields override deterministic if they exist
    llm.forEach(field => {
      if (merged.has(field.field_name)) {
        // LLM has higher confidence, use it
        if ((field.extraction_confidence || 0) > (merged.get(field.field_name).extraction_confidence || 0)) {
          merged.set(field.field_name, field);
        }
      } else {
        // New field from LLM
        merged.set(field.field_name, field);
      }
    });

    return Array.from(merged.values());
  }

  /**
   * Find clause containing search term
   */
  private static findClauseContaining(
    text: string,
    clauses: ClauseSegment[],
    searchTerm: string
  ): SourceClauseLocation | undefined {
    const clause = clauses.find(c => 
      c.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (clause) {
      return {
        page: clause.page,
        bounding_box: clause.bounding_box,
        clause_id: clause.clause_id,
        clause_text: clause.text.substring(0, 200) // First 200 chars
      };
    }

    return undefined;
  }

  /**
   * Parse date string to ISO format
   */
  private static parseDate(dateString: string): string {
    try {
      // Try various date formats
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {
      // If parsing fails, return original
    }
    return dateString;
  }

  /**
   * Validate all extracted fields
   */
  private static async validateAllFields(
    leaseId: string,
    fields: Array<any>
  ): Promise<Record<string, any>> {
    const results: Record<string, any> = {};

    // Get lease to pass to validation
    const { supabase } = await import('@/lib/supabase');
    if (!supabase) return results;

    const { data: lease } = await supabase
      .from('leases')
      .select('*')
      .eq('id', leaseId)
      .single();

    for (const field of fields) {
      const fieldObj: LeaseField = {
        id: 'temp',
        lease_id: leaseId,
        field_name: field.field_name,
        value_text: field.value_text,
        value_normalized: field.value_normalized,
        source_clause_location: field.source_clause_location,
        extraction_confidence: field.extraction_confidence,
        validation_state: 'candidate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const validation = ValidationEngine.validateField(fieldObj, lease || undefined);
      results[field.field_name] = validation;
    }

    return results;
  }

  /**
   * Calculate average confidence
   */
  private static calculateAverageConfidence(fields: Array<any>): number {
    if (fields.length === 0) return 0;
    
    const total = fields.reduce((sum, f) => sum + (f.extraction_confidence || 0), 0);
    return Math.round(total / fields.length);
  }
}

