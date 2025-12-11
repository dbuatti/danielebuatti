import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

// Mock data structure matching ExtractedQuoteContent type
const mockExtractedContent = {
  clientName: "Mock Client Name",
  clientEmail: "mock.client@example.com",
  invoiceType: "Quote",
  eventTitle: "Mock Event Title",
  eventDate: new Date().toISOString().split('T')[0],
  eventTime: "19:00",
  eventLocation: "Mock Venue, Mock City",
  paymentTerms: "Payment due within 7 days.",
  preparationNotes: "Mock preparation notes extracted by AI.",
  compulsoryItems: [
    { name: "Mock Service Fee", description: "Standard service charge.", amount: 1200 },
  ],
  addOns: [
    { name: "Mock Add-On 1", description: "Extra hour of performance.", cost: 300, quantity: 1 },
  ],
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // In a real scenario, you would process the request body (emailContent) here
    // and call the Gemini API or similar service.
    
    // For now, we return mock data to ensure the client-side flow works.
    return new Response(
      JSON.stringify(mockExtractedContent),
      {
        headers: corsHeaders,
        status: 200,
      },
    )
  } catch (error) {
    console.error("Edge Function Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: corsHeaders,
        status: 500,
      },
    )
  }
})