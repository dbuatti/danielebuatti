// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
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
        properties: { name: { type: "string" }, amount: { type: "number" } },
        required: ["name", "amount"],
      },
    },
    addOns: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, cost: { type: "number" } },
        required: ["name", "cost"],
      },
    },
  },
  required: ["clientName", "clientEmail", "invoiceType", "eventTitle", "eventDate", "eventLocation", "paymentTerms", "preparationNotes", "compulsoryItems", "addOns"],
};

const PRIMARY_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), { status: 401, headers: corsHeaders });
    }
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { emailContent } = await req.json();
    if (!emailContent) return new Response(JSON.stringify({ error: 'Missing emailContent' }), { status: 400, headers: corsHeaders });

    const genAI = new GoogleGenerativeAI(PRIMARY_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json", responseSchema: extractionSchema }
    });

    const prompt = `Extract quote details from this text into JSON: ${emailContent}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return new Response(response.text(), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});