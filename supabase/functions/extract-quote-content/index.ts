// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.15.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the JSON schema for the expected output
const extractionSchema = {
  type: "object",
  properties: {
    clientName: { type: "string", description: "The full name of the client." },
    clientEmail: { type: "string", description: "The client's email address." },
    invoiceType: { type: "string", enum: ["Quote", "Invoice"], description: "The type of document, usually 'Quote'." },
    eventTitle: { type: "string", description: "A concise title for the event." },
    eventDate: { type: "string", description: "The event date in YYYY-MM-DD format." },
    eventTime: { type: "string", description: "The event start time in HH:MM format (24-hour clock)." },
    eventLocation: { type: "string", description: "The venue or location of the event." },
    paymentTerms: { type: "string", description: "The payment terms, e.g., 'Payment due within 7 days.'" },
    preparationNotes: { type: "string", description: "Detailed notes regarding preparation and service included in the fee." },
    compulsoryItems: {
      type: "array",
      description: "List of fixed, compulsory service items.",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          amount: { type: "number", description: "The fixed price for this item." },
        },
        required: ["name", "amount"],
      },
    },
    addOns: {
      type: "array",
      description: "List of optional add-on services.",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          cost: { type: "number", description: "The cost per unit for this add-on." },
        },
        required: ["name", "cost"],
      },
    },
    discountPercentage: { type: "number", description: "Optional discount percentage (0-100) if mentioned. Default to 0 if not found." },
    discountAmount: { type: "number", description: "Optional fixed discount amount if mentioned. Default to 0 if not found." },
    scopeOfWorkUrl: { type: "string", description: "Optional URL for a scope of work document." },
  },
  required: ["clientName", "clientEmail", "invoiceType", "eventTitle", "eventDate", "eventLocation", "paymentTerms", "preparationNotes", "compulsoryItems", "addOns"],
};

// @ts-ignore
const PRIMARY_KEY = Deno.env.get('GEMINI_API_KEY');
// @ts-ignore
const BACKUP_KEY = Deno.env.get('GEMINI_API_KEY_BACKUP');

const runExtraction = async (apiKey: string, emailContent: string) => {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert quote extraction service. Analyze the following raw text input, which contains structured quote details. Extract all fields into a single JSON object strictly following the provided JSON schema. Ensure all dates are in YYYY-MM-DD format and times are in HH:MM format. If a field is missing, use a reasonable default or an empty string/array, but ensure the output strictly adheres to the schema. For discountPercentage and discountAmount, if not explicitly mentioned, default to 0.

Raw Quote Details:
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

  return JSON.parse(response.text);
};

serve(async (req: Request) => {
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

    if (!PRIMARY_KEY) {
      throw new Error("GEMINI_API_KEY environment variable not set.");
    }

    let extractedData;

    try {
      // 1. Attempt with Primary Key
      extractedData = await runExtraction(PRIMARY_KEY, emailContent);
    } catch (primaryError: any) {
      console.warn('Primary Key failed. Checking for rate limit error...');
      
      const isRateLimitError = primaryError.message?.includes('429 Too Many Requests') || primaryError.message?.includes('Quota exceeded');

      if (isRateLimitError && BACKUP_KEY) {
        // 2. If rate limited, attempt with Backup Key
        console.log('Rate limit detected. Retrying with backup key...');
        extractedData = await runExtraction(BACKUP_KEY, emailContent);
      } else {
        // 3. Re-throw if not rate limit or no backup key available
        throw primaryError;
      }
    }

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('AI Extraction Error:', error);
    
    let status = 500;
    let errorMessage = error.message || 'Failed to process AI extraction';

    // Check for rate limit error message
    if (errorMessage.includes('429 Too Many Requests') || errorMessage.includes('Quota exceeded')) {
      status = 429;
      errorMessage = 'AI Quota Exceeded. Please wait a few minutes before trying again.';
    } else if (errorMessage.includes('API key not valid')) {
      // Handle case where both keys might be invalid
      errorMessage = 'AI API Key(s) are invalid or missing.';
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});