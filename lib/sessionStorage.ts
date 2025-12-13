/**
 * Session-based storage for testing without Supabase
 * Stores lease data and file metadata in browser sessionStorage
 */

export interface SessionLease {
  id: string;
  user_id?: string;
  tenant_name: string | null;
  property_address: string | null;
  monthly_rent?: string | null;
  lease_start?: string | null;
  lease_end?: string | null;
  due_date?: string;
  late_fee?: string | null;
  security_deposit?: string | null;
  utilities?: string;
  parking?: string;
  pets?: string;
  smoking?: string;
  file_url?: string;
  file_name: string;
  file_size: number;
  file_data?: string; // base64 encoded file data
  file_key?: string;
  org_id?: string;
  uploader_id?: string;
  verification_status?: string;
  confidence_score?: number;
  analysis_data?: any;
  portfolio_impact?: any;
  compliance_assessment?: any;
  strategic_recommendations?: any;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'stayll_session_leases';

export class SessionStorageService {
  /**
   * Get all leases from session storage
   */
  static getLeases(): SessionLease[] {
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : [];
      return parsed;
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return [];
    }
  }

  /**
   * Save all leases to session storage
   */
  static saveLeases(leases: SessionLease[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(leases));
    } catch (error) {
      console.error('Error saving to session storage:', error);
    }
  }

  /**
   * Add a new lease
   */
  static addLease(lease: SessionLease): SessionLease {
    const leases = this.getLeases();
    leases.push(lease);
    this.saveLeases(leases);
    
    // Dispatch custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sessionLeaseAdded', { detail: lease }));
    }
    
    return lease;
  }

  /**
   * Get a single lease by ID
   */
  static getLease(id: string): SessionLease | null {
    const leases = this.getLeases();
    return leases.find(lease => lease.id === id) || null;
  }

  /**
   * Update a lease
   */
  static updateLease(id: string, updates: Partial<SessionLease>): SessionLease | null {
    const leases = this.getLeases();
    const index = leases.findIndex(lease => lease.id === id);
    
    if (index === -1) return null;
    
    leases[index] = {
      ...leases[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.saveLeases(leases);
    
    // Dispatch custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sessionLeaseUpdated', { detail: leases[index] }));
    }
    
    return leases[index];
  }

  /**
   * Delete a lease
   */
  static deleteLease(id: string): boolean {
    const leases = this.getLeases();
    const filtered = leases.filter(lease => lease.id !== id);
    
    if (filtered.length === leases.length) return false;
    
    this.saveLeases(filtered);
    return true;
  }

  /**
   * Clear all leases
   */
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Search leases by property address or tenant name
   */
  static searchLeases(options?: {
    propertyAddress?: string;
    tenantName?: string;
    limit?: number;
    offset?: number;
  }): { leases: SessionLease[]; count: number } {
    let leases = this.getLeases();
    
    // Filter by search criteria
    if (options?.propertyAddress) {
      const search = options.propertyAddress.toLowerCase();
      leases = leases.filter(lease => 
        lease.property_address?.toLowerCase().includes(search)
      );
    }
    
    if (options?.tenantName) {
      const search = options.tenantName.toLowerCase();
      leases = leases.filter(lease => 
        lease.tenant_name?.toLowerCase().includes(search)
      );
    }
    
    const count = leases.length;
    
    // Apply pagination
    if (options?.offset) {
      leases = leases.slice(options.offset);
    }
    
    if (options?.limit) {
      leases = leases.slice(0, options.limit);
    }
    
    return { leases, count };
  }

  /**
   * Convert file to base64 for storage
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Create a blob URL from base64 data
   */
  static base64ToBlob(base64: string, type: string = 'application/pdf'): string {
    try {
      const byteString = atob(base64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error converting base64 to blob:', error);
      return '';
    }
  }
}
