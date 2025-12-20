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
      id, // Optional ID for updating existing quote
      clientName,
      clientEmail,
      invoiceType,
      eventTitle,
      eventDate,
      eventLocation,
      preparedBy,
      totalAmount, // This is the total of the ACTIVE version
      details, // This now contains { versions: QuoteVersion[] }
      slug,
      status, // This is the status of the ACTIVE version
    } = await req.json();

    if (!clientName || !clientEmail || !invoiceType || !eventTitle || !eventDate || !eventLocation || !preparedBy || totalAmount === undefined || !details || !slug || !status) {
      return new Response(JSON.stringify({ error: 'Missing required fields for quote creation/update' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Find the active version to set top-level accepted/rejected dates
    const activeVersion = details.versions.find(v => v.is_active);
    
    const quoteData = {
      client_name: clientName,
      client_email: clientEmail,
      invoice_type: invoiceType,
      event_title: eventTitle,
      event_date: eventDate,
      event_location: eventLocation,
      prepared_by: preparedBy,
      total_amount: totalAmount,
      details: details, // Save the full versions array
      slug: slug,
      status: status,
      accepted_at: activeVersion?.accepted_at || null,
      rejected_at: activeVersion?.rejected_at || null,
    };

    let result;
    let action = id ? 'Update' : 'Insert';

    if (id) {
      // Update existing quote
      result = await supabaseClient
        .from('invoices')
        .update(quoteData)
        .eq('id', id)
        .select()
        .single();
    } else {
      // Insert new quote
      result = await supabaseClient
        .from('invoices')
        .insert([quoteData])
        .select()
        .single();
    }

    if (result.error) {
      console.error(`Supabase ${action} error:`, result.error);
      throw new Error(`Failed to ${action.toLowerCase()} quote: ${result.error.message}`);
    }

    const updatedRecord = result.data;
    if (!updatedRecord) {
      throw new Error('No record returned after operation.');
    }

    // --- Admin Notification (Only send if status is 'Created' and it's a new quote) ---
    if (status === 'Created' && action === 'Insert') {
      const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
      const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');
      const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');

      if (EMAIL_SERVICE_API_KEY && CONTACT_FORM_RECIPIENT_EMAIL && EMAIL_SERVICE_ENDPOINT) {
        const adminQuoteLink = `https://danielebuatti.com/admin/quotes/${updatedRecord.id}`;
        const publicQuoteLink = `https://danielebuatti.com/quotes/${updatedRecord.slug}`;
        const subject = `📝 New Quote Created: ${updatedRecord.event_title} for ${updatedRecord.client_name}`;
        const emailHtml = `
          <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #fdb813; text-align: center; margin-bottom: 20px;">New Quote Created!</h2>
              <p style="font-size: 16px; line-height: 1.6;">A new quote has been generated in your system:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedRecord.client_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Quote Title:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${updatedRecord.event_title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Total Amount:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">£${updatedRecord.total_amount.toFixed(2)}</td>
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
    }

    return new Response(JSON.stringify({ message: `Quote ${action.toLowerCase()}d successfully!`, id: updatedRecord.id, slug: updatedRecord.slug, status: updatedRecord.status }), {
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