import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface Lease {
  id: string
  user_id: string
  tenant_name: string
  property_address: string
  monthly_rent: string
  lease_start: string
  lease_end: string
  due_date: string
  late_fee: string
  file_url: string
  created_at: string
}

export interface Tenant {
  id: string
  user_id: string
  name: string
  lease_id: string
  status: string
  created_at: string
} 