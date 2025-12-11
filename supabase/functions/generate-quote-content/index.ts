import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.15.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientName, eventTitle, invoiceType } = await req.json();

    if (!clientName || !eventTitle || !invoiceType) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Note: GEMINI_API_KEY is expected to be set as a Supabase secret
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set.");
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const prompt = `You are an expert quote generator for a professional service provider. Based on the following details, generate a JSON object containing suggested compulsory items, optional add-ons, and payment terms.

Details:
- Client Name: ${clientName}
- Event Title: ${eventTitle}
- Invoice Type: ${invoiceType}

Constraints:
1. The output MUST be a single JSON object that strictly follows the TypeScript interface:
   interface AIQuoteContent {
     compulsoryItems: { description: string; amount: number; }[];
     addOns: { description: string; cost: number; quantity: number; }[];
     paymentTerms: string;
   }
2. Ensure all amounts and costs are realistic positive numbers.
3. Ensure 'compulsoryItems' has at least 2 items.
4. Ensure 'addOns' has at least 2 items.
5. The 'paymentTerms' should be a concise string (max 3 sentences).

JSON Output:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const jsonText = response.text.trim().replace(/```json|```/g, '').trim();
    const generatedContent = JSON.parse(jsonText);

    return new Response(JSON.stringify(generatedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});