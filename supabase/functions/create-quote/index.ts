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

    const {
      clientName,
      clientEmail,
      invoiceType,
      eventTitle,
      eventDate,
      eventLocation,
      preparedBy,
      totalAmount,
      details, // This will contain baseService, addOns, depositPercentage, bankDetails, eventTime
      slug,
    } = await req.json();

    if (!clientName || !clientEmail || !invoiceType || !eventTitle || !eventDate || !eventLocation || !preparedBy || totalAmount === undefined || !details || !slug) {
      return new Response(JSON.stringify({ error: 'Missing required fields for quote creation' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data, error: insertError } = await supabaseClient
      .from('invoices')
      .insert([
        {
          client_name: clientName,
          client_email: clientEmail,
          invoice_type: invoiceType,
          event_title: eventTitle,
          event_date: eventDate,
          event_location: eventLocation,
          prepared_by: preparedBy,
          total_amount: totalAmount,
          details: details,
          slug: slug,
          accepted_at: null, // New quotes are initially not accepted
          rejected_at: null, // New quotes are initially not rejected
        },
      ])
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw new Error(`Failed to insert quote: ${insertError.message}`);
    }

    const insertedRecord = data?.[0];
    if (!insertedRecord) {
      throw new Error('No record returned after insertion.');
    }

    // Optionally send an email notification to admin that a new quote has been created
    // This is separate from client acceptance, just for internal tracking
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (EMAIL_SERVICE_API_KEY && CONTACT_FORM_RECIPIENT_EMAIL && EMAIL_SERVICE_ENDPOINT) {
      const adminQuoteLink = `https://danielebuatti.com/admin/quotes/${insertedRecord.id}`;
      const publicQuoteLink = `https://danielebuatti.com/quotes/${insertedRecord.slug}`;
      const subject = `📝 New Quote Created: ${insertedRecord.event_title} for ${insertedRecord.client_name}`;
      const emailHtml = `
        <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #fdb813; text-align: center; margin-bottom: 20px;">New Quote Created!</h2>
            <p style="font-size: 16px; line-height: 1.6;">A new quote has been generated in your system:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Name:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.client_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Email:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><a href="mailto:${insertedRecord.client_email}" style="color: #fdb813; text-decoration: none;">${insertedRecord.client_email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Quote Title:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.event_title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Event Date:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.event_date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Total Amount:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">£${insertedRecord.total_amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Created On:</td>
                <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">${new Date(insertedRecord.created_at).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Admin Link:</td>
                <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;"><a href="${adminQuoteLink}" style="color: #fdb813; text-decoration: none;">View in Admin Panel</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Public Link:</td>
                <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;"><a href="${publicQuoteLink}" style="color: #fdb813; text-decoration: none;">Share with Client</a></td>
              </tr>
            </table>
            <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
              This notification was sent from your website.
            </p>
          </div>
        </div>
      `;

      await fetch(EMAIL_SERVICE_ENDPOINT, {
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
    }

    return new Response(JSON.stringify({ message: 'Quote created successfully!', id: insertedRecord.id, slug: insertedRecord.slug }), {
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