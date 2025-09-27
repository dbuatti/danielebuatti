import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const payload = await req.json();
    const { record } = payload; // The new contact_message record

    if (!record) {
      return new Response(JSON.stringify({ error: 'No record found in payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { name, email, message, created_at } = record;

    // Retrieve secrets for email service
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT'); // e.g., for SendGrid, Mailgun, Resend

    if (!EMAIL_SERVICE_API_KEY || !CONTACT_FORM_RECIPIENT_EMAIL || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Missing email service environment variables.');
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing email service credentials.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct email content
    const subject = `New Contact Form Submission from ${name}`;
    const emailBody = `
      A new message has been submitted through the contact form:

      Name: ${name}
      Email: ${email}
      Message:
      ---
      ${message}
      ---
      Submitted On: ${new Date(created_at).toLocaleString()}
    `;

    // Replace this with your actual email service API call
    // Example using a generic email API (e.g., SendGrid, Mailgun, Resend)
    const emailResponse = await fetch(EMAIL_SERVICE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}`, // Or 'x-api-key' depending on service
      },
      body: JSON.stringify({
        from: 'no-reply@yourdomain.com', // Replace with your verified sender email
        to: CONTACT_FORM_RECIPIENT_EMAIL,
        subject: subject,
        text: emailBody,
        // html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p><p><strong>Submitted On:</strong> ${new Date(created_at).toLocaleString()}</p>`,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Email service error:', errorData);
      throw new Error(`Failed to send email: ${emailResponse.statusText}`);
    }

    console.log('Email notification sent successfully!');

    return new Response(JSON.stringify({ message: 'Email notification sent' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Function error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});