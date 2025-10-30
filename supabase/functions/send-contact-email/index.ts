/// <reference types="./deno.d.ts" />

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// Removed unused import: import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => { // Added type annotation for 'req'
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // This function is triggered by a database insert, so it doesn't need its own supabaseClient for database operations.
    // The 'record' comes from the trigger payload.

    const payload = await req.json();
    const { record } = payload; // The new contact_message record

    if (!record) {
      console.error('Edge Function: No record found in payload');
      return new Response(JSON.stringify({ error: 'No record found in payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { name, email, message, created_at } = record;

    // Retrieve secrets for email service
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (!EMAIL_SERVICE_API_KEY || !CONTACT_FORM_RECIPIENT_EMAIL || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Edge Function: Missing email service environment variables. Check EMAIL_SERVICE_API_KEY, CONTACT_FORM_RECIPIENT_EMAIL, EMAIL_SERVICE_ENDPOINT.');
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing email service credentials.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `New Contact Form Submission from ${name}`;
    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #00022D; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #DB4CA3; text-align: center; margin-bottom: 20px;">New Contact Form Submission</h2>
          <p style="font-size: 16px; line-height: 1.6;">A new message has been submitted through the contact form on your website:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 100px;">Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><a href="mailto:${email}" style="color: #DB4CA3; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold;">Submitted On:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">${new Date(created_at).toLocaleString()}</td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
            This message was sent from your website's contact form.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await fetch(EMAIL_SERVICE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'info@danielebuatti.com',
        to: CONTACT_FORM_RECIPIENT_EMAIL,
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Edge Function: Email service error - Status:', emailResponse.status, 'Body:', errorData);
      throw new Error(`Failed to send email: ${emailResponse.statusText} - ${JSON.stringify(errorData)}`);
    }

    console.log(`Edge Function: Email notification sent for contact form successfully!`);

    return new Response(JSON.stringify({ message: `Email notification sent for contact form` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) { // Explicitly type error as unknown
    console.error('Edge Function: Caught error during execution:', (error as Error).message); // Cast to Error
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});