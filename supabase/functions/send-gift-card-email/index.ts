// @ts-nocheck
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
    const {
      buyerEmail,
      giftCardName,
      value,
      redemptionCode,
      expirationDate,
      type,
    } = await req.json();

    if (!buyerEmail || !giftCardName || value === undefined || !redemptionCode || !type) {
      console.error("[send-gift-card-email] Missing required email fields.");
      return new Response(JSON.stringify({ error: 'Missing required email fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const EMAIL_SERVICE_API_KEY = Deno.env.get('EMAIL_SERVICE_API_KEY');
    const EMAIL_SERVICE_ENDPOINT = Deno.env.get('EMAIL_SERVICE_ENDPOINT');
    const CONTACT_FORM_RECIPIENT_EMAIL = Deno.env.get('CONTACT_FORM_RECIPIENT_EMAIL');


    if (!EMAIL_SERVICE_API_KEY || !EMAIL_SERVICE_ENDPOINT || !CONTACT_FORM_RECIPIENT_EMAIL) {
      console.error("[send-gift-card-email] Missing email service environment variables.");
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing email service credentials.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = `Your Daniele Buatti Gift Card: ${giftCardName}`;
    const formattedValue = `A$${value.toFixed(2)}`;
    
    let formattedExpiration = 'Never expires';
    if (expirationDate) {
        try {
            const date = new Date(expirationDate);
            if (!isNaN(date.getTime())) {
                formattedExpiration = date.toLocaleDateString('en-AU');
            }
        } catch (e) {
            // Ignore parsing error, keep default 'Never expires'
        }
    }

    let giftCardDetailsHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        You have purchased a ${giftCardName} gift card with a value of <strong>${formattedValue}</strong>.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        Your unique redemption code is: <strong style="color: #DB4CA3; font-size: 1.2em;">${redemptionCode}</strong>
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        This gift card ${expirationDate ? `expires on <strong>${formattedExpiration}</strong>` : 'never expires'}.
      </p>
    `;

    if (type === 'open_credit') {
      giftCardDetailsHtml += `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
          This is an open credit gift card. The remaining balance will be tracked and can be used across multiple sessions.
        </p>
      `;
    } else if (type === 'fixed_session') {
      giftCardDetailsHtml += `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
          This gift card is for a specific session. Please use the redemption code when booking your session.
        </p>
      `;
    } else if (type === 'discount') {
      giftCardDetailsHtml += `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
          This is a discount code. Apply it at checkout for your next purchase.
        </p>
      `;
    }

    const emailHtml = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #DB4CA3; text-align: center; margin-bottom: 20px;">Thank You for Your Purchase!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Dear Customer,</p>
          ${giftCardDetailsHtml}
          <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
            To redeem your gift card, please visit my <a href="https://danielebuatti.com/booking" style="color: #DB4CA3; text-decoration: none;">booking page</a> and enter your redemption code in the 'Gift Card / Promo Code' field during checkout.
          </p>
          <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
            If you have any questions, please reply to this email.
          </p>
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #EEEEEE; margin-top: 20px;">
            <img src="https://danielebuatti.com/logo-pinkwhite.png" alt="Daniele Buatti Logo" style="height: 40px; width: auto; margin-bottom: 10px; max-width: 100%; display: block; margin: 0 auto 10px auto;" />
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
        subject: subject,
        html: emailHtml,
        bcc: [CONTACT_FORM_RECIPIENT_EMAIL],
    };

    // Log the full payload being sent (excluding HTML body for brevity)
    console.log(`[send-gift-card-email] Sending payload to ${EMAIL_SERVICE_ENDPOINT}:`, JSON.stringify({ ...emailPayload, html: '[...html content excluded for log brevity...]' }));

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
      console.error('[send-gift-card-email] Email service error - Status:', emailResponse.status, 'Body:', errorData);
      throw new Error(`Failed to send email: ${emailResponse.statusText} - ${JSON.stringify(errorData)}`);
    }

    console.log(`[send-gift-card-email] Gift card confirmation email sent successfully to ${buyerEmail} (BCC attempted).`);

    return new Response(JSON.stringify({ message: `Gift card confirmation email sent to ${buyerEmail}` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[send-gift-card-email] Edge Function error:', (error as Error).message);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});