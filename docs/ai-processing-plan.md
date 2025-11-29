# AI Processing & Caching Plan (Stayll AI)

## Pipeline overview

1. **Upload ingestion** – `/upload` Edge Function creates a lease record and returns signed URL.
2. **OCR/Text extraction** – External worker (Textract or Vertex Document AI) saves normalized text back to Supabase (table `lease_analyses` with `analysis_type = 'ocr'`).
3. **AI extraction** – `/analyze` Edge Function calls `STAYLL_AI_ENDPOINT` with `{ lease_id, file_key, prompt }`.
4. **Validation layer** – Deterministic checks run inside the Edge Function before persisting, using Zod schema + financial rules.
5. **Scorecard** – `/scorecard` Edge Function derives health metrics from `lease_fields` and `lease_analyses`.

## Caching strategy

- **Primary cache**: `lease_analyses` table.
  - `analysis_type = 'initial'` → cached AI extraction JSON.
  - `analysis_type = 'scorecard'` → deterministic metrics.
  - `analysis_type = 'ocr'` → raw text payload.
- **Invalidation**: pass `force: true` in function body to skip cache. Automatic invalidation when a new contract version (future `contract_versions` table) is inserted.
- **External cache**: optional Supabase KV (pgvector extension or `pgmq`) storing recent AI responses keyed by SHA-256 of text content + model version.

## Deterministic validation (Edge Function layer)

- Use [`zod`](https://github.com/colinhacks/zod) inside Edge Functions (bundled via Deno) for schema enforcement.
- Cross-check numeric totals: compare `base_rent * months` vs `rent_schedule` totals.
- Flag missing clauses → store warning list in `analysis_data.validation_warnings`.

## Environment variables

Set in Supabase project or Vercel build settings:

- `STAYLL_AI_ENDPOINT` – HTTPS endpoint that wraps Vertex or other model provider.
- `STAYLL_AI_API_KEY` – Bearer token for the AI endpoint.
- `SUPABASE_SERVICE_ROLE_KEY` – already configured locally.
- `SUPABASE_ANON_KEY` – required for Edge auth bridging.
- `FEEDBACK_WEBHOOK_URL` – optional Slack/Linear integration.

## Follow-up tasks

- [ ] Implement OCR worker that writes to `lease_analyses` with type `ocr`.
- [ ] Move deterministic validation helpers into shared module (`supabase/functions/_shared/validation.ts`).
- [ ] Add `lease_versions` table to track re-uploads.
- [ ] Emit PostHog events from Edge Functions for observability.
