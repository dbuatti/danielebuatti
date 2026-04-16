// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@16.2.0?target=deno';
import { generateGiftCardCode } from '../_shared/utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      return new Response(JSON.stringify({ error: 'Missing Stripe-Signature header or webhook secret.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err: any) {
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      const type = session.metadata?.type;

      if (type === 'arrangement_purchase') {
        const arrangementIds = session.metadata?.arrangement_ids?.split(',') || [];
        const purchaseData = session.metadata?.purchase_data ? JSON.parse(session.metadata.purchase_data) : null;
        const buyerEmail = session.customer_details?.email;

        if (buyerEmail) {
          await supabaseClient.functions.invoke('send-arrangement-email', {
            body: {
              buyerEmail: buyerEmail,
              arrangementIds: arrangementIds,
              purchaseData: purchaseData,
            },
          });
        }
      } else {
        // Gift card logic...
        const giftCardName = session.metadata?.giftCardName || session.line_items?.data[0]?.description || "Gift Card";
        const value = (session.amount_total ?? 0) / 100;
        const buyerEmail = session.customer_details?.email;
        const stripeCheckoutSessionId = session.id;
        const giftCardType = session.metadata?.giftCardType || (giftCardName.toLowerCase().includes('credit') ? 'open_credit' : 'fixed_session');
        const expirationDate = session.metadata?.expirationDate || null;

        if (buyerEmail) {
          const redemptionCode = generateGiftCardCode();
          await supabaseClient.from('gift_cards').insert([{
            name: giftCardName,
            type: giftCardType,
            value: value,
            code: redemptionCode,
            email: buyerEmail,
            purchased_at: new Date().toISOString(),
            payment_status: 'paid',
            redemption_status: 'unused',
            amount_redeemed: 0,
            remaining_balance: value,
            stripe_checkout_session_id: stripeCheckoutSessionId,
            expiration_date: expirationDate,
            notes: `Purchased via Stripe Checkout Session ${stripeCheckoutSessionId}`,
            status: 'active',
          }]);

          await supabaseClient.functions.invoke('send-gift-card-email', {
            body: {
              buyerEmail: buyerEmail,
              giftCardName: giftCardName,
              value: value,
              redemptionCode: redemptionCode,
              expirationDate: expirationDate,
              type: giftCardType,
            },
          });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[stripe-webhook] Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});