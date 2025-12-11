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

    const { quoteId, clientName, clientEmail, finalTotal, finalSelectedAddOns } = await req.json();

    if (!quoteId || !clientName || !clientEmail || finalTotal === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields for quote acceptance' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch existing quote details to get compulsory items and other metadata
    const { data: existingQuote, error: fetchError } = await supabaseClient
      .from('invoices')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (fetchError || !existingQuote) {
      console.error('Supabase fetch error:', fetchError);
      throw new Error(`Quote not found or failed to fetch: ${fetchError?.message}`);
    }

    // 2. Update the invoice record
    const updatedDetails = {
      ...existingQuote.details,
      final_total_amount: finalTotal,
      client_selected_add_ons: finalSelectedAddOns,
    };

    const { data: updatedRecord, error: updateError } = await supabaseClient
      .from('invoices')
      .update({
        accepted_at: new Date().toISOString(),
        client_name: clientName, // Update client name
        client_email: clientEmail, // Update client email
        total_amount: finalTotal,
        details: updatedDetails,
        rejected_at: null,
      })
      .eq('id', quoteId)
      .select()
      .single();

    if (updateError || !updatedRecord) {
      console.error('Supabase update error:', updateError);
      throw new Error(`Failed to update quote acceptance: ${updateError?.message}`);
    }

    // 3. Send Admin Notification Email
    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

    if (!EMAIL_SERVICE_API_KEY || !CONTACT_FORM_RECIPIENT_EMAIL || !EMAIL_SERVICE_ENDPOINT) {
      console.error('Missing email service environment variables for quote acceptance.');
      return new Response(JSON.stringify({ message: 'Quote accepted, but email notification failed due to server config.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminQuoteLink = `https://danielebuatti.com/admin/quotes/${updatedRecord.id}`;
    const subject = `🎉 Quote Accepted: ${updatedRecord.event_title || updatedRecord.invoice_type} from ${clientName}`;
    
    const compulsoryList = (updatedRecord.details?.compulsoryItems || [])
      .map((item: any) => `<li>${item.name}: A$${(item.price * item.quantity).toFixed(2)}</li>`)
      .join('');
      
    const addOnList = finalSelectedAddOns.length > 0 
      ? finalSelectedAddOns.map((a: any) => `<li>${a.name} (Qty: ${a.quantity}, Cost: A$${(a.price * a.quantity).toFixed(2)})</li>`).join('')
      : '<li>None selected.</li>';

    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #fdb813; text-align: center; margin-bottom: 20px;">Quote Accepted!</h2>
          <p style="font-size: 16px; line-height: 1.6;">A client has accepted your quote proposal:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><a href="mailto:${clientEmail}" style="color: #fdb813; text-decoration: none;">${clientEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Quote Title:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedRecord.event_title || updatedRecord.invoice_type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Compulsory Items:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><ul>${compulsoryList}</ul></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Selected Add-Ons:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><ul>${addOnList}</ul></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">FINAL TOTAL:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">A$${finalTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Accepted On:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">${new Date().toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Admin Link:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;"><a href="${adminQuoteLink}" style="color: #fdb813; text-decoration: none;">View in Admin Panel</a></td>
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
    
    // 4. Send Client Confirmation Email
    const clientSubject = `Booking Confirmed: ${updatedRecord.event_title || updatedRecord.invoice_type}`;
    const clientEmailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #DB4CA3; text-align: center; margin-bottom: 20px;">Booking Confirmed!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Dear ${clientName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Thank you for accepting the quote for your event, <strong>${updatedRecord.event_title || updatedRecord.invoice_type}</strong>. Your booking is now confirmed!</p>
          <p style="font-size: 16px; line-height: 1.6;"><strong>Event Date:</strong> ${updatedRecord.event_date}</p>
          <p style="font-size: 16px; line-height: 1.6;"><strong>Total Amount:</strong> A$${finalTotal.toFixed(2)}</p>
          <p style="font-size: 16px; line-height: 1.6;">Daniele will be in touch shortly to finalize the deposit payment and all remaining details.</p>
          <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
            This is an automated confirmation.
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
        to: clientEmail,
        subject: clientSubject,
        html: clientEmailHtml,
      }),
    });


    console.log(`Quote acceptance processed and email notification sent successfully!`);

    return new Response(JSON.stringify({ message: 'Quote accepted and email notification sent.' }), {
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