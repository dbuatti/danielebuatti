// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Create Admin Client for secure database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use Service Role for bypassing RLS
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 2. Verify User Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No token provided' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error("[save-job-decision] Auth error:", authError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Parse and Validate Payload
    const payload = await req.json();
    console.log(`[save-job-decision] Payload received for user ${user.id}:`, JSON.stringify(payload));

    const { 
      id, 
      jobName, 
      emr, nsi, tc, tv, ia, et, frs, er, cc,
      totalScore, 
      decisionOutput 
    } = payload;

    // Validate required fields
    if (!jobName || totalScore === undefined || !decisionOutput) {
      console.error("[save-job-decision] Missing required fields:", { jobName, totalScore, decisionOutput });
      return new Response(JSON.stringify({ error: 'Missing required fields: jobName, totalScore, or decisionOutput' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Helper to safely extract score and details
    const parseFilterData = (filterData: any) => {
      // Ensure score is a number, default to 0 if invalid
      const score = typeof filterData?.score === 'number' ? filterData.score : 0;
      // Ensure details is a string, default to empty string if null/undefined
      const details = filterData?.details ? String(filterData.details) : '';
      return { score, details };
    };

    const emrData = parseFilterData(emr);
    const nsiData = parseFilterData(nsi);
    const tcData = parseFilterData(tc);
    const tvData = parseFilterData(tv);
    const iaData = parseFilterData(ia);
    const etData = parseFilterData(et);
    const frsData = parseFilterData(frs);
    const erData = parseFilterData(er);
    const ccData = parseFilterData(cc);

    // 4. Prepare Database Data (Snake Case)
    const decisionData = {
      user_id: user.id,
      job_name: jobName,
      emr_score: emrData.score,
      nsi_score: nsiData.score,
      tc_score: tcData.score,
      tv_score: tvData.score,
      ia_score: iaData.score,
      et_score: etData.score,
      frs_score: frsData.score,
      er_score: erData.score,
      cc_score: ccData.score,
      emr_details: emrData.details,
      nsi_details: nsiData.details,
      tc_details: tcData.details,
      tv_details: tvData.details,
      ia_details: iaData.details,
      et_details: etData.details,
      frs_details: frsData.details,
      er_details: erData.details,
      cc_details: ccData.details,
      total_score: totalScore,
      decision_output: decisionOutput,
      updated_at: new Date().toISOString(),
    };

    // 5. Perform Database Operation
    let result;
    if (id) {
      // Update existing
      result = await supabaseAdmin
        .from('job_decisions')
        .update(decisionData)
        .eq('id', id)
        .eq('user_id', user.id) // Security check: ensure user owns this record
        .select()
        .single();
      console.log(`[save-job-decision] Updated job decision ${id} for user ${user.id}.`);
    } else {
      // Insert new
      result = await supabaseAdmin
        .from('job_decisions')
        .insert(decisionData)
        .select()
        .single();
      console.log(`[save-job-decision] Inserted new job decision for user ${user.id}.`);
    }

    if (result.error) {
      console.error("[save-job-decision] Supabase operation error:", result.error.message);
      throw new Error(`Failed to save job decision: ${result.error.message}`);
    }

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[save-job-decision] Edge Function error:', (error as Error).message);
    console.error('[save-job-decision] Stack trace:', (error as Error).stack);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});