-- Migration 0040: Schedule AI Article Agent via pg_cron
-- Runs 5 times/day at staggered times to distribute article generation
-- across categories (matching daily_target totals from config: 6/day)

-- Enable pg_cron and pg_net extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove existing jobs if re-running
DO $$
BEGIN
  PERFORM cron.unschedule('generate-articles-1');
  PERFORM cron.unschedule('generate-articles-2');
  PERFORM cron.unschedule('generate-articles-3');
  PERFORM cron.unschedule('generate-articles-4');
  PERFORM cron.unschedule('generate-articles-5');
EXCEPTION WHEN OTHERS THEN
  -- Jobs not found — first run
END;
$$;

-- Schedule 5 staggered invocations (times in UTC; WAT = UTC+1)
-- Slot 1: 06:00 UTC = 07:00 WAT
SELECT cron.schedule(
  'generate-articles-1',
  '0 6 * * *',
  $$SELECT
    net.http_post(
      url:='https://eztaonlpenuzpoosqonx.supabase.co/functions/v1/generate-articles',
      headers:='{"Content-Type": "application/json"}'::jsonb
    ) AS request_id$$
);

-- Slot 2: 09:30 UTC = 10:30 WAT
SELECT cron.schedule(
  'generate-articles-2',
  '30 9 * * *',
  $$SELECT
    net.http_post(
      url:='https://eztaonlpenuzpoosqonx.supabase.co/functions/v1/generate-articles',
      headers:='{"Content-Type": "application/json"}'::jsonb
    ) AS request_id$$
);

-- Slot 3: 13:00 UTC = 14:00 WAT
SELECT cron.schedule(
  'generate-articles-3',
  '0 13 * * *',
  $$SELECT
    net.http_post(
      url:='https://eztaonlpenuzpoosqonx.supabase.co/functions/v1/generate-articles',
      headers:='{"Content-Type": "application/json"}'::jsonb
    ) AS request_id$$
);

-- Slot 4: 16:30 UTC = 17:30 WAT
SELECT cron.schedule(
  'generate-articles-4',
  '30 16 * * *',
  $$SELECT
    net.http_post(
      url:='https://eztaonlpenuzpoosqonx.supabase.co/functions/v1/generate-articles',
      headers:='{"Content-Type": "application/json"}'::jsonb
    ) AS request_id$$
);

-- Slot 5: 20:00 UTC = 21:00 WAT
SELECT cron.schedule(
  'generate-articles-5',
  '0 20 * * *',
  $$SELECT
    net.http_post(
      url:='https://eztaonlpenuzpoosqonx.supabase.co/functions/v1/generate-articles',
      headers:='{"Content-Type": "application/json"}'::jsonb
    ) AS request_id$$
);