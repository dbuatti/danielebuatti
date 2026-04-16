// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@16.2.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'No items provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.title,
          description: `Arrangement by ${item.composer || 'Unknown'}`,
          metadata: {
            arrangement_id: item.id,
          },
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/store?canceled=true`,
      metadata: {
        arrangement_ids: items.map((i: any) => i.id).join(','),
        type: 'arrangement_purchase'
      },
    });

    console.log(`[create-checkout-session] Created session: ${session.id}`);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error(`[create-checkout-session] Error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});