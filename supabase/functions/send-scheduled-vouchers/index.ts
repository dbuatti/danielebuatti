// Daily job: sends the recipient emails whose send date has arrived, and marks
// any paid voucher past its expiry as expired.
//
// Run by pg_cron (see 0011_voucher_cron.sql). Also safe to invoke by hand from
// the admin.
//
// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders, json, fail, env } from '../_shared/vouchers.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false },
    });

    // 1. Expire anything paid that is past its expiry date.
    const { data: expired, error: expireError } = await supabase.rpc('expire_stale_vouchers');
    if (expireError) throw new Error(`expire_stale_vouchers: ${expireError.message}`);

    // 2. Send recipient emails whose scheduled date is today or earlier and
    //    which have not already been sent.
    const today = new Date().toISOString().slice(0, 10);

    const { data: due, error: dueError } = await supabase
      .from('gift_vouchers')
      .select('id, code')
      .eq('status', 'paid')
      .not('send_recipient_on', 'is', null)
      .lte('send_recipient_on', today)
      .is('recipient_sent_at', null);

    if (dueError) throw new Error(`gift_vouchers: ${dueError.message}`);

    let sent = 0;
    const failures: string[] = [];

    for (const v of due ?? []) {
      try {
        const { error } = await supabase.functions.invoke('send-voucher-email', {
          body: { voucherId: v.id, kind: 'recipient' },
        });
        if (error) failures.push(`${v.code}: ${error.message}`);
        else sent += 1;
      } catch (e) {
        failures.push(`${v.code}: ${(e as Error).message}`);
      }
    }

    // 3. Clear out checkouts that were opened and never paid. Seven days is
    //    long enough that a slow bank card can still complete; without this the
    //    list slowly fills with rows that were never real.
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: abandoned, error: abandonError } = await supabase
      .from('gift_vouchers')
      .delete({ count: 'exact' })
      .eq('status', 'pending')
      .is('paid_at', null)
      .lt('created_at', cutoff);

    if (abandonError) {
      // A cleanup failure shouldn't stop the scheduled sends above.
      console.error(`[send-scheduled-vouchers] could not clear abandoned checkouts: ${abandonError.message}`);
    }

    console.log(
      `[send-scheduled-vouchers] expired=${expired ?? 0} sent=${sent} failed=${failures.length} abandoned=${abandoned ?? 0}`,
    );
    return json({
      expired: expired ?? 0,
      sent,
      failed: failures.length,
      failures,
      abandoned: abandoned ?? 0,
    });
  } catch (error) {
    return fail((error as Error).message, 500);
  }
});