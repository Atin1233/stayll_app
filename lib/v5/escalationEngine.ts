/**
 * STAYLL v5.0 - Escalation Projection Engine
 * 5-year cashflow projection with CPI, percentage, and fixed escalations
 */

import type { EscalationClause } from './rentRollEngine';

export interface ProjectionYear {
  year: number;
  annual_rent: number;
  escalation_rate: number;
  escalation_amount: number;
  cumulative_rent: number;
  notes?: string;
}

export interface ProjectionParams {
  current_rent: number;
  start_year: number;
  escalation: EscalationClause;
  projection_years?: number; // Default 5
  historical_cpi?: number[]; // For CPI projections
}

export class EscalationEngine {
  /**
   * Project future rent for next N years
   */
  static projectEscalation(params: ProjectionParams): ProjectionYear[] {
    const years = params.projection_years || 5;
    const projections: ProjectionYear[] = [];
    
    let currentRent = params.current_rent;
    let cumulativeRent = 0;

    console.log('[Escalation] Projecting', years, 'years from rent:', currentRent);

    for (let year = 1; year <= years; year++) {
      const { escalationRate, escalationAmount, notes } = this.calculateYearEscalation(
        currentRent,
        year,
        params.escalation,
        params.historical_cpi
      );

      const newRent = currentRent + escalationAmount;
      const annualRent = newRent * 12; // Monthly to annual
      cumulativeRent += annualRent;

      projections.push({
        year: params.start_year + year - 1,
        annual_rent: Math.round(annualRent * 100) / 100,
        escalation_rate: escalationRate,
        escalation_amount: escalationAmount,
        cumulative_rent: Math.round(cumulativeRent * 100) / 100,
        notes,
      });

      // Update current rent for compounding
      if (params.escalation.type === 'percentage' || params.escalation.type === 'cpi') {
        currentRent = newRent;
      } else if (params.escalation.type === 'fixed_dollar') {
        // Fixed dollar doesn't compound
        currentRent += escalationAmount;
      }
    }

    console.log('[Escalation] Projected total over', years, 'years:', cumulativeRent);

    return projections;
  }

  /**
   * Calculate escalation for a specific year
   */
  private static calculateYearEscalation(
    baseRent: number,
    year: number,
    escalation: EscalationClause,
    historicalCPI?: number[]
  ): { escalationRate: number; escalationAmount: number; notes: string } {
    let escalationRate = 0;
    let escalationAmount = 0;
    let notes = '';

    switch (escalation.type) {
      case 'percentage':
        if (escalation.rate) {
          escalationRate = escalation.rate;
          escalationAmount = baseRent * (escalation.rate / 100);
          notes = `${escalation.rate}% annual increase (compounding)`;
        }
        break;

      case 'fixed_dollar':
        if (escalation.rate) {
          escalationAmount = escalation.rate;
          escalationRate = (escalation.rate / baseRent) * 100;
          notes = `$${escalation.rate} fixed annual increase`;
        }
        break;

      case 'cpi':
        const cpiRate = this.estimateCPI(year, historicalCPI);
        let adjustedCPI = cpiRate;
        
        if (escalation.cpi_adjustment) {
          adjustedCPI += escalation.cpi_adjustment;
        }

        // Apply cap and floor
        if (escalation.cap && adjustedCPI > escalation.cap) {
          adjustedCPI = escalation.cap;
          notes = `CPI ${cpiRate.toFixed(2)}% capped at ${escalation.cap}%`;
        } else if (escalation.floor && adjustedCPI < escalation.floor) {
          adjustedCPI = escalation.floor;
          notes = `CPI ${cpiRate.toFixed(2)}% floored at ${escalation.floor}%`;
        } else {
          notes = `CPI ${cpiRate.toFixed(2)}%${escalation.cpi_adjustment ? ` + ${escalation.cpi_adjustment}%` : ''}`;
        }

        escalationRate = adjustedCPI;
        escalationAmount = baseRent * (adjustedCPI / 100);
        break;

      case 'none':
      default:
        notes = 'No escalation';
        break;
    }

    return {
      escalationRate: Math.round(escalationRate * 100) / 100,
      escalationAmount: Math.round(escalationAmount * 100) / 100,
      notes,
    };
  }

  /**
   * Estimate CPI for future year based on historical data
   * Uses simple moving average or default to 2.5%
   */
  private static estimateCPI(year: number, historicalCPI?: number[]): number {
    if (historicalCPI && historicalCPI.length > 0) {
      // Use moving average of historical CPI
      const sum = historicalCPI.reduce((a, b) => a + b, 0);
      return sum / historicalCPI.length;
    }

    // Default CPI estimate (conservative)
    // Typically CPI is 2-4%, we'll use 2.5% as baseline
    return 2.5;
  }

  /**
   * Compare different escalation scenarios
   */
  static compareScenarios(
    baseRent: number,
    startYear: number,
    scenarios: Array<{ name: string; escalation: EscalationClause }>
  ): {
    scenarios: Array<{
      name: string;
      projections: ProjectionYear[];
      total_5_year: number;
      average_annual: number;
    }>;
    comparison: {
      best: string;
      worst: string;
      difference: number;
    };
  } {
    const results = scenarios.map(scenario => {
      const projections = this.projectEscalation({
        current_rent: baseRent,
        start_year: startYear,
        escalation: scenario.escalation,
        projection_years: 5,
      });

      const total = projections[projections.length - 1].cumulative_rent;
      const average = total / 5;

      return {
        name: scenario.name,
        projections,
        total_5_year: total,
        average_annual: average,
      };
    });

    // Find best and worst scenarios
    results.sort((a, b) => b.total_5_year - a.total_5_year);
    const best = results[0];
    const worst = results[results.length - 1];
    const difference = best.total_5_year - worst.total_5_year;

    return {
      scenarios: results,
      comparison: {
        best: best.name,
        worst: worst.name,
        difference: Math.round(difference * 100) / 100,
      },
    };
  }

  /**
   * Calculate NPV (Net Present Value) of rent stream
   */
  static calculateNPV(
    projections: ProjectionYear[],
    discountRate: number = 0.05 // 5% default
  ): number {
    let npv = 0;

    for (let i = 0; i < projections.length; i++) {
      const yearRent = projections[i].annual_rent;
      const discountFactor = Math.pow(1 + discountRate, i + 1);
      npv += yearRent / discountFactor;
    }

    return Math.round(npv * 100) / 100;
  }

  /**
   * Calculate effective escalation rate over period
   */
  static calculateEffectiveRate(
    initialRent: number,
    finalRent: number,
    years: number
  ): number {
    // CAGR formula: (Final/Initial)^(1/years) - 1
    const rate = Math.pow(finalRent / initialRent, 1 / years) - 1;
    return Math.round(rate * 10000) / 100; // Return as percentage
  }

  /**
   * Generate visualization data for charts
   */
  static generateChartData(projections: ProjectionYear[]): {
    labels: string[];
    rent_values: number[];
    escalation_values: number[];
    cumulative_values: number[];
  } {
    return {
      labels: projections.map(p => `Year ${p.year}`),
      rent_values: projections.map(p => p.annual_rent),
      escalation_values: projections.map(p => p.escalation_amount * 12), // Annualized
      cumulative_values: projections.map(p => p.cumulative_rent),
    };
  }

  /**
   * Parse escalation clause from text
   */
  static parseEscalationClause(text: string): EscalationClause {
    const textLower = text.toLowerCase();

    // Check for CPI
    if (textLower.includes('cpi') || textLower.includes('consumer price index')) {
      const cpiMatch = text.match(/cpi\s*\+?\s*(\d+(?:\.\d+)?)\s*%/i);
      const adjustment = cpiMatch ? parseFloat(cpiMatch[1]) : 0;
      
      const capMatch = text.match(/cap(?:ped)?\s+(?:at\s+)?(\d+(?:\.\d+)?)\s*%/i);
      const floorMatch = text.match(/floor\s+(?:at\s+)?(\d+(?:\.\d+)?)\s*%/i);

      return {
        type: 'cpi',
        cpi_adjustment: adjustment,
        cap: capMatch ? parseFloat(capMatch[1]) : undefined,
        floor: floorMatch ? parseFloat(floorMatch[1]) : undefined,
        frequency: 'annual',
      };
    }

    // Check for percentage
    const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
    if (percentMatch) {
      return {
        type: 'percentage',
        rate: parseFloat(percentMatch[1]),
        frequency: 'annual',
      };
    }

    // Check for fixed dollar
    const dollarMatch = text.match(/\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (dollarMatch) {
      return {
        type: 'fixed_dollar',
        rate: parseFloat(dollarMatch[1].replace(/,/g, '')),
        frequency: 'annual',
      };
    }

    // No escalation found
    return {
      type: 'none',
    };
  }

  /**
   * Export projection to CSV
   */
  static exportProjectionCSV(projections: ProjectionYear[]): string {
    const headers = [
      'Year',
      'Annual Rent',
      'Escalation Rate (%)',
      'Escalation Amount',
      'Cumulative Rent',
      'Notes'
    ];

    const rows = projections.map(p => [
      p.year,
      p.annual_rent.toFixed(2),
      p.escalation_rate.toFixed(2),
      p.escalation_amount.toFixed(2),
      p.cumulative_rent.toFixed(2),
      p.notes || ''
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }
}
