import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// Ensure you have VITE_GEMINI_API_KEY set as a secret in Supabase
const GEMINI_API_KEY = Deno.env.get('VITE_GEMINI_API_KEY');
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Define the expected JSON output structure for the AI
const JSON_SCHEMA = {
  type: "object",
  properties: {
    clientName: { type: "string", description: "The full name of the client or contact person." },
    clientEmail: { type: "string", description: "The client's email address." },
    invoiceType: { type: "string", enum: ["Quote", "Invoice"], description: "The type of document requested, default to 'Quote'." },
    eventTitle: { type: "string", description: "A concise title for the event." },
    eventDate: { type: "string", description: "The date of the event in YYYY-MM-DD format." },
    eventTime: { type: "string", description: "The time of the event (e.g., '7:00 PM'). Optional." },
    eventLocation: { type: "string", description: "The location or venue of the event." },
    paymentTerms: { type: "string", description: "Any specific payment terms mentioned by the client." },
    preparationNotes: { type: "string", description: "Any detailed notes or requirements regarding preparation, service, or commitment hours mentioned in the email. Combine related points into a single text block." },
    compulsoryItems: {
      type: "array",
      description: "A list of mandatory services or items requested, including their cost.",
      items: {
        type: "object",
        properties: {
          description: { type: "string", description: "The name or title of the compulsory service." },
          amount: { type: "number", description: "The fixed cost of the service." },
        },
        required: ["description", "amount"]
      }
    },
    addOns: {
      type: "array",
      description: "A list of optional add-ons or items requested, including their unit cost and quantity.",
      items: {
        type: "object",
        properties: {
          description: { type: "string", description: "The name or title of the optional add-on." },
          cost: { type: "number", description: "The unit cost of the add-on." },
          quantity: { type: "number", description: "The quantity requested, default to 1 if not specified." },
        },
        required: ["description", "cost", "quantity"]
      }
    }
  },
  required: ["clientName", "clientEmail", "invoiceType", "eventTitle", "eventDate", "eventLocation", "paymentTerms", "compulsoryItems", "addOns", "preparationNotes"]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not set' }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  try {
    const { emailContent } = await req.json();

    if (!emailContent) {
      return new Response(JSON.stringify({ error: 'Missing emailContent in request body' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const prompt = `Analyze the following client email content and extract all relevant details for generating a professional quote. Pay special attention to identifying the client, event details, requested services (compulsory items), optional services (add-ons), and any specific notes regarding service commitment or preparation.

Client Email Content:
---
${emailContent}
---

Please output the result strictly as a single JSON object conforming to the provided schema. Ensure all numeric fields are numbers and all required fields are present. If a field is not explicitly mentioned, use a reasonable default or leave it empty if optional, but ensure the structure is maintained.`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: JSON_SCHEMA,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API failed with status ${response.status}: ${errorText}`);
    }

    const geminiData = await response.json();
    
    // The response structure from Gemini is usually { candidates: [{ content: { parts: [{ text: JSON_STRING }] } }] }
    const jsonString = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonString) {
      throw new Error("AI response was empty or malformed.");
    }

    const extractedData = JSON.parse(jsonString);

    // Basic validation to ensure required fields are present before returning
    if (!extractedData.clientName || !extractedData.eventTitle) {
        throw new Error("AI failed to extract core client or event details.");
    }

    return new Response(JSON.stringify(extractedData), {
      headers: corsHeaders,
      status: 200,
    });

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});