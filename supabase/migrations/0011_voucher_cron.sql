-- Daily scheduled work for gift vouchers:
--   * send recipient emails whose send date has arrived
--   * mark paid vouchers past their expiry as expired
--
-- Runs the send-scheduled-vouchers edge function once a day at 8:00am UTC
-- (7:00pm AEDT / 6:00pm AEST), a civilised hour to receive a gift.
--
-- No service role key is needed here: the edge function reads
-- SUPABASE_SERVICE_ROLE_KEY from its own environment, which Supabase injects
-- automatically. The cron job only needs to reach the function, which is why
-- send-scheduled-vouchers is deployed with verify_jwt = false
-- (see supabase/config.toml).

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Safe to re-run: drop any earlier schedule with this name first.
SELECT cron.unschedule('send-scheduled-vouchers')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-scheduled-vouchers');

SELECT cron.schedule(
  'send-scheduled-vouchers',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://shkwqfggbcqtaedfxvwd.supabase.co/functions/v1/send-scheduled-vouchers',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);

-- ------------------------------------------------------- admin allowlist
-- Mirrors HUB_ADMIN_EMAILS so Postgres RLS can check it. Keep in step with the
-- Edge Function secret; the table is read-only from the browser.

INSERT INTO public.voucher_admins (email)
VALUES ('daniele.buatti@gmail.com')
ON CONFLICT (email) DO NOTHING;