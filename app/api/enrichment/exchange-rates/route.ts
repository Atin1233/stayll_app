import { NextRequest, NextResponse } from 'next/server'
import { convertCurrency, getExchangeRates, convertRentSchedule } from '@/lib/services/exchangeRates'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const baseCurrency = searchParams.get('base') || 'USD'

  try {
    const rates = await getExchangeRates(baseCurrency)
    return NextResponse.json(rates)
  } catch (error) {
    console.error('Exchange rates API error', error)
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, fromCurrency, toCurrency, schedule } = body

    if (schedule) {
      // Convert rent schedule
      const baseCurrency = toCurrency || 'USD'
      const converted = await convertRentSchedule(schedule, baseCurrency)
      return NextResponse.json({ converted })
    }

    if (!amount || !fromCurrency || !toCurrency) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, fromCurrency, toCurrency' },
        { status: 400 },
      )
    }

    const result = await convertCurrency(amount, fromCurrency, toCurrency)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Currency conversion error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to convert currency' },
      { status: 500 },
    )
  }
}


