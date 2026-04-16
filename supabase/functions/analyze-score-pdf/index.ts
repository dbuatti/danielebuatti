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
    title: { type: "string" },
    composer: { type: "string" },
    instrumentation: { type: "string" },
    difficulty: { type: "string" },
    key: { type: "string" },
    genre: { type: "string" },
    lyrics: { type: "string" },
    duration: { type: "string" },
    style: { type: "string" },
  },
  required: ["title", "composer", "instrumentation"],
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

    const { text } = await req.json();
    if (!text) return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400, headers: corsHeaders });

    const genAI = new GoogleGenerativeAI(PRIMARY_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json", responseSchema: extractionSchema }
    });

    const prompt = `Analyze the following text extracted from a music score PDF and extract metadata: ${text}`;
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