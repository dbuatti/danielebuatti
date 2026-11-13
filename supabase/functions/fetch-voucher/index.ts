// Returns a voucher by its public code for the printable /voucher/<code> page.
//
// Deliberately returns a narrow projection: the recipient's name, what the
// voucher is for, the buyer's message, the code and the expiry. It never returns
// the buyer's email, the recipient's email, internal notes or Stripe ids, so the
// page is safe to share a link to.
//
// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import {
  corsHeaders, json, fail, env, formatMoney, describeVoucher,
} from '../_shared/vouchers.ts';

function longDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00Z` : iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    // Support both /?code=... and the path form when deployed behind a rewrite.
    const code = (url.searchParams.get('code') || url.pathname.split('/').pop() || '')
      .trim()
      .toUpperCase();

    if (!code || code.length < 4 || code.length > 40) return fail('A voucher code is required.', 400);

    const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false },
    });

    const { data: v, error } = await supabase
      .from('gift_vouchers')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (error) throw new Error(`gift_vouchers: ${error.message}`);
    if (!v) return fail('That voucher code was not found.', 404);

    const publicView = {
      code: v.code,
      recipientName: v.recipient_name,
      buyerFirstName: (v.buyer_name || '').trim().split(/\s+/)[0] || null,
      what: describeVoucher(v),
      description: v.description,
      message: v.message,
      sessionsTotal: v.sessions_total,
      sessionsRemaining: v.sessions_remaining,
      sessionLengthMinutes: v.session_length_minutes,
      amountCents: v.amount_cents,
      amountLabel: v.amount_cents ? formatMoney(v.amount_cents) : null,
      expiresOn: longDate(v.expires_at),
      expiresIso: v.expires_at,
      status: v.status,
      isExpired: v.status === 'expired' || (v.expires_at && v.expires_at < new Date().toISOString().slice(0, 10)),
      bookingEmail: 'info@danielebuatti.com',
      bookingUrl: 'https://danielebuatti.com/book-voice-piano',
    };

    return json(publicView);
  } catch (error) {
    return fail((error as Error).message, 500);
  }
});