/**
 * Unified Enrichment Service
 * Orchestrates all data enrichment APIs for lease records
 */

import { geocodeAddress } from './geocoding'
import { convertCurrency, getExchangeRates } from './exchangeRates'
import { getCPIForDate, adjustRentForInflation, calculateEscalationFromCPI, FRED_SERIES } from './fred'

interface LeaseEnrichmentData {
  leaseId: string
  propertyAddress?: string | null
  monthlyRent?: number | null
  currency?: string | null
  baseCurrency?: string
  leaseStart?: string | null
  leaseEnd?: string | null
}

interface EnrichmentResult {
  geocoding?: {
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
    addressComponents: Record<string, string>
  } | null
  currency?: {
    baseCurrency: string
    convertedAmount?: number
    rate?: number
  } | null
  economic?: {
    cpiBase?: number | null
    inflationAdjustedRent?: number | null
    escalationProjection?: number | null
  } | null
}

/**
 * Enrich a lease with geocoding, currency conversion, and economic data
 */
export async function enrichLease(
  data: LeaseEnrichmentData,
): Promise<EnrichmentResult> {
  const result: EnrichmentResult = {}
  const baseCurrency = data.baseCurrency || 'USD'

  // 1. Geocode property address if available
  if (data.propertyAddress) {
    try {
      const geocodeResult = await geocodeAddress(data.propertyAddress)
      if (geocodeResult) {
        result.geocoding = {
          latitude: geocodeResult.latitude,
          longitude: geocodeResult.longitude,
          placeId: geocodeResult.placeId,
          formattedAddress: geocodeResult.formattedAddress,
          addressComponents: {
            streetNumber: geocodeResult.addressComponents.streetNumber || '',
            route: geocodeResult.addressComponents.route || '',
            locality: geocodeResult.addressComponents.locality || '',
            administrativeArea: geocodeResult.addressComponents.administrativeArea || '',
            postalCode: geocodeResult.addressComponents.postalCode || '',
            country: geocodeResult.addressComponents.country || '',
          },
        }
      }
    } catch (error) {
      console.error('Geocoding enrichment failed', error)
      result.geocoding = null
    }
  }

  // 2. Currency conversion if rent is in non-base currency
  if (data.monthlyRent && data.currency && data.currency !== baseCurrency) {
    try {
      const conversion = await convertCurrency(data.monthlyRent, data.currency, baseCurrency)
      result.currency = {
        baseCurrency,
        convertedAmount: conversion.convertedAmount,
        rate: conversion.rate,
      }
    } catch (error) {
      console.error('Currency conversion enrichment failed', error)
      result.currency = null
    }
  } else if (data.monthlyRent) {
    result.currency = {
      baseCurrency: data.currency || baseCurrency,
    }
  }

  // 3. Economic indicators (CPI, inflation adjustments)
  if (data.monthlyRent && data.leaseStart) {
    try {
      const today = new Date().toISOString().split('T')[0]
      const baseDate = data.leaseStart

      // Get CPI for lease start date
      const cpiBase = await getCPIForDate(baseDate, FRED_SERIES.CPI_RENT)

      // Calculate inflation-adjusted rent to today
      const adjustedRent = cpiBase
        ? await adjustRentForInflation(data.monthlyRent, baseDate, today, FRED_SERIES.CPI_RENT)
        : null

      // If lease end date exists, calculate escalation projection
      let escalationProjection = null
      if (data.leaseEnd) {
        escalationProjection = await calculateEscalationFromCPI(baseDate, data.leaseEnd, FRED_SERIES.CPI_RENT)
      }

      result.economic = {
        cpiBase,
        inflationAdjustedRent: adjustedRent || null,
        escalationProjection: escalationProjection || null,
      }
    } catch (error) {
      console.error('Economic data enrichment failed', error)
      result.economic = null
    }
  }

  return result
}

/**
 * Batch enrich multiple leases
 */
export async function enrichLeases(leases: LeaseEnrichmentData[]): Promise<Map<string, EnrichmentResult>> {
  const results = new Map<string, EnrichmentResult>()

  // Process in parallel but with a small delay to avoid rate limits
  await Promise.all(
    leases.map(async (lease, index) => {
      // Stagger requests slightly
      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, index * 100))
      }

      const enrichment = await enrichLease(lease)
      results.set(lease.leaseId, enrichment)
    }),
  )

  return results
}

