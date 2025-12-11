import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the expected structure for the mock response
interface MockExtractedQuoteContent {
  clientName: string;
  clientEmail: string;
  invoiceType: 'Quote' | 'Invoice';
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  compulsoryItems: Array<{
    name: string;
    description: string;
    amount: number;
  }>;
  addOns: Array<{
    name: string;
    description: string;
    cost: number;
  }>;
  paymentTerms: string;
  preparationNotes: string;
}

// Note: The TS2307 error regarding remote imports is often a limitation of the local IDE/TS setup 
// when parsing Deno files. The Deno runtime handles this import correctly.

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Log the incoming request body for debugging purposes
    const { emailContent } = await req.json();
    console.log("Received email content for extraction:", emailContent.substring(0, 100) + '...');

    // Mock response data matching the ExtractedQuoteContent type expected by the client
    const mockResponse: MockExtractedQuoteContent = {
      clientName: "Mock Client Name",
      clientEmail: "mock.client@example.com",
      invoiceType: "Quote",
      eventTitle: "Mock Extracted Event",
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: "18:00",
      eventLocation: "Mock Venue, Mock City",
      compulsoryItems: [
        { name: "Mock Service Fee", description: "Extracted standard service.", amount: 1200 },
      ],
      addOns: [
        { name: "Mock Add-On 1", description: "Optional extra service.", cost: 300 },
        { name: "Mock Add-On 2", description: "Another optional item.", cost: 150 },
      ],
      paymentTerms: "Extracted payment terms: 14 days.",
      preparationNotes: "Extracted preparation notes.",
    };

    return new Response(
      JSON.stringify(mockResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error processing request in Edge Function:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error: Mock function failed to process request." }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})