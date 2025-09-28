import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const MAILCHIMP_API_KEY = Deno.env.get('MAILCHIMP_API_KEY');
    const MAILCHIMP_AUDIENCE_ID = Deno.env.get('MAILCHIMP_AUDIENCE_ID');

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
      console.error('Missing Mailchimp API Key or Audience ID environment variables.');
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing Mailchimp credentials.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mailchimp API key format is KEY-usX, where X is the data center.
    // We need to extract the data center for the API endpoint.
    const [, dataCenter] = MAILCHIMP_API_KEY.split('-');
    const mailchimpApiUrl = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

    const subscriberData = {
      email_address: email,
      status: 'subscribed', // or 'pending' if you want double opt-in
    };

    const mailchimpResponse = await fetch(mailchimpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`, // Mailchimp requires Basic Auth with any username
      },
      body: JSON.stringify(subscriberData),
    });

    const responseData = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      console.error('Mailchimp API error:', responseData);
      // Handle specific Mailchimp errors, e.g., member already exists
      if (responseData.title === "Member Exists") {
        return new Response(JSON.stringify({ message: 'Email is already subscribed.' }), {
          status: 200, // Return 200 as it's not an error from our side, just already subscribed
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Failed to add subscriber to Mailchimp: ${responseData.detail || mailchimpResponse.statusText}`);
    }

    console.log('Subscriber added to Mailchimp:', responseData);

    return new Response(JSON.stringify({ message: 'Successfully subscribed to newsletter!' }), {
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