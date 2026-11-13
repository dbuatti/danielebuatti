// Creates a Stripe Checkout session for a gift voucher and records the pending
// voucher. The voucher is only marked paid by the Stripe webhook, so a browser
// that closes the checkout window can never produce a paid voucher.
//
// The price is always looked up server-side from voucher_packs. A client can
// choose which pack it wants, never what it costs.
//
// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@16.2.0?target=deno';
import {
  corsHeaders, json, fail, env, effectivePriceCents, expiryTwelveMonths,
  isValidEmail, describeVoucher, type Pack,
} from '../_shared/vouchers.ts';

const MIN_CUSTOM_CENTS = 5000;   // $50 — also clears Stripe's AUD minimum comfortably
const MAX_CUSTOM_CENTS = 500000; // $5,000

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail('Invalid JSON body');

    const packKey = String(body.packKey ?? '').trim();
    const buyerName = String(body.buyerName ?? '').trim();
    const buyerEmail = String(body.buyerEmail ?? '').trim();
    const recipientName = String(body.recipientName ?? '').trim();
    const recipientEmail = String(body.recipientEmail ?? '').trim();
    const message = String(body.message ?? '').trim().slice(0, 1000);
    const sendRecipientOn = String(body.sendRecipientOn ?? '').trim();
    const customAmount = Number(body.customAmount);

    if (!packKey) return fail('Choose a voucher.');
    if (buyerName.length < 2) return fail('Enter your name.');
    if (!isValidEmail(buyerEmail)) return fail('Enter a valid email address for the receipt.');

    // Recipient email is optional: the buyer may want the PDF to give by hand.
    if (recipientEmail && !isValidEmail(recipientEmail)) {
      return fail('Enter a valid recipient email, or leave it blank.');
    }

    // A scheduled send date only makes sense with a recipient email.
    let sendOn: string | null = null;
    if (sendRecipientOn) {
      if (!recipientEmail) return fail('Add a recipient email to schedule the send.');
      const d = new Date(`${sendRecipientOn}T00:00:00Z`);
      if (Number.isNaN(d.getTime())) return fail('That send date is not valid.');
      sendOn = d.toISOString().slice(0, 10);
    }

    const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false },
    });

    // ---- resolve the pack and its price from the database ----
    const { data: pack, error: packError } = await supabase
      .from('voucher_packs')
      .select('*')
      .eq('key', packKey)
      .maybeSingle();

    if (packError) throw new Error(`voucher_packs: ${packError.message}`);
    if (!pack || !(pack as Pack).is_active) return fail('That voucher is not available.', 404);

    const p = pack as Pack;
    const priceCents = p.is_custom_amount
      ? Math.round((Number.isFinite(customAmount) ? customAmount : 0) * 100)
      : effectivePriceCents(p);

    if (p.is_custom_amount) {
      const min = p.min_cents ?? MIN_CUSTOM_CENTS;
      const max = p.max_cents ?? MAX_CUSTOM_CENTS;
      if (!Number.isFinite(priceCents) || priceCents < min) {
        return fail(`The minimum custom amount is $${(min / 100).toFixed(0)}.`);
      }
      if (priceCents > max) {
        return fail(`The maximum custom amount is $${(max / 100).toFixed(0)}.`);
      }
    }

    // ---- create the Stripe session ----
    const stripeSecret = env('STRIPE_SECRET_KEY');
    if (!stripeSecret) return fail('Stripe is not configured.', 500);

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const origin = req.headers.get('origin') || 'https://danielebuatti.com';
    const productName = p.is_custom_amount
      ? `${p.label} — $${(priceCents / 100).toFixed(0)}`
      : p.label;

    // ---- record the pending voucher first ----
    // The voucher is written before the Stripe session so its code can be put
    // in the return URL: the success page shows the printable voucher straight
    // away, and RLS never has to expose the table to the browser. The unique
    // index on stripe_checkout_session_id still stops a retry from creating a
    // second voucher, and the webhook only ever finds a paid voucher by that id.
    const { data: code, error: codeError } = await supabase
      .rpc('generate_voucher_code', { p_discipline: p.discipline });

    if (codeError || !code) {
      throw new Error(`Could not generate a voucher code: ${codeError?.message ?? 'no code returned'}`);
    }

    const { data: voucher, error: insertError } = await supabase
      .from('gift_vouchers')
      .insert({
        code,
        pack_key: p.key,
        discipline: p.discipline,
        label: p.label,
        description: p.description,
        sessions_total: p.sessions_total,
        sessions_remaining: p.sessions_total,
        session_length_minutes: p.session_length_minutes,
        // What was actually paid, in cents. Recorded for every voucher so
        // income can be reported from the voucher row alone, without joining
        // back to a price list that may have changed since.
        amount_cents: priceCents,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        recipient_name: recipientName || null,
        recipient_email: recipientEmail || null,
        message: message || null,
        send_recipient_on: sendOn,
        status: 'pending',
        expires_at: expiryTwelveMonths(),
      })
      .select('id, code')
      .single();

    if (insertError) throw new Error(`Could not save the voucher: ${insertError.message}`);

    // ---- create the Stripe session ----
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: buyerEmail,
        line_items: [{
          quantity: 1,
          price_data: {
            currency: 'aud',
            unit_amount: priceCents,
            product_data: {
              name: productName,
              description: p.is_custom_amount
                ? 'A dollar credit to put towards any session.'
                : (p.description || describeVoucher(p)),
            },
          },
        }],
        success_url: `${origin}/gift/success?code=${encodeURIComponent(voucher.code)}`,
        cancel_url: `${origin}/gift?canceled=1`,
        metadata: {
          type: 'gift_voucher',
          pack_key: p.key,
          voucher_code: voucher.code,
          buyer_name: buyerName.slice(0, 200),
          buyer_email: buyerEmail.slice(0, 200),
          recipient_name: recipientName.slice(0, 200),
          recipient_email: recipientEmail.slice(0, 200),
          message,
          send_recipient_on: sendOn ?? '',
        },
      });
    } catch (stripeError) {
      // No session means no way to pay, so don't leave the pending row behind.
      await supabase.from('gift_vouchers').delete().eq('id', voucher.id);
      throw stripeError;
    }

    const { error: linkError } = await supabase
      .from('gift_vouchers')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', voucher.id);

    if (linkError) throw new Error(`Could not link the voucher to checkout: ${linkError.message}`);

    console.log(`[create-voucher-checkout] ${session.id} -> voucher ${voucher.code}`);

    return json({ url: session.url, voucherId: voucher.id, code: voucher.code });
  } catch (error) {
    return fail((error as Error).message, 500);
  }
});