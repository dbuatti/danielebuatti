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

  console.log('[save-job-decision] Incoming request:', req.method, req.url);

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[save-job-decision] No Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized: No token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('[save-job-decision] Auth failed:', authError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = await req.json();
    console.log(`[save-job-decision] User ${user.id} payload:`, JSON.stringify(payload));

    const { 
      id, 
      jobName, 
      emr, nsi, tc, tv, ia, et, frs, er, cc,
      totalScore, // This is the float from the client
      decisionOutput 
    } = payload;

    if (!jobName || totalScore === undefined || !decisionOutput) {
      console.error("[save-job-decision] Missing fields:", { jobName, totalScore, decisionOutput });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Helper to safely extract score and details
    const parseFilterData = (filterData: any) => {
      const score = typeof filterData?.score === 'number' ? filterData.score : 0;
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

    // Ensure total_score is an integer for the database
    const integerTotalScore = Math.round(totalScore);

    // Prepare data with explicit null handling for details
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
      emr_details: emrData.details || null,
      nsi_details: nsiData.details || null,
      tc_details: tcData.details || null,
      tv_details: tvData.details || null,
      ia_details: iaData.details || null,
      et_details: etData.details || null,
      frs_details: frsData.details || null,
      er_details: erData.details || null,
      cc_details: ccData.details || null,
      total_score: integerTotalScore, // Use the rounded integer total score
      decision_output: decisionOutput,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
      console.log('[save-job-decision] Updating record:', id);
      result = await supabaseAdmin
        .from('job_decisions')
        .update(decisionData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      console.log('[save-job-decision] Inserting new record');
      decisionData.created_at = new Date().toISOString();
      result = await supabaseAdmin
        .from('job_decisions')
        .insert(decisionData)
        .select()
        .single();
    }

    if (result.error) {
      console.error("[save-job-decision] Database error:", result.error);
      // Log the full error object for better debugging
      console.error("[save-job-decision] Full Supabase error object:", JSON.stringify(result.error));
      throw new Error(`Database error: ${result.error.message}`);
    }

    console.log('[save-job-decision] Success:', result.data);

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