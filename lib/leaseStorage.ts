import { supabase } from './supabase';

export interface LeaseUploadData {
  file: File;
  propertyAddress?: string;
  tenantName?: string;
}

export interface LeaseRecord {
  id: string;
  user_id: string;
  tenant_name: string;
  property_address: string;
  monthly_rent: string;
  lease_start: string;
  lease_end: string;
  due_date: string;
  late_fee: string;
  security_deposit: string;
  utilities: string;
  parking: string;
  pets: string;
  smoking: string;
  file_url: string;
  file_name: string;
  file_size: number;
  confidence_score: number;
  analysis_data: any;
  portfolio_impact: any;
  compliance_assessment: any;
  strategic_recommendations: any;
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

      const response = await fetch('/api/upload-lease', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Upload failed' };
      }

      return { success: true, lease: result.lease };
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
      const params = new URLSearchParams();
      if (options?.propertyAddress) params.append('propertyAddress', options.propertyAddress);
      if (options?.tenantName) params.append('tenantName', options.tenantName);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`/api/leases?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Fetch failed' };
      }

      return { 
        success: true, 
        leases: result.leases,
        count: result.count
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
      const response = await fetch('/api/leases', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leaseId }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Delete failed' };
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
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: lease, error } = await supabase
        .from('leases')
        .select('*')
        .eq('id', leaseId)
        .eq('user_id', user.id)
        .single();

      if (error || !lease) {
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
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: lease, error } = await supabase
        .from('leases')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', leaseId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error || !lease) {
        return { success: false, error: 'Update failed' };
      }

      return { success: true, lease };
    } catch (error) {
      console.error('Update lease error:', error);
      return { success: false, error: 'Update failed' };
    }
  }
} 