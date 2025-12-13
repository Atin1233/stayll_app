import { supabase } from './supabase';
import { SessionStorageService } from './sessionStorage';

export interface LeaseUploadData {
  file: File;
  propertyAddress?: string;
  tenantName?: string;
}

export interface LeaseRecord {
  id: string;
  user_id?: string;
  tenant_name: string | null;
  property_address: string | null;
  monthly_rent: string | null;
  lease_start: string | null;
  lease_end: string | null;
  due_date?: string;
  late_fee: string | null;
  security_deposit: string | null;
  utilities?: string;
  parking?: string;
  pets?: string;
  smoking?: string;
  file_url?: string;
  file_name: string;
  file_size: number;
  confidence_score?: number;
  analysis_data?: any;
  portfolio_impact?: any;
  compliance_assessment?: any;
  strategic_recommendations?: any;
  created_at: string;
  updated_at: string;
}

export interface LeaseAnalysisData {
  leaseId: string;
  analysisData: any;
}

export class LeaseStorageService {
  /**
   * Upload a lease file and create a database record
   */
  static async uploadLease(data: LeaseUploadData): Promise<{ success: boolean; lease?: LeaseRecord; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.propertyAddress) {
        formData.append('propertyAddress', data.propertyAddress);
      }
      if (data.tenantName) {
        formData.append('tenantName', data.tenantName);
      }

      // Use test endpoint for session-based storage
      const endpoint = '/api/test-upload';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Upload failed' };
      }

      // Store in session storage
      const lease = result.lease;
      SessionStorageService.addLease(lease);

      return { success: true, lease };
    } catch (error) {
      console.error('Lease upload error:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  /**
   * Save analysis results to a lease
   */
  static async saveAnalysis(data: LeaseAnalysisData): Promise<{ success: boolean; lease?: LeaseRecord; error?: string }> {
    try {
      const response = await fetch('/api/analyze-lease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Analysis save failed' };
      }

      return { success: true, lease: result.lease };
    } catch (error) {
      console.error('Analysis save error:', error);
      return { success: false, error: 'Analysis save failed' };
    }
  }

  /**
   * Fetch all leases for the current user
   */
  static async fetchLeases(options?: {
    propertyAddress?: string;
    tenantName?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; leases?: LeaseRecord[]; count?: number; error?: string }> {
    try {
      // Fetch from session storage
      const { leases, count } = SessionStorageService.searchLeases(options);

      return { 
        success: true, 
        leases,
        count
      };
    } catch (error) {
      console.error('Fetch leases error:', error);
      return { success: false, error: 'Fetch failed' };
    }
  }

  /**
   * Delete a lease and its associated file
   */
  static async deleteLease(leaseId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete from session storage
      const deleted = SessionStorageService.deleteLease(leaseId);
      
      if (!deleted) {
        return { success: false, error: 'Lease not found' };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete lease error:', error);
      return { success: false, error: 'Delete failed' };
    }
  }

  /**
   * Get a single lease by ID
   */
  static async getLease(leaseId: string): Promise<{ success: boolean; lease?: LeaseRecord; error?: string }> {
    try {
      // Get from session storage
      const lease = SessionStorageService.getLease(leaseId);
      
      if (!lease) {
        return { success: false, error: 'Lease not found' };
      }

      return { success: true, lease };
    } catch (error) {
      console.error('Get lease error:', error);
      return { success: false, error: 'Fetch failed' };
    }
  }

  /**
   * Update lease information
   */
  static async updateLease(leaseId: string, updates: Partial<LeaseRecord>): Promise<{ success: boolean; lease?: LeaseRecord; error?: string }> {
    try {
      // Update in session storage
      const lease = SessionStorageService.updateLease(leaseId, updates);
      
      if (!lease) {
        return { success: false, error: 'Lease not found' };
      }

      return { success: true, lease };
    } catch (error) {
      console.error('Update lease error:', error);
      return { success: false, error: 'Update failed' };
    }
  }
} 