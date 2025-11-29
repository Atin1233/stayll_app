import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createServiceClient, getUserFromToken } from "../_shared/supabase.ts";
import { getMembership } from "../_shared/org.ts";

interface UploadRequestBody {
  fileName: string;
  contentType: string;
  fileSize?: number;
  tenantName?: string;
  propertyAddress?: string;
}

const sanitizeFileName = (value: string): string =>
  value.replace(/[^a-zA-Z0-9.\-_/]/g, "_");

const jsonResponse = (payload: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");

  try {
    const { user } = await getUserFromToken(authHeader);
    const body = (await req.json()) as UploadRequestBody | null;

    if (!body?.fileName || !body?.contentType) {
      return jsonResponse({ error: "fileName and contentType are required" }, { status: 400 });
    }

    const serviceClient = createServiceClient();

    const membership = await getMembership(serviceClient, user.id);

    const sanitizedName = sanitizeFileName(body.fileName);
    const objectPath = `${membership.organization_id}/${crypto.randomUUID()}-${sanitizedName}`;

    const { data: signedUrlData, error: signedUrlError } = await serviceClient
      .storage
      .from("contract-uploads")
      .createSignedUploadUrl(objectPath, {
        contentType: body.contentType,
        upsert: false,
      });

    if (signedUrlError || !signedUrlData) {
      console.error("Failed to create signed upload URL", signedUrlError);
      return jsonResponse({ error: "Unable to prepare upload" }, { status: 500 });
    }

    const { data: lease, error: leaseError } = await serviceClient
      .from("leases")
      .insert({
        org_id: membership.organization_id,
        uploader_id: user.id,
        tenant_name: body.tenantName ?? null,
        property_address: body.propertyAddress ?? null,
        file_key: objectPath,
        file_name: body.fileName,
        file_size: body.fileSize ?? null,
        verification_status: "unverified",
      })
      .select("id")
      .single();

    if (leaseError) {
      console.error("Failed to insert lease record", leaseError);
      return jsonResponse({ error: "Unable to create lease record" }, { status: 500 });
    }

    // Trigger enrichment asynchronously if property address is provided
    if (body.propertyAddress) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const enrichUrl = `${supabaseUrl}/functions/v1/enrich`;
      
      // Fire and forget - don't block the upload response
      fetch(enrichUrl, {
        method: "POST",
        headers: {
          "Authorization": req.headers.get("Authorization") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaseId: lease.id,
          enrichments: ["geocoding", "currency", "economic"],
        }),
      }).catch((error) => {
        console.error("Enrichment trigger failed (non-fatal):", error);
      });
    }

    return jsonResponse({
      leaseId: lease.id,
      uploadUrl: signedUrlData.signedUrl,
      token: signedUrlData.token,
      path: objectPath,
      bucket: "contract-uploads",
      expiresAt: signedUrlData.pathExpiresAt,
    });
  } catch (error) {
    console.error("Upload function error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";

    const status = message === "Missing Authorization header" || message === "Unable to authenticate user"
      ? 401
      : 500;

    return jsonResponse({ error: message }, { status });
  }
});
