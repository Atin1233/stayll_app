import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createServiceClient, getUserFromToken } from "../_shared/supabase.ts";
import { getMembership } from "../_shared/org.ts";

interface AuditEventRequest {
  leaseId: string;
  eventType: string;
  payload?: Record<string, unknown> | null;
}

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
    const body = (await req.json()) as AuditEventRequest | null;

    if (!body?.leaseId || !body?.eventType) {
      return jsonResponse({ error: "leaseId and eventType are required" }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const membership = await getMembership(serviceClient, user.id);

    const { data: lease, error: leaseError } = await serviceClient
      .from("leases")
      .select("id, org_id")
      .eq("id", body.leaseId)
      .maybeSingle();

    if (leaseError || !lease) {
      console.error("Lease lookup failed", leaseError);
      return jsonResponse({ error: "Lease not found" }, { status: 404 });
    }

    if (lease.org_id !== membership.organization_id) {
      return jsonResponse({ error: "Unauthorized for this lease" }, { status: 403 });
    }

    const { error: insertError } = await serviceClient
      .from("audit_events")
      .insert({
        lease_id: lease.id,
        org_id: lease.org_id,
        user_id: user.id,
        event_type: body.eventType,
        payload: body.payload ?? null,
      });

    if (insertError) {
      console.error("Failed to write audit event", insertError);
      return jsonResponse({ error: "Unable to store audit event" }, { status: 500 });
    }

    return jsonResponse({ status: "ok" });
  } catch (error) {
    console.error("Audit function error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.includes("authenticate") ? 401 : 500;
    return jsonResponse({ error: message }, { status });
  }
});
