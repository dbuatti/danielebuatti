// Sends one of the two voucher emails:
//   kind=receipt    -> the buyer, with the voucher details and a link to print
//   kind=recipient  -> the recipient, with the buyer's message
//
// The PDF itself is rendered in the browser from /voucher/<code> and printed by
// the buyer, so no attachment handling is needed here.
//
// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import {
  corsHeaders, json, fail, env, formatMoney, describeVoucher,
  emailShell, voucherCodeBlock, sendEmail, isValidEmail,
} from '../_shared/vouchers.ts';

const SITE = 'https://danielebuatti.com';

function longDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00Z` : iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Escapes the buyer's message before it goes into HTML. */
function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #F3EEE6;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#76767C;width:42%;vertical-align:top;">${label}</td>
      <td style="padding:9px 0;border-bottom:1px solid #F3EEE6;font-size:15px;color:#1A2039;">${value}</td>
    </tr>`;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  try {
    const { voucherId, kind } = await req.json().catch(() => null);
    if (!voucherId || !['receipt', 'recipient'].includes(kind)) {
      return fail('voucherId and kind ("receipt" | "recipient") are required.');
    }

    const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false },
    });

    const { data: v, error } = await supabase
      .from('gift_vouchers')
      .select('*')
      .eq('id', voucherId)
      .maybeSingle();

    if (error) throw new Error(`gift_vouchers: ${error.message}`);
    if (!v) return fail('Voucher not found.', 404);
    if (v.status === 'pending') return fail('Cannot email a voucher that is not paid yet.', 409);

    const voucherUrl = `${SITE}/voucher/${v.code}`;
    const what = describeVoucher(v);
    const expires = longDate(v.expires_at);

    let to: string;
    let subject: string;
    let inner: string;

    if (kind === 'receipt') {
      to = v.buyer_email;
      if (!isValidEmail(to)) return fail('The voucher has no valid buyer email.');

      subject = `Your Daniele Buatti gift voucher ${v.code}`;

      inner = `
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#DB4CA3;">Payment received</p>
        <h1 style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;color:#1A2039;">Thank you, ${esc(v.buyer_name)}</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#585C6B;">
          ${v.recipient_name
            ? `Your gift for <strong style="color:#1A2039;">${esc(v.recipient_name)}</strong> is ready.`
            : 'Your gift voucher is ready.'}
        </p>

        <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
          ${detailRow('Voucher for', esc(what))}
          ${detailRow('Valid until', expires)}
          ${v.recipient_name ? detailRow('Recipient', esc(v.recipient_name)) : ''}
          ${v.message ? detailRow('Your message', `<em>“${esc(v.message)}”</em>`) : ''}
          ${v.amount_cents && !v.sessions_total ? detailRow('Value', formatMoney(v.amount_cents)) : ''}
        </table>

        <div style="background:#FAF7F2;border:1px dashed #D3CBBE;border-radius:10px;padding:18px;text-align:center;margin:0 0 24px;">
          ${voucherCodeBlock(v.code)}
          <p style="margin:8px 0 0;font-size:12px;color:#76767C;">Quote this code when you book.</p>
        </div>

        <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#585C6B;">
          ${v.recipient_email && !v.send_recipient_on
            ? `We've also emailed it to ${esc(v.recipient_email)}.`
            : v.send_recipient_on
              ? `We'll email it to ${esc(v.recipient_email)} on ${longDate(v.send_recipient_on)}.`
              : 'To give it as a gift, open the link below and print it.'}
        </p>

        <p style="margin:24px 0 0;text-align:center;">
          <a href="${voucherUrl}" style="display:inline-block;background:#DB4CA3;color:#FFFFFF;text-decoration:none;padding:14px 30px;border-radius:999px;font-size:15px;font-weight:600;">View &amp; print the voucher</a>
        </p>

        <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#76767C;text-align:center;">
          To book, email <a href="mailto:info@danielebuatti.com" style="color:#DB4CA3;">info@danielebuatti.com</a>,
          book online at <a href="${SITE}/book-voice-piano" style="color:#DB4CA3;">danielebuatti.com/book-voice-piano</a>,
          and quote your code.
        </p>`;
    } else {
      if (!isValidEmail(v.recipient_email)) return fail('This voucher has no recipient email.');

      to = v.recipient_email;
      subject = v.buyer_name
        ? `${v.buyer_name} has given you a gift voucher`
        : 'You have been given a gift voucher';

      inner = `
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#DB4CA3;">A gift for you</p>
        <h1 style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;color:#1A2039;">
          ${v.recipient_name ? `Dear ${esc(v.recipient_name)},` : 'Hello,'}
        </h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#585C6B;">
          ${esc(v.buyer_name)} has given you a gift voucher for ${esc(what)}.
        </p>

        ${v.message ? `
        <blockquote style="margin:0 0 24px;padding:16px 20px;border-left:3px solid #DB4CA3;background:#FAF7F2;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-style:italic;line-height:1.6;color:#1A2039;">
          ${esc(v.message)}
        </blockquote>` : ''}

        <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
          ${detailRow('Your voucher', esc(what))}
          ${detailRow('Valid until', expires)}
          ${v.amount_cents && !v.sessions_total ? detailRow('Value', formatMoney(v.amount_cents)) : ''}
        </table>

        <div style="background:#FAF7F2;border:1px dashed #D3CBBE;border-radius:10px;padding:18px;text-align:center;margin:0 0 24px;">
          ${voucherCodeBlock(v.code)}
          <p style="margin:8px 0 0;font-size:12px;color:#76767C;">Quote this code when you book.</p>
        </div>

        <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#585C6B;">
          To book, email <a href="mailto:info@danielebuatti.com" style="color:#DB4CA3;">info@danielebuatti.com</a>
          or book online at <a href="${SITE}/book-voice-piano" style="color:#DB4CA3;">danielebuatti.com/book-voice-piano</a>
          and quote your code.
        </p>

        <p style="margin:24px 0 0;text-align:center;">
          <a href="${voucherUrl}" style="display:inline-block;background:#DB4CA3;color:#FFFFFF;text-decoration:none;padding:14px 30px;border-radius:999px;font-size:15px;font-weight:600;">View your voucher</a>
        </p>`;
    }

    await sendEmail({ to, subject, html: emailShell(inner), replyTo: v.buyer_email });

    const stamp = kind === 'receipt' ? { buyer_receipt_sent_at: new Date().toISOString() } : { recipient_sent_at: new Date().toISOString() };
    await supabase.from('gift_vouchers').update(stamp).eq('id', v.id);

    console.log(`[send-voucher-email] ${kind} sent to ${to} for ${v.code}`);
    return json({ sent: true, to, kind });
  } catch (error) {
    return fail((error as Error).message, 500);
  }
});