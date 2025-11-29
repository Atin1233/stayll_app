/**
 * STAYLL v5.0 - LLM Extraction Service
 * Domain-focused extraction using LLM with structured prompts
 */

import type { 
  LeaseSchema, 
  ClauseSegment, 
  RentTable,
  OCRResult 
} from '@/types/leaseSchema';
import type { LeaseField } from '@/types/v5.0';
import { ClauseChunkingService } from './clauseChunking';

export interface LLMExtractionResult {
  success: boolean;
  fields: LeaseField[];
  confidence: number;
  source_clause_ids: string[];
  errors?: string[];
}

export class LLMExtractionService {
  /**
   * Extract lease term information
   */
  static async extractTerm(
    clauses: ClauseSegment[],
    ocrResult: OCRResult
  ): Promise<LLMExtractionResult> {
    const termClauses = ClauseChunkingService.getClausesByType(clauses, 'term_section');
    const relevantText = termClauses.map(c => c.text).join('\n\n');

    const prompt = this.buildTermExtractionPrompt(relevantText);
    
    // For now, use deterministic parsing as fallback
    // In production, this would call an LLM API
    const result = await this.callLLMOrFallback(prompt, 'term');
    
    return {
      success: result.success,
      fields: result.fields,
      confidence: result.confidence,
      source_clause_ids: termClauses.map(c => c.clause_id),
      errors: result.errors
    };
  }

  /**
   * Extract base rent schedule
   */
  static async extractBaseRent(
    clauses: ClauseSegment[],
    rentTables: RentTable[],
    ocrResult: OCRResult
  ): Promise<LLMExtractionResult> {
    const rentClauses = ClauseChunkingService.getClausesByType(clauses, 'base_rent_section');
    const relevantText = rentClauses.map(c => c.text).join('\n\n');
    
    // Include table data if available
    const tableData = rentTables.map(t => ({
      page: t.page_number,
      cells: t.cells,
      structure: t.detected_structure
    }));

    const prompt = this.buildRentExtractionPrompt(relevantText, tableData);
    const result = await this.callLLMOrFallback(prompt, 'rent');
    
    return {
      success: result.success,
      fields: result.fields,
      confidence: result.confidence,
      source_clause_ids: rentClauses.map(c => c.clause_id),
      errors: result.errors
    };
  }

  /**
   * Extract escalations
   */
  static async extractEscalations(
    clauses: ClauseSegment[],
    ocrResult: OCRResult
  ): Promise<LLMExtractionResult> {
    const escalationClauses = ClauseChunkingService.getClausesByType(clauses, 'escalation_section');
    const rentClauses = ClauseChunkingService.getClausesByType(clauses, 'base_rent_section');
    const relevantText = [...escalationClauses, ...rentClauses]
      .map(c => c.text)
      .join('\n\n');

    const prompt = this.buildEscalationExtractionPrompt(relevantText);
    const result = await this.callLLMOrFallback(prompt, 'escalation');
    
    return {
      success: result.success,
      fields: result.fields,
      confidence: result.confidence,
      source_clause_ids: [...escalationClauses, ...rentClauses].map(c => c.clause_id),
      errors: result.errors
    };
  }

  /**
   * Extract renewal options
   */
  static async extractRenewalOptions(
    clauses: ClauseSegment[],
    ocrResult: OCRResult
  ): Promise<LLMExtractionResult> {
    const optionsClauses = ClauseChunkingService.getClausesByType(clauses, 'options_section');
    const relevantText = optionsClauses.map(c => c.text).join('\n\n');

    const prompt = this.buildRenewalExtractionPrompt(relevantText);
    const result = await this.callLLMOrFallback(prompt, 'renewal');
    
    return {
      success: result.success,
      fields: result.fields,
      confidence: result.confidence,
      source_clause_ids: optionsClauses.map(c => c.clause_id),
      errors: result.errors
    };
  }

  /**
   * Extract CAM and additional rent
   */
  static async extractAdditionalRent(
    clauses: ClauseSegment[],
    ocrResult: OCRResult
  ): Promise<LLMExtractionResult> {
    const camClauses = ClauseChunkingService.getClausesByType(clauses, 'cam_section');
    const relevantText = camClauses.map(c => c.text).join('\n\n');

    const prompt = this.buildCAMExtractionPrompt(relevantText);
    const result = await this.callLLMOrFallback(prompt, 'cam');
    
    return {
      success: result.success,
      fields: result.fields,
      confidence: result.confidence,
      source_clause_ids: camClauses.map(c => c.clause_id),
      errors: result.errors
    };
  }

  /**
   * Build term extraction prompt
   */
  private static buildTermExtractionPrompt(text: string): string {
    return `You are a lease abstraction engine. Extract lease term information from the following text.

Extract:
- commencement_date (ISO format: YYYY-MM-DD)
- expiration_date (ISO format: YYYY-MM-DD)
- possession_date (ISO format: YYYY-MM-DD, if mentioned)
- free_rent_periods (array of {start_date, end_date, description})
- renewal_options (array of {term_years, term_months, notice_required_days, rent_basis})

Output strict JSON matching this schema:
{
  "commencement_date": "YYYY-MM-DD" | null,
  "expiration_date": "YYYY-MM-DD" | null,
  "possession_date": "YYYY-MM-DD" | null,
  "free_rent_periods": [{"start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "description": "string"}] | [],
  "renewal_options": [{"term_years": number, "term_months": number, "notice_required_days": number, "rent_basis": "market"|"fixed"|"escalated"|"formula"}] | []
}

For each field, if you cannot confidently find it, use null or empty array.

Text:
${text.substring(0, 8000)}`;
  }

  /**
   * Build rent extraction prompt
   */
  private static buildRentExtractionPrompt(text: string, tables: any[]): string {
    const tableInfo = tables.length > 0 
      ? `\n\nRent Tables Found:\n${JSON.stringify(tables, null, 2)}`
      : '';

    return `You are a lease abstraction engine. Extract base rent schedule from the following text and tables.

Extract base_rent_schedule as an array of:
{
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "amount": number,
  "frequency": "monthly" | "quarterly" | "annual",
  "per_sf_or_total": "per_sf" | "total",
  "per_sf_amount": number (if per_sf_or_total is "per_sf")
}

If rent is expressed as "$X per square foot per year", convert to monthly total if square footage is mentioned.
If rent is expressed as "$X per month", use that directly.

Output strict JSON:
{
  "base_rent_schedule": [...]
}

Text:
${text.substring(0, 8000)}${tableInfo}`;
  }

  /**
   * Build escalation extraction prompt
   */
  private static buildEscalationExtractionPrompt(text: string): string {
    return `You are a lease abstraction engine. Extract rent escalations from the following text.

Extract escalations as an array of:
{
  "type": "fixed" | "percent" | "index",
  "value": number,
  "frequency": "monthly" | "quarterly" | "annual" | "one_time",
  "effective_date": "YYYY-MM-DD" | null,
  "cap": number | null,
  "floor": number | null,
  "index_type": "cpi" | "ppi" | "custom" | null
}

Examples:
- "3% annually" → {"type": "percent", "value": 3, "frequency": "annual"}
- "$0.50 per square foot per year" → {"type": "fixed", "value": 0.50, "frequency": "annual", "per_sf": true}
- "CPI with 2% floor and 5% cap" → {"type": "index", "value": null, "index_type": "cpi", "floor": 2, "cap": 5}

Output strict JSON:
{
  "escalations": [...]
}

Text:
${text.substring(0, 8000)}`;
  }

  /**
   * Build renewal extraction prompt
   */
  private static buildRenewalExtractionPrompt(text: string): string {
    return `You are a lease abstraction engine. Extract renewal options from the following text.

Extract renewal_options as an array of:
{
  "option_number": number,
  "term_years": number | null,
  "term_months": number | null,
  "notice_required_days": number | null,
  "rent_basis": "market" | "fixed" | "escalated" | "formula" | null,
  "rent_amount": number | null,
  "rent_per_sf": number | null
}

Output strict JSON:
{
  "renewal_options": [...]
}

Text:
${text.substring(0, 8000)}`;
  }

  /**
   * Build CAM extraction prompt
   */
  private static buildCAMExtractionPrompt(text: string): string {
    return `You are a lease abstraction engine. Extract CAM and additional rent information from the following text.

Extract:
{
  "cam": {
    "billing_method": "proportional" | "fixed" | "passthrough",
    "amount": number | null,
    "per_sf": number | null,
    "estimated_annual": number | null,
    "reconciliation_frequency": "monthly" | "quarterly" | "annual" | null
  },
  "taxes": {...same structure...},
  "insurance": {...same structure...},
  "utilities": {
    "responsibility": "tenant" | "landlord" | "shared",
    "billing_method": "metered" | "fixed" | "estimated" | null,
    "amount": number | null
  }
}

Output strict JSON matching the structure above.

Text:
${text.substring(0, 8000)}`;
  }

  /**
   * Call LLM or use fallback deterministic parser
   */
  private static async callLLMOrFallback(
    prompt: string,
    domain: 'term' | 'rent' | 'escalation' | 'renewal' | 'cam'
  ): Promise<{ success: boolean; fields: LeaseField[]; confidence: number; errors?: string[] }> {
    // TODO: Integrate with actual LLM (OpenAI, Anthropic, Vertex AI, etc.)
    // For now, return empty result - deterministic parser will handle it
    // This allows the system to work without LLM while we integrate it
    
    return {
      success: true,
      fields: [],
      confidence: 0,
      errors: ['LLM extraction not yet implemented - using deterministic parser']
    };
  }
}


