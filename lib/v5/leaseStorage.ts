/**
 * STAYLL v5.0 - Lease Storage Service
 * Updated for multi-tenant architecture and v5.0 schema
 */

import { supabase } from '@/lib/supabase';
import { SessionStorageService } from '@/lib/sessionStorage';
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
      // Use v5 endpoint (will handle test mode automatically)
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

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        return { success: false, error: errorMessage };
      }

      // Parse JSON response
      let result;
      try {
        const text = await response.text();
        if (!text) {
          return { success: false, error: 'Empty response from server' };
        }
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return { success: false, error: 'Invalid response from server' };
      }

      if (!result.success) {
        return { success: false, error: result.error || 'Upload failed' };
      }

      // Store in session storage
      const lease = result.lease;
      console.log('[v5/leaseStorage] Storing lease in session storage:', lease.id);
      SessionStorageService.addLease(lease);

      // Extract data from PDF if we have file_data
      if (lease.file_data) {
        console.log('[v5/leaseStorage] Lease has file_data, starting extraction...');
        try {
          const extractFormData = new FormData();
          extractFormData.append('fileData', lease.file_data);
          
          console.log('[v5/leaseStorage] Calling /api/extract-lease...');
          const extractResponse = await fetch('/api/extract-lease', {
            method: 'POST',
            body: extractFormData,
          });
          
          const extractResult = await extractResponse.json();
          console.log('[v5/leaseStorage] Extraction result:', extractResult);
          
          if (extractResult.success && extractResult.extracted) {
            console.log('[v5/leaseStorage] Extraction successful! Extracted data:', extractResult.extracted);
            
            // Update lease with extracted data
            const updatedLease = {
              ...lease,
              property_address: extractResult.extracted.property_address || lease.property_address,
              tenant_name: extractResult.extracted.tenant_name || lease.tenant_name,
              monthly_rent: extractResult.extracted.monthly_rent,
              lease_start: extractResult.extracted.lease_start,
              lease_end: extractResult.extracted.lease_end,
              security_deposit: extractResult.extracted.security_deposit,
              late_fee: extractResult.extracted.late_fee,
              confidence_score: extractResult.extracted.confidence_score,
            };
            
            console.log('[v5/leaseStorage] Updating lease with extracted data:', updatedLease);
            // Update in session storage
            SessionStorageService.updateLease(lease.id, updatedLease as any);
            
            return { 
              success: true, 
              lease: updatedLease as any,
              job_id: `job-${Date.now()}`,
              extraction: extractResult
            };
          } else {
            console.warn('[v5/leaseStorage] Extraction failed or no data extracted:', extractResult);
          }
        } catch (extractError) {
          console.error('[v5/leaseStorage] Extraction error:', extractError);
          // Continue without extraction
        }
      } else {
        console.log('[v5/leaseStorage] No file_data available, skipping extraction');
      }

      return { 
        success: true, 
        lease: result.lease as any,
        job_id: `job-${Date.now()}`,
        extraction: {}
      };
    } catch (error) {
      console.error('Lease upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      return { success: false, error: errorMessage };
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
      // First try session storage (client-side)
      const sessionLeases = SessionStorageService.searchLeases({
        limit: options?.limit,
        offset: options?.offset
      });

      // If we have session data, return it
      if (sessionLeases.leases.length > 0) {
        return { 
          success: true, 
          leases: sessionLeases.leases as any[],
          count: sessionLeases.count
        };
      }

      // Otherwise try API (will return empty in test mode)
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
  static async getLease_OLD(leaseId: string): Promise<{ 
    success: boolean; 
    lease?: Lease; 
    error?: string 
  }> {
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
      // Get from session storage
      const lease = SessionStorageService.getLease(leaseId);
      
      if (!lease) {
        return { success: false, error: 'Lease not found' };
      }

      return { success: true, lease: lease as any };
    } catch (error) {
      console.error('Get lease error:', error);
      return { success: false, error: 'Fetch failed' };
    }
  }

  static async getLease_BACKUP(leaseId: string): Promise<{ 
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

  static async deleteLease_BACKUP(leaseId: string): Promise<{ success: boolean; error?: string }> {
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
      // Update in session storage
      const lease = SessionStorageService.updateLease(leaseId, updates as any);
      
      if (!lease) {
        return { success: false, error: 'Lease not found' };
      }

      return { success: true, lease: lease as any };
    } catch (error) {
      console.error('Update lease error:', error);
      return { success: false, error: 'Update failed' };
    }
  }

  static async updateLease_BACKUP(
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

