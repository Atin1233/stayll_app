/**
 * Google Maps Geocoding API Integration
 * Enriches property addresses with coordinates, place IDs, and location metadata
 * 
 * NOTE: Google Maps requires billing setup but provides $200/month free credit
 * Free tier covers ~40,000 geocoding requests/month
 */

interface GeocodingResult {
  address: string
  formattedAddress: string
  latitude: number
  longitude: number
  placeId: string
  addressComponents: {
    streetNumber?: string
    route?: string
    locality?: string
    administrativeArea?: string
    postalCode?: string
    country?: string
  }
  types: string[]
}

interface GeocodingResponse {
  results: Array<{
    formatted_address: string
    geometry: {
      location: { lat: number; lng: number }
    }
    place_id: string
    address_components: Array<{
      long_name: string
      short_name: string
      types: string[]
    }>
    types: string[]
  }>
  status: string
}

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

/**
 * Geocode an address to get coordinates and metadata
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured')
    return null
  }

  try {
    const url = new URL(GEOCODING_API_URL)
    url.searchParams.set('address', address)
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY)

    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 * 30 }, // Cache for 30 days (addresses don't change)
    })

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data: GeocodingResponse = await response.json()

    if (data.status !== 'OK' || !data.results.length) {
      console.warn(`Geocoding failed for address: ${address}`, data.status)
      return null
    }

    const result = data.results[0]
    const addressComponents: GeocodingResult['addressComponents'] = {}

    result.address_components.forEach((component) => {
      if (component.types.includes('street_number')) {
        addressComponents.streetNumber = component.long_name
      } else if (component.types.includes('route')) {
        addressComponents.route = component.long_name
      } else if (component.types.includes('locality')) {
        addressComponents.locality = component.long_name
      } else if (component.types.includes('administrative_area_level_1')) {
        addressComponents.administrativeArea = component.short_name
      } else if (component.types.includes('postal_code')) {
        addressComponents.postalCode = component.long_name
      } else if (component.types.includes('country')) {
        addressComponents.country = component.short_name
      }
    })

    return {
      address,
      formattedAddress: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      placeId: result.place_id,
      addressComponents,
      types: result.types,
    }
  } catch (error) {
    console.error('Failed to geocode address', error)
    return null
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured')
    return null
  }

  try {
    const url = new URL(GEOCODING_API_URL)
    url.searchParams.set('latlng', `${latitude},${longitude}`)
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY)

    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 * 30 },
    })

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`)
    }

    const data: GeocodingResponse = await response.json()

    if (data.status !== 'OK' || !data.results.length) {
      return null
    }

    const result = data.results[0]
    const addressComponents: GeocodingResult['addressComponents'] = {}

    result.address_components.forEach((component) => {
      if (component.types.includes('street_number')) {
        addressComponents.streetNumber = component.long_name
      } else if (component.types.includes('route')) {
        addressComponents.route = component.long_name
      } else if (component.types.includes('locality')) {
        addressComponents.locality = component.long_name
      } else if (component.types.includes('administrative_area_level_1')) {
        addressComponents.administrativeArea = component.short_name
      } else if (component.types.includes('postal_code')) {
        addressComponents.postalCode = component.long_name
      } else if (component.types.includes('country')) {
        addressComponents.country = component.short_name
      }
    })

    return {
      address: result.formatted_address,
      formattedAddress: result.formatted_address,
      latitude,
      longitude,
      placeId: result.place_id,
      addressComponents,
      types: result.types,
    }
  } catch (error) {
    console.error('Failed to reverse geocode', error)
    return null
  }
}

/**
 * Batch geocode multiple addresses (with rate limiting)
 */
export async function geocodeAddresses(
  addresses: string[],
  delayMs: number = 100, // Rate limit: 10 requests/second
): Promise<Array<GeocodingResult | null>> {
  const results: Array<GeocodingResult | null> = []

  for (const address of addresses) {
    const result = await geocodeAddress(address)
    results.push(result)

    // Rate limiting
    if (addresses.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return results
}

