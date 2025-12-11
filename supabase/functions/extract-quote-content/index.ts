import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.15.0";

// Define Deno environment types for TypeScript compatibility
declare global {
  const Deno: {
    env: {
      get: (key: string) => string | undefined;
    };
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailContent } = await req.json();

    if (!emailContent) {
      return new Response(JSON.stringify({ error: 'Missing email content.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set.");
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const prompt = `You are an expert AI Quote Extractor. Analyze the following email conversation thread and extract all relevant details for creating a professional service quote.

Email Conversation:
---
${emailContent}
---

Extract the following fields and return them as a single JSON object. If a field is missing or cannot be reliably determined, use a placeholder or a reasonable default (e.g., 'Quote' for invoiceType, current date for eventDate, empty string for optional fields).

Constraints:
1. The output MUST be a single JSON object that strictly follows the TypeScript interface:
   interface ExtractedQuoteContent {
     clientName: string;
     clientEmail: string;
     invoiceType: string; // e.g., 'Wedding Quote', 'Live Piano Quote'
     eventTitle: string; // e.g., 'Wedding Ceremony & Reception'
     eventDate: string; // MUST be in YYYY-MM-DD format
     eventTime?: string; // Optional, e.g., '7:00 PM'
     eventLocation: string;
     compulsoryItems: { description: string; amount: number; }[]; // At least 1 item
     addOns: { description: string; cost: number; quantity: number; }[]; // Can be empty
     paymentTerms: string; // Concise payment terms
   }
2. Ensure all amounts and costs are realistic positive numbers based on the context, or use 0 if fees are not mentioned.
3. Extract the client's name and email address from the conversation context.
4. If multiple dates/events are mentioned, extract the primary one.

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
    console.error('AI Extraction Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});