// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.15.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const extractionSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "The title of the arrangement." },
    composer: { type: "string", description: "The original composer or arranger." },
    instrumentation: { type: "string", description: "The instruments involved (e.g., Piano/Vocal, SATB, Jazz Trio)." },
    difficulty: { type: "string", description: "Estimated difficulty level (e.g., Beginner, Intermediate, Advanced)." },
    key: { type: "string", description: "The musical key of the piece." },
    genre: { type: "string", description: "The musical genre (e.g., Jazz, Classical, Pop)." },
    lyrics: { type: "string", description: "A snippet of the lyrics if present." },
    duration: { type: "string", description: "Estimated duration (e.g., 3:30)." },
    style: { type: "string", description: "The musical style (e.g., Swing, Ballad, Up-tempo)." },
  },
  required: ["title", "composer", "instrumentation"],
};

const PRIMARY_KEY = Deno.env.get('GEMINI_API_KEY');
const BACKUP_KEY = Deno.env.get('GEMINI_API_KEY_BACKUP');

const runExtraction = async (apiKey: string, text: string) => {
  const genAI = new GoogleGenAI(apiKey);
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: extractionSchema,
    }
  });

  const prompt = `You are an expert music librarian. Analyze the following text extracted from a music score PDF and extract metadata into a single JSON object strictly following the provided JSON schema.

Extracted Text:
---
${text}
---
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Missing text in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!PRIMARY_KEY) {
      throw new Error("GEMINI_API_KEY environment variable not set.");
    }

    let extractedData;

    try {
      extractedData = await runExtraction(PRIMARY_KEY, text);
    } catch (primaryError: any) {
      console.warn('[analyze-score-pdf] Primary Key failed. Checking for rate limit error...');
      
      const isRateLimitError = primaryError.message?.includes('429 Too Many Requests') || primaryError.message?.includes('Quota exceeded');

      if (isRateLimitError && BACKUP_KEY) {
        console.log('[analyze-score-pdf] Rate limit detected. Retrying with backup key...');
        extractedData = await runExtraction(BACKUP_KEY, text);
      } else {
        throw primaryError;
      }
    }

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('[analyze-score-pdf] AI Extraction Error:', error);
    
    let status = 500;
    let errorMessage = error.message || 'Failed to process AI extraction';

    if (errorMessage.includes('429 Too Many Requests') || errorMessage.includes('Quota exceeded')) {
      status = 429;
      errorMessage = 'AI Quota Exceeded. Please wait a few minutes before trying again.';
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});