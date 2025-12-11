import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.15.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the expected JSON schema for the AI output
const extractionSchema = {
  type: "object",
  properties: {
    clientName: { type: "string", description: "The full name of the client or couple." },
    clientEmail: { type: "string", description: "The client's contact email address." },
    invoiceType: { type: "string", enum: ["Quote", "Invoice"], description: "The type of document, usually 'Quote'." },
    eventTitle: { type: "string", description: "A descriptive title for the event." },
    eventDate: { type: "string", description: "The date of the event in YYYY-MM-DD format (e.g., 2026-02-15)." },
    eventTime: { type: "string", description: "The time or time window of the event/performance (e.g., '2:00 PM – 4:00 PM')." },
    eventLocation: { type: "string", description: "The venue and city of the event." },
    paymentTerms: { type: "string", description: "The payment terms, including deposit and balance due dates." },
    preparationNotes: { type: "string", description: "Any detailed notes regarding preparation, service, or commitment included in the quote." },
    compulsoryItems: {
      type: "array",
      description: "Items that are mandatory fees or services.",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          amount: { type: "number", description: "The fixed total cost for this item." },
        },
        required: ["name", "amount"],
      },
    },
    addOns: {
      type: "array",
      description: "Optional items or services with variable costs or quantities.",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          cost: { type: "number", description: "The cost per unit/quantity." },
          quantity: { type: "number", description: "The default quantity, usually 1." },
        },
        required: ["name", "cost", "quantity"],
      },
    },
  },
  required: ["clientName", "clientEmail", "invoiceType", "eventTitle", "eventDate", "eventLocation", "compulsoryItems", "addOns", "paymentTerms", "preparationNotes"],
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailContent } = await req.json();
    
    if (!emailContent) {
      return new Response(JSON.stringify({ error: 'Missing emailContent in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get API Key from environment secrets
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable not set.');
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const prompt = `You are an expert data extraction tool. Analyze the following text, which is a quote or invoice draft, and extract all relevant details into the specified JSON schema. Ensure dates are in YYYY-MM-DD format. If a field is not explicitly found, infer the best possible value or use an empty string/default number (0 or 1) if required by the schema.

    Text to analyze:
    ---
    ${emailContent}
    ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: extractionSchema,
      },
    });

    // The response text should be a valid JSON string matching the schema
    const extractedData = JSON.parse(response.text);

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to process request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});