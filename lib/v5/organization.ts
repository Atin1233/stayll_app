/**
 * STAYLL v5.0 - Organization Service
 * Multi-tenant organization management
 */

import { supabase } from '@/lib/supabase';
import type { Organization, UserProfile, UserRole } from '@/types/v5.0';

export class OrganizationService {
  /**
   * Get current user's organization
   */
  static async getCurrentOrganization(): Promise<{ 
    success: boolean; 
    organization?: Organization; 
    profile?: UserProfile;
    error?: string 
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Get user profile with organization
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: 'User profile not found' };
      }

      const organization = profile.organizations as Organization | null;
      if (!organization) {
        return { success: false, error: 'User not associated with an organization' };
      }

      return {
        success: true,
        organization,
        profile: profile as UserProfile
      };
    } catch (error) {
      console.error('Get organization error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get organization ID for current user
   */
  static async getCurrentOrganizationId(): Promise<string | null> {
    const result = await this.getCurrentOrganization();
    return result.organization?.id || null;
  }

  /**
   * Get current user's role
   */
  static async getCurrentUserRole(): Promise<UserRole | null> {
    const result = await this.getCurrentOrganization();
    return result.profile?.role || null;
  }

  /**
   * Check if user has required role
   */
  static async hasRole(requiredRole: UserRole | UserRole[]): Promise<boolean> {
    const role = await this.getCurrentUserRole();
    if (!role) return false;

    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return requiredRoles.includes(role);
  }

  /**
   * Create organization (for org_admin only)
   */
  static async createOrganization(name: string): Promise<{ 
    success: boolean; 
    organization?: Organization; 
    error?: string 
  }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Create organization
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({ name, billing_status: 'trial' })
        .select()
        .single();

      if (orgError || !organization) {
        return { success: false, error: 'Failed to create organization' };
      }

      // Update user profile with organization
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          organization_id: organization.id,
          role: 'org_admin'
        });

      if (profileError) {
        // Rollback: delete organization
        await supabase.from('organizations').delete().eq('id', organization.id);
        return { success: false, error: 'Failed to associate user with organization' };
      }

      return { success: true, organization };
    } catch (error) {
      console.error('Create organization error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

