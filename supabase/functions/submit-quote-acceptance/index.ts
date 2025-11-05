// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create a URL-friendly slug
function createSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace from both ends
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

serve(async (req: Request) => { // Added type annotation for 'req'
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

    const eventTitle = "Christmas Carols – Live Piano Quote"; // Specific title for this quote type
    const baseSlug = createSlug(`${eventTitle}-${clientName}-${proposalDetails.dateOfEvent}`);
    let uniqueSlug = baseSlug;
    let counter = 0;

    // Ensure slug uniqueness by appending a counter if needed
    while (true) {
      const { data: existingSlugs, error: slugCheckError } = await supabaseClient
        .from('invoices')
        .select('slug')
        .eq('slug', uniqueSlug);

      if (slugCheckError) throw slugCheckError;

      if (existingSlugs && existingSlugs.length === 0) {
        break; // Slug is unique
      }

      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    // Insert data into the new 'invoices' table
    const { data, error: insertError } = await supabaseClient
      .from('invoices')
      .insert([
        {
          client_name: clientName,
          client_email: clientEmail,
          invoice_type: eventTitle,
          event_title: eventTitle,
          event_date: proposalDetails.dateOfEvent,
          event_location: proposalDetails.location,
          prepared_by: proposalDetails.preparedBy,
          total_amount: totalAmount,
          details: { // Store specific details in the JSONB column
            selected_package_id: "Custom Quote",
            has_add_on: wantsExtraHour || wantsRehearsal,
            selected_add_ons: {
              extraHour: wantsExtraHour,
              rehearsal: wantsRehearsal,
            },
          },
          slug: uniqueSlug, // Store the generated slug
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

    // Format event_date for display
    const formattedEventDate = insertedRecord.event_date ? new Date(insertedRecord.event_date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';

    // Retrieve secrets for email service
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (!EMAIL_SERVICE_API_KEY || !CONTACT_FORM_RECIPIENT_EMAIL || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Missing email service environment variables for quote acceptance.');
      // We still return success for the client, but log the server error
      return new Response(JSON.stringify({ message: 'Quote accepted, but email notification failed due to server config.', slug: insertedRecord.slug }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const quoteLink = `https://danielebuatti.com/quotes/${insertedRecord.slug}`; // Construct the direct link
    const subject = `🎉 New Quote Acceptance: ${insertedRecord.event_title} from ${insertedRecord.client_name}`;
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
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.event_title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Selected Package:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.details.selected_package_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Optional Add-On:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.details.has_add_on ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Total Amount:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">A$${insertedRecord.total_amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Event Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${formattedEventDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Event Location:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.event_location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Prepared By:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${insertedRecord.prepared_by}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold;">Accepted On:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">${new Date(insertedRecord.accepted_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold;">Direct Quote Link:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;"><a href="${quoteLink}" style="color: #fdb813; text-decoration: none;">View Quote Page</a></td>
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
        from: 'info@danielebuatti.com', // Ensure this is a verified sender in your email service
        to: CONTACT_FORM_RECIPIENT_EMAIL,
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Email service error for quote acceptance:', errorData);
      throw new Error(`Failed to send quote acceptance email: ${emailResponse.statusText}`);
    }

    console.log(`Quote acceptance processed and email notification sent successfully!`);

    return new Response(JSON.stringify({ message: 'Quote accepted and email notification sent.', slug: insertedRecord.slug }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) { // Explicitly type error as unknown
    console.error('Edge Function error for quote acceptance:', (error as Error).message); // Cast to Error
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});