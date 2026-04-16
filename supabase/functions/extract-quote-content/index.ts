// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const extractionSchema = {
  type: "object",
  properties: {
    clientName: { type: "string" },
    clientEmail: { type: "string" },
    invoiceType: { type: "string", enum: ["Quote", "Invoice"] },
    eventTitle: { type: "string" },
    eventDate: { type: "string" },
    eventTime: { type: "string" },
    eventLocation: { type: "string" },
    paymentTerms: { type: "string" },
    preparationNotes: { type: "string" },
    compulsoryItems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          amount: { type: "number" },
        },
        required: ["name", "amount"],
      },
    },
    addOns: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          cost: { type: "number" },
        },
        required: ["name", "cost"],
      },
    },
    discountPercentage: { type: "number" },
    discountAmount: { type: "number" },
    scopeOfWorkUrl: { type: "string" },
  },
  required: ["clientName", "clientEmail", "invoiceType", "eventTitle", "eventDate", "eventLocation", "paymentTerms", "preparationNotes", "compulsoryItems", "addOns"],
};

const PRIMARY_KEY = Deno.env.get('GEMINI_API_KEY');
const BACKUP_KEY = Deno.env.get('GEMINI_API_KEY_BACKUP');

const runExtraction = async (apiKey: string, emailContent: string, retryCount = 0) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: extractionSchema,
      }
    });

    const prompt = `Extract quote details from this text into JSON: ${emailContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error: any) {
    // Handle 503 Service Unavailable with a single retry
    if (error.message?.includes('503') && retryCount < 1) {
      console.log(`[extract-quote-content] Gemini 503 detected. Retrying in 2s...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return runExtraction(apiKey, emailContent, retryCount + 1);
    }
    throw error;
  }
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailContent } = await req.json();

    if (!emailContent) {
      return new Response(JSON.stringify({ error: 'Missing emailContent' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!PRIMARY_KEY) {
      throw new Error("GEMINI_API_KEY not set.");
    }

    let extractedData;
    try {
      extractedData = await runExtraction(PRIMARY_KEY, emailContent);
    } catch (err: any) {
      console.error('[extract-quote-content] Primary Key failed:', err.message);
      if (BACKUP_KEY) {
        console.log('[extract-quote-content] Retrying with backup key...');
        extractedData = await runExtraction(BACKUP_KEY, emailContent);
      } else {
        throw err;
      }
    }

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('[extract-quote-content] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});