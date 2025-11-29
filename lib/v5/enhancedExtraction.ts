/**
 * STAYLL v5.0 - Enhanced Extraction Service
 * Complete extraction pipeline: OCR → Chunking → LLM → Post-Processing → Validation
 */

import { PDFExtractionService } from './pdfExtraction';
import { ClauseChunkingService } from './clauseChunking';
import { LLMExtractionService } from './llmExtraction';
import { PostProcessingService } from './postProcessing';
import { FinancialReconciliationService } from './financialReconciliation';
import { LeaseFieldsService } from './leaseFields';
import { AuditService } from './audit';
import type { LeaseSchema, OCRResult, ClauseSegment } from '@/types/leaseSchema';
import type { LeaseField } from '@/types/v5.0';

export interface EnhancedExtractionResult {
  success: boolean;
  leaseSchema: Partial<LeaseSchema>;
  fields: LeaseField[];
  confidence: number;
  reconciliation: {
    warnings: any[];
    errors: any[];
    passed: boolean;
  };
  errors?: string[];
}

export class EnhancedExtractionService {
  /**
   * Complete extraction pipeline
   */
  static async extractLease(
    leaseId: string,
    orgId: string,
    pdfBuffer: Buffer
  ): Promise<EnhancedExtractionResult> {
    try {
      // Step 1: OCR - Extract text and structure from PDF
      const ocrResult = await PDFExtractionService.extractTextWithPages(pdfBuffer);
      ocrResult.lease_id = leaseId;

      // Step 2: Clause Chunking - Segment into structured clauses
      const { clauses, documentIndex } = ClauseChunkingService.segmentClauses(ocrResult);

      // Step 3: LLM Extraction - Extract fields by domain
      const termResult = await LLMExtractionService.extractTerm(clauses, ocrResult);
      const rentResult = await LLMExtractionService.extractBaseRent(clauses, ocrResult.tables || [], ocrResult);
      const escalationResult = await LLMExtractionService.extractEscalations(clauses, ocrResult);
      const renewalResult = await LLMExtractionService.extractRenewalOptions(clauses, ocrResult);
      const camResult = await LLMExtractionService.extractAdditionalRent(clauses, ocrResult);

      // Step 4: Merge all extracted fields
      const allFields = [
        ...termResult.fields,
        ...rentResult.fields,
        ...escalationResult.fields,
        ...renewalResult.fields,
        ...camResult.fields
      ];

      // Step 5: Post-Processing - Normalize dates, money, etc.
      const processedFields = PostProcessingService.postProcessFields(allFields);

      // Step 6: Build Lease Schema
      const leaseSchema = this.buildLeaseSchema(
        leaseId,
        processedFields,
        clauses,
        termResult,
        rentResult,
        escalationResult,
        renewalResult,
        camResult
      );

      // Step 7: Financial Reconciliation
      const reconciliation = FinancialReconciliationService.reconcile(leaseSchema, processedFields);

      // Step 8: Store fields in database
      const bulkResult = await LeaseFieldsService.bulkCreateFields(leaseId, processedFields);

      // Step 9: Update lease flags
      await this.updateLeaseFlags(leaseId, reconciliation);

      // Step 10: Log audit event
      await AuditService.logEvent({
        org_id: orgId,
        lease_id: leaseId,
        event_type: 'FIELD_EXTRACTED',
        payload: {
          fields_extracted: processedFields.length,
          confidence_avg: this.calculateAverageConfidence(processedFields),
          reconciliation_passed: reconciliation.passed,
          warnings_count: reconciliation.warnings.length,
          errors_count: reconciliation.errors.length
        }
      });

      return {
        success: true,
        leaseSchema,
        fields: processedFields,
        confidence: this.calculateAverageConfidence(processedFields),
        reconciliation: {
          warnings: reconciliation.warnings,
          errors: reconciliation.errors,
          passed: reconciliation.passed
        },
        errors: bulkResult.errors
      };
    } catch (error) {
      console.error('Enhanced extraction error:', error);
      return {
        success: false,
        leaseSchema: {},
        fields: [],
        confidence: 0,
        reconciliation: {
          warnings: [],
          errors: [],
          passed: false
        },
        errors: [error instanceof Error ? error.message : 'Unknown extraction error']
      };
    }
  }

  /**
   * Build LeaseSchema from extracted fields
   */
  private static buildLeaseSchema(
    leaseId: string,
    fields: LeaseField[],
    clauses: ClauseSegment[],
    termResult: any,
    rentResult: any,
    escalationResult: any,
    renewalResult: any,
    camResult: any
  ): Partial<LeaseSchema> {
    const schema: Partial<LeaseSchema> = {
      lease_id: leaseId,
      qa_status: 'auto',
      source_clause_ids: clauses.map(c => c.clause_id),
      confidence_score: this.calculateAverageConfidence(fields)
    };

    // Build term
    const commencementField = fields.find(f => f.field_name === 'commencement_date' || f.field_name === 'lease_start');
    const expirationField = fields.find(f => f.field_name === 'expiration_date' || f.field_name === 'lease_end');
    const possessionField = fields.find(f => f.field_name === 'possession_date');

    if (commencementField || expirationField) {
      schema.term = {
        commencement_date: commencementField?.value_normalized?.date || undefined,
        expiration_date: expirationField?.value_normalized?.date || undefined,
        possession_date: possessionField?.value_normalized?.date || undefined,
        renewal_options: renewalResult.fields.length > 0 ? [] : undefined, // TODO: Parse renewal options
        free_rent_periods: [] // TODO: Parse free rent periods
      };
    }

    // Build economics
    const baseRentField = fields.find(f => f.field_name === 'base_rent');
    const rentScheduleFields = fields.filter(f => f.field_name.startsWith('rent_schedule_'));

    if (baseRentField || rentScheduleFields.length > 0) {
      schema.economics = {
        base_rent_schedule: this.buildRentSchedule(fields, baseRentField),
        escalations: escalationResult.fields.length > 0 ? [] : undefined, // TODO: Parse escalations
        additional_rent: {
          cam: camResult.fields.length > 0 ? undefined : undefined // TODO: Parse CAM
        }
      };
    }

    // Build obligations
    const noticeFields = fields.filter(f => f.field_name.includes('notice'));
    if (noticeFields.length > 0) {
      schema.obligations = {
        notice_events: [] // TODO: Parse notice events
      };
    }

    // Build flags
    schema.flags = {
      validation_errors: [],
      reconciliation_warnings: [],
      relational_gaps: [],
      qa_status: 'auto'
    };

    return schema;
  }

  /**
   * Build rent schedule from fields
   */
  private static buildRentSchedule(
    fields: LeaseField[],
    baseRentField?: LeaseField
  ): LeaseSchema['economics']['base_rent_schedule'] {
    const schedule: LeaseSchema['economics']['base_rent_schedule'] = [];

    // If we have a base rent field, create a simple schedule
    if (baseRentField?.value_normalized?.numeric) {
      const termStartField = fields.find(f => f.field_name === 'lease_start' || f.field_name === 'commencement_date');
      const termEndField = fields.find(f => f.field_name === 'lease_end' || f.field_name === 'expiration_date');

      if (termStartField?.value_normalized?.date && termEndField?.value_normalized?.date) {
        schedule.push({
          start_date: termStartField.value_normalized.date,
          end_date: termEndField.value_normalized.date,
          amount: baseRentField.value_normalized.numeric,
          frequency: 'monthly',
          per_sf_or_total: 'total'
        });
      }
    }

    // TODO: Parse rent schedule fields if they exist

    return schedule;
  }

  /**
   * Update lease flags based on reconciliation
   */
  private static async updateLeaseFlags(
    leaseId: string,
    reconciliation: { warnings: any[]; errors: any[]; passed: boolean }
  ): Promise<void> {
    try {
      const { supabase } = await import('@/lib/supabase');
      if (!supabase) return;

      const qaStatus = reconciliation.errors.length > 0 
        ? 'flagged' 
        : reconciliation.warnings.length > 0 
          ? 'flagged' 
          : 'auto';

      await supabase
        .from('leases')
        .update({
          verification_status: qaStatus === 'flagged' ? 'in_review' : 'unverified',
          updated_at: new Date().toISOString()
        })
        .eq('id', leaseId);
    } catch (error) {
      console.error('Update lease flags error:', error);
    }
  }

  /**
   * Calculate average confidence
   */
  private static calculateAverageConfidence(fields: LeaseField[]): number {
    if (fields.length === 0) return 0;
    
    const total = fields.reduce((sum, f) => sum + (f.extraction_confidence || 0), 0);
    return Math.round(total / fields.length);
  }
}

