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
    // Authenticate the user using the JWT from the request header
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("[save-job-decision] Auth error:", authError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { id, jobName, effortToMoney, nervousSystemImpact, timeContainment, trajectoryValue, identityAlignment, energyTiming, totalScore, decisionOutput } = await req.json();

    if (!jobName || totalScore === undefined || !decisionOutput) {
      console.error("[save-job-decision] Missing required fields in payload.");
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const decisionData = {
      user_id: user.id,
      job_name: jobName,
      effort_to_money: effortToMoney,
      nervous_system_impact: nervousSystemImpact,
      time_containment: timeContainment,
      trajectory_value: trajectoryValue,
      identity_alignment: identityAlignment,
      energy_timing: energyTiming,
      total_score: totalScore,
      decision_output: decisionOutput,
    };

    let result;
    if (id) {
      // Update existing decision
      result = await supabase
        .from('job_decisions')
        .update({ ...decisionData, updated_at: new Date().toISOString() }) // Manually set updated_at
        .eq('id', id)
        .select()
        .single();
      console.log(`[save-job-decision] Updated job decision ${id} for user ${user.id}.`);
    } else {
      // Insert new decision
      result = await supabase
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
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});