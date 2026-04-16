// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { quoteId, clientName, clientEmail, finalTotal, finalSelectedAddOns } = await req.json();

    if (!quoteId || !clientName || !clientEmail || finalTotal === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch existing quote and VERIFY EMAIL (IDOR Fix)
    const { data: existingQuote, error: fetchError } = await supabaseClient
      .from('invoices')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (fetchError || !existingQuote) {
      throw new Error(`Quote not found.`);
    }

    // Security Check: Ensure the email matches the record
    if (existingQuote.client_email.toLowerCase() !== clientEmail.toLowerCase()) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Email does not match the quote record.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const versions = existingQuote.details.versions || [];
    const activeVersion = versions.find(v => v.is_active);

    if (!activeVersion) throw new Error('No active version found.');
    if (activeVersion.accepted_at) throw new Error('Quote already accepted.');

    const acceptedAt = new Date().toISOString();

    // 2. Update the active version
    const updatedVersions = versions.map(v => {
        if (v.versionId === activeVersion.versionId) {
            return {
                ...v,
                accepted_at: acceptedAt,
                status: 'Accepted',
                total_amount: finalTotal,
                client_selected_add_ons: finalSelectedAddOns,
            };
        }
        return v;
    });

    // 3. Update the main record
    const { error: updateError } = await supabaseClient
      .from('invoices')
      .update({
        accepted_at: acceptedAt,
        status: 'Accepted',
        total_amount: finalTotal,
        details: { versions: updatedVersions },
      })
      .eq('id', quoteId);

    if (updateError) throw updateError;

    // 4. Send Notifications (Admin & Client)
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (EMAIL_SERVICE_API_KEY && EMAIL_SERVICE_ENDPOINT) {
      // Admin Email
      await fetch(EMAIL_SERVICE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}` },
        body: JSON.stringify({
          from: 'info@danielebuatti.com',
          to: CONTACT_FORM_RECIPIENT_EMAIL,
          subject: `🎉 Quote Accepted: ${existingQuote.event_title} from ${clientName}`,
          html: `<p>${clientName} has accepted the quote for ${existingQuote.event_title}. Total: ${activeVersion.currencySymbol}${finalTotal.toFixed(2)}</p>`,
        }),
      });
    }

    return new Response(JSON.stringify({ message: 'Quote accepted successfully.' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});