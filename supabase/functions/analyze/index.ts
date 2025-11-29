import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createServiceClient, getUserFromToken } from "../_shared/supabase.ts";
import { getMembership } from "../_shared/org.ts";

interface AnalyzeRequestBody {
  leaseId: string;
  force?: boolean;
  prompt?: string;
}

const jsonResponse = (payload: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

const callAiEndpoint = async (payload: Record<string, unknown>) => {
  const aiEndpoint = Deno.env.get("STAYLL_AI_ENDPOINT");
  const aiApiKey = Deno.env.get("STAYLL_AI_API_KEY");

  if (!aiEndpoint) {
    return {
      summary: "AI endpoint not configured",
      extracted_fields: [],
      confidence: null,
    };
  }

  const response = await fetch(aiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(aiApiKey ? { Authorization: `Bearer ${aiApiKey}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI endpoint error: ${response.status} ${errorText}`);
  }

  return await response.json();
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");

  try {
    const { user } = await getUserFromToken(authHeader);
    const body = (await req.json()) as AnalyzeRequestBody | null;

    if (!body?.leaseId) {
      return jsonResponse({ error: "leaseId is required" }, { status: 400 });
    }

    const serviceClient = createServiceClient();

    const { data: lease, error: leaseError } = await serviceClient
      .from("leases")
      .select("id, org_id, file_key, analysis_data")
      .eq("id", body.leaseId)
      .maybeSingle();

    if (leaseError || !lease) {
      console.error("Lease lookup failed", leaseError);
      return jsonResponse({ error: "Lease not found" }, { status: 404 });
    }

    const membership = await getMembership(serviceClient, user.id);

    if (membership.organization_id !== lease.org_id) {
      return jsonResponse({ error: "Unauthorized for this lease" }, { status: 403 });
    }

    const { data: existingAnalysis } = await serviceClient
      .from("lease_analyses")
      .select("id, analysis_data, created_at, analyzer_version")
      .eq("lease_id", lease.id)
      .eq("analysis_type", "initial")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingAnalysis && !body.force) {
      return jsonResponse({
        leaseId: lease.id,
        reuse: true,
        analysis: existingAnalysis.analysis_data,
        analyzerVersion: existingAnalysis.analyzer_version,
      });
    }

    const aiPayload = {
      lease_id: lease.id,
      file_key: lease.file_key,
      prompt: body.prompt,
    };

    const aiResult = await callAiEndpoint(aiPayload);

    const { data: insertedAnalysis, error: analysisError } = await serviceClient
      .from("lease_analyses")
      .insert({
        lease_id: lease.id,
        user_id: user.id,
        analysis_type: "initial",
        analysis_data: aiResult,
        confidence_score: aiResult?.confidence ?? null,
        analyzer_version: typeof aiResult?.version === "string" ? aiResult.version : null,
      })
      .select("id, analysis_data, analyzer_version")
      .single();

    if (analysisError || !insertedAnalysis) {
      console.error("Failed to insert analysis", analysisError);
      return jsonResponse({ error: "Unable to save analysis" }, { status: 500 });
    }

    await serviceClient
      .from("leases")
      .update({ analysis_data: aiResult?.extracted_fields ?? aiResult })
      .eq("id", lease.id);

    return jsonResponse({
      leaseId: lease.id,
      analysis: insertedAnalysis.analysis_data,
      analyzerVersion: insertedAnalysis.analyzer_version,
    });
  } catch (error) {
    console.error("Analyze function error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.includes("authenticate") ? 401 : 500;
    return jsonResponse({ error: message }, { status });
  }
});
