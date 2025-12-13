/**
 * STAYLL v5.0 - Per-Field Confidence Scoring
 * Generates confidence scores with detailed reason codes
 */

import type { LeaseField } from '@/types/v5.0';

export interface ConfidenceResult {
  score: number; // 0-100
  reason_codes: string[];
  factors: {
    pattern_match_quality: number;
    multiple_pattern_agreement: boolean;
    field_completeness: number;
    format_validation: boolean;
    context_validation: number;
  };
}

export class ConfidenceScorer {
  /**
   * Calculate confidence score for a field extraction
   */
  static calculateConfidence(params: {
    field_name: string;
    value_text?: string;
    extraction_method: 'regex' | 'llm' | 'hybrid';
    pattern_matches?: number;
    patterns_total?: number;
    context_window?: string;
    format_valid?: boolean;
    multiple_sources_agree?: boolean;
  }): ConfidenceResult {
    const reasonCodes: string[] = [];
    const factors = {
      pattern_match_quality: 0,
      multiple_pattern_agreement: params.multiple_sources_agree || false,
      field_completeness: 0,
      format_validation: params.format_valid || false,
      context_validation: 0,
    };

    // Factor 1: Pattern Match Quality (0-30 points)
    if (params.pattern_matches && params.patterns_total) {
      const matchRatio = params.pattern_matches / params.patterns_total;
      factors.pattern_match_quality = matchRatio * 30;
      
      if (matchRatio < 0.3) {
        reasonCodes.push('LOW_PATTERN_MATCH');
      } else if (matchRatio >= 0.7) {
        reasonCodes.push('STRONG_PATTERN_MATCH');
      }
    } else if (params.extraction_method === 'llm') {
      // LLM extractions get moderate score by default
      factors.pattern_match_quality = 20;
    }

    // Factor 2: Multiple Pattern Agreement (0-20 points)
    if (params.multiple_sources_agree) {
      factors.pattern_match_quality += 20;
      reasonCodes.push('MULTIPLE_PATTERNS_AGREE');
    } else if (params.pattern_matches && params.pattern_matches > 1) {
      reasonCodes.push('PATTERN_DISAGREEMENT');
    }

    // Factor 3: Field Completeness (0-25 points)
    if (params.value_text) {
      const length = params.value_text.length;
      if (length === 0) {
        factors.field_completeness = 0;
        reasonCodes.push('FIELD_EMPTY');
      } else if (length < 3) {
        factors.field_completeness = 10;
        reasonCodes.push('FIELD_TOO_SHORT');
      } else if (length > 200) {
        factors.field_completeness = 15;
        reasonCodes.push('FIELD_TOO_LONG');
      } else {
        factors.field_completeness = 25;
      }
    } else {
      reasonCodes.push('FIELD_NOT_FOUND');
    }

    // Factor 4: Format Validation (0-15 points)
    if (params.format_valid) {
      factors.format_validation = true;
      factors.field_completeness += 15;
    } else {
      reasonCodes.push('FORMAT_INVALID');
    }

    // Factor 5: Context Validation (0-10 points)
    if (params.context_window) {
      // Check if field name keywords appear in context
      const fieldKeywords = this.getFieldKeywords(params.field_name);
      const contextLower = params.context_window.toLowerCase();
      const keywordsFound = fieldKeywords.filter(kw => 
        contextLower.includes(kw.toLowerCase())
      ).length;
      
      factors.context_validation = (keywordsFound / fieldKeywords.length) * 10;
      
      if (keywordsFound === 0) {
        reasonCodes.push('NO_CONTEXT_KEYWORDS');
      }
    }

    // Calculate total score
    const totalScore = Math.min(100, Math.round(
      factors.pattern_match_quality +
      factors.field_completeness +
      factors.context_validation
    ));

    // Add overall confidence reason
    if (totalScore >= 90) {
      reasonCodes.push('HIGH_CONFIDENCE');
    } else if (totalScore >= 70) {
      reasonCodes.push('MEDIUM_CONFIDENCE');
    } else {
      reasonCodes.push('LOW_CONFIDENCE');
    }

    return {
      score: totalScore,
      reason_codes: reasonCodes,
      factors,
    };
  }

  /**
   * Get expected keywords for a field name
   */
  private static getFieldKeywords(fieldName: string): string[] {
    const keywordMap: Record<string, string[]> = {
      lease_id: ['lease', 'agreement', 'id', 'number'],
      property_id: ['property', 'premises', 'id', 'unit'],
      tenant_name: ['tenant', 'lessee', 'renter'],
      landlord_name: ['landlord', 'lessor', 'owner'],
      property_address: ['property', 'premises', 'located', 'address'],
      lease_start: ['commencement', 'start', 'effective', 'beginning'],
      lease_end: ['expiration', 'end', 'termination', 'ending'],
      term_length: ['term', 'duration', 'length', 'period'],
      base_rent: ['rent', 'base', 'monthly', 'payment'],
      rent_schedule: ['rent', 'schedule', 'payment', 'table'],
      escalation_clause: ['escalation', 'increase', 'adjustment', 'cpi'],
      rent_commencement: ['rent', 'commencement', 'payment', 'start'],
      renewal_options: ['renewal', 'option', 'extend', 'extension'],
      termination_rights: ['termination', 'break', 'early', 'cancel'],
      operating_expenses: ['operating', 'expense', 'cam', 'triple net'],
      lease_type: ['gross', 'net', 'triple', 'modified'],
      cam_details: ['cam', 'common', 'area', 'maintenance'],
      tax_details: ['tax', 'property tax', 'real estate tax'],
      insurance_details: ['insurance', 'liability', 'coverage'],
      late_fee: ['late', 'fee', 'charge', 'penalty'],
      payment_frequency: ['payment', 'frequency', 'due', 'monthly'],
      payment_due_date: ['due', 'date', 'payment', 'payable'],
      notice_address: ['notice', 'address', 'correspondence'],
      guarantor: ['guarantor', 'guarantee', 'surety'],
      security_deposit: ['security', 'deposit'],
    };

    return keywordMap[fieldName] || [fieldName.replace(/_/g, ' ')];
  }

  /**
   * Generate human-readable explanation for confidence score
   */
  static explainConfidence(result: ConfidenceResult): string {
    const explanations: string[] = [];

    if (result.score >= 90) {
      explanations.push('High confidence extraction');
    } else if (result.score >= 70) {
      explanations.push('Medium confidence - may need review');
    } else {
      explanations.push('Low confidence - requires review');
    }

    // Add specific reasons
    if (result.reason_codes.includes('FIELD_NOT_FOUND')) {
      explanations.push('Field not found in document');
    }
    if (result.reason_codes.includes('LOW_PATTERN_MATCH')) {
      explanations.push('Few extraction patterns matched');
    }
    if (result.reason_codes.includes('PATTERN_DISAGREEMENT')) {
      explanations.push('Multiple patterns disagreed');
    }
    if (result.reason_codes.includes('FORMAT_INVALID')) {
      explanations.push('Value format doesn\'t match expected');
    }
    if (result.reason_codes.includes('NO_CONTEXT_KEYWORDS')) {
      explanations.push('Expected keywords not found near value');
    }
    if (result.reason_codes.includes('FIELD_TOO_SHORT')) {
      explanations.push('Extracted value seems too short');
    }
    if (result.reason_codes.includes('FIELD_TOO_LONG')) {
      explanations.push('Extracted value seems too long');
    }

    // Add positive indicators
    if (result.reason_codes.includes('MULTIPLE_PATTERNS_AGREE')) {
      explanations.push('Multiple extraction methods agree');
    }
    if (result.reason_codes.includes('STRONG_PATTERN_MATCH')) {
      explanations.push('Strong pattern match');
    }

    return explanations.join('. ') + '.';
  }

  /**
   * Determine if field needs QA review based on confidence
   */
  static needsQA(score: number, fieldName: string): boolean {
    // Critical fields require higher confidence
    const criticalFields = [
      'base_rent',
      'lease_start',
      'lease_end',
      'rent_schedule',
      'escalation_clause',
      'tenant_name',
      'property_address'
    ];

    const threshold = criticalFields.includes(fieldName) ? 85 : 70;
    return score < threshold;
  }

  /**
   * Get color coding for confidence score (for UI)
   */
  static getConfidenceColor(score: number): string {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
  }

  /**
   * Get icon for confidence level (for UI)
   */
  static getConfidenceIcon(score: number): string {
    if (score >= 90) return '✓';
    if (score >= 70) return '⚠';
    return '✗';
  }
}
