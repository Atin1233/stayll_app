/**
 * STAYLL v5.0 - Lease Storage Service
 * Updated for multi-tenant architecture and v5.0 schema
 */

import { supabase } from '@/lib/supabase';
import { OrganizationService } from './organization';
import { AuditService } from './audit';
import type { Lease, LeaseUploadRequest, VerificationStatus } from '@/types/v5.0';

export class LeaseStorageService {
  /**
   * Upload a lease file and create database record
   */
  static async uploadLease(data: LeaseUploadRequest): Promise<{ 
    success: boolean; 
    lease?: Lease; 
    job_id?: string;
    extraction?: any;
    error?: string 
  }> {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.property_address) {
        formData.append('property_address', data.property_address);
      }
      if (data.tenant_name) {
        formData.append('tenant_name', data.tenant_name);
      }
      if (data.portfolio_tag) {
        formData.append('portfolio_tag', data.portfolio_tag);
      }

      const response = await fetch('/api/v5/leases/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Upload failed' };
      }

      return { 
        success: true, 
        lease: result.lease,
        job_id: result.job_id,
        extraction: result.extraction
      };
    } catch (error) {
      console.error('Lease upload error:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  /**
   * Fetch all leases for the current organization
   */
  static async fetchLeases(options?: {
    status?: VerificationStatus;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ success: boolean; leases?: Lease[]; count?: number; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (options?.status) params.append('status', options.status);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      if (options?.search) params.append('search', options.search);

      const response = await fetch(`/api/v5/leases?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Fetch failed' };
      }

      return { 
        success: true, 
        leases: result.leases || [],
        count: result.count || 0
      };
    } catch (error) {
      console.error('Fetch leases error:', error);
      return { success: false, error: 'Fetch failed' };
    }
  }

  /**
   * Get a single lease by ID
   */
  static async getLease(leaseId: string): Promise<{ 
    success: boolean; 
    lease?: Lease; 
    error?: string 
  }> {
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
        .single();

      if (error || !lease) {
        return { success: false, error: 'Lease not found' };
      }

      // Verify user has access via organization
      const orgResult = await OrganizationService.getCurrentOrganization();
      if (!orgResult.success || orgResult.organization?.id !== lease.org_id) {
        return { success: false, error: 'Access denied' };
      }

      return { success: true, lease };
    } catch (error) {
      console.error('Get lease error:', error);
      return { success: false, error: 'Fetch failed' };
    }
  }

  /**
   * Delete a lease and its associated file
   */
  static async deleteLease(leaseId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Authentication required' };
      }

      // Get lease to verify ownership and get file info
      const { data: lease, error: leaseError } = await supabase
        .from('leases')
        .select('file_key, org_id')
        .eq('id', leaseId)
        .single();

      if (leaseError || !lease) {
        return { success: false, error: 'Lease not found' };
      }

      // Verify organization access
      const orgResult = await OrganizationService.getCurrentOrganization();
      if (!orgResult.success || orgResult.organization?.id !== lease.org_id) {
        return { success: false, error: 'Access denied' };
      }

      // Delete the lease record (cascading deletes will handle related records)
      const { error: deleteError } = await supabase
        .from('leases')
        .delete()
        .eq('id', leaseId);

      if (deleteError) {
        return { success: false, error: 'Failed to delete lease' };
      }

      // Delete file from storage if file_key exists
      if (lease.file_key) {
        try {
          await supabase.storage
            .from('leases')
            .remove([lease.file_key]);
        } catch (storageError) {
          console.error('Storage delete error:', storageError);
          // Don't fail the request if file deletion fails
        }
      }

      // Log audit event
      await AuditService.logEvent({
        org_id: lease.org_id,
        lease_id: leaseId,
        event_type: 'UPLOAD', // Using UPLOAD as event type for deletion (or create new type)
        payload: { action: 'delete' }
      });

      return { success: true };
    } catch (error) {
      console.error('Delete lease error:', error);
      return { success: false, error: 'Delete failed' };
    }
  }

  /**
   * Update lease information
   */
  static async updateLease(
    leaseId: string, 
    updates: Partial<Lease>
  ): Promise<{ success: boolean; lease?: Lease; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Authentication required' };
      }

      // Get lease to verify ownership
      const { data: existingLease } = await supabase
        .from('leases')
        .select('org_id')
        .eq('id', leaseId)
        .single();

      if (!existingLease) {
        return { success: false, error: 'Lease not found' };
      }

      // Verify organization access
      const orgResult = await OrganizationService.getCurrentOrganization();
      if (!orgResult.success || orgResult.organization?.id !== existingLease.org_id) {
        return { success: false, error: 'Access denied' };
      }

      const { data: lease, error } = await supabase
        .from('leases')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', leaseId)
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

