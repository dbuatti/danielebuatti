import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { record } = payload; // The new quote_acceptance record

    if (!record) {
      return new Response(JSON.stringify({ error: 'No record found in payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { client_name, client_email, selected_package_id, has_add_on, total_amount, event_date, event_location, quote_title, quote_prepared_by, created_at } = record;

    // Retrieve secrets for email service
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL'); // Your email
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (!EMAIL_SERVICE_API_KEY || !CONTACT_FORM_RECIPIENT_EMAIL || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Missing email service environment variables for quote acceptance.');
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing email service credentials.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `🎉 New Quote Acceptance: ${quote_title} from ${client_name}`;
    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #fdb813; text-align: center; margin-bottom: 20px;">New Quote Acceptance!</h2>
          <p style="font-size: 16px; line-height: 1.6;">A client has accepted your quote proposal:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${client_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Client Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><a href="mailto:${client_email}" style="color: #fdb813; text-decoration: none;">${client_email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Quote Title:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${quote_title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Selected Package:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${selected_package_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Optional Add-On:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${has_add_on ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Total Amount:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">A$${total_amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Event Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${event_date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Event Location:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${event_location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold;">Prepared By:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${quote_prepared_by}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold;">Accepted On:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">${new Date(created_at).toLocaleString()}</td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
            This notification was sent from your website.
          </p>
        </div>
      </div>
    `;

    // Resend API call (assuming your EMAIL_SERVICE_ENDPOINT is for Resend or similar)
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

    console.log(`Email notification sent for quote acceptance successfully!`);

    return new Response(JSON.stringify({ message: `Email notification sent for quote acceptance` }), {
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