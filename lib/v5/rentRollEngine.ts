/**
 * STAYLL v5.0 - Rent Roll Generation Engine
 * Generates monthly rent schedules with escalations
 */

import type { RentScheduleEntry } from '@/types/v5.0';

export interface RentRollEntry {
  period_start: string;
  period_end: string;
  month_number: number;
  base_rent: number;
  escalation_amount: number;
  total_rent: number;
  cumulative_rent: number;
  escalation_applied?: string;
}

export interface EscalationClause {
  type: 'cpi' | 'percentage' | 'fixed_dollar' | 'none';
  rate?: number; // For percentage or fixed dollar
  cpi_base_year?: number;
  cpi_adjustment?: number; // e.g., CPI + 2%
  effective_year?: number; // When escalation starts
  frequency?: 'annual' | 'monthly' | 'one_time';
  cap?: number; // Maximum escalation rate
  floor?: number; // Minimum escalation rate
}

export interface RentRollParams {
  base_rent: number;
  lease_start: string;
  lease_end: string;
  rent_commencement?: string;
  escalation?: EscalationClause;
  step_rent_schedule?: RentScheduleEntry[];
  free_rent_months?: number[];
  abatements?: Array<{
    start_month: number;
    end_month: number;
    amount: number;
  }>;
}

export class RentRollEngine {
  /**
   * Generate complete monthly rent schedule for lease term
   */
  static generateRentRoll(params: RentRollParams): RentRollEntry[] {
    const startDate = new Date(params.rent_commencement || params.lease_start);
    const endDate = new Date(params.lease_end);
    
    const entries: RentRollEntry[] = [];
    let currentDate = new Date(startDate);
    let monthNumber = 1;
    let cumulativeRent = 0;

    console.log('[RentRoll] Generating rent schedule from', startDate, 'to', endDate);

    while (currentDate <= endDate) {
      const periodStart = new Date(currentDate);
      const periodEnd = new Date(currentDate);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0); // Last day of current month

      // Calculate base rent for this period
      let baseRent = this.getBaseRentForMonth(
        monthNumber,
        params.base_rent,
        params.step_rent_schedule
      );

      // Apply escalation
      const { escalationAmount, escalationDescription } = this.calculateEscalation(
        baseRent,
        monthNumber,
        params.escalation
      );

      // Check for free rent or abatements
      let totalRent = baseRent + escalationAmount;
      if (params.free_rent_months?.includes(monthNumber)) {
        totalRent = 0;
      }
      if (params.abatements) {
        const abatement = params.abatements.find(
          a => monthNumber >= a.start_month && monthNumber <= a.end_month
        );
        if (abatement) {
          totalRent = Math.max(0, totalRent - abatement.amount);
        }
      }

      cumulativeRent += totalRent;

      entries.push({
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
        month_number: monthNumber,
        base_rent: baseRent,
        escalation_amount: escalationAmount,
        total_rent: totalRent,
        cumulative_rent: cumulativeRent,
        escalation_applied: escalationDescription,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
      monthNumber++;
    }

    console.log('[RentRoll] Generated', entries.length, 'months, total rent:', cumulativeRent);

    return entries;
  }

  /**
   * Get base rent for a specific month (handles step rent)
   */
  private static getBaseRentForMonth(
    monthNumber: number,
    defaultBaseRent: number,
    stepRentSchedule?: RentScheduleEntry[]
  ): number {
    if (!stepRentSchedule || stepRentSchedule.length === 0) {
      return defaultBaseRent;
    }

    // Find the applicable rent schedule entry
    for (const entry of stepRentSchedule) {
      const startDate = new Date(entry.period_start);
      const endDate = new Date(entry.period_end);
      
      // Simple month-based matching (could be improved with actual date comparison)
      if (entry.frequency === 'monthly') {
        return entry.amount;
      }
    }

    return defaultBaseRent;
  }

  /**
   * Calculate escalation for a given month
   */
  private static calculateEscalation(
    baseRent: number,
    monthNumber: number,
    escalation?: EscalationClause
  ): { escalationAmount: number; escalationDescription?: string } {
    if (!escalation || escalation.type === 'none') {
      return { escalationAmount: 0 };
    }

    const yearNumber = Math.floor((monthNumber - 1) / 12) + 1;

    // Check if escalation is effective for this year
    if (escalation.effective_year && yearNumber < escalation.effective_year) {
      return { escalationAmount: 0 };
    }

    // Only apply escalation at the start of each year (for annual)
    if (escalation.frequency === 'annual' && (monthNumber - 1) % 12 !== 0) {
      return { escalationAmount: 0 };
    }

    let escalationAmount = 0;
    let description = '';

    switch (escalation.type) {
      case 'percentage':
        if (escalation.rate) {
          escalationAmount = baseRent * (escalation.rate / 100);
          description = `${escalation.rate}% annual increase`;
        }
        break;

      case 'fixed_dollar':
        if (escalation.rate) {
          escalationAmount = escalation.rate;
          description = `$${escalation.rate} annual increase`;
        }
        break;

      case 'cpi':
        // CPI calculation (simplified - would need real CPI data)
        const estimatedCPI = 3.0; // Placeholder: would fetch real CPI
        let cpiRate = estimatedCPI;
        if (escalation.cpi_adjustment) {
          cpiRate += escalation.cpi_adjustment;
        }
        
        // Apply cap and floor
        if (escalation.cap && cpiRate > escalation.cap) {
          cpiRate = escalation.cap;
        }
        if (escalation.floor && cpiRate < escalation.floor) {
          cpiRate = escalation.floor;
        }

        escalationAmount = baseRent * (cpiRate / 100);
        description = `CPI (${estimatedCPI}%) ${escalation.cpi_adjustment ? `+ ${escalation.cpi_adjustment}%` : ''}`;
        break;
    }

    return {
      escalationAmount: Math.round(escalationAmount * 100) / 100,
      escalationDescription: description,
    };
  }

  /**
   * Calculate annual rent totals by year
   */
  static calculateAnnualTotals(rentRoll: RentRollEntry[]): Array<{
    year: number;
    total_rent: number;
    base_rent: number;
    escalations: number;
    average_monthly: number;
  }> {
    const yearlyData = new Map<number, { total: number; base: number; escalations: number; months: number }>();

    for (const entry of rentRoll) {
      const year = new Date(entry.period_start).getFullYear();
      
      if (!yearlyData.has(year)) {
        yearlyData.set(year, { total: 0, base: 0, escalations: 0, months: 0 });
      }

      const data = yearlyData.get(year)!;
      data.total += entry.total_rent;
      data.base += entry.base_rent;
      data.escalations += entry.escalation_amount;
      data.months += 1;
    }

    const results: Array<any> = [];
    let yearNumber = 1;

    for (const [year, data] of yearlyData.entries()) {
      results.push({
        year: yearNumber++,
        calendar_year: year,
        total_rent: Math.round(data.total * 100) / 100,
        base_rent: Math.round(data.base * 100) / 100,
        escalations: Math.round(data.escalations * 100) / 100,
        average_monthly: Math.round((data.total / data.months) * 100) / 100,
        months: data.months,
      });
    }

    return results;
  }

  /**
   * Validate rent schedule matches expected totals
   */
  static validateRentSchedule(
    rentRoll: RentRollEntry[],
    expectedAnnualRent?: number,
    tolerance: number = 0.01
  ): {
    valid: boolean;
    discrepancies: string[];
    actual_total: number;
    expected_total?: number;
  } {
    const discrepancies: string[] = [];
    const actualTotal = rentRoll.reduce((sum, entry) => sum + entry.total_rent, 0);

    // Check if expected annual rent matches
    if (expectedAnnualRent) {
      const difference = Math.abs(actualTotal - expectedAnnualRent);
      const toleranceAmount = expectedAnnualRent * tolerance;

      if (difference > toleranceAmount) {
        discrepancies.push(
          `Total rent ($${actualTotal.toFixed(2)}) differs from expected ($${expectedAnnualRent.toFixed(2)}) by $${difference.toFixed(2)}`
        );
      }
    }

    // Check for negative rents
    const negativeRents = rentRoll.filter(e => e.total_rent < 0);
    if (negativeRents.length > 0) {
      discrepancies.push(`Found ${negativeRents.length} months with negative rent`);
    }

    // Check for gaps in schedule
    for (let i = 1; i < rentRoll.length; i++) {
      const prevEnd = new Date(rentRoll[i - 1].period_end);
      const currStart = new Date(rentRoll[i].period_start);
      const daysDiff = (currStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 2) { // Allow for 1-day gaps due to month boundaries
        discrepancies.push(`Gap detected between month ${i} and ${i + 1}`);
      }
    }

    return {
      valid: discrepancies.length === 0,
      discrepancies,
      actual_total: actualTotal,
      expected_total: expectedAnnualRent,
    };
  }

  /**
   * Export rent roll to CSV format
   */
  static exportToCSV(rentRoll: RentRollEntry[]): string {
    const headers = [
      'Month',
      'Period Start',
      'Period End',
      'Base Rent',
      'Escalation',
      'Total Rent',
      'Cumulative Rent',
      'Escalation Note'
    ];

    const rows = rentRoll.map(entry => [
      entry.month_number,
      entry.period_start,
      entry.period_end,
      entry.base_rent.toFixed(2),
      entry.escalation_amount.toFixed(2),
      entry.total_rent.toFixed(2),
      entry.cumulative_rent.toFixed(2),
      entry.escalation_applied || ''
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }
}
