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
    const { email, firstName, lastName } = await req.json(); // Extract firstName and lastName

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

    const [, dataCenter] = MAILCHIMP_API_KEY.split('-');
    const mailchimpApiUrl = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

    const subscriberData: {
      email_address: string;
      status: string;
      merge_fields?: {
        FNAME?: string;
        LNAME?: string;
      };
    } = {
      email_address: email,
      status: 'subscribed',
    };

    // Add merge fields if first name or last name are provided
    if (firstName || lastName) {
      subscriberData.merge_fields = {};
      if (firstName) {
        subscriberData.merge_fields.FNAME = firstName;
      }
      if (lastName) {
        subscriberData.merge_fields.LNAME = lastName;
      }
    }

    const mailchimpResponse = await fetch(mailchimpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
      },
      body: JSON.stringify(subscriberData),
    });

    const responseData = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      console.error('Mailchimp API error:', responseData);
      if (responseData.title === "Member Exists") {
        return new Response(JSON.stringify({ message: 'Email is already subscribed.' }), {
          status: 200,
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