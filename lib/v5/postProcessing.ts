/**
 * STAYLL v5.0 - Deterministic Post-Processing
 * Normalize dates, money, escalations after extraction
 */

import type { LeaseField } from '@/types/v5.0';
import type { RentScheduleEntry, Escalation } from '@/types/leaseSchema';

export class PostProcessingService {
  /**
   * Normalize date to ISO format (YYYY-MM-DD)
   */
  static normalizeDate(dateString: string | null | undefined): string | null {
    if (!dateString) return null;

    try {
      // Try common date formats
      const formats = [
        /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/, // MM/DD/YYYY or DD/MM/YYYY
        /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/, // YYYY-MM-DD
        /(\w+)\s+(\d{1,2}),\s+(\d{4})/, // Month DD, YYYY
      ];

      for (const format of formats) {
        const match = dateString.match(format);
        if (match) {
          let year: number, month: number, day: number;

          if (format === formats[0]) {
            // MM/DD/YYYY or DD/MM/YYYY - assume MM/DD/YYYY for US leases
            month = parseInt(match[1], 10);
            day = parseInt(match[2], 10);
            year = parseInt(match[3], 10);
            if (year < 100) year += 2000;
          } else if (format === formats[1]) {
            // YYYY-MM-DD
            year = parseInt(match[1], 10);
            month = parseInt(match[2], 10);
            day = parseInt(match[3], 10);
          } else {
            // Month DD, YYYY
            const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
              'july', 'august', 'september', 'october', 'november', 'december'];
            month = monthNames.indexOf(match[1].toLowerCase()) + 1;
            day = parseInt(match[2], 10);
            year = parseInt(match[3], 10);
          }

          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }

      // Fallback: try Date constructor
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Date normalization error:', error);
    }

    return null;
  }

  /**
   * Convert money string to normalized number
   */
  static normalizeMoney(moneyString: string | null | undefined): number | null {
    if (!moneyString) return null;

    try {
      // Remove currency symbols and commas
      const cleaned = moneyString.replace(/[$,\s]/g, '');
      const parsed = parseFloat(cleaned);
      
      if (!isNaN(parsed) && parsed >= 0) {
        return parsed;
      }
    } catch (error) {
      console.error('Money normalization error:', error);
    }

    return null;
  }

  /**
   * Parse rent unit (e.g., "$30/sf/year" → {amount_per_sf_per_year: 30})
   */
  static parseRentUnit(text: string): {
    amount?: number;
    per_sf?: boolean;
    frequency?: 'monthly' | 'quarterly' | 'annual';
    per_sf_amount?: number;
  } | null {
    if (!text) return null;

    const lowerText = text.toLowerCase();
    
    // Pattern: $X per square foot per year
    const perSfYearMatch = text.match(/\$?([0-9,]+(?:\.[0-9]{2})?)\s*per\s*(?:square\s*)?foot\s*per\s*(?:year|annum)/i);
    if (perSfYearMatch) {
      const amount = this.normalizeMoney(perSfYearMatch[1]);
      if (amount !== null) {
        return {
          per_sf: true,
          frequency: 'annual',
          per_sf_amount: amount
        };
      }
    }

    // Pattern: $X per square foot per month
    const perSfMonthMatch = text.match(/\$?([0-9,]+(?:\.[0-9]{2})?)\s*per\s*(?:square\s*)?foot\s*per\s*month/i);
    if (perSfMonthMatch) {
      const amount = this.normalizeMoney(perSfMonthMatch[1]);
      if (amount !== null) {
        return {
          per_sf: true,
          frequency: 'monthly',
          per_sf_amount: amount
        };
      }
    }

    // Pattern: $X per month
    const perMonthMatch = text.match(/\$?([0-9,]+(?:\.[0-9]{2})?)\s*per\s*month/i);
    if (perMonthMatch) {
      const amount = this.normalizeMoney(perMonthMatch[1]);
      if (amount !== null) {
        return {
          amount,
          frequency: 'monthly',
          per_sf: false
        };
      }
    }

    // Pattern: $X per year
    const perYearMatch = text.match(/\$?([0-9,]+(?:\.[0-9]{2})?)\s*per\s*(?:year|annum)/i);
    if (perYearMatch) {
      const amount = this.normalizeMoney(perYearMatch[1]);
      if (amount !== null) {
        return {
          amount,
          frequency: 'annual',
          per_sf: false
        };
      }
    }

    return null;
  }

  /**
   * Parse escalation text (e.g., "3% annually" → structured escalation)
   */
  static parseEscalation(text: string): Escalation | null {
    if (!text) return null;

    const lowerText = text.toLowerCase();

    // Pattern: X% annually/quarterly/monthly
    const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*(annually|quarterly|monthly|per\s*year|per\s*quarter|per\s*month)/i);
    if (percentMatch) {
      const percent = parseFloat(percentMatch[1]);
      const freqText = percentMatch[2].toLowerCase();
      
      let frequency: Escalation['frequency'] = 'annual';
      if (freqText.includes('quarter')) frequency = 'quarterly';
      else if (freqText.includes('month')) frequency = 'monthly';
      else frequency = 'annual';

      // Check for cap/floor
      const capMatch = text.match(/(?:cap|maximum|max)\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*%/i);
      const floorMatch = text.match(/(?:floor|minimum|min)\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*%/i);

      return {
        type: 'percent',
        value: percent,
        frequency,
        cap: capMatch ? parseFloat(capMatch[1]) : undefined,
        floor: floorMatch ? parseFloat(floorMatch[1]) : undefined
      };
    }

    // Pattern: $X per square foot per year
    const fixedPerSfMatch = text.match(/\$?([0-9,]+(?:\.[0-9]{2})?)\s*per\s*(?:square\s*)?foot\s*per\s*(?:year|annum)/i);
    if (fixedPerSfMatch) {
      const amount = this.normalizeMoney(fixedPerSfMatch[1]);
      if (amount !== null) {
        return {
          type: 'fixed',
          value: amount,
          frequency: 'annual'
        };
      }
    }

    // Pattern: CPI/PPI index
    if (lowerText.includes('cpi') || lowerText.includes('consumer price index')) {
      const capMatch = text.match(/(?:cap|maximum|max)\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*%/i);
      const floorMatch = text.match(/(?:floor|minimum|min)\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*%/i);

      return {
        type: 'index',
        value: 0, // Will be calculated from actual index
        frequency: 'annual',
        index_type: 'cpi',
        cap: capMatch ? parseFloat(capMatch[1]) : undefined,
        floor: floorMatch ? parseFloat(floorMatch[1]) : undefined
      };
    }

    return null;
  }

  /**
   * Convert per-sf rent to monthly total
   */
  static convertPerSfToMonthly(
    perSfAmount: number,
    squareFeet: number,
    frequency: 'monthly' | 'quarterly' | 'annual'
  ): number {
    let annualAmount = 0;
    
    if (frequency === 'annual') {
      annualAmount = perSfAmount * squareFeet;
    } else if (frequency === 'quarterly') {
      annualAmount = perSfAmount * squareFeet * 4;
    } else if (frequency === 'monthly') {
      annualAmount = perSfAmount * squareFeet * 12;
    }

    return annualAmount / 12; // Monthly total
  }

  /**
   * Normalize currency to USD (if needed)
   */
  static normalizeCurrency(amount: number, currency?: string): number {
    // For now, assume USD - in production, would use exchange rate API
    if (!currency || currency.toUpperCase() === 'USD') {
      return amount;
    }
    
    // TODO: Integrate exchange rate service
    return amount;
  }

  /**
   * Post-process extracted fields
   */
  static postProcessFields(fields: LeaseField[]): LeaseField[] {
    return fields.map(field => {
      const processed = { ...field };

      // Normalize dates
      if (field.field_name.includes('date') || field.field_name.includes('_start') || field.field_name.includes('_end')) {
        if (field.value_text) {
          const normalizedDate = this.normalizeDate(field.value_text);
          if (normalizedDate) {
            processed.value_normalized = {
              ...processed.value_normalized,
              date: normalizedDate
            };
          }
        }
      }

      // Normalize money
      if (field.field_name.includes('rent') || field.field_name.includes('amount') || field.field_name.includes('fee')) {
        if (field.value_text) {
          const normalizedMoney = this.normalizeMoney(field.value_text);
          if (normalizedMoney !== null) {
            processed.value_normalized = {
              ...processed.value_normalized,
              numeric: normalizedMoney
            };
          }
        }
      }

      return processed;
    });
  }
}

