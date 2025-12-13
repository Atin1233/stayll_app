/**
 * FRED (Federal Reserve Economic Data) API Integration
 * Provides inflation indices, CPI, and escalation data for lease analysis
 * 
 * Free API key: https://fred.stlouisfed.org/docs/api/api_key.html
 */

interface FREDSeries {
  id: string
  title: string
  units: string
  frequency: string
  seasonal_adjustment: string
  last_updated: string
  observation_start: string
  observation_end: string
}

interface FRObservation {
  date: string
  value: number | string // '.' indicates missing data
}

interface FREDSeriesResponse {
  series: FREDSeries[]
  observations: FRObservation[]
}

const FRED_API_KEY = process.env.FRED_API_KEY
const FRED_API_URL = 'https://api.stlouisfed.org/fred'

/**
 * Common FRED series IDs for lease analysis
 */
export const FRED_SERIES = {
  CPI_ALL: 'CPIAUCSL', // Consumer Price Index for All Urban Consumers: All Items
  CPI_RENT: 'CUSR0000SEHA', // CPI for Rent of Primary Residence
  CPI_URBAN: 'CPILFESL', // CPI Less Food and Energy
  PPI_CONSTRUCTION: 'PPICON', // Producer Price Index for Construction
  COMMERCIAL_RENT_INDEX: 'CUUR0000SEHA', // Rent of Primary Residence (if available)
} as const

/**
 * Fetch a FRED economic series
 */
export async function getFREDSeries(
  seriesId: string,
  startDate?: string,
  endDate?: string,
): Promise<FREDSeriesResponse | null> {
  if (!FRED_API_KEY) {
    console.warn('FRED API key not configured')
    return null
  }

  try {
    const url = new URL(`${FRED_API_URL}/series/observations`)
    url.searchParams.set('series_id', seriesId)
    url.searchParams.set('api_key', FRED_API_KEY)
    url.searchParams.set('file_type', 'json')
    if (startDate) url.searchParams.set('observation_start', startDate)
    if (endDate) url.searchParams.set('observation_end', endDate)

    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`)
    }

    const data = await response.json()

    // Also fetch series metadata
    const seriesUrl = new URL(`${FRED_API_URL}/series`)
    seriesUrl.searchParams.set('series_id', seriesId)
    seriesUrl.searchParams.set('api_key', FRED_API_KEY)
    seriesUrl.searchParams.set('file_type', 'json')

    const seriesResponse = await fetch(seriesUrl.toString(), {
      next: { revalidate: 86400 },
    })

    const seriesData = await seriesResponse.json()

    return {
      series: seriesData.series || [],
      observations: data.observations || [],
    }
  } catch (error) {
    console.error('Failed to fetch FRED series', error)
    return null
  }
}

/**
 * Calculate inflation rate between two dates using CPI
 */
export async function calculateInflationRate(
  startDate: string, // YYYY-MM-DD
  endDate: string,
  seriesId: string = FRED_SERIES.CPI_ALL,
): Promise<number | null> {
  const data = await getFREDSeries(seriesId, startDate, endDate)

  if (!data || !data.observations.length) {
    return null
  }

  const validObservations = data.observations.filter(
    (obs) => obs.value !== '.' && typeof obs.value === 'number',
  ) as Array<{ date: string; value: number }>

  if (validObservations.length < 2) {
    return null
  }

  const first = validObservations[0].value
  const last = validObservations[validObservations.length - 1].value

  return ((last - first) / first) * 100
}

/**
 * Get CPI value for a specific date (or nearest available)
 */
export async function getCPIForDate(
  date: string, // YYYY-MM-DD
  seriesId: string = FRED_SERIES.CPI_ALL,
): Promise<number | null> {
  const data = await getFREDSeries(seriesId, date, date)

  if (!data || !data.observations.length) {
    // Try to get the most recent value before the date
    const historical = await getFREDSeries(seriesId, undefined, date)
    if (!historical || !historical.observations.length) {
      return null
    }

    const valid = historical.observations
      .filter((obs) => obs.value !== '.' && typeof obs.value === 'number')
      .map((obs) => obs as { date: string; value: number })
      .sort((a, b) => b.date.localeCompare(a.date))

    return valid[0]?.value || null
  }

  const obs = data.observations[0]
  return obs.value !== '.' && typeof obs.value === 'number' ? obs.value : null
}

/**
 * Adjust rent amount for inflation between two dates
 */
export async function adjustRentForInflation(
  amount: number,
  baseDate: string, // YYYY-MM-DD
  targetDate: string,
  seriesId: string = FRED_SERIES.CPI_ALL,
): Promise<number | null> {
  const baseCPI = await getCPIForDate(baseDate, seriesId)
  const targetCPI = await getCPIForDate(targetDate, seriesId)

  if (!baseCPI || !targetCPI) {
    return null
  }

  return amount * (targetCPI / baseCPI)
}

/**
 * Calculate escalation percentage based on CPI change
 */
export async function calculateEscalationFromCPI(
  baseDate: string,
  escalationDate: string,
  seriesId: string = FRED_SERIES.CPI_RENT, // Use rent-specific CPI if available
): Promise<number | null> {
  const inflationRate = await calculateInflationRate(baseDate, escalationDate, seriesId)
  return inflationRate
}


