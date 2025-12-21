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

    // 1. Fetch existing quote details
    const { data: existingQuote, error: fetchError } = await supabaseClient
      .from('invoices')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (fetchError || !existingQuote) {
      console.error('Supabase fetch error:', fetchError);
      throw new Error(`Quote not found or failed to fetch: ${fetchError?.message}`);
    }
    
    const versions = existingQuote.details.versions || [];
    const activeVersion = versions.find(v => v.is_active);

    if (!activeVersion) {
        throw new Error('No active version found for this quote.');
    }

    const acceptedAt = new Date().toISOString();

    // 2. Update the active version within the versions array
    const updatedVersions = versions.map(v => {
        if (v.versionId === activeVersion.versionId) {
            return {
                ...v,
                accepted_at: acceptedAt,
                rejected_at: null,
                status: 'Accepted',
                total_amount: finalTotal, // Update total amount based on client selection
                client_selected_add_ons: finalSelectedAddOns,
            };
        }
        return v;
    });
    
    const updatedActiveVersion = updatedVersions.find(v => v.is_active);
    if (!updatedActiveVersion) throw new Error("Active version lost during update.");


    // 3. Update the main invoice record
    const { data: updatedRecord, error: updateError } = await supabaseClient
      .from('invoices')
      .update({
        accepted_at: acceptedAt, // Update top-level accepted_at
        rejected_at: null, // Clear top-level rejected_at
        status: 'Accepted', // Update top-level status
        client_name: clientName,
        client_email: clientEmail,
        total_amount: finalTotal, // Update top-level total
        details: { versions: updatedVersions }, // Save the updated versions array
      })
      .eq('id', quoteId)
      .select()
      .single();

    if (updateError || !updatedRecord) {
      console.error('Supabase update error:', updateError);
      throw new Error(`Failed to update quote acceptance: ${updateError?.message}`);
    }

    // --- Calculation for Email Content ---
    
    // Calculate pre-discount subtotal (based on compulsory items + selected add-ons)
    const compulsoryTotal = (updatedActiveVersion.compulsoryItems || [])
      .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0;
    const addOnTotal = finalSelectedAddOns.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const preDiscountTotal = compulsoryTotal + addOnTotal;

    // Calculate discount amount applied
    const discountPercentage = updatedActiveVersion.discountPercentage || 0;
    const discountAmountFixed = updatedActiveVersion.discountAmount || 0;
    const totalDiscountApplied = preDiscountTotal - finalTotal;
    
    const discountRowHtml = (totalDiscountApplied > 0.01) ? `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px; color: #FF0000;">Discount Applied:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; color: #FF0000;">-${updatedActiveVersion.currencySymbol}${totalDiscountApplied.toFixed(2)}</td>
        </tr>
    ` : '';
    
    // 4. Send Admin Notification Email
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
    
    // Use data from the updated active version for email content
    const compulsoryList = (updatedActiveVersion.compulsoryItems || [])
      .map((item: any) => `<li>${item.name}: ${updatedActiveVersion.currencySymbol}${(item.price * item.quantity).toFixed(2)}</li>`)
      .join('');
      
    const addOnList = finalSelectedAddOns.length > 0 
      ? finalSelectedAddOns.map((a: any) => `<li>${a.name} (Qty: ${a.quantity}, Cost: ${updatedActiveVersion.currencySymbol}${(a.price * a.quantity).toFixed(2)})</li>`).join('')
      : '<li>None selected.</li>';
      
    const depositAmount = finalTotal * (updatedActiveVersion.depositPercentage / 100);

    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #fdb813; text-align: center; margin-bottom: 20px;">Quote Accepted!</h2>
          <p style="font-size: 16px; line-height: 1.6;">A client has accepted your quote proposal (Version ${updatedActiveVersion.versionId}):</p>
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
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Pre-Discount Total:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedActiveVersion.currencySymbol}${preDiscountTotal.toFixed(2)}</td>
            </tr>
            ${discountRowHtml}
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">FINAL TOTAL:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedActiveVersion.currencySymbol}${finalTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Accepted On:</td>
              <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">${new Date(acceptedAt).toLocaleString()}</td>
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
    
    // 5. Send Client Confirmation Email
    const clientSubject = `Booking Confirmed: ${updatedRecord.event_title || updatedRecord.invoice_type}`;
    
    const compulsoryListClient = (updatedActiveVersion.compulsoryItems || [])
      .map((item: any) => `<li>${item.name}: ${updatedActiveVersion.currencySymbol}${(item.price * item.quantity).toFixed(2)}</li>`)
      .join('');
      
    const addOnListClient = finalSelectedAddOns.length > 0 
      ? finalSelectedAddOns.map((a: any) => `<li>${a.name} (Qty: ${a.quantity}, Cost: ${updatedActiveVersion.currencySymbol}${(a.price * a.quantity).toFixed(2)})</li>`).join('')
      : '<li>None selected.</li>';

    const clientEmailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #DB4CA3; text-align: center; margin-bottom: 20px;">Booking Confirmed!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Dear ${clientName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Thank you for accepting the quote (Version ${updatedActiveVersion.versionId}) for your event, <strong>${updatedRecord.event_title || updatedRecord.invoice_type}</strong>. Your booking is now confirmed!</p>
          
          <h3 style="color: #DB4CA3; margin-top: 20px; font-size: 18px;">Booking Summary:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Event Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedRecord.event_date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Event Location:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedRecord.event_location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Pre-Discount Total:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedActiveVersion.currencySymbol}${preDiscountTotal.toFixed(2)}</td>
            </tr>
            ${discountRowHtml}
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">FINAL TOTAL:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedActiveVersion.currencySymbol}${finalTotal.toFixed(2)}</td>
            </tr>
          </table>

          <h3 style="color: #DB4CA3; margin-top: 20px; font-size: 18px;">Selected Services:</h3>
          <p style="font-weight: bold; margin-top: 10px;">Compulsory Items:</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
            ${compulsoryListClient}
          </ul>
          
          <p style="font-weight: bold; margin-top: 10px;">Selected Optional Add-Ons:</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
            ${addOnListClient}
          </ul>

          <h3 style="color: #DB4CA3; margin-top: 20px; font-size: 18px;">Next Steps:</h3>
          <p style="font-size: 16px; line-height: 1.6;">Daniele will be in touch shortly to finalise the deposit payment (${updatedActiveVersion.currencySymbol}${(depositAmount).toFixed(2)}) and all remaining details.</p>
          
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