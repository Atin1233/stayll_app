import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createServiceClient, getUserFromToken } from "../_shared/supabase.ts";
import { getMembership } from "../_shared/org.ts";

interface ScorecardRequestBody {
  leaseId: string;
  force?: boolean;
}

const jsonResponse = (payload: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

const calculateScore = (fields: Array<{ validation_state: string | null }>) => {
  const total = fields.length;
  const verified = fields.filter((field) => field.validation_state === "human_pass" || field.validation_state === "auto_pass").length;
  const pending = total - verified;

  const baseScore = total === 0 ? 0 : Math.round((verified / total) * 100);
  const risk = pending > 0 ? "pending_validation" : "verified";

  return { baseScore, verified, pending, risk }; // simple heuristic placeholder
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");

  try {
    const { user } = await getUserFromToken(authHeader);
    const body = (await req.json()) as ScorecardRequestBody | null;

    if (!body?.leaseId) {
      return jsonResponse({ error: "leaseId is required" }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const membership = await getMembership(serviceClient, user.id);

    const { data: lease, error: leaseError } = await serviceClient
      .from("leases")
      .select("id, org_id")
      .eq("id", body.leaseId)
      .maybeSingle();

    if (leaseError || !lease) {
      console.error("Lease not found", leaseError);
      return jsonResponse({ error: "Lease not found" }, { status: 404 });
    }

    if (lease.org_id !== membership.organization_id) {
      return jsonResponse({ error: "Unauthorized for this lease" }, { status: 403 });
    }

    const { data: existingScorecard } = await serviceClient
      .from("lease_analyses")
      .select("id, analysis_data, created_at")
      .eq("lease_id", lease.id)
      .eq("analysis_type", "scorecard")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingScorecard && !body.force) {
      return jsonResponse({
        leaseId: lease.id,
        reuse: true,
        scorecard: existingScorecard.analysis_data,
      });
    }

    const { data: leaseFields, error: leaseFieldsError } = await serviceClient
      .from("lease_fields")
      .select("field_name, validation_state, extraction_confidence")
      .eq("lease_id", lease.id);

    if (leaseFieldsError) {
      console.error("Failed to fetch lease fields", leaseFieldsError);
      return jsonResponse({ error: "Unable to retrieve lease fields" }, { status: 500 });
    }

    const scoreData = calculateScore(leaseFields ?? []);

    const scorecardPayload = {
      score: scoreData.baseScore,
      totals: {
        fields: leaseFields?.length ?? 0,
        verified: scoreData.verified,
        pending: scoreData.pending,
      },
      riskLevel: scoreData.risk,
      generatedAt: new Date().toISOString(),
    };

    const { error: insertError } = await serviceClient
      .from("lease_analyses")
      .insert({
        lease_id: lease.id,
        user_id: user.id,
        analysis_type: "scorecard",
        analysis_data: scorecardPayload,
      });

    if (insertError) {
      console.error("Failed to store scorecard", insertError);
      return jsonResponse({ error: "Unable to store scorecard" }, { status: 500 });
    }

    return jsonResponse({ leaseId: lease.id, scorecard: scorecardPayload });
  } catch (error) {
    console.error("Scorecard function error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.includes("authenticate") ? 401 : 500;
    return jsonResponse({ error: message }, { status });
  }
});
