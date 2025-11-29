/**
 * Exchange Rates API Integration
 * Supports multi-currency lease rent conversion for portfolio rollups
 * 
 * Uses exchangerate.host (FREE, unlimited requests, no API key required)
 * Alternative: exchangerate-api.com (free tier: 1,500 requests/month)
 */

interface ExchangeRateResponse {
  base: string
  date: string
  rates: Record<string, number>
  success?: boolean
}

interface ConversionResult {
  fromCurrency: string
  toCurrency: string
  amount: number
  convertedAmount: number
  rate: number
  date: string
}

// Use free unlimited exchangerate.host by default
const EXCHANGE_RATE_API_URL = process.env.EXCHANGE_RATE_API_URL || 'https://api.exchangerate.host/latest'
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY // Not needed for exchangerate.host

/**
 * Fetch latest exchange rates for a base currency
 */
export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRateResponse> {
  try {
    // exchangerate.host uses query parameters, exchangerate-api.com uses path
    const isExchangerateHost = EXCHANGE_RATE_API_URL.includes('exchangerate.host')
    const url = isExchangerateHost
      ? `${EXCHANGE_RATE_API_URL}?base=${baseCurrency}`
      : `${EXCHANGE_RATE_API_URL}/${baseCurrency}`
    
    const response = await fetch(url, {
      headers: EXCHANGE_RATE_API_KEY ? { 'Authorization': `Bearer ${EXCHANGE_RATE_API_KEY}` } : {},
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Handle exchangerate.host response format
    if (isExchangerateHost && data.success !== undefined) {
      return {
        base: data.base || baseCurrency,
        date: data.date || new Date().toISOString().split('T')[0],
        rates: data.rates || {},
        success: data.success,
      }
    }
    
    // Handle exchangerate-api.com response format
    return {
      base: data.base || baseCurrency,
      date: data.date || new Date().toISOString().split('T')[0],
      rates: data.rates || {},
      success: true,
    }
  } catch (error) {
    console.error('Failed to fetch exchange rates', error)
    throw error
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<ConversionResult> {
  if (fromCurrency === toCurrency) {
    return {
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount: amount,
      rate: 1,
      date: new Date().toISOString().split('T')[0],
    }
  }

  const rates = await getExchangeRates(fromCurrency)
  const rate = rates.rates[toCurrency]

  if (!rate) {
    throw new Error(`Exchange rate not found for ${toCurrency}`)
  }

  return {
    fromCurrency,
    toCurrency,
    amount,
    convertedAmount: amount * rate,
    rate,
    date: rates.date,
  }
}

/**
 * Convert multiple amounts (e.g., rent schedule) to base currency
 */
export async function convertRentSchedule(
  schedule: Array<{ amount: number; currency: string; period: string }>,
  baseCurrency: string = 'USD',
): Promise<Array<{ amount: number; currency: string; period: string; convertedAmount: number; rate: number }>> {
  const conversions = await Promise.all(
    schedule.map(async (item) => {
      if (item.currency === baseCurrency) {
        return {
          ...item,
          convertedAmount: item.amount,
          rate: 1,
        }
      }

      const result = await convertCurrency(item.amount, item.currency, baseCurrency)
      return {
        ...item,
        convertedAmount: result.convertedAmount,
        rate: result.rate,
      }
    }),
  )

  return conversions
}

/**
 * Get historical exchange rate (requires historical API endpoint)
 * Note: Free tier may not support historical data
 */
export async function getHistoricalRate(
  fromCurrency: string,
  toCurrency: string,
  date: string, // YYYY-MM-DD
): Promise<number> {
  // For historical data, you may need a paid API or use a different provider
  // This is a placeholder implementation
  try {
    const url = `https://api.exchangerate.host/${date}?base=${fromCurrency}&symbols=${toCurrency}`
    const response = await fetch(url, { next: { revalidate: 86400 } }) // Cache for 24h

    if (!response.ok) {
      throw new Error(`Historical rate API error: ${response.status}`)
    }

    const data = await response.json()
    return data.rates?.[toCurrency] || 1
  } catch (error) {
    console.error('Failed to fetch historical rate', error)
    // Fallback to current rate
    const current = await convertCurrency(1, fromCurrency, toCurrency)
    return current.rate
  }
}

