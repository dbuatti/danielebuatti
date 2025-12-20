import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { invoice_id } = await req.json()
    
    if (!invoice_id) {
      return new Response(JSON.stringify({ error: 'Missing invoice_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create a Supabase client with the Service Role Key for elevated permissions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // 1. Fetch the existing quote data
    const { data: oldQuote, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoice_id)
      .single()

    if (fetchError) throw fetchError

    // Check if migration is needed (details is null or details.versions is missing/empty)
    const details = oldQuote.details || {}
    if (details.versions && details.versions.length > 0) {
      return new Response(JSON.stringify({ message: 'Quote already has versions. Migration skipped.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Construct the initial version (v1) based on existing top-level fields
    const initialVersion = {
      versionId: 'v1',
      versionName: 'Initial Migration',
      created_at: oldQuote.created_at,
      is_active: true,
      status: oldQuote.status || 'Created',
      accepted_at: oldQuote.accepted_at,
      rejected_at: oldQuote.rejected_at,
      
      // Default values for fields that were not stored at the top level previously
      total_amount: oldQuote.total_amount || 0,
      depositPercentage: 50, 
      paymentTerms: 'Payment due within 7 days of acceptance.', 
      bankDetails: { bsb: '923100', acc: '301110875' }, 
      currencySymbol: 'A$', 
      eventTime: '18:00', 
      theme: 'default', 
      headerImageUrl: '', 
      headerImagePosition: '', 
      preparationNotes: 'This fee covers 7 hours of commitment, including preparation, travel, setup, performance, and pack down.', 
      scopeOfWorkUrl: '', 
      
      // Attempt to reconstruct compulsory items from old details structure if possible, otherwise use a placeholder
      compulsoryItems: details.items || [{ 
        id: 'migrated-item', 
        name: oldQuote.event_title || 'Migrated Service Fee', 
        description: 'Fee migrated from old quote structure.', 
        price: oldQuote.total_amount || 0, 
        quantity: 1,
        scheduleDates: oldQuote.event_date,
        showScheduleDates: false,
        showQuantity: true,
        showRate: true,
      }],
      addOns: details.addOns || [], 
    }

    // 3. Update the quote with the new version structure
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        details: { versions: [initialVersion] },
        // Ensure top-level fields are consistent with the new active version
        total_amount: initialVersion.total_amount,
        status: initialVersion.status,
        accepted_at: initialVersion.accepted_at,
        rejected_at: initialVersion.rejected_at,
      })
      .eq('id', invoice_id)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ message: 'Quote successfully migrated to version structure.', quote: initialVersion }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Migration Error:', error)
    // Safely access error message, assuming it might be an object with a message property or a string
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during migration.';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})