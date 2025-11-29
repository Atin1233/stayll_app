import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createServiceClient, getUserFromToken } from "../_shared/supabase.ts";
import { getMembership } from "../_shared/org.ts";

interface EnrichRequestBody {
  leaseId: string;
  enrichments?: string[]; // ['geocoding', 'currency', 'economic']
}

interface GeocodingResult {
  latitude: number;
  longitude: number;
  placeId: string;
  formattedAddress: string;
  addressComponents: Record<string, string>;
}

const jsonResponse = (payload: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

// Geocode address using Google Maps API
async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
  if (!apiKey) {
    console.warn("Google Maps API key not configured");
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== "OK" || !data.results?.[0]) return null;

    const result = data.results[0];
    const components: Record<string, string> = {};

    result.address_components?.forEach((component: any) => {
      if (component.types.includes("street_number")) components.streetNumber = component.long_name;
      else if (component.types.includes("route")) components.route = component.long_name;
      else if (component.types.includes("locality")) components.locality = component.long_name;
      else if (component.types.includes("administrative_area_level_1")) components.administrativeArea = component.short_name;
      else if (component.types.includes("postal_code")) components.postalCode = component.long_name;
      else if (component.types.includes("country")) components.country = component.short_name;
    });

    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      placeId: result.place_id,
      formattedAddress: result.formatted_address,
      addressComponents: components,
    };
  } catch (error) {
    console.error("Geocoding error", error);
    return null;
  }
}

// Convert currency using exchangerate.host (free)
async function convertCurrency(amount: number, from: string, to: string): Promise<{ converted: number; rate: number } | null> {
  if (from === to) {
    return { converted: amount, rate: 1 };
  }

  try {
    const url = `https://api.exchangerate.host/latest?base=${from}&symbols=${to}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    const rate = data.rates?.[to];

    if (!rate) return null;

    return {
      converted: amount * rate,
      rate,
    };
  } catch (error) {
    console.error("Currency conversion error", error);
    return null;
  }
}

// Get CPI from FRED API
async function getCPIForDate(date: string): Promise<number | null> {
  const apiKey = Deno.env.get("FRED_API_KEY");
  if (!apiKey) {
    console.warn("FRED API key not configured");
    return null;
  }

  try {
    // Get CPI series ending on or before the date
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=CUSR0000SEHA&api_key=${apiKey}&file_type=json&observation_end=${date}&sort_order=desc&limit=1`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    const obs = data.observations?.[0];

    if (!obs || obs.value === ".") return null;

    return parseFloat(obs.value);
  } catch (error) {
    console.error("FRED API error", error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");

  try {
    const { user } = await getUserFromToken(authHeader);
    const body = (await req.json()) as EnrichRequestBody | null;

    if (!body?.leaseId) {
      return jsonResponse({ error: "leaseId is required" }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const membership = await getMembership(serviceClient, user.id);

    // Get lease data
    const { data: lease, error: leaseError } = await serviceClient
      .from("leases")
      .select("id, org_id, property_address, monthly_rent, currency, base_currency, lease_start, lease_end")
      .eq("id", body.leaseId)
      .maybeSingle();

    if (leaseError || !lease) {
      console.error("Lease lookup failed", leaseError);
      return jsonResponse({ error: "Lease not found" }, { status: 404 });
    }

    if (lease.org_id !== membership.organization_id) {
      return jsonResponse({ error: "Unauthorized for this lease" }, { status: 403 });
    }

    const enrichments = body.enrichments || ["geocoding", "currency", "economic"];
    const updates: Record<string, unknown> = {};

    // Geocoding enrichment
    if (enrichments.includes("geocoding") && lease.property_address) {
      const geocodeResult = await geocodeAddress(lease.property_address);
      if (geocodeResult) {
        updates.latitude = geocodeResult.latitude;
        updates.longitude = geocodeResult.longitude;
        updates.place_id = geocodeResult.placeId;
        updates.geocoding_metadata = {
          formattedAddress: geocodeResult.formattedAddress,
          addressComponents: geocodeResult.addressComponents,
        };
      }
    }

    // Currency conversion
    if (enrichments.includes("currency") && lease.monthly_rent && lease.currency) {
      const baseCurrency = (lease.base_currency as string) || "USD";
      if (lease.currency !== baseCurrency) {
        const conversion = await convertCurrency(Number(lease.monthly_rent), lease.currency as string, baseCurrency);
        if (conversion) {
          updates.currency = lease.currency;
          updates.base_currency = baseCurrency;
          // Store conversion in rent_schedule or create a new field
        }
      }
    }

    // Economic data enrichment
    if (enrichments.includes("economic") && lease.lease_start) {
      const cpiBase = await getCPIForDate(lease.lease_start as string);
      if (cpiBase) {
        updates.cpi_base_date = lease.lease_start;
        updates.cpi_series_id = "CUSR0000SEHA";

        // Calculate inflation-adjusted rent if we have rent amount
        if (lease.monthly_rent) {
          const today = new Date().toISOString().split("T")[0];
          const cpiToday = await getCPIForDate(today);
          if (cpiToday) {
            const adjustedRent = Number(lease.monthly_rent) * (cpiToday / cpiBase);
            updates.inflation_adjusted_rent = {
              original: lease.monthly_rent,
              adjusted: adjustedRent,
              baseDate: lease.lease_start,
              adjustmentDate: today,
              inflationRate: ((cpiToday - cpiBase) / cpiBase) * 100,
            };
          }
        }
      }
    }

    // Update lease with enrichment data
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await serviceClient
        .from("leases")
        .update(updates)
        .eq("id", lease.id);

      if (updateError) {
        console.error("Failed to update lease with enrichment data", updateError);
        return jsonResponse({ error: "Failed to save enrichment data" }, { status: 500 });
      }
    }

    return jsonResponse({
      leaseId: lease.id,
      enrichments: Object.keys(updates),
      data: updates,
    });
  } catch (error) {
    console.error("Enrich function error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.includes("authenticate") ? 401 : 500;
    return jsonResponse({ error: message }, { status });
  }
});
