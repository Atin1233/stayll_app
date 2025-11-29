import { NextRequest, NextResponse } from 'next/server'
import {
  getFREDSeries,
  calculateInflationRate,
  getCPIForDate,
  adjustRentForInflation,
  calculateEscalationFromCPI,
  FRED_SERIES,
} from '@/lib/services/fred'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const seriesId = searchParams.get('seriesId')
  const startDate = searchParams.get('startDate') || undefined
  const endDate = searchParams.get('endDate') || undefined
  const action = searchParams.get('action') // 'series', 'inflation', 'cpi', 'escalation'

  try {
    if (action === 'inflation') {
      const start = searchParams.get('startDate')
      const end = searchParams.get('endDate')
      const series = searchParams.get('seriesId') || FRED_SERIES.CPI_ALL

      if (!start || !end) {
        return NextResponse.json(
          { error: 'Missing startDate or endDate for inflation calculation' },
          { status: 400 },
        )
      }

      const rate = await calculateInflationRate(start, end, series)
      if (rate === null) {
        return NextResponse.json(
          { error: 'Failed to calculate inflation rate' },
          { status: 404 },
        )
      }

      return NextResponse.json({ inflationRate: rate, startDate: start, endDate: end, seriesId: series })
    }

    if (action === 'cpi') {
      const date = searchParams.get('date')
      const series = searchParams.get('seriesId') || FRED_SERIES.CPI_ALL

      if (!date) {
        return NextResponse.json(
          { error: 'Missing date parameter' },
          { status: 400 },
        )
      }

      const cpi = await getCPIForDate(date, series)
      if (cpi === null) {
        return NextResponse.json(
          { error: 'CPI data not found for date' },
          { status: 404 },
        )
      }

      return NextResponse.json({ cpi, date, seriesId: series })
    }

    if (action === 'escalation') {
      const baseDate = searchParams.get('baseDate')
      const escalationDate = searchParams.get('escalationDate')
      const series = searchParams.get('seriesId') || FRED_SERIES.CPI_RENT

      if (!baseDate || !escalationDate) {
        return NextResponse.json(
          { error: 'Missing baseDate or escalationDate' },
          { status: 400 },
        )
      }

      const escalation = await calculateEscalationFromCPI(baseDate, escalationDate, series)
      if (escalation === null) {
        return NextResponse.json(
          { error: 'Failed to calculate escalation' },
          { status: 404 },
        )
      }

      return NextResponse.json({
        escalationRate: escalation,
        baseDate,
        escalationDate,
        seriesId: series,
      })
    }

    if (action === 'adjust') {
      const amount = parseFloat(searchParams.get('amount') || '0')
      const baseDate = searchParams.get('baseDate')
      const targetDate = searchParams.get('targetDate')
      const series = searchParams.get('seriesId') || FRED_SERIES.CPI_ALL

      if (!baseDate || !targetDate || amount <= 0) {
        return NextResponse.json(
          { error: 'Missing amount, baseDate, or targetDate' },
          { status: 400 },
        )
      }

      const adjusted = await adjustRentForInflation(amount, baseDate, targetDate, series)
      if (adjusted === null) {
        return NextResponse.json(
          { error: 'Failed to adjust rent for inflation' },
          { status: 404 },
        )
      }

      return NextResponse.json({
        originalAmount: amount,
        adjustedAmount: adjusted,
        baseDate,
        targetDate,
        seriesId: series,
      })
    }

    // Default: fetch series data
    if (!seriesId) {
      return NextResponse.json(
        { error: 'Missing seriesId parameter', availableSeries: FRED_SERIES },
        { status: 400 },
      )
    }

    const data = await getFREDSeries(seriesId, startDate, endDate)
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch FRED series' },
        { status: 500 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('FRED API error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch FRED data' },
      { status: 500 },
    )
  }
}


