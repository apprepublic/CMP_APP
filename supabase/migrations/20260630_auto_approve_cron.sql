-- Enable pg_cron and pg_net extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove existing job if re-running (handles first run gracefully)
DO $$
BEGIN
  PERFORM cron.unschedule('auto-approve-completions');
EXCEPTION WHEN OTHERS THEN
  -- Job not found — first run
END;
$$;

-- Schedule the edge function every hour
SELECT cron.schedule(
  'auto-approve-completions',
  '0 * * * *',
  $$SELECT
    net.http_post(
      url:='https://eztaonlpenuzpoosqonx.supabase.co/functions/v1/auto-approve-completions',
      headers:='{"Content-Type": "application/json"}'::jsonb
    ) AS request_id$$
);
