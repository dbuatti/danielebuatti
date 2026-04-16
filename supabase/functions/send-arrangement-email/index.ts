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

    // Generate signed URLs for all files - Set to 10 years (effectively never expires)
    const TEN_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 10;
    
    const downloadLinks = await Promise.all(arrangements.map(async (arr: any) => {
      const files = [];
      
      // Main PDF
      if (arr.pdf_file_path) {
        const { data } = await supabaseClient.storage
          .from('arrangements')
          .createSignedUrl(arr.pdf_file_path, TEN_YEARS_IN_SECONDS);
        
        files.push({
          label: 'Main Score (PDF)',
          url: data?.signedUrl,
        });
      }

      // Secondary File
      if (arr.secondary_file_path) {
        const { data } = await supabaseClient.storage
          .from('arrangements')
          .createSignedUrl(arr.secondary_file_path, TEN_YEARS_IN_SECONDS);
        
        files.push({
          label: arr.secondary_file_name || 'Secondary File',
          url: data?.signedUrl,
        });
      }

      return {
        title: arr.title,
        files: files,
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

    const itemsHtml = downloadLinks.map((item: any) => `
      <div style="margin-bottom: 25px; padding: 15px; background-color: #f9f9f9; border-radius: 12px; border: 1px solid #eeeeee;">
        <h3 style="margin: 0 0 10px 0; color: #00022D;">${item.title}</h3>
        <ul style="margin: 0; padding: 0; list-style: none;">
          ${item.files.map((file: any) => `
            <li style="margin-bottom: 8px;">
              <a href="${file.url}" style="color: #DB4CA3; text-decoration: none; font-weight: bold; font-size: 15px;">
                ↓ Download ${file.label}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');

    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #DB4CA3; text-align: center; margin-bottom: 20px;">Your Music Arrangements are Ready!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear Customer,</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thank you for your purchase. You can download your files using the secure links below.</p>
          
          ${itemsHtml}
          
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