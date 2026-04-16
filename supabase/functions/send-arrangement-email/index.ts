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
    const { buyerEmail, arrangementIds } = await req.json();

    if (!buyerEmail || !arrangementIds || !Array.isArray(arrangementIds)) {
      console.error("[send-arrangement-email] Missing required fields.");
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Fetch arrangement details
    const { data: arrangements, error: fetchError } = await supabaseClient
      .from('arrangements')
      .select('*')
      .in('id', arrangementIds);

    if (fetchError) {
      console.error("[send-arrangement-email] Error fetching arrangements:", fetchError.message);
      throw fetchError;
    }

    if (!arrangements || arrangements.length === 0) {
      console.error("[send-arrangement-email] No arrangements found for IDs:", arrangementIds);
      return new Response(JSON.stringify({ error: 'No arrangements found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate signed URLs
    const downloadLinks = await Promise.all(arrangements.map(async (arr) => {
      const { data, error } = await supabaseClient.storage
        .from('arrangements')
        .createSignedUrl(arr.pdf_file_path, 60 * 60 * 24 * 7); // 7 days

      return {
        title: arr.title,
        url: data?.signedUrl,
      };
    }));

    // Send email
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');

    if (!EMAIL_SERVICE_API_KEY || !EMAIL_SERVICE_ENDPOINT || !CONTACT_FORM_RECIPIENT_EMAIL) {
      console.error("[send-arrangement-email] Missing email service environment variables.");
      throw new Error('Server configuration error: Missing email service credentials.');
    }

    const linksHtml = downloadLinks.map(link => `
      <li style="margin-bottom: 10px;">
        <strong>${link.title}</strong>: <a href="${link.url}" style="color: #DB4CA3; text-decoration: none; font-weight: bold;">Download PDF</a>
      </li>
    `).join('');

    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #DB4CA3; text-align: center; margin-bottom: 20px;">Your Music Arrangements are Ready!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Dear Customer,</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Thank you for your purchase. You can download your arrangements using the links below. These links will be active for 7 days.</p>
          <ul style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
            ${linksHtml}
          </ul>
          <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
            If you have any questions, please reply to this email.
          </p>
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #EEEEEE; margin-top: 20px;">
            <img src="https://danielebuatti.com/blue-pink-ontrans.png" alt="Daniele Buatti Logo" style="height: 40px; width: auto; margin-bottom: 10px; max-width: 100%; display: block; margin: 0 auto 10px auto;" />
            <p style="font-size: 14px; color: #666666; margin: 5px 0;">
              Embodied Coaching for Performers & Communicators
            </p>
            <p style="font-size: 14px; color: #666666; margin: 5px 0;">
              <a href="mailto:info@danielebuatti.com" style="color: #DB4CA3; text-decoration: none;">info@danielebuatti.com</a> |
              <a href="https://wa.me/61424174067" style="color: #DB4CA3; text-decoration: none;">+61 424 174 067</a>
            </p>
            <p style="font-size: 12px; color: #999999; margin-top: 10px;">
              &copy; ${new Date().getFullYear()} Daniele Buatti. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const emailPayload = {
      from: 'info@danielebuatti.com',
      to: buyerEmail,
      subject: 'Your Music Arrangement Downloads',
      html: emailHtml,
      bcc: [CONTACT_FORM_RECIPIENT_EMAIL],
    };

    console.log(`[send-arrangement-email] Sending payload to ${EMAIL_SERVICE_ENDPOINT}:`, JSON.stringify({ ...emailPayload, html: '[...html content excluded...]' }));

    const emailResponse = await fetch(EMAIL_SERVICE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('[send-arrangement-email] Email service error:', errorData);
      throw new Error(`Failed to send email: ${emailResponse.statusText}`);
    }

    console.log(`[send-arrangement-email] Arrangement confirmation email sent successfully to ${buyerEmail}.`);

    return new Response(JSON.stringify({ message: `Arrangement confirmation email sent to ${buyerEmail}` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[send-arrangement-email] Edge Function error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
