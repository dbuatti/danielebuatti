"use client";

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, Brain, Clock, TrendingUp, HeartHandshake, Sun, Save, Loader2, Trash2, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { toast } from 'sonner'; // For promise-based toast
import { Input } from '@/components/ui/input'; // NEW: Added Input import

const scoreSchema = z.coerce.number().min(0).max(3, 'Score must be between 0 and 3.');

const formSchema = z.object({
  id: z.string().optional(), // Added for editing existing decisions
  jobName: z.string().min(1, 'Job Name is required.'), // New field for job name
  effortToMoney: scoreSchema,
  nervousSystemImpact: scoreSchema,
  timeContainment: scoreSchema,
  trajectoryValue: scoreSchema,
  identityAlignment: scoreSchema,
  energyTiming: scoreSchema,
});

type JobDecisionFormValues = z.infer<typeof formSchema>;

// UPDATED: Interface to match database snake_case for fetched data
interface SavedJobDecision {
  id: string;
  user_id: string;
  job_name: string; // Matches DB column
  effort_to_money: number; // Matches DB column
  nervous_system_impact: number; // Matches DB column
  time_containment: number; // Matches DB column
  trajectory_value: number; // Matches DB column
  identity_alignment: number; // Matches DB column
  energy_timing: number; // Matches DB column
  total_score: number;
  decision_output: string;
  created_at: string;
  updated_at: string;
}

const criteria = [
  {
    name: 'effortToMoney',
    label: '1. 💰 Effort-to-Money Ratio',
    question: 'Does this pay well for the actual energy it costs me?',
    scores: [
      { value: 3, label: 'High pay / low–moderate effort' },
      { value: 2, label: 'Fair pay / effort matches' },
      { value: 1, label: 'Low pay / high effort' },
      { value: 0, label: 'Insulting (Auto-No)' },
    ],
    icon: DollarSign,
  },
  {
    name: 'nervousSystemImpact',
    label: '2. 🧠 Nervous System Impact',
    question: 'After doing this, do I feel regulated or wrung out?',
    scores: [
      { value: 3, label: 'Regulating / grounding / spacious' },
      { value: 2, label: 'Neutral / contained' },
      { value: 1, label: 'Draining but tolerable' },
      { value: 0, label: 'Dysregulating / shame / panic / overdrive (Premium Pay or Decline)' },
    ],
    icon: Brain,
  },
  {
    name: 'timeContainment',
    label: '3. 🕰 Time Containment',
    question: 'Is the time footprint clean and predictable?',
    scores: [
      { value: 3, label: 'Fixed hours, minimal prep, clear end' },
      { value: 2, label: 'Some prep but bounded' },
      { value: 1, label: 'Bleeds into other days' },
      { value: 0, label: 'Vague, last-minute, or ongoing (No 0s Jan–Mar)' },
    ],
    icon: Clock,
  },
  {
    name: 'trajectoryValue',
    label: '4. 🌱 Trajectory Value',
    question: 'Does this move me toward the kind of work I want more of?',
    scores: [
      { value: 3, label: 'Directly builds desired future' },
      { value: 2, label: 'Indirect skill or network value' },
      { value: 1, label: 'Keeps lights on only' },
      { value: 0, label: 'Actively pulls me backward (Exceptional Pay to Override)' },
    ],
    icon: TrendingUp,
  },
  {
    name: 'identityAlignment',
    label: '5. 🧩 Identity Alignment',
    question: 'Does this match who I’m becoming — not who I used to be?',
    scores: [
      { value: 3, label: 'Feels aligned, clean, adult' },
      { value: 2, label: 'Slight compromise but acceptable' },
      { value: 1, label: 'Old pattern / people-pleasing' },
      { value: 0, label: 'Self-betrayal (Relief if cancelling = 1 or 0)' },
    ],
    icon: HeartHandshake,
  },
  {
    name: 'energyTiming',
    label: '6. 🔋 Energy Timing',
    question: 'Does this land in a part of the day/week where I actually have capacity?',
    scores: [
      { value: 3, label: 'Ideal timing' },
      { value: 2, label: 'Manageable' },
      { value: 1, label: 'Poor timing' },
      { value: 0, label: 'Sabotages rest or recovery (Post-7pm needs 3 elsewhere)' },
    ],
    icon: Sun,
  },
];

interface DecisionOutput {
  text: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
}

const JobDecisionFilterPage: React.FC = () => {
  const { session } = useSession();
  const [savedDecisions, setSavedDecisions] = useState<SavedJobDecision[]>([]);
  const [isLoadingDecisions, setIsLoadingDecisions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<JobDecisionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobName: '',
      effortToMoney: 0,
      nervousSystemImpact: 0,
      timeContainment: 0,
      trajectoryValue: 0,
      identityAlignment: 0,
      energyTiming: 0,
    },
    mode: 'onChange',
  });

  const watchedScores = form.watch();
  const currentDecisionId = form.watch('id');

  const totalScore = useMemo(() => {
    // FIX 1: Ensure sum is always a number and only sum numeric scores
    return Object.values(watchedScores).reduce((sum: number, score) => {
      if (typeof score === 'number') {
        return sum + score;
      }
      return sum;
    }, 0); // Initialize sum as 0
  }, [watchedScores]);

  const decisionOutput: DecisionOutput = useMemo(() => {
    // FIX 2 & 3: totalScore is now guaranteed to be a number
    if (totalScore === 18) {
      return { text: 'Yes, don’t overthink', variant: 'default' };
    } else if (totalScore >= 14) {
      return { text: 'Yes with boundaries or renegotiate', variant: 'secondary' };
    } else if (totalScore >= 10) {
      return { text: 'No, unless pay increases', variant: 'outline' };
    } else {
      return { text: 'No. Stop negotiating with yourself.', variant: 'destructive' };
    }
  }, [totalScore]);

  const fetchSavedDecisions = useCallback(async () => {
    if (!session) {
      setSavedDecisions([]);
      setIsLoadingDecisions(false);
      return;
    }

    setIsLoadingDecisions(true);
    try {
      // Invoke the Edge Function to fetch decisions
      const { data, error } = await supabase.functions.invoke('fetch-job-decisions');

      if (error) throw error;

      setSavedDecisions(data as SavedJobDecision[] || []);
    } catch (error: any) {
      console.error('Error fetching saved decisions:', error);
      showError('Failed to load saved decisions.');
    } finally {
      setIsLoadingDecisions(false);
    }
  }, [session]);

  useEffect(() => {
    fetchSavedDecisions();
  }, [fetchSavedDecisions]);

  const handleReset = () => {
    form.reset({
      jobName: '',
      effortToMoney: 0,
      nervousSystemImpact: 0,
      timeContainment: 0,
      trajectoryValue: 0,
      identityAlignment: 0,
      energyTiming: 0,
      id: undefined, // Clear the ID to indicate a new decision
    });
  };

  const handleSaveDecision = async (values: JobDecisionFormValues) => {
    if (!session) {
      showError('You must be logged in to save decisions.');
      return;
    }

    setIsSaving(true);
    const toastId = showLoading(values.id ? 'Updating decision...' : 'Saving decision...');

    try {
      const payload = {
        id: values.id, // Pass ID for update, or undefined for insert
        jobName: values.jobName,
        effortToMoney: values.effortToMoney,
        nervousSystemImpact: values.nervousSystemImpact,
        timeContainment: values.timeContainment,
        trajectoryValue: values.trajectoryValue,
        identityAlignment: values.identityAlignment,
        energyTiming: values.energyTiming,
        totalScore: totalScore,
        decisionOutput: decisionOutput.text,
      };

      // Invoke the Edge Function to save/update decision
      const { data, error } = await supabase.functions.invoke('save-job-decision', {
        body: payload,
      });

      if (error) throw error;

      showSuccess(values.id ? 'Decision updated successfully!' : 'Decision saved successfully!', { id: toastId });
      form.setValue('id', (data as SavedJobDecision).id); // Update form with new ID if it was an insert
      await fetchSavedDecisions(); // Refresh the list of saved decisions
    } catch (error: any) {
      console.error('Error saving decision:', error);
      showError(`Failed to save decision: ${error.message}`, { id: toastId });
    } finally {
      setIsSaving(false);
      dismissToast(toastId);
    }
  };

  const handleLoadDecision = (decisionId: string) => {
    const decisionToLoad = savedDecisions.find(d => d.id === decisionId);
    if (decisionToLoad) {
      // FIX 4-11: Map snake_case from DB to camelCase for form
      form.reset({
        id: decisionToLoad.id,
        jobName: decisionToLoad.job_name,
        effortToMoney: decisionToLoad.effort_to_money,
        nervousSystemImpact: decisionToLoad.nervous_system_impact,
        timeContainment: decisionToLoad.time_containment,
        trajectoryValue: decisionToLoad.trajectory_value,
        identityAlignment: decisionToLoad.identity_alignment,
        energyTiming: decisionToLoad.energy_timing,
      });
      // FIX 12: Use job_name from DB
      showSuccess(`Loaded decision for "${decisionToLoad.job_name}".`);
    }
  };

  const handleDeleteDecision = async (decisionId: string) => {
    toast.promise(
      async () => {
        const { error } = await supabase
          .from('job_decisions')
          .delete()
          .eq('id', decisionId);

        if (error) throw error;

        if (currentDecisionId === decisionId) {
          handleReset(); // Clear form if the deleted decision was currently loaded
        }
        await fetchSavedDecisions();
        return 'Decision deleted successfully!';
      },
      {
        loading: 'Deleting decision...',
        success: (message) => message,
        error: (err) => {
          console.error('Error deleting decision:', err);
          return 'Failed to delete decision.';
        },
        action: {
          label: 'Confirm Delete',
          onClick: () => { /* The promise handles the actual deletion */ },
        },
        description: 'Are you sure you want to delete this job decision? This action cannot be undone.',
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Job Decision Filter</h2>
        <Button onClick={handleReset} variant="outline" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
          <Calculator className="mr-2 h-4 w-4" /> {currentDecisionId ? 'New Decision' : 'Reset Scores'}
        </Button>
      </div>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Use this filter to evaluate potential jobs based on Daniele's non-negotiable criteria.
      </p>

      {/* Load Existing Decisions */}
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <FolderOpen className="h-5 w-5" /> Load Existing Decision
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDecisions ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              <span className="sr-only">Loading decisions...</span>
            </div>
          ) : savedDecisions.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No saved decisions found. Start by creating one!</p>
          ) : (
            <div className="space-y-4">
              {savedDecisions.map((decision) => (
                <div key={decision.id} className={cn(
                  "flex items-center justify-between p-3 border rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30",
                  currentDecisionId === decision.id ? "border-brand-primary ring-2 ring-brand-primary/50" : "border-brand-secondary/30"
                )}>
                  <div>
                    <h3 className="font-semibold text-lg text-brand-primary">{decision.job_name}</h3>
                    <p className="text-sm text-brand-dark/80 dark:text-brand-light/80">
                      Score: {decision.total_score} / 18 &bull; Decision: {decision.decision_output}
                    </p>
                    <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">
                      Last updated: {new Date(decision.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadDecision(decision.id)}
                      className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50"
                    >
                      Load
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDecision(decision.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <Calculator className="h-5 w-5" /> Score Your Job Opportunity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveDecision)} className="space-y-6">
              <FormField
                control={form.control}
                name="jobName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-dark dark:text-brand-light">Job Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Christmas Carols Gig"
                        className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="bg-brand-secondary/50" />
              {criteria.map((criterion) => (
                <div key={criterion.name} className="space-y-2 p-4 border border-brand-secondary/30 rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30">
                  <h3 className="font-semibold text-lg text-brand-primary flex items-center gap-2">
                    <criterion.icon className="h-5 w-5" /> {criterion.label}
                  </h3>
                  <p className="text-brand-dark/80 dark:text-brand-light/80 italic">{criterion.question}</p>
                  <FormField
                    control={form.control}
                    name={criterion.name as keyof JobDecisionFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Score for {criterion.label}</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
                          <FormControl>
                            <SelectTrigger className="w-full md:w-[300px] bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                              <SelectValue placeholder="Select a score" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                            {criterion.scores.map((scoreOption) => (
                              <SelectItem key={scoreOption.value} value={String(scoreOption.value)}>
                                {scoreOption.value} - {scoreOption.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={isSaving || !form.formState.isValid}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> {currentDecisionId ? 'Update Decision' : 'Save Decision'}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <Calculator className="h-5 w-5" /> Decision Output
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-2xl font-bold text-brand-dark dark:text-brand-light">
            Total Score: <span className="text-brand-primary">{totalScore} / 18</span>
          </p>
          <Badge variant={decisionOutput.variant} className={cn("text-lg px-4 py-2", {
            'bg-brand-primary text-brand-light': decisionOutput.variant === 'default',
            'bg-brand-secondary text-brand-dark dark:text-brand-light': decisionOutput.variant === 'secondary',
            'bg-red-600 text-white': decisionOutput.variant === 'destructive',
          })}>
            {decisionOutput.text}
          </Badge>
          <Separator className="max-w-xs mx-auto bg-brand-secondary my-4" />
          <div className="text-sm text-brand-dark/70 dark:text-brand-light/70 space-y-2">
            <p><strong>Rules Reminder:</strong></p>
            <ul className="list-disc list-inside text-left max-w-md mx-auto">
              <li>If Effort-to-Money score = 0, auto-no.</li>
              <li>Any Nervous System Impact score = 0 must be paid at a premium or declined.</li>
              <li>January–March: No Time Containment score = 0 allowed.</li>
              <li>A Trajectory Value score = 0 requires exceptional pay to override.</li>
              <li>If you feel relief imagining cancelling → it’s an Identity Alignment score of 1 or 0.</li>
              <li>Anything post-7pm must score 3 elsewhere to survive Energy Timing.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDecisionFilterPage;