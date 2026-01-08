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
import { Calculator, DollarSign, Brain, Clock, TrendingUp, HeartHandshake, Sun, Shield, Frown, Layers, Save, Loader2, Trash2, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// --- 1. SCHEMA & TYPES ---

const scoreSchema = z.coerce.number().min(0).max(3, 'Score must be between 0 and 3.');
const detailsSchema = z.string().optional();

const filterSchema = z.object({
  score: scoreSchema,
  details: detailsSchema,
});

const formSchema = z.object({
  id: z.string().optional(),
  jobName: z.string().min(1, 'Job Name is required.'),
  emr: filterSchema,
  nsi: filterSchema,
  tc: filterSchema,
  tv: filterSchema,
  ia: filterSchema,
  et: filterSchema,
  frs: filterSchema,
  er: filterSchema,
  cc: filterSchema,
});

type JobDecisionFormValues = z.infer<typeof formSchema>;

// FIX 2: Correct interface for DB data (snake_case)
interface SavedJobDecision {
  id: string;
  user_id: string;
  job_name: string;
  emr_score: number;
  nsi_score: number;
  tc_score: number;
  tv_score: number;
  ia_score: number;
  et_score: number;
  frs_score: number;
  er_score: number;
  cc_score: number;
  emr_details: string | null;
  nsi_details: string | null;
  tc_details: string | null;
  tv_details: string | null;
  ia_details: string | null;
  et_details: string | null;
  frs_details: string | null;
  er_details: string | null;
  cc_details: string | null;
  total_score: number;
  decision_output: string;
  created_at: string;
  updated_at: string;
}

// --- 2. FILTER CONFIGURATION ---

interface FilterConfig {
  key: keyof JobDecisionFormValues;
  label: string;
  icon: React.ElementType;
  description: string;
  subFactors: string[];
  weight: number;
}

const filters: FilterConfig[] = [
  { key: 'emr', label: 'Effort-to-Money Ratio', icon: DollarSign, description: 'Time, physical, and cognitive load vs. pay.', subFactors: ['Time invested vs pay', 'Physical effort', 'Emotional/cognitive load', 'Hidden costs (travel, prep)'], weight: 1 },
  { key: 'nsi', label: 'Nervous System Impact', icon: Brain, description: 'Predicted effect on stress, regulation, and recovery.', subFactors: ['Stress/anxiety', 'Rest/grounding', 'Emotional volatility', 'Post-task recovery'], weight: 1.5 },
  { key: 'tc', label: 'Time Containment', icon: Clock, description: 'Predictability and cleanliness of the time footprint.', subFactors: ['Fixed hours', 'Prep/teardown time', 'Buffer/bleed into other tasks', 'Scheduling ambiguity'], weight: 1 },
  { key: 'tv', label: 'Trajectory Value', icon: TrendingUp, description: 'Long-term skill, network, and earning potential.', subFactors: ['Direct skill growth', 'Network/opportunity growth', 'Long-term earning potential', 'Alignment with clinic/entertainment goals'], weight: 2 },
  { key: 'ia', label: 'Identity Alignment', icon: HeartHandshake, description: 'Alignment with current self, values, and boundaries.', subFactors: ['Career/personal goals', 'Self-perception/adult boundaries', 'Values alignment', 'Avoids people-pleasing/self-betrayal'], weight: 1 },
  { key: 'et', label: 'Energy Timing', icon: Sun, description: 'Fit with circadian rhythm and weekly load.', subFactors: ['Time of day (optimal window)', 'Weekly load fit', 'Recovery vs exertion', 'Sleep/cycle impact'], weight: 1 },
  { key: 'frs', label: 'Financial Risk / Stability', icon: Shield, description: 'Upfront cost, ROI, and cashflow impact.', subFactors: ['Upfront cost', 'Potential ROI', 'Cashflow impact', 'Risk level'], weight: 1 },
  { key: 'er', label: 'Emotional Reward', icon: Frown, description: 'Fun, satisfaction, and motivation.', subFactors: ['Fun/stimulation', 'Satisfaction/fulfillment', 'Motivation boost', 'Adherence factor'], weight: 1 },
  { key: 'cc', label: 'Compounding Complexity', icon: Layers, description: 'Cascade overload and stacked stress.', subFactors: ['Dependent tasks', 'Overlap with other projects', 'Scheduling conflicts', 'Cascade potential'], weight: 1 },
];

// --- 3. COMPONENT ---

const JobDecisionFilterPage: React.FC = () => {
  const { session } = useSession();
  const [savedDecisions, setSavedDecisions] = useState<SavedJobDecision[]>([]);
  const [isLoadingDecisions, setIsLoadingDecisions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<JobDecisionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobName: '',
      emr: { score: 0, details: '' },
      nsi: { score: 0, details: '' },
      tc: { score: 0, details: '' },
      tv: { score: 0, details: '' },
      ia: { score: 0, details: '' },
      et: { score: 0, details: '' },
      frs: { score: 0, details: '' },
      er: { score: 0, details: '' },
      cc: { score: 0, details: '' },
    },
    mode: 'onChange',
  });

  const currentDecisionId = form.watch('id');

  // --- CALCULATIONS ---
  // FIX 4 & 5: Correctly type the values and filterValue
  const { totalScore, normalizedScore, decisionOutput } = useMemo(() => {
    const values = form.getValues();
    let weightedSum = 0;
    let totalWeight = 0;

    filters.forEach(filter => {
      const filterValue = values[filter.key];
      if (filterValue && typeof filterValue === 'object' && 'score' in filterValue && typeof filterValue.score === 'number') {
        weightedSum += filterValue.score * filter.weight;
        totalWeight += filter.weight;
      }
    });

    const calculatedTotal = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
    const normalized = Math.round(calculatedTotal * 3);

    // FIX 6-9: Define output type correctly
    type DecisionVariant = 'default' | 'destructive' | 'outline' | 'secondary';
    let output: { text: string; variant: DecisionVariant } = { text: 'Insufficient Data', variant: 'outline' };
    
    if (normalized >= 24) output = { text: 'Yes — Clear Go', variant: 'default' };
    else if (normalized >= 21) output = { text: 'Yes — Go with Boundaries', variant: 'secondary' };
    else if (normalized >= 18) output = { text: 'Yes — Negotiate / Minor Tweaks', variant: 'outline' };
    else if (normalized >= 15) output = { text: 'Conditional — Only if Pay/Schedule Improved', variant: 'secondary' };
    else if (normalized >= 0) output = { text: 'No — Reject / Drop', variant: 'destructive' };

    return { totalScore: calculatedTotal, normalizedScore: normalized, decisionOutput: output };
  }, [form]);

  // --- DATA HANDLING ---
  const fetchSavedDecisions = useCallback(async () => {
    if (!session) {
      setSavedDecisions([]);
      setIsLoadingDecisions(false);
      return;
    }

    setIsLoadingDecisions(true);
    try {
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
      emr: { score: 0, details: '' },
      nsi: { score: 0, details: '' },
      tc: { score: 0, details: '' },
      tv: { score: 0, details: '' },
      ia: { score: 0, details: '' },
      et: { score: 0, details: '' },
      frs: { score: 0, details: '' },
      er: { score: 0, details: '' },
      cc: { score: 0, details: '' },
      id: undefined,
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
        ...values,
        totalScore: totalScore,
        decisionOutput: decisionOutput.text,
      };

      const { data, error } = await supabase.functions.invoke('save-job-decision', {
        body: payload,
      });

      if (error) throw error;

      showSuccess(values.id ? 'Decision updated successfully!' : 'Decision saved successfully!', { id: toastId });
      form.setValue('id', (data as SavedJobDecision).id);
      await fetchSavedDecisions();
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
      // FIX 10-28: Map snake_case from DB to camelCase for form
      form.reset({
        id: decisionToLoad.id,
        jobName: decisionToLoad.job_name,
        emr: { score: decisionToLoad.emr_score, details: decisionToLoad.emr_details || '' },
        nsi: { score: decisionToLoad.nsi_score, details: decisionToLoad.nsi_details || '' },
        tc: { score: decisionToLoad.tc_score, details: decisionToLoad.tc_details || '' },
        tv: { score: decisionToLoad.tv_score, details: decisionToLoad.tv_details || '' },
        ia: { score: decisionToLoad.ia_score, details: decisionToLoad.ia_details || '' },
        et: { score: decisionToLoad.et_score, details: decisionToLoad.et_details || '' },
        frs: { score: decisionToLoad.frs_score, details: decisionToLoad.frs_details || '' },
        er: { score: decisionToLoad.er_score, details: decisionToLoad.er_details || '' },
        cc: { score: decisionToLoad.cc_score, details: decisionToLoad.cc_details || '' },
      });
      // FIX 29: Use job_name from DB
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
          handleReset();
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

  // --- RENDER HELPERS ---
  const renderFilterInput = (filter: FilterConfig) => {
    // FIX 30 & 31: Use type assertion for dynamic field names
    const scoreFieldName = `${filter.key}.score` as keyof JobDecisionFormValues;
    const detailsFieldName = `${filter.key}.details` as keyof JobDecisionFormValues;

    return (
      <div key={filter.key} className="p-4 border border-brand-secondary/30 rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-brand-primary flex items-center gap-2">
            <filter.icon className="h-5 w-5" /> {filter.label}
          </h3>
          <Badge variant="outline" className="text-xs">Weight: {filter.weight}</Badge>
        </div>
        <p className="text-sm text-brand-dark/80 dark:text-brand-light/80 italic">{filter.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Score Selector */}
          <FormField
            control={form.control}
            name={scoreFieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal">Score (0-3)</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                      <SelectValue placeholder="Select score" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                    {[0, 1, 2, 3].map(score => (
                      <SelectItem key={score} value={String(score)}>{score}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Details Textarea */}
          <FormField
            control={form.control}
            name={detailsFieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal">Sub-factor Notes (Optional)</FormLabel>
                <FormControl>
                  {/* FIX 32: Ensure value is string for Textarea */}
                  <Textarea
                    placeholder="e.g., 2hr travel, high cognitive load..."
                    className="resize-none h-10"
                    value={field.value as string}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Sub-factors List */}
        <div className="text-xs text-brand-dark/70 dark:text-brand-light/70 mt-2">
          <span className="font-semibold">Sub-factors:</span> {filter.subFactors.join(', ')}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Daniele Decision Filter</h2>
          <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">Developer-style specification for opportunity evaluation.</p>
        </div>
        <Button onClick={handleReset} variant="outline" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
          <Calculator className="mr-2 h-4 w-4" /> {currentDecisionId ? 'New Decision' : 'Reset Scores'}
        </Button>
      </div>

      {/* Saved Decisions List */}
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
                    {/* FIX 33: Use job_name from DB */}
                    <h3 className="font-semibold text-lg text-brand-primary">{decision.job_name}</h3>
                    <p className="text-sm text-brand-dark/80 dark:text-brand-light/80">
                      Score: {decision.total_score} &bull; Decision: {decision.decision_output}
                    </p>
                    <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">
                      Last updated: {new Date(decision.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleLoadDecision(decision.id)} className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">Load</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteDecision(decision.id)} className="bg-red-600 hover:bg-red-700 text-white"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Scoring Form */}
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <Calculator className="h-5 w-5" /> Score Opportunity
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
                    <FormLabel className="text-brand-dark dark:text-brand-light">Opportunity Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Christmas Carols Gig" className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="bg-brand-secondary/50" />
              <div className="grid grid-cols-1 gap-6">
                {filters.map(renderFilterInput)}
              </div>
              <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105" disabled={isSaving || !form.formState.isValid}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> {currentDecisionId ? 'Update Decision' : 'Save Decision'}</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Decision Output */}
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <Calculator className="h-5 w-5" /> Decision Output
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-brand-secondary/10 dark:bg-brand-dark/30">
              <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">Weighted Score</p>
              <p className="text-2xl font-bold text-brand-primary">{totalScore}</p>
            </div>
            <div className="p-4 rounded-lg bg-brand-secondary/10 dark:bg-brand-dark/30">
              <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">Normalized (0-27)</p>
              <p className="text-2xl font-bold text-brand-primary">{normalizedScore}</p>
            </div>
          </div>
          {/* FIX 34-36: decisionOutput.variant is now correctly typed as 'default' | 'destructive' | 'outline' | 'secondary' */}
          <Badge variant={decisionOutput.variant} className={cn("text-lg px-6 py-3", {
            'bg-brand-primary text-brand-light': decisionOutput.variant === 'default',
            'bg-brand-secondary text-brand-dark dark:text-brand-light': decisionOutput.variant === 'secondary',
            'bg-red-600 text-white': decisionOutput.variant === 'destructive',
          })}>
            {decisionOutput.text}
          </Badge>
          <Separator className="max-w-xs mx-auto bg-brand-secondary my-4" />
          <div className="text-sm text-brand-dark/70 dark:text-brand-light/70 text-left">
            <p className="font-semibold mb-2">Decision Logic:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>24+:</strong> Yes — clear go</li>
              <li><strong>21–23:</strong> Yes — go with boundaries</li>
              <li><strong>18–20:</strong> Yes — negotiate / minor tweaks</li>
              <li><strong>15–17:</strong> Conditional — only if pay or schedule is improved</li>
              <li><strong>&lt;15:</strong> No — reject / drop</li>
            </ul>
            <p className="mt-3 italic">Note: Nervous System Impact (x1.5) and Trajectory Value (x2) are weighted higher.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDecisionFilterPage;