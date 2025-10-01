/// <reference types="./deno.d.ts" />
/// <reference types="https://deno.land/std@0.190.0/http/server.ts" />
/// <reference types="https://esm.sh/@supabase/supabase-js@2.45.0" />

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
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use SERVICE_ROLE_KEY
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { clientName, clientEmail, wantsExtraHour, wantsRehearsal, totalAmount, proposalDetails } = await req.json();

    if (!clientName || !clientEmail || !totalAmount || !proposalDetails) {
      return new Response(JSON.stringify({ error: 'Missing required fields for quote acceptance' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert data into quote_acceptances table
    const { data, error: insertError } = await supabaseClient
      .from('quote_acceptances')
      .insert([
        {
          client_name: clientName,
          client_email: clientEmail,
          selected_package_id: "Custom Quote",
          has_add_on: wantsExtraHour || wantsRehearsal,
          selected_add_ons: JSON.stringify({
            extraHour: wantsExtraHour,
            rehearsal: wantsRehearsal,
          }),
          total_amount: totalAmount,
          event_date: proposalDetails.dateOfEvent,
          event_location: proposalDetails.location,
          quote_title: "Christmas Carols – Live Piano Quote",
          quote_prepared_by: proposalDetails.preparedBy,
        },
      ])
      .select(); // Select the inserted record to get its details

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw new Error(`Failed to insert quote acceptance: ${insertError.message}`);
    }

    const insertedRecord = data?.[0];
    if (!insertedRecord) {
      throw new Error('No record returned after insertion.');
    }

    // Retrieve secrets for email service
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (!EMAIL_SERVICE_API_KEY || !CONTACT_FORM_RECIPIENT_EMAIL || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Missing email service environment variables for quote acceptance.');
      // We still return success for the client, but log the server error
      return new Response(JSON.stringify({ message: 'Quote accepted, but email notification failed due to server config.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `🎉 New Quote Acceptance: ${insertedRecord.quote_title} from ${insertedRecord.client_name}`;
    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #fdb813; text-align: center; margin-bottom: 20px;">New Quote Acceptance!</h2>
          <p style="font-size: 16px; line-height: 1.6;">A client has accepted your quote proposal:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.client_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Client Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><a href="mailto:${insertedRecord.client_email}" style="color: #fdb813; text-decoration: none;">${insertedRecord.client_email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Quote Title:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.quote_title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Selected Package:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.selected_package_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Optional Add-On:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.has_add_on ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Total Amount:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">A$${insertedRecord.total_amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Event Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.event_date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Event Location:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.event_location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Prepared By:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.quote_prepared_by}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold;">Accepted On:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">${new Date(insertedRecord.created_at).toLocaleString()}</td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
            This notification was sent from your website.
          </p>
        </div>
      </div>
    `;

    // Send email notification
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
      console.error('Email service error:', errorData);
      throw new Error(`Failed to send email: ${emailResponse.statusText}`);
    }

    console.log(`Quote acceptance processed and email notification sent successfully!`);

    return new Response(JSON.stringify({ message: 'Quote accepted and email notification sent.' }), {
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