// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@16.2.0?target=deno'; // Import Stripe for webhook verification
import { generateGiftCardCode } from '../_shared/utils.ts'; // Import your utility function

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
      apiVersion: '2024-06-20', // Use your desired API version
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      console.error("[stripe-webhook] Missing Stripe-Signature header or webhook secret.");
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
      console.error(`[stripe-webhook] Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[stripe-webhook] Received checkout.session.completed event for session: ${session.id}`);

      // Create a Supabase client with the service role key to bypass RLS
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        {
          auth: {
            persistSession: false,
          },
        }
      );

      // Extract relevant information
      const giftCardName = session.metadata?.giftCardName || session.line_items?.data[0]?.description || "Gift Card";
      const value = (session.amount_total ?? 0) / 100; // Convert cents to AUD
      const buyerEmail = session.customer_details?.email;
      const stripeCheckoutSessionId = session.id;

      // Determine gift card type based on metadata or name (you might need to refine this logic)
      const giftCardType = session.metadata?.giftCardType || (giftCardName.toLowerCase().includes('credit') ? 'open_credit' : 'fixed_session');
      const expirationDate = session.metadata?.expirationDate || null; // Assuming expiration date can be passed via metadata

      if (!buyerEmail) {
        console.error(`[stripe-webhook] No buyer email found for session ${session.id}. Skipping gift card creation.`);
        return new Response(JSON.stringify({ received: true, message: 'No buyer email, skipping gift card creation.' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate a unique redemption code
      const redemptionCode = generateGiftCardCode(); // Using your existing utility

      // Insert data into the 'gift_cards' table
      const { data: newGiftCard, error: insertError } = await supabaseClient
        .from('gift_cards')
        .insert([
          {
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
            stripe_product_id: session.line_items?.data[0]?.price?.product as string || null, // If product ID is available
            stripe_payment_link: session.url || null, // Link to the checkout session
            stripe_checkout_session_id: stripeCheckoutSessionId, // Store the checkout session ID
            expiration_date: expirationDate,
            notes: `Purchased via Stripe Checkout Session ${stripeCheckoutSessionId}`,
            status: 'active', // FIX: Explicitly set status to 'active'
          },
        ])
        .select()
        .single();

      if (insertError) {
        // Handle potential duplicate entry if webhook is retried
        if (insertError.code === '23505' && insertError.message.includes('stripe_checkout_session_id')) {
          console.warn(`[stripe-webhook] Duplicate checkout session ID ${stripeCheckoutSessionId}. Gift card already processed.`);
          return new Response(JSON.stringify({ received: true, message: 'Gift card already processed.' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        console.error(`[stripe-webhook] Supabase insert error for gift card: ${insertError.message}`);
        throw new Error(`Failed to save gift card: ${insertError.message}`);
      }

      console.log(`[stripe-webhook] Gift card ${newGiftCard.id} saved successfully.`);

      // Trigger email confirmation
      const { error: emailError } = await supabaseClient.functions.invoke('send-gift-card-email', {
        body: {
          buyerEmail: buyerEmail,
          giftCardName: giftCardName,
          value: value,
          redemptionCode: redemptionCode,
          expirationDate: expirationDate,
          type: giftCardType,
        },
      });

      if (emailError) {
        console.error(`[stripe-webhook] Error invoking send-gift-card-email: ${emailError.message}`);
        // Don't throw, as the gift card is already saved. Just log the email error.
      } else {
        console.log(`[stripe-webhook] Triggered email for gift card ${newGiftCard.id}.`);
      }
    } else {
      console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[stripe-webhook] Edge Function error:', (error as Error).message);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});