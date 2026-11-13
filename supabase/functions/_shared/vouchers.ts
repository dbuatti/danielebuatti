// Shared helpers for the gift voucher edge functions.
//
// The voucher tables live in this site's Supabase project. RLS lets the public
// create a pending, unpaid voucher and lets only HUB_ADMIN_EMAILS read or update
// one. Every function here either uses the service role deliberately (Stripe
// webhook, cron) or checks the admin allowlist before touching admin data.

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function fail(message: string, status = 400): Response {
  console.error(`[vouchers] ${message}`);
  return json({ error: message }, status);
}

export const env = (name: string) => (Deno.env.get(name) ?? '').trim();

export interface Pack {
  key: string;
  label: string;
  discipline: string;
  description: string | null;
  sessions_total: number | null;
  session_length_minutes: number | null;
  price_cents: number;
  next_price_cents: number | null;
  next_price_from: string | null;
  is_custom_amount: boolean;
  min_cents: number | null;
  max_cents: number | null;
  is_active: boolean;
}

/**
 * The price that applies today. A scheduled rise (next_price_from) wins once
 * its date has passed, so the kinesiology increase to $285 needs no deploy.
 */
export function effectivePriceCents(pack: Pack, today = new Date()): number {
  if (pack.next_price_cents != null && pack.next_price_from) {
    const from = new Date(`${pack.next_price_from}T00:00:00Z`);
    if (!Number.isNaN(from.getTime()) && from <= today) return pack.next_price_cents;
  }
  return pack.price_cents;
}

/** True when the caller's email is on the admin allowlist. */
export async function requireVoucherAdmin(req: Request, supabase: any): Promise<string | null> {
  const admins = env('HUB_ADMIN_EMAILS')
    .toLowerCase()
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (!admins.length) {
    // Mirrors fetch-business-overview: without the secret we cannot tell an
    // admin from anyone else who made an account.
    console.error('[vouchers] HUB_ADMIN_EMAILS is not set');
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser(req.headers.get('Authorization') ?? '');
  if (error || !user?.email) return null;

  return admins.includes(user.email.toLowerCase()) ? user.email : null;
}

/** A voucher expiry 12 months out, as a plain date string. */
export function expiryTwelveMonths(from = new Date()): string {
  const d = new Date(from);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
}

/**
 * Human sentence describing what a voucher is for.
 * e.g. "Three 30-minute piano lessons" or "A $100 credit".
 */
export function describeVoucher(v: {
  label: string;
  description?: string | null;
  sessions_total?: number | null;
  session_length_minutes?: number | null;
  amount_cents?: number | null;
}): string {
  if (v.sessions_total && v.session_length_minutes) {
    const n = v.sessions_total;
    const count = n === 1 ? 'One' : n === 2 ? 'Two' : n === 3 ? 'Three' : String(n);
    return `${count} × ${v.session_length_minutes}-minute ${v.label.split('·').pop()?.trim() || 'session'}`;
  }
  if (v.amount_cents) return `${formatMoney(v.amount_cents)} credit`;
  return v.description || v.label;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

/** Sends one email through the site's existing email service. */
export async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const endpoint = env('EMAIL_SERVICE_ENDPOINT');
  const apiKey = env('EMAIL_SERVICE_API_KEY');
  const bcc = env('CONTACT_FORM_RECIPIENT_EMAIL');

  if (!endpoint || !apiKey || !bcc) {
    throw new Error('Email service is not configured (EMAIL_SERVICE_ENDPOINT / EMAIL_SERVICE_API_KEY / CONTACT_FORM_RECIPIENT_EMAIL).');
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: 'info@danielebuatti.com',
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      bcc: [bcc],
      ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Email service returned ${res.status}: ${detail.slice(0, 300)}`);
  }
}

/** The warm ivory/navy/magenta shell every voucher email shares. */
export function emailShell(inner: string): string {
  return `
  <div style="margin:0;padding:24px 12px;background:#FAF7F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A2039;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E7E0D5;border-radius:14px;overflow:hidden;">
      <div style="background:#1A2039;padding:28px 32px;text-align:center;">
        <img src="https://danielebuatti.com/blue-pink-ontrans.png" alt="Daniele Buatti" style="height:38px;width:auto;display:block;margin:0 auto;" />
        <p style="margin:14px 0 0;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#D3CBBE;">Gift voucher</p>
      </div>
      <div style="padding:32px;">
        ${inner}
      </div>
      <div style="padding:20px 32px;border-top:1px solid #E7E0D5;text-align:center;">
        <p style="margin:0;font-size:12px;color:#76767C;">
          <a href="mailto:info@danielebuatti.com" style="color:#DB4CA3;text-decoration:none;">info@danielebuatti.com</a>
          &nbsp;·&nbsp; +61 424 174 067
        </p>
        <p style="margin:8px 0 0;font-size:11px;color:#A39E97;">&copy; ${new Date().getFullYear()} Daniele Buatti</p>
      </div>
    </div>
  </div>`;
}

export function voucherCodeBlock(code: string): string {
  return `
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#76767C;">Voucher code</p>
    <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:24px;letter-spacing:0.08em;color:#DB4CA3;font-weight:bold;">${code}</p>`;
}