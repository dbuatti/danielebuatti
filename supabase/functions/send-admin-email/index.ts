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
    // Create a Supabase client with the service role key to bypass RLS for fetching templates
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use SERVICE_ROLE_KEY
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { recipientEmail, subject, body } = await req.json();

    if (!recipientEmail || !subject || !body) {
      return new Response(JSON.stringify({ error: 'Missing required email fields (recipient, subject, body)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Retrieve secrets for email service
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (!EMAIL_SERVICE_API_KEY || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Edge Function: Missing email service environment variables. Check EMAIL_SERVICE_API_KEY, EMAIL_SERVICE_ENDPOINT.');
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing email service credentials.' }), {
        status: 500,
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
        from: 'info@danielebuatti.com', // Ensure this is a verified sender in your email service
        to: recipientEmail,
        subject: subject,
        html: body, // Assuming the body is HTML content
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Edge Function: Email service error - Status:', emailResponse.status, 'Body:', errorData);
      throw new Error(`Failed to send email: ${emailResponse.statusText} - ${JSON.stringify(errorData)}`);
    }

    console.log(`Edge Function: Email sent successfully to ${recipientEmail}!`);

    return new Response(JSON.stringify({ message: `Email sent successfully to ${recipientEmail}.` }), {
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