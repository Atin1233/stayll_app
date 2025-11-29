import { NextRequest, NextResponse } from 'next/server'
import { geocodeAddress, reverseGeocode, geocodeAddresses } from '@/lib/services/geocoding'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get('address')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  try {
    if (address) {
      const result = await geocodeAddress(address)
      if (!result) {
        return NextResponse.json(
          { error: 'Address not found' },
          { status: 404 },
        )
      }
      return NextResponse.json(result)
    }

    if (lat && lng) {
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)

      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
          { error: 'Invalid coordinates' },
          { status: 400 },
        )
      }

      const result = await reverseGeocode(latitude, longitude)
      if (!result) {
        return NextResponse.json(
          { error: 'Location not found' },
          { status: 404 },
        )
      }
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Missing address or coordinates (lat/lng)' },
      { status: 400 },
    )
  } catch (error) {
    console.error('Geocoding API error', error)
    return NextResponse.json(
      { error: 'Failed to geocode address' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { addresses } = body

    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Missing or invalid addresses array' },
        { status: 400 },
      )
    }

    const results = await geocodeAddresses(addresses)
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Batch geocoding error', error)
    return NextResponse.json(
      { error: 'Failed to geocode addresses' },
      { status: 500 },
    )
  }
}


