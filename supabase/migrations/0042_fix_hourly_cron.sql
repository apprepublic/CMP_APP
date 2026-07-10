-- Fix: Replace old 5-slot daily cron with a single hourly cron
-- The old migration 0040 used wrong job names (generate-articles-hourly-1 etc)
-- while the actual job names in cron.job were just 'generate-articles' (jobid 2-6)

-- Remove old 5-slot jobs
SELECT cron.unschedule(2);
SELECT cron.unschedule(3);
SELECT cron.unschedule(4);
SELECT cron.unschedule(5);
SELECT cron.unschedule(6);

-- Create hourly schedule at minute 5 past
SELECT cron.schedule(
  'generate-articles-hourly',
  '5 * * * *',
  'SELECT net.http_post(url:=''https://eztaonlpenuzpoosqonx.supabase.co/functions/v1/generate-articles'', headers:=''{\"Content-Type\": \"application/json\"}''::jsonb) AS request_id'
);
