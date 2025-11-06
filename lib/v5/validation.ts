/**
 * STAYLL v5.0 - Validation Engine
 * Deterministic rule-based validation for extracted fields
 */

import type { ValidationRule, ValidationResult, LeaseField, RentScheduleEntry } from '@/types/v5.0';

export class ValidationEngine {
  /**
   * Validate a single field using deterministic rules
   */
  static validateField(field: LeaseField, lease?: { rent_schedule?: RentScheduleEntry[] }): ValidationResult {
    const rules: ValidationRule[] = [];
    let requiresQA = false;

    // Rule 1: Date Logic Validation
    if (field.field_name.includes('start') || field.field_name.includes('end')) {
      const dateRule = this.validateDateLogic(field);
      rules.push(dateRule);
      if (!dateRule.passed && dateRule.severity === 'high') {
        requiresQA = true;
      }
    }

    // Rule 2: Numeric Format Validation
    if (field.field_name.includes('rent') || field.field_name.includes('amount') || field.field_name.includes('fee')) {
      const numericRule = this.validateNumericFormat(field);
      rules.push(numericRule);
      if (!numericRule.passed && numericRule.severity === 'high') {
        requiresQA = true;
      }
    }

    // Rule 3: Rent Schedule Reconciliation
    if (field.field_name === 'base_rent' && lease?.rent_schedule) {
      const reconciliationRule = this.validateRentReconciliation(field, lease.rent_schedule);
      rules.push(reconciliationRule);
      if (!reconciliationRule.passed) {
        requiresQA = true;
      }
    }

    // Rule 4: Escalation Math Validation
    if (field.field_name.includes('escalation')) {
      const escalationRule = this.validateEscalation(field);
      rules.push(escalationRule);
      if (!escalationRule.passed && escalationRule.severity === 'high') {
        requiresQA = true;
      }
    }

    // Rule 5: Confidence Threshold
    const confidenceRule = this.validateConfidence(field);
    rules.push(confidenceRule);
    if (!confidenceRule.passed && confidenceRule.severity === 'high') {
      requiresQA = true;
    }

    // Determine overall state
    const hasFailures = rules.some(r => !r.passed);
    const hasHighSeverityFailures = rules.some(r => !r.passed && r.severity === 'high');
    
    let overallState: LeaseField['validation_state'] = 'auto_pass';
    if (hasHighSeverityFailures) {
      overallState = 'rule_fail';
    } else if (hasFailures || field.extraction_confidence && field.extraction_confidence < 70) {
      overallState = 'flagged';
    } else if (field.extraction_confidence && field.extraction_confidence >= 90 && !hasFailures) {
      overallState = 'auto_pass';
    }

    return {
      field_id: field.id,
      field_name: field.field_name,
      rules,
      overall_state: overallState,
      requires_qa: requiresQA || overallState === 'flagged' || overallState === 'rule_fail'
    };
  }

  /**
   * Validate date logic (start < end, valid date format)
   */
  private static validateDateLogic(field: LeaseField): ValidationRule {
    const rule: ValidationRule = {
      rule_id: 'date_logic',
      rule_name: 'Date Logic Validation',
      passed: true,
      severity: 'high',
      message: 'Date is valid'
    };

    if (!field.value_text) {
      rule.passed = false;
      rule.message = 'Date value is missing';
      return rule;
    }

    // Check if it's a valid date
    const date = new Date(field.value_text);
    if (isNaN(date.getTime())) {
      rule.passed = false;
      rule.message = 'Invalid date format';
      return rule;
    }

    // Check if date is reasonable (not too far in past/future)
    const now = new Date();
    const year = date.getFullYear();
    const currentYear = now.getFullYear();
    
    if (year < 1900 || year > currentYear + 50) {
      rule.passed = false;
      rule.severity = 'medium';
      rule.message = `Date year (${year}) seems unusual`;
      return rule;
    }

    return rule;
  }

  /**
   * Validate numeric format
   */
  private static validateNumericFormat(field: LeaseField): ValidationRule {
    const rule: ValidationRule = {
      rule_id: 'numeric_format',
      rule_name: 'Numeric Format Validation',
      passed: true,
      severity: 'high',
      message: 'Numeric value is valid'
    };

    if (field.value_normalized?.numeric !== undefined) {
      const value = field.value_normalized.numeric;
      
      // Check if value is reasonable
      if (value < 0) {
        rule.passed = false;
        rule.message = 'Negative value not allowed';
        return rule;
      }

      if (value > 100000000) { // $100M limit
        rule.passed = false;
        rule.severity = 'medium';
        rule.message = 'Value seems unusually high';
        return rule;
      }

      return rule;
    }

    // Try to parse from text
    if (field.value_text) {
      const cleaned = field.value_text.replace(/[$,]/g, '');
      const parsed = parseFloat(cleaned);
      
      if (isNaN(parsed)) {
        rule.passed = false;
        rule.message = 'Cannot parse numeric value from text';
        return rule;
      }

      if (parsed < 0) {
        rule.passed = false;
        rule.message = 'Negative value not allowed';
        return rule;
      }
    } else {
      rule.passed = false;
      rule.message = 'No numeric value found';
      return rule;
    }

    return rule;
  }

  /**
   * Validate rent schedule reconciliation
   */
  private static validateRentReconciliation(
    baseRentField: LeaseField, 
    rentSchedule: RentScheduleEntry[]
  ): ValidationRule {
    const rule: ValidationRule = {
      rule_id: 'rent_reconciliation',
      rule_name: 'Rent Schedule Reconciliation',
      passed: true,
      severity: 'high',
      message: 'Rent schedule matches base rent'
    };

    if (!baseRentField.value_normalized?.numeric) {
      rule.passed = false;
      rule.message = 'Base rent value not found';
      return rule;
    }

    const baseRent = baseRentField.value_normalized.numeric;
    
    // Calculate annual rent from schedule
    let annualTotal = 0;
    for (const entry of rentSchedule) {
      if (entry.frequency === 'monthly') {
        const months = this.monthsBetween(entry.period_start, entry.period_end);
        annualTotal += entry.amount * months;
      } else if (entry.frequency === 'quarterly') {
        const quarters = this.monthsBetween(entry.period_start, entry.period_end) / 3;
        annualTotal += entry.amount * quarters;
      } else if (entry.frequency === 'annual') {
        annualTotal += entry.amount;
      }
    }

    // Compare (allow 1% tolerance for rounding)
    const expectedAnnual = baseRent * 12; // Assuming base rent is monthly
    const tolerance = expectedAnnual * 0.01;
    const difference = Math.abs(annualTotal - expectedAnnual);

    if (difference > tolerance) {
      rule.passed = false;
      rule.expected = expectedAnnual;
      rule.actual = annualTotal;
      rule.message = `Rent schedule total (${annualTotal}) doesn't match base rent annual (${expectedAnnual})`;
      return rule;
    }

    return rule;
  }

  /**
   * Validate escalation calculations
   */
  private static validateEscalation(field: LeaseField): ValidationRule {
    const rule: ValidationRule = {
      rule_id: 'escalation_validation',
      rule_name: 'Escalation Rate Validation',
      passed: true,
      severity: 'medium',
      message: 'Escalation rate is valid'
    };

    if (field.value_normalized?.numeric !== undefined) {
      const rate = field.value_normalized.numeric;
      
      // Typical escalation rates are 0-10%
      if (rate < 0 || rate > 10) {
        rule.passed = false;
        rule.message = `Escalation rate (${rate}%) seems unusual`;
        return rule;
      }
    }

    return rule;
  }

  /**
   * Validate confidence threshold
   */
  private static validateConfidence(field: LeaseField): ValidationRule {
    const rule: ValidationRule = {
      rule_id: 'confidence_threshold',
      rule_name: 'Confidence Threshold Check',
      passed: true,
      severity: 'medium',
      message: 'Confidence meets threshold'
    };

    const confidence = field.extraction_confidence || 0;
    
    if (confidence < 70) {
      rule.passed = false;
      rule.severity = 'high';
      rule.message = `Low confidence (${confidence}%) requires review`;
      return rule;
    }

    if (confidence < 85) {
      rule.passed = false;
      rule.severity = 'low';
      rule.message = `Moderate confidence (${confidence}%) may need review`;
      return rule;
    }

    return rule;
  }

  /**
   * Helper: Calculate months between two dates
   */
  private static monthsBetween(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const years = (endDate.getFullYear() - startDate.getFullYear());
    const months = (endDate.getMonth() - startDate.getMonth());
    return years * 12 + months + 1; // +1 to include both start and end months
  }

  /**
   * Cross-field validation (e.g., lease_start < lease_end)
   */
  static validateCrossField(fields: LeaseField[]): ValidationRule[] {
    const rules: ValidationRule[] = [];

    const startField = fields.find(f => f.field_name === 'lease_start');
    const endField = fields.find(f => f.field_name === 'lease_end');

    if (startField && endField && startField.value_text && endField.value_text) {
      const startDate = new Date(startField.value_text);
      const endDate = new Date(endField.value_text);

      if (startDate >= endDate) {
        rules.push({
          rule_id: 'date_order',
          rule_name: 'Lease Date Order',
          passed: false,
          severity: 'critical',
          expected: 'lease_start < lease_end',
          actual: `start: ${startDate.toISOString()}, end: ${endDate.toISOString()}`,
          message: 'Lease start date must be before end date'
        });
      } else {
        rules.push({
          rule_id: 'date_order',
          rule_name: 'Lease Date Order',
          passed: true,
          severity: 'high',
          message: 'Lease dates are in correct order'
        });
      }
    }

    return rules;
  }
}

