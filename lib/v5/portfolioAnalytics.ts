/**
 * STAYLL v5.0 - Portfolio Analytics Service
 * Rent roll, exposure calculations, and portfolio insights
 */

import { supabase } from '@/lib/supabase';
import type { LeaseSchema } from '@/types/leaseSchema';
import type { Lease } from '@/types/v5.0';

export interface RentRollEntry {
  lease_id: string;
  tenant_name?: string;
  property_address?: string;
  year: number;
  annual_rent: number;
  monthly_rent: number;
  escalations: number;
  cam: number;
  taxes: number;
  insurance: number;
  total_annual: number;
  total_monthly: number;
}

export interface PortfolioRentRoll {
  year: number;
  total_annual_rent: number;
  total_monthly_rent: number;
  lease_count: number;
  entries: RentRollEntry[];
}

export interface PortfolioExposure {
  total_contractual_rent: number;
  total_annual_rent: number;
  lease_count: number;
  average_lease_value: number;
  exposure_by_year: Record<number, number>;
  exposure_by_property: Record<string, number>;
}

export class PortfolioAnalyticsService {
  /**
   * Generate rent roll for a portfolio
   */
  static async generateRentRoll(
    orgId: string,
    year?: number
  ): Promise<{
    success: boolean;
    rentRoll?: PortfolioRentRoll;
    error?: string;
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const targetYear = year || new Date().getFullYear();

      // Get all leases for organization
      const { data: leases, error } = await supabase
        .from('leases')
        .select('*')
        .eq('org_id', orgId)
        .eq('verification_status', 'verified'); // Only verified leases

      if (error) {
        return { success: false, error: 'Failed to fetch leases' };
      }

      // Get all lease fields
      const leaseIds = (leases || []).map(l => l.id);
      const { data: fields } = await supabase
        .from('lease_fields')
        .select('*')
        .in('lease_id', leaseIds);

      // Calculate rent roll entries
      const entries: RentRollEntry[] = [];

      for (const lease of leases || []) {
        const leaseFields = (fields || []).filter(f => f.lease_id === lease.id);
        const rentEntry = this.calculateLeaseRentForYear(lease, leaseFields, targetYear);

        if (rentEntry) {
          entries.push(rentEntry);
        }
      }

      // Calculate totals
      const total_annual_rent = entries.reduce((sum, e) => sum + e.annual_rent, 0);
      const total_monthly_rent = entries.reduce((sum, e) => sum + e.monthly_rent, 0);

      return {
        success: true,
        rentRoll: {
          year: targetYear,
          total_annual_rent,
          total_monthly_rent,
          lease_count: entries.length,
          entries
        }
      };
    } catch (error) {
      console.error('Generate rent roll error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Calculate lease rent for a specific year
   */
  private static calculateLeaseRentForYear(
    lease: Lease,
    fields: any[],
    year: number
  ): RentRollEntry | null {
    // Get base rent
    const baseRentField = fields.find(f => f.field_name === 'base_rent');
    const baseRent = baseRentField?.value_normalized?.numeric || lease.base_rent || 0;

    // Get rent schedule if available
    const rentSchedule = lease.rent_schedule || [];

    // Calculate annual rent for the year
    let annualRent = 0;
    let monthlyRent = 0;

    if (rentSchedule.length > 0) {
      // Use rent schedule
      for (const entry of rentSchedule) {
        const entryStart = new Date(entry.period_start);
        const entryEnd = new Date(entry.period_end);
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);

        // Check if entry overlaps with target year
        if (entryStart <= yearEnd && entryEnd >= yearStart) {
          const overlapStart = entryStart > yearStart ? entryStart : yearStart;
          const overlapEnd = entryEnd < yearEnd ? entryEnd : yearEnd;
          const months = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

          if (entry.frequency === 'monthly') {
            annualRent += entry.amount * months;
          } else if (entry.frequency === 'quarterly') {
            annualRent += entry.amount * (months / 3);
          } else if (entry.frequency === 'annual') {
            annualRent += entry.amount * (months / 12);
          }
        }
      }
    } else {
      // Use base rent (assume monthly)
      annualRent = baseRent * 12;
    }

    monthlyRent = annualRent / 12;

    // Get additional rent components
    const camField = fields.find(f => f.field_name.includes('cam'));
    const cam = camField?.value_normalized?.numeric || 0;

    const taxesField = fields.find(f => f.field_name.includes('tax'));
    const taxes = taxesField?.value_normalized?.numeric || 0;

    const insuranceField = fields.find(f => f.field_name.includes('insurance'));
    const insurance = insuranceField?.value_normalized?.numeric || 0;

    // Calculate escalations (simplified - would need escalation logic)
    const escalations = 0; // TODO: Calculate from escalation fields

    const total_annual = annualRent + (cam * 12) + (taxes * 12) + (insurance * 12);
    const total_monthly = total_annual / 12;

    return {
      lease_id: lease.id,
      tenant_name: lease.tenant_name || undefined,
      property_address: lease.property_address || undefined,
      year,
      annual_rent: annualRent,
      monthly_rent: monthlyRent,
      escalations,
      cam: cam * 12, // Annual CAM
      taxes: taxes * 12, // Annual taxes
      insurance: insurance * 12, // Annual insurance
      total_annual,
      total_monthly
    };
  }

  /**
   * Calculate portfolio exposure
   */
  static async calculateExposure(
    orgId: string
  ): Promise<{
    success: boolean;
    exposure?: PortfolioExposure;
    error?: string;
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      // Get all leases
      const { data: leases, error } = await supabase
        .from('leases')
        .select('*')
        .eq('org_id', orgId)
        .eq('verification_status', 'verified');

      if (error) {
        return { success: false, error: 'Failed to fetch leases' };
      }

      // Get all lease fields
      const leaseIds = (leases || []).map(l => l.id);
      const { data: fields } = await supabase
        .from('lease_fields')
        .select('*')
        .in('lease_id', leaseIds);

      let total_contractual_rent = 0;
      const exposure_by_year: Record<number, number> = {};
      const exposure_by_property: Record<string, number> = {};

      const currentYear = new Date().getFullYear();
      const futureYears = 10; // Calculate exposure for next 10 years

      for (const lease of leases || []) {
        const leaseFields = (fields || []).filter(f => f.lease_id === lease.id);
        
        // Calculate lease value
        const baseRent = lease.base_rent || 0;
        const annualRent = baseRent * 12;

        // Get lease term
        const startField = leaseFields.find(f => f.field_name === 'lease_start');
        const endField = leaseFields.find(f => f.field_name === 'lease_end');

        if (startField?.value_normalized?.date && endField?.value_normalized?.date) {
          const startDate = new Date(startField.value_normalized.date);
          const endDate = new Date(endField.value_normalized.date);
          
          // Calculate total contractual rent
          const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
          total_contractual_rent += annualRent * years;

          // Calculate exposure by year
          for (let year = currentYear; year <= currentYear + futureYears; year++) {
            const yearStart = new Date(year, 0, 1);
            const yearEnd = new Date(year, 11, 31);

            if (startDate <= yearEnd && endDate >= yearStart) {
              exposure_by_year[year] = (exposure_by_year[year] || 0) + annualRent;
            }
          }
        }

        // Group by property
        const property = lease.property_address || 'Unknown';
        exposure_by_property[property] = (exposure_by_property[property] || 0) + annualRent;
      }

      const lease_count = leases?.length || 0;
      const average_lease_value = lease_count > 0 ? total_contractual_rent / lease_count : 0;

      // Calculate total annual rent (current year)
      const total_annual_rent = exposure_by_year[currentYear] || 0;

      return {
        success: true,
        exposure: {
          total_contractual_rent,
          total_annual_rent,
          lease_count,
          average_lease_value,
          exposure_by_year,
          exposure_by_property
        }
      };
    } catch (error) {
      console.error('Calculate exposure error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export rent roll to CSV
   */
  static exportRentRollToCSV(rentRoll: PortfolioRentRoll): string {
    const headers = [
      'Lease ID',
      'Tenant Name',
      'Property Address',
      'Year',
      'Annual Rent',
      'Monthly Rent',
      'Escalations',
      'CAM',
      'Taxes',
      'Insurance',
      'Total Annual',
      'Total Monthly'
    ];

    const rows = rentRoll.entries.map(entry => [
      entry.lease_id,
      entry.tenant_name || '',
      entry.property_address || '',
      entry.year.toString(),
      entry.annual_rent.toFixed(2),
      entry.monthly_rent.toFixed(2),
      entry.escalations.toFixed(2),
      entry.cam.toFixed(2),
      entry.taxes.toFixed(2),
      entry.insurance.toFixed(2),
      entry.total_annual.toFixed(2),
      entry.total_monthly.toFixed(2)
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }
}

