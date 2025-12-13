# Stayll AI Background Jobs

Supabase supports HTTP cron jobs that invoke Edge Functions. Use the following schedule to keep audits up to date without leaving the free tier.

## Nightly obligation refresh (recommended)

- **Function**: `scorecard`
- **Endpoint**: `https://ktmgqbgrntgkzencxqhs.supabase.co/functions/v1/scorecard`
- **Schedule**: `0 7 * * *` (07:00 UTC)
- **Payload**: `{ "leaseId": "<uuid>", "force": true }`
- **Auth header**: `Bearer <service role key>`

Invoke the function once per active lease. If the portfolio grows, move to a queue-based worker (Cloudflare Worker + Supabase Queues).

## AI reanalysis retry

- **Function**: `analyze`
- **Schedule**: `*/30 * * * *`
- **Payload**: `{ "leaseId": "<uuid>", "force": true }`
- **Purpose**: Retry failed or stale analyses after upstream outages.

## How to schedule via Supabase Dashboard

1. Go to **Project Settings → Schedules**.
2. Click **Create job**, choose `HTTPS request`.
3. Paste the Edge Function URL and select POST.
4. Add the JSON payload. For multiple leases, either create separate jobs or trigger a batch Edge Function that iterates over leases.
5. Set the `Authorization` header to `Bearer ${SUPABASE_SERVICE_ROLE}`. Store this value in Supabase Secrets so it is not visible in the UI.
6. Save to activate.

## Alternative: Worker-based orchestrator

If you prefer a code workflow, deploy a Cloudflare Worker that:

1. Runs on a cron schedule (e.g., hourly).
2. Fetches leases with stale `analysis_data` using the Supabase service key.
3. Invokes `analyze` and `scorecard` Edge Functions sequentially.

This avoids creating many dashboard jobs and keeps API keys outside the Supabase UI.

---

> Tip: As Edge Functions expect a `leaseId`, consider adding a helper function that loops through a list of IDs so the scheduled payload stays tiny. You can place it in `supabase/functions/reanalyse/index.ts` when ready.
