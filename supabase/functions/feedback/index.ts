import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createServiceClient, getUserFromToken } from "../_shared/supabase.ts";
import { getMembership } from "../_shared/org.ts";

interface FeedbackRequestBody {
  leaseId?: string;
  category?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

const jsonResponse = (payload: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

const postWebhook = async (body: FeedbackRequestBody & { userId: string; orgId: string }) => {
  const webhookUrl = Deno.env.get("FEEDBACK_WEBHOOK_URL");
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.warn("Feedback webhook failed", error);
  }
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");

  try {
    const { user } = await getUserFromToken(authHeader);
    const body = (await req.json()) as FeedbackRequestBody | null;

    if (!body?.message) {
      return jsonResponse({ error: "Feedback message is required" }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const membership = await getMembership(serviceClient, user.id);

    let leaseId: string | null = null;

    if (body.leaseId) {
      const { data: lease, error: leaseError } = await serviceClient
        .from("leases")
        .select("id, org_id")
        .eq("id", body.leaseId)
        .maybeSingle();

      if (leaseError) {
        console.error("Lease lookup failed", leaseError);
        return jsonResponse({ error: "Unable to validate lease" }, { status: 500 });
      }

      if (!lease || lease.org_id !== membership.organization_id) {
        return jsonResponse({ error: "Unauthorized for the provided lease" }, { status: 403 });
      }

      leaseId = lease.id;
    }

    const { data: inserted, error: insertError } = await serviceClient
      .from("feedback")
      .insert({
        lease_id: leaseId,
        org_id: membership.organization_id,
        user_id: user.id,
        category: body.category ?? null,
        message: body.message,
        metadata: body.metadata ?? null,
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("Failed to store feedback", insertError);
      return jsonResponse({ error: "Unable to store feedback" }, { status: 500 });
    }

    await postWebhook({ ...body, leaseId: leaseId ?? undefined, userId: user.id, orgId: membership.organization_id });

    return jsonResponse({
      id: inserted.id,
      createdAt: inserted.created_at,
    });
  } catch (error) {
    console.error("Feedback function error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.includes("authenticate") ? 401 : 500;
    return jsonResponse({ error: message }, { status });
  }
});
