/**
 * Client-side enrichment service
 * Calls enrichment APIs from the frontend
 */

import { supabase } from '@/lib/supabase'

interface EnrichLeaseOptions {
  leaseId: string
  enrichments?: Array<'geocoding' | 'currency' | 'economic'>
}

/**
 * Trigger enrichment for a lease (calls Edge Function)
 */
export async function enrichLease(options: EnrichLeaseOptions): Promise<{
  success: boolean
  data?: Record<string, unknown>
  error?: string
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: 'Authentication required' }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      return { success: false, error: 'Supabase URL not configured' }
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/enrich`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        leaseId: options.leaseId,
        enrichments: options.enrichments || ['geocoding', 'currency', 'economic'],
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || 'Enrichment failed' }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('Enrichment client error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Enrichment failed',
    }
  }
}

/**
 * Geocode an address (calls Next.js API route)
 */
export async function geocodeAddress(address: string): Promise<{
  success: boolean
  data?: {
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
    addressComponents: Record<string, string>
  }
  error?: string
}> {
  try {
    const response = await fetch(`/api/enrichment/geocode?address=${encodeURIComponent(address)}`)

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Geocoding failed' }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Geocoding client error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Geocoding failed',
    }
  }
}

/**
 * Convert currency (calls Next.js API route)
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<{
  success: boolean
  data?: {
    fromCurrency: string
    toCurrency: string
    amount: number
    convertedAmount: number
    rate: number
    date: string
  }
  error?: string
}> {
  try {
    const response = await fetch('/api/enrichment/exchange-rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, fromCurrency, toCurrency }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Currency conversion failed' }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Currency conversion client error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Currency conversion failed',
    }
  }
}

/**
 * Get FRED economic data (calls Next.js API route)
 */
export async function getEconomicData(
  action: 'inflation' | 'cpi' | 'adjust' | 'escalation',
  params: Record<string, string | number>,
): Promise<{
  success: boolean
  data?: unknown
  error?: string
}> {
  try {
    const searchParams = new URLSearchParams({
      action,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ),
    })

    const response = await fetch(`/api/enrichment/fred?${searchParams.toString()}`)

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'FRED API failed' }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('FRED API client error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'FRED API failed',
    }
  }
}

