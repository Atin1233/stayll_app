/**
 * STAYLL v5.0 - Discrepancy Detection Engine
 * Validates extracted data with financial logic
 */

import type { LeaseField, RentScheduleEntry } from '@/types/v5.0';
import type { RentRollEntry } from './rentRollEngine';

export interface Discrepancy {
  id: string;
  field_name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'value_mismatch' | 'logic_error' | 'missing_data' | 'format_error' | 'calculation_error';
  description: string;
  expected?: any;
  actual?: any;
  recommendation?: string;
  auto_fixable: boolean;
}

export interface ValidationReport {
  lease_id: string;
  overall_status: 'pass' | 'warning' | 'fail';
  discrepancies: Discrepancy[];
  validated_at: string;
  validator_version: string;
}

export class DiscrepancyDetector {
  private static version = '5.0.1';

  /**
   * Run comprehensive validation on lease data
   */
  static detectDiscrepancies(params: {
    lease_id: string;
    fields: Record<string, any>;
    rent_roll?: RentRollEntry[];
    expected_values?: Record<string, any>;
  }): ValidationReport {
    const discrepancies: Discrepancy[] = [];

    console.log('[Discrepancy] Validating lease:', params.lease_id);

    // Run all validation checks
    discrepancies.push(...this.validateBaseRent(params.fields, params.rent_roll));
    discrepancies.push(...this.validateDates(params.fields));
    discrepancies.push(...this.validateRentSchedule(params.fields, params.rent_roll));
    discrepancies.push(...this.validateEscalations(params.fields, params.rent_roll));
    discrepancies.push(...this.validateDeposit(params.fields));
    discrepancies.push(...this.validateLateFee(params.fields));
    discrepancies.push(...this.validatePaymentTerms(params.fields));
    discrepancies.push(...this.validateMissingCriticalFields(params.fields));

    // Compare with expected values if provided
    if (params.expected_values) {
      discrepancies.push(...this.compareExpectedValues(params.fields, params.expected_values));
    }

    // Determine overall status
    const criticalCount = discrepancies.filter(d => d.severity === 'critical').length;
    const highCount = discrepancies.filter(d => d.severity === 'high').length;
    
    let overallStatus: 'pass' | 'warning' | 'fail' = 'pass';
    if (criticalCount > 0) {
      overallStatus = 'fail';
    } else if (highCount > 0) {
      overallStatus = 'warning';
    }

    console.log('[Discrepancy] Found', discrepancies.length, 'discrepancies, status:', overallStatus);

    return {
      lease_id: params.lease_id,
      overall_status: overallStatus,
      discrepancies,
      validated_at: new Date().toISOString(),
      validator_version: this.version,
    };
  }

  /**
   * Validate base rent against rent schedule
   */
  private static validateBaseRent(
    fields: Record<string, any>,
    rentRoll?: RentRollEntry[]
  ): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];
    const baseRent = fields.base_rent;

    if (!baseRent) {
      discrepancies.push({
        id: 'base_rent_missing',
        field_name: 'base_rent',
        severity: 'critical',
        type: 'missing_data',
        description: 'Base rent not found in document',
        recommendation: 'Manual review required to locate base rent clause',
        auto_fixable: false,
      });
      return discrepancies;
    }

    // Validate base rent is positive
    if (baseRent <= 0) {
      discrepancies.push({
        id: 'base_rent_negative',
        field_name: 'base_rent',
        severity: 'critical',
        type: 'value_mismatch',
        description: 'Base rent must be positive',
        actual: baseRent,
        recommendation: 'Check extraction accuracy',
        auto_fixable: false,
      });
    }

    // Validate base rent is reasonable (not too high/low)
    if (baseRent < 100) {
      discrepancies.push({
        id: 'base_rent_too_low',
        field_name: 'base_rent',
        severity: 'medium',
        type: 'value_mismatch',
        description: 'Base rent seems unusually low',
        actual: baseRent,
        recommendation: 'Verify extraction captured correct amount',
        auto_fixable: false,
      });
    }

    if (baseRent > 1000000) {
      discrepancies.push({
        id: 'base_rent_too_high',
        field_name: 'base_rent',
        severity: 'medium',
        type: 'value_mismatch',
        description: 'Base rent seems unusually high',
        actual: baseRent,
        recommendation: 'Verify extraction captured monthly (not annual) rent',
        auto_fixable: false,
      });
    }

    // Compare with rent roll if available
    if (rentRoll && rentRoll.length > 0) {
      const firstMonthRent = rentRoll[0].base_rent;
      const tolerance = baseRent * 0.01; // 1% tolerance
      const difference = Math.abs(firstMonthRent - baseRent);

      if (difference > tolerance) {
        discrepancies.push({
          id: 'base_rent_schedule_mismatch',
          field_name: 'base_rent',
          severity: 'high',
          type: 'calculation_error',
          description: 'Base rent does not match rent schedule first month',
          expected: firstMonthRent,
          actual: baseRent,
          recommendation: 'Review rent schedule and base rent clause for consistency',
          auto_fixable: false,
        });
      }
    }

    return discrepancies;
  }

  /**
   * Validate date fields
   */
  private static validateDates(fields: Record<string, any>): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];
    const { lease_start, lease_end, rent_commencement } = fields;

    // Check for missing dates
    if (!lease_start) {
      discrepancies.push({
        id: 'lease_start_missing',
        field_name: 'lease_start',
        severity: 'critical',
        type: 'missing_data',
        description: 'Lease start date not found',
        recommendation: 'Manual review required',
        auto_fixable: false,
      });
    }

    if (!lease_end) {
      discrepancies.push({
        id: 'lease_end_missing',
        field_name: 'lease_end',
        severity: 'critical',
        type: 'missing_data',
        description: 'Lease end date not found',
        recommendation: 'Manual review required',
        auto_fixable: false,
      });
    }

    // Validate date order
    if (lease_start && lease_end) {
      const startDate = new Date(lease_start);
      const endDate = new Date(lease_end);

      if (startDate >= endDate) {
        discrepancies.push({
          id: 'date_order_invalid',
          field_name: 'lease_start',
          severity: 'critical',
          type: 'logic_error',
          description: 'Lease start date must be before end date',
          actual: `start: ${lease_start}, end: ${lease_end}`,
          recommendation: 'Verify date extraction accuracy',
          auto_fixable: false,
        });
      }

      // Check lease term length is reasonable
      const diffMonths = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (diffMonths < 1) {
        discrepancies.push({
          id: 'lease_term_too_short',
          field_name: 'term_length',
          severity: 'high',
          type: 'logic_error',
          description: 'Lease term is less than 1 month',
          actual: `${diffMonths.toFixed(1)} months`,
          recommendation: 'Verify dates are correct',
          auto_fixable: false,
        });
      }

      if (diffMonths > 600) { // 50 years
        discrepancies.push({
          id: 'lease_term_too_long',
          field_name: 'term_length',
          severity: 'medium',
          type: 'logic_error',
          description: 'Lease term exceeds 50 years',
          actual: `${diffMonths.toFixed(1)} months`,
          recommendation: 'Verify dates are correct',
          auto_fixable: false,
        });
      }
    }

    // Validate rent commencement vs lease start
    if (rent_commencement && lease_start) {
      const rentDate = new Date(rent_commencement);
      const startDate = new Date(lease_start);

      if (rentDate < startDate) {
        discrepancies.push({
          id: 'rent_before_lease',
          field_name: 'rent_commencement',
          severity: 'high',
          type: 'logic_error',
          description: 'Rent commencement date is before lease start date',
          actual: `rent: ${rent_commencement}, start: ${lease_start}`,
          recommendation: 'Verify dates are correct',
          auto_fixable: false,
        });
      }
    }

    return discrepancies;
  }

  /**
   * Validate rent schedule consistency
   */
  private static validateRentSchedule(
    fields: Record<string, any>,
    rentRoll?: RentRollEntry[]
  ): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];

    if (!rentRoll || rentRoll.length === 0) {
      return discrepancies;
    }

    // Check for gaps in schedule
    for (let i = 1; i < rentRoll.length; i++) {
      const prevEnd = new Date(rentRoll[i - 1].period_end);
      const currStart = new Date(rentRoll[i].period_start);
      const daysDiff = (currStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff > 2) {
        discrepancies.push({
          id: `schedule_gap_${i}`,
          field_name: 'rent_schedule',
          severity: 'medium',
          type: 'logic_error',
          description: `Gap detected in rent schedule between month ${i} and ${i + 1}`,
          actual: `${daysDiff.toFixed(0)} days`,
          recommendation: 'Review rent schedule for continuity',
          auto_fixable: false,
        });
      }
    }

    // Check for negative rents
    const negativeMonths = rentRoll.filter(e => e.total_rent < 0);
    if (negativeMonths.length > 0) {
      discrepancies.push({
        id: 'negative_rent',
        field_name: 'rent_schedule',
        severity: 'critical',
        type: 'calculation_error',
        description: `Found ${negativeMonths.length} months with negative rent`,
        recommendation: 'Review rent schedule calculations',
        auto_fixable: false,
      });
    }

    return discrepancies;
  }

  /**
   * Validate escalation clauses match rent increases
   */
  private static validateEscalations(
    fields: Record<string, any>,
    rentRoll?: RentRollEntry[]
  ): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];

    if (!rentRoll || rentRoll.length < 13) {
      return discrepancies; // Need at least 2 years to validate escalations
    }

    // Check if escalations are applied consistently
    const escalationMonths = rentRoll.filter(e => e.escalation_amount > 0);
    
    if (escalationMonths.length === 0 && fields.escalation_clause) {
      discrepancies.push({
        id: 'escalation_not_applied',
        field_name: 'escalation_clause',
        severity: 'high',
        type: 'calculation_error',
        description: 'Escalation clause exists but no escalations applied in rent schedule',
        recommendation: 'Verify escalation calculation logic',
        auto_fixable: false,
      });
    }

    return discrepancies;
  }

  /**
   * Validate security deposit
   */
  private static validateDeposit(fields: Record<string, any>): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];
    const { security_deposit, base_rent } = fields;

    if (security_deposit && base_rent) {
      const ratio = security_deposit / base_rent;

      // Typically deposit is 1-3 months rent
      if (ratio < 0.5) {
        discrepancies.push({
          id: 'deposit_too_low',
          field_name: 'security_deposit',
          severity: 'low',
          type: 'value_mismatch',
          description: 'Security deposit is less than 0.5 months rent',
          actual: `${ratio.toFixed(2)}x monthly rent`,
          recommendation: 'Verify deposit amount',
          auto_fixable: false,
        });
      }

      if (ratio > 6) {
        discrepancies.push({
          id: 'deposit_too_high',
          field_name: 'security_deposit',
          severity: 'medium',
          type: 'value_mismatch',
          description: 'Security deposit exceeds 6 months rent',
          actual: `${ratio.toFixed(2)}x monthly rent`,
          recommendation: 'Verify deposit amount is not annual rent',
          auto_fixable: false,
        });
      }
    }

    return discrepancies;
  }

  /**
   * Validate late fee is reasonable
   */
  private static validateLateFee(fields: Record<string, any>): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];
    const { late_fee, base_rent } = fields;

    if (late_fee && base_rent) {
      // Parse late fee (could be $ amount or percentage)
      let feeAmount = 0;
      
      if (typeof late_fee === 'string') {
        if (late_fee.includes('%')) {
          const percent = parseFloat(late_fee.replace('%', ''));
          feeAmount = base_rent * (percent / 100);
        } else {
          feeAmount = parseFloat(late_fee.replace(/[$,]/g, ''));
        }
      } else {
        feeAmount = late_fee;
      }

      const ratio = feeAmount / base_rent;

      // Typical late fees are 3-10% of rent
      if (ratio > 0.15) {
        discrepancies.push({
          id: 'late_fee_excessive',
          field_name: 'late_fee',
          severity: 'medium',
          type: 'value_mismatch',
          description: 'Late fee exceeds 15% of monthly rent',
          actual: `${(ratio * 100).toFixed(1)}%`,
          recommendation: 'Verify late fee calculation',
          auto_fixable: false,
        });
      }
    }

    return discrepancies;
  }

  /**
   * Validate payment terms
   */
  private static validatePaymentTerms(fields: Record<string, any>): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];
    const { payment_due_date, payment_frequency } = fields;

    if (payment_due_date) {
      const dueDay = parseInt(payment_due_date);
      
      if (dueDay < 1 || dueDay > 31) {
        discrepancies.push({
          id: 'invalid_due_date',
          field_name: 'payment_due_date',
          severity: 'medium',
          type: 'format_error',
          description: 'Payment due date is not a valid day of month',
          actual: payment_due_date,
          recommendation: 'Verify extraction accuracy',
          auto_fixable: false,
        });
      }
    }

    return discrepancies;
  }

  /**
   * Check for missing critical fields
   */
  private static validateMissingCriticalFields(fields: Record<string, any>): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];
    
    const criticalFields = [
      'tenant_name',
      'property_address',
      'lease_start',
      'lease_end',
      'base_rent',
    ];

    for (const fieldName of criticalFields) {
      if (!fields[fieldName]) {
        discrepancies.push({
          id: `missing_${fieldName}`,
          field_name: fieldName,
          severity: 'critical',
          type: 'missing_data',
          description: `Critical field '${fieldName}' is missing`,
          recommendation: 'Manual review required to locate this field',
          auto_fixable: false,
        });
      }
    }

    return discrepancies;
  }

  /**
   * Compare with expected values
   */
  private static compareExpectedValues(
    fields: Record<string, any>,
    expected: Record<string, any>
  ): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];

    for (const [fieldName, expectedValue] of Object.entries(expected)) {
      const actualValue = fields[fieldName];

      if (actualValue !== expectedValue) {
        discrepancies.push({
          id: `mismatch_${fieldName}`,
          field_name: fieldName,
          severity: 'high',
          type: 'value_mismatch',
          description: `Expected value does not match extracted value for ${fieldName}`,
          expected: expectedValue,
          actual: actualValue,
          recommendation: 'Review extraction accuracy',
          auto_fixable: false,
        });
      }
    }

    return discrepancies;
  }

  /**
   * Export discrepancies to CSV
   */
  static exportDiscrepanciesCSV(report: ValidationReport): string {
    const headers = [
      'Severity',
      'Field',
      'Type',
      'Description',
      'Expected',
      'Actual',
      'Recommendation'
    ];

    const rows = report.discrepancies.map(d => [
      d.severity,
      d.field_name,
      d.type,
      d.description,
      d.expected || '',
      d.actual || '',
      d.recommendation || ''
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }
}
