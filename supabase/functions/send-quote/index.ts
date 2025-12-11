// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { format } from 'https://esm.sh/date-fns@3.6.0';

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

    const { quoteId, recipientEmail, subject, htmlBody } = await req.json();

    if (!quoteId || !recipientEmail || !subject || !htmlBody) {
      return new Response(JSON.stringify({ error: 'Missing required fields for sending email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Update quote status to 'Sent'
    const { data: updatedRecord, error: updateError } = await supabaseClient
      .from('invoices')
      .update({ status: 'Sent' })
      .eq('id', quoteId)
      .select('id, slug, client_name, event_title')
      .single();

    if (updateError || !updatedRecord) {
      console.error('Supabase update error:', updateError);
      throw new Error(`Failed to update quote status to Sent: ${updateError?.message}`);
    }

    // 2. Send the email
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (!EMAIL_SERVICE_API_KEY || !CONTACT_FORM_RECIPIENT_EMAIL || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Missing email service environment variables for sending quote.');
      // Log error but proceed with success since DB update was successful
      return new Response(JSON.stringify({ message: 'Quote status updated, but email notification failed due to server config.', slug: updatedRecord.slug }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailResponse = await fetch(EMAIL_SERVICE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'info@danielebuatti.com',
        to: recipientEmail,
        subject: subject,
        html: htmlBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Email service error for sending quote:', errorData);
      throw new Error(`Failed to send quote email: ${emailResponse.statusText}`);
    }

    console.log(`Quote email sent successfully to ${recipientEmail}!`);

    return new Response(JSON.stringify({ message: 'Quote sent successfully!', slug: updatedRecord.slug }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Edge Function error:', (error as Error).message);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});