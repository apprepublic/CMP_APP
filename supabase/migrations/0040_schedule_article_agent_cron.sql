-- Migration 0040: Schedule AI Article Agent via pg_cron
-- Runs 24 times/day (hourly) to ensure continuous article generation
-- with immediate retry on failure/flagging until successful insertion

-- Enable pg_cron and pg_net extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove existing jobs if re-running
DO $$
BEGIN
  PERFORM cron.unschedule('generate-articles-hourly');
EXCEPTION WHEN OTHERS THEN
  -- Job not found — first run
END;
$$;

-- Schedule hourly at minute 5 past the hour (05, 65, 125... minutes past midnight UTC)
-- This gives 24 runs/day: 00:05, 01:05, 02:05, ..., 23:05 UTC
-- WAT = UTC+1, so this is 01:05, 02:05, ..., 00:05 WAT
SELECT cron.schedule(
  'generate-articles-hourly',
  '5 * * * *',
  $$SELECT
    net.http_post(
      url:='https://eztaonlpenuzpoosqonx.supabase.co/functions/v1/generate-articles',
      headers:='{"Content-Type": "application/json"}'::jsonb
    ) AS request_id$$
);