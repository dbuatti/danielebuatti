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
import { Calculator, DollarSign, Brain, Clock, TrendingUp, HeartHandshake, Sun, Shield, Frown, Layers, Save, Loader2, Trash2, FolderOpen, ChevronDown, ChevronRight, AlertTriangle, Activity, MessageCircle, ExternalLink, ArrowLeft } from 'lucide-react';
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
  gutFeeling: z.enum(['yes', 'no', 'meh']).optional(),
  timeOfDay: z.string().optional(),
  currentLoad: z.enum(['light', 'normal', 'heavy']).optional(),
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
type FilterKey = 'emr' | 'nsi' | 'tc' | 'tv' | 'ia' | 'et' | 'frs' | 'er' | 'cc';

interface SavedJobDecision {
  id: string;
  user_id: string;
  job_name: string;
  gut_feeling: string | null;
  time_of_day: string | null;
  current_load: string | null;
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
  key: FilterKey;
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

// --- 3. CONSTANTS ---

type TimeOfDay = 'early_morning' | 'morning' | 'late_morning' | 'midday' | 'afternoon' | 'late_afternoon' | 'evening' | 'late_night' | 'na';

const timeOfDayOptions: { value: TimeOfDay; label: string; optimal: boolean }[] = [
  { value: 'early_morning', label: 'Early Morning (before 8am)', optimal: false },
  { value: 'morning', label: 'Morning (8–10am)', optimal: false },
  { value: 'late_morning', label: 'Late Morning (10am–12pm)', optimal: true },
  { value: 'midday', label: 'Midday (12–2pm)', optimal: true },
  { value: 'afternoon', label: 'Afternoon (2–4pm)', optimal: true },
  { value: 'late_afternoon', label: 'Late Afternoon (4–6pm)', optimal: false },
  { value: 'evening', label: 'Evening (6–9pm)', optimal: false },
  { value: 'late_night', label: 'Late Night (after 9pm)', optimal: false },
  { value: 'na', label: 'N/A — Flexible / Unknown', optimal: false },
];

const loadOptions: { value: 'light' | 'normal' | 'heavy'; label: string; multiplier: number }[] = [
  { value: 'light', label: 'Light Week', multiplier: 0.5 },
  { value: 'normal', label: 'Normal Week', multiplier: 1 },
  { value: 'heavy', label: 'Heavy Week', multiplier: 1.5 },
];

const scoreLabels = ['Strong Negative', 'Minor Concern', 'Minor Benefit', 'Strong Positive'];

// --- 4. WIZARD TYPES & CONSTANTS ---

interface WizardData {
  jobName: string;
  roleInfo: string;
  datesDuration: string;
  feeRate: string;
  workType: string[];
  gutFeeling: string;
  energyCost: number;
  alignment: number;
  whoAsking: string;
  otherPlate: string;
  moneyMeaningful: string;
  sayNoConsequence: string;
  anythingElse: string;
}

const workTypeOptions = [
  { value: 'md', label: 'MD / Musical Director' },
  { value: 'pit', label: 'Pit pianist' },
  { value: 'accompanist', label: 'Accompanist / auditions' },
  { value: 'voice', label: 'Voice coaching' },
  { value: 'piano-backings', label: 'Piano backings' },
  { value: 'kinesiology', label: 'Kinesiology / FNH' },
  { value: 'choir', label: 'Choir / community music' },
  { value: 'other', label: 'Other' },
];

const gutOptions = [
  { value: 'excited', label: 'Excited', emoji: '⚡', className: 'border-green-400 text-green-700 dark:text-green-300 data-[active=true]:bg-green-100 dark:data-[active=true]:bg-green-900/40' },
  { value: 'curious-unsure', label: 'Curious but unsure', emoji: '🤔', className: 'border-yellow-400 text-yellow-700 dark:text-yellow-300 data-[active=true]:bg-yellow-100 dark:data-[active=true]:bg-yellow-900/40' },
  { value: 'flat', label: 'Flat / meh', emoji: '😐', className: 'border-gray-400 text-gray-700 dark:text-gray-300 data-[active=true]:bg-gray-100 dark:data-[active=true]:bg-gray-900/40' },
  { value: 'anxious', label: 'Anxious / dread', emoji: '😰', className: 'border-red-400 text-red-700 dark:text-red-300 data-[active=true]:bg-red-100 dark:data-[active=true]:bg-red-900/40' },
  { value: 'obligated', label: 'Obligated', emoji: '😬', className: 'border-orange-400 text-orange-700 dark:text-orange-300 data-[active=true]:bg-orange-100 dark:data-[active=true]:bg-orange-900/40' },
];

const whoOptions = [
  { value: 'love', label: 'Someone I love working with' },
  { value: 'good-contact', label: 'Good professional contact' },
  { value: 'neutral', label: 'Neutral / new person' },
  { value: 'difficult', label: 'Someone I find difficult' },
  { value: 'pressure', label: 'Relationship pressure' },
];

const moneyOptions = [
  { value: 'need-it', label: 'Yes — I need it' },
  { value: 'helpful', label: 'Helpful but not critical' },
  { value: 'irrelevant', label: 'Irrelevant at this rate' },
  { value: 'below-rate', label: "It's below my rate" },
];

const sayNoOptions = [
  { value: 'nothing', label: 'Nothing — easy pass' },
  { value: 'awkwardness', label: 'Some awkwardness' },
  { value: 'lose-relationship', label: 'Might lose the relationship' },
  { value: 'financial-gap', label: 'Significant financial gap' },
  { value: 'dont-know', label: "Honestly don't know" },
];

// --- 4. COMPONENT ---

const JobDecisionFilterPage: React.FC = () => {
  const { session } = useSession();
  const [savedDecisions, setSavedDecisions] = useState<SavedJobDecision[]>([]);
  const [isLoadingDecisions, setIsLoadingDecisions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<'wizard' | 'detailed'>('wizard');
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    jobName: '',
    roleInfo: '',
    datesDuration: '',
    feeRate: '',
    workType: [],
    gutFeeling: '',
    energyCost: 3,
    alignment: 3,
    whoAsking: '',
    otherPlate: '',
    moneyMeaningful: '',
    sayNoConsequence: '',
    anythingElse: '',
  });

  const form = useForm<JobDecisionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobName: '',
      gutFeeling: undefined,
      timeOfDay: undefined,
      currentLoad: 'normal',
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
  const watchedFormValues = form.watch();

  const toggleNotes = (key: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // --- ADJUSTMENTS ---
  const timeOfDay = form.watch('timeOfDay') as TimeOfDay | undefined;
  const currentLoad = form.watch('currentLoad') as 'light' | 'normal' | 'heavy' | undefined;

  const isOutsideOptimalWindow = timeOfDay && timeOfDay !== 'na' && !timeOfDayOptions.find(o => o.value === timeOfDay)?.optimal;

  const loadMultiplier = loadOptions.find(o => o.value === (currentLoad || 'normal'))?.multiplier || 1;

  // --- RED FLAGS ---
  const nsiScore = form.watch('nsi.score');
  const tvScore = form.watch('tv.score');
  const redFlags: string[] = [];
  if (nsiScore === 0) redFlags.push('Nervous System Impact scored 0 — this is a major red flag.');
  if (tvScore === 0) redFlags.push('Trajectory Value scored 0 — this is a major red flag.');

  // --- CALCULATIONS ---
  const { totalScore, normalizedScore, decisionOutput, effectiveEtScore, effectiveCcWeight } = useMemo(() => {
    const values = watchedFormValues;
    let weightedSum = 0;
    let totalWeight = 0;

    const getFilterValue = (key: FilterKey) => {
      const fv = values[key];
      if (fv && typeof fv === 'object' && 'score' in fv && typeof fv.score === 'number') {
        return fv.score;
      }
      return 0;
    };

    const calcEffectiveWeight = (key: FilterKey): number => {
      const filter = filters.find(f => f.key === key);
      if (!filter) return 0;
      if (key === 'cc') return filter.weight * loadMultiplier;
      return filter.weight;
    };

    const calcEffectiveScore = (key: FilterKey): number => {
      const raw = getFilterValue(key);
      if (key === 'et' && isOutsideOptimalWindow) {
        return Math.max(0, raw - 1);
      }
      return raw;
    };

    filters.forEach(filter => {
      const effectiveScore = calcEffectiveScore(filter.key);
      const effectiveWeight = calcEffectiveWeight(filter.key);
      weightedSum += effectiveScore * effectiveWeight;
      totalWeight += effectiveWeight;
    });

    const calculatedTotal = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
    const normalized = Math.round(calculatedTotal * filters.length);

    type DecisionVariant = 'default' | 'destructive' | 'outline' | 'secondary';
    let output: { text: string; variant: DecisionVariant } = { text: 'Insufficient Data', variant: 'outline' };

    if (normalized >= 24) output = { text: 'Yes — Clear Go', variant: 'default' };
    else if (normalized >= 21) output = { text: 'Yes — Go with Boundaries', variant: 'secondary' };
    else if (normalized >= 18) output = { text: 'Yes — Negotiate / Minor Tweaks', variant: 'outline' };
    else if (normalized >= 15) output = { text: 'Conditional — Only if Pay/Schedule Improved', variant: 'secondary' };
    else if (normalized >= 0) output = { text: 'No — Reject / Drop', variant: 'destructive' };

    return {
      totalScore: calculatedTotal,
      normalizedScore: normalized,
      decisionOutput: output,
      effectiveEtScore: calcEffectiveScore('et'),
      effectiveCcWeight: calcEffectiveWeight('cc'),
    };
  }, [watchedFormValues, isOutsideOptimalWindow, loadMultiplier]);

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
      gutFeeling: undefined,
      timeOfDay: undefined,
      currentLoad: 'normal',
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
    setExpandedNotes(new Set());
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
      form.reset({
        id: decisionToLoad.id,
        jobName: decisionToLoad.job_name,
        gutFeeling: (decisionToLoad.gut_feeling as 'yes' | 'no' | 'meh') || undefined,
        timeOfDay: decisionToLoad.time_of_day || undefined,
        currentLoad: (decisionToLoad.current_load as 'light' | 'normal' | 'heavy') || 'normal',
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
          onClick: () => { },
        },
        description: 'Are you sure you want to delete this job decision? This action cannot be undone.',
      }
    );
  };

  // --- WIZARD TO FORM MAPPING ---
  const handleWizardComplete = () => {
    const w = wizardData;
    const gutMap: Record<string, 'yes' | 'no' | 'meh'> = {
      excited: 'yes',
      'curious-unsure': 'meh',
      flat: 'meh',
      anxious: 'no',
      obligated: 'no',
    };

    const energyToNsi = Math.max(0, 3 - Math.round((w.energyCost - 1) * 0.75));
    const alignToScore = Math.min(3, Math.round(w.alignment * 0.6));
    const moneyToScore = w.moneyMeaningful === 'need-it' ? 2 : w.moneyMeaningful === 'helpful' ? 1 : 0;
    const sayNoToScore = w.sayNoConsequence === 'financial-gap' || w.sayNoConsequence === 'lose-relationship' ? 2 : w.sayNoConsequence === 'awkwardness' ? 1 : 0;

    form.setValue('jobName', w.jobName);
    form.setValue('gutFeeling', gutMap[w.gutFeeling] || undefined);
    form.setValue('nsi.score', energyToNsi);
    form.setValue('nsi.details', `Energy cost: ${w.energyCost}/5. ${w.otherPlate}`);
    form.setValue('tv.score', alignToScore);
    form.setValue('ia.score', alignToScore);
    form.setValue('ia.details', `Role: ${w.roleInfo}. Who's asking: ${whoOptions.find(o => o.value === w.whoAsking)?.label || w.whoAsking}.`);
    form.setValue('emr.score', moneyToScore);
    form.setValue('emr.details', `Fee: ${w.feeRate}. Money: ${moneyOptions.find(o => o.value === w.moneyMeaningful)?.label}`);
    form.setValue('frs.score', sayNoToScore);
    form.setValue('frs.details', `Saying no: ${sayNoOptions.find(o => o.value === w.sayNoConsequence)?.label}`);
    form.setValue('cc.details', `Other commitments: ${w.otherPlate}. Dates: ${w.datesDuration}.`);
    form.setValue('er.details', `Gut: ${gutOptions.find(o => o.value === w.gutFeeling)?.label}. Additional notes: ${w.anythingElse}`);

    setMode('detailed');
    showSuccess('Wizard answers mapped to scores. Tweak them below, then save.');
  };

  // --- WIZARD RENDER ---
  const renderWizardHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {[1, 2, 3].map(step => (
          <div key={step} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
              wizardStep === step
                ? "bg-brand-primary text-brand-light"
                : wizardStep > step
                  ? "bg-green-500 text-white"
                  : "bg-brand-secondary/30 text-brand-dark/50 dark:text-brand-light/50"
            )}>
              {wizardStep > step ? '✓' : step}
            </div>
            <span className={cn(
              "text-sm hidden sm:inline",
              wizardStep === step ? "text-brand-primary font-semibold" : "text-brand-dark/50 dark:text-brand-light/50"
            )}>
              {step === 1 ? 'The Facts' : step === 2 ? 'The Feel' : 'Stakes'}
            </span>
            {step < 3 && <ChevronRight className="h-4 w-4 text-brand-dark/30 dark:text-brand-light/30 hidden sm:block" />}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadDemoWizardData}
          className="text-xs border-dashed border-brand-secondary/50 text-brand-dark/50 dark:text-brand-light/50 hover:text-brand-primary hover:border-brand-primary"
        >
          Load Demo
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => { setMode('detailed'); showSuccess('Switched to detailed scoring. All scores start at 0.'); }}
          className="text-xs text-brand-dark/50 dark:text-brand-light/50 hover:text-brand-primary"
        >
          Skip to detailed scoring →
        </Button>
      </div>
    </div>
  );

  const updateWizard = (partial: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...partial }));
  };

  const handleWorkTypeToggle = (value: string) => {
    const current = wizardData.workType;
    if (current.includes(value)) {
      updateWizard({ workType: current.filter(v => v !== value) });
    } else {
      updateWizard({ workType: [...current, value] });
    }
  };

  const loadDemoWizardData = () => {
    setWizardData({
      jobName: 'Wicked at Lyric',
      roleInfo: 'MD for Wicked at Lyric — 6 weeks, starts July',
      datesDuration: 'July 1–Aug 10, evenings + 2 Sat matinees',
      feeRate: '$3,200 flat',
      workType: ['md', 'pit'],
      gutFeeling: 'curious-unsure',
      energyCost: 4,
      alignment: 4,
      whoAsking: 'good-contact',
      otherPlate: 'Seussical rehearsals Tue/Thu, SHINE prep, 3 clinic days, planning to visit family one weekend',
      moneyMeaningful: 'helpful',
      sayNoConsequence: 'awkwardness',
      anythingElse: 'Venue is 45min drive. First time working with this MD. Could lead to more work at Lyric.',
    });
    setWizardStep(1);
    showSuccess('Demo data loaded — fill in the rest or jump straight to See the Score.');
  };

  const loadDemoDetailedData = () => {
    form.reset({
      id: undefined,
      jobName: 'Wicked at Lyric',
      gutFeeling: 'meh',
      timeOfDay: 'evening',
      currentLoad: 'heavy',
      emr: { score: 2, details: '$3,200 flat for 6 weeks — decent but not life-changing. Rehearsal-heavy schedule.' },
      nsi: { score: 1, details: 'Evening shows every night. High cognitive load. Long commute adds fatigue.' },
      tc: { score: 2, details: 'Fixed schedule July 1–Aug 10. Prep is predictable but 45min drive bleeds into evenings.' },
      tv: { score: 3, details: 'First major MD credit at Lyric. Huge network opportunity. Could lead to regular work.' },
      ia: { score: 2, details: 'Exciting creative work, but evening schedule clashes with morning-person identity.' },
      et: { score: 1, details: 'Evening shows outside 10am–4pm window. Heavy tech week. Struggling with sleep already.' },
      frs: { score: 2, details: 'Reliable pay. No upfront cost. Low financial risk.' },
      er: { score: 2, details: 'MD work is deeply satisfying. Wicked is a dream show. But exhaustion factor is real.' },
      cc: { score: 1, details: 'Overlaps with Seussical + SHINE. One weekend buffer. Rehearsal conflicts possible.' },
    });
    setMode('detailed');
    setExpandedNotes(new Set());
    showSuccess('Demo data loaded in detailed mode — scores are pre-filled and ready to tweak.');
  };

  const renderWizardStep1 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1">What's the job?</label>
        <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mb-2">Name, role, who's asking, or a quick description.</p>
        <Input
          placeholder="e.g. MD for Wicked at Lyric — 6 weeks, starts July"
          value={wizardData.roleInfo}
          onChange={e => updateWizard({ roleInfo: e.target.value })}
          className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1">Dates and duration?</label>
          <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mb-2">e.g. July 1–Aug 10, evenings + 2 Sat matinees</p>
          <Input
            placeholder="e.g. July 1–Aug 10"
            value={wizardData.datesDuration}
            onChange={e => updateWizard({ datesDuration: e.target.value })}
            className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1">What's the fee or rate?</label>
          <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mb-2">e.g. $1,800 flat / $150/session / unknown</p>
          <Input
            placeholder="e.g. $1,800 flat"
            value={wizardData.feeRate}
            onChange={e => updateWizard({ feeRate: e.target.value })}
            className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-2">What type of work is it?</label>
        <div className="flex flex-wrap gap-2">
          {workTypeOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleWorkTypeToggle(opt.value)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-all",
                wizardData.workType.includes(opt.value)
                  ? "bg-brand-primary text-brand-light border-brand-primary"
                  : "bg-brand-light dark:bg-brand-dark border-brand-secondary/50 text-brand-dark/70 dark:text-brand-light/70 hover:border-brand-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="text-brand-dark dark:text-brand-light border-brand-secondary/50"
          disabled
        >
          ← Back
        </Button>
        <Button
          type="button"
          onClick={() => setWizardStep(2)}
          className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
        >
          Next: The Feel →
        </Button>
      </div>
    </div>
  );

  const renderWizardStep2 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-2">What's your gut saying right now?</label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {gutOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              data-active={wizardData.gutFeeling === opt.value}
              onClick={() => updateWizard({ gutFeeling: opt.value })}
              className={cn(
                "px-3 py-3 text-sm font-medium rounded-md border transition-all duration-150 text-center",
                "bg-brand-light dark:bg-brand-dark border-brand-secondary/50 text-brand-dark/70 dark:text-brand-light/70 hover:border-brand-secondary",
                wizardData.gutFeeling === opt.value && opt.className
              )}
            >
              <div className="text-lg mb-1">{opt.emoji}</div>
              <div>{opt.label}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1">
            Energy cost — how much will this take out of you?
          </label>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-brand-dark/60 dark:text-brand-light/60 w-16 text-right">Light touch</span>
            <input
              type="range"
              min="1"
              max="5"
              value={wizardData.energyCost}
              onChange={e => updateWizard({ energyCost: parseInt(e.target.value) })}
              className="flex-1 accent-brand-primary"
            />
            <span className="text-xs text-brand-dark/60 dark:text-brand-light/60 w-16">Full depletion</span>
          </div>
          <div className="text-center mt-1">
            <Badge variant="outline" className={cn(
              wizardData.energyCost >= 4 ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-400" :
              wizardData.energyCost >= 3 ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-400" :
              "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-400"
            )}>
              {wizardData.energyCost}/5
            </Badge>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1">
            How aligned is it with where you're heading?
          </label>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-brand-dark/60 dark:text-brand-light/60 w-16 text-right">Off-path</span>
            <input
              type="range"
              min="1"
              max="5"
              value={wizardData.alignment}
              onChange={e => updateWizard({ alignment: parseInt(e.target.value) })}
              className="flex-1 accent-brand-primary"
            />
            <span className="text-xs text-brand-dark/60 dark:text-brand-light/60 w-16">Deeply aligned</span>
          </div>
          <div className="text-center mt-1">
            <Badge variant="outline" className={cn(
              wizardData.alignment >= 4 ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-400" :
              wizardData.alignment >= 3 ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-400" :
              "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-400"
            )}>
              {wizardData.alignment}/5
            </Badge>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1">Who's asking — and does that matter to you?</label>
        <div className="flex flex-wrap gap-2">
          {whoOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateWizard({ whoAsking: opt.value })}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-all",
                wizardData.whoAsking === opt.value
                  ? "bg-brand-primary text-brand-light border-brand-primary"
                  : "bg-brand-light dark:bg-brand-dark border-brand-secondary/50 text-brand-dark/70 dark:text-brand-light/70 hover:border-brand-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1">What else is on your plate during this period?</label>
        <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mb-2">Briefly — other shows, clinic days, personal commitments, recovery time needed.</p>
        <Textarea
          placeholder="e.g. Seussical rehearsals Tue/Thu, SHINE prep, 3 clinic days..."
          value={wizardData.otherPlate}
          onChange={e => updateWizard({ otherPlate: e.target.value })}
          className="resize-none h-20 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setWizardStep(1)}
          className="text-brand-dark dark:text-brand-light border-brand-secondary/50"
        >
          ← Back
        </Button>
        <Button
          type="button"
          onClick={() => setWizardStep(3)}
          className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
        >
          Next: Stakes →
        </Button>
      </div>
    </div>
  );

  const renderWizardStep3 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-2">Is the money meaningful?</label>
        <div className="flex flex-wrap gap-2">
          {moneyOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateWizard({ moneyMeaningful: opt.value })}
              className={cn(
                "px-4 py-2 text-sm rounded-md border transition-all",
                wizardData.moneyMeaningful === opt.value
                  ? "bg-brand-primary text-brand-light border-brand-primary"
                  : "bg-brand-light dark:bg-brand-dark border-brand-secondary/50 text-brand-dark/70 dark:text-brand-light/70 hover:border-brand-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-2">What happens if you say no?</label>
        <div className="flex flex-wrap gap-2">
          {sayNoOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateWizard({ sayNoConsequence: opt.value })}
              className={cn(
                "px-4 py-2 text-sm rounded-md border transition-all",
                wizardData.sayNoConsequence === opt.value
                  ? "bg-brand-primary text-brand-light border-brand-primary"
                  : "bg-brand-light dark:bg-brand-dark border-brand-secondary/50 text-brand-dark/70 dark:text-brand-light/70 hover:border-brand-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-dark dark:text-brand-light mb-1">Anything else I should know?</label>
        <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mb-2">Red flags, exciting upsides, weird conditions, or a feeling you can't name yet.</p>
        <Textarea
          placeholder="Optional — but often the most useful thing you write"
          value={wizardData.anythingElse}
          onChange={e => updateWizard({ anythingElse: e.target.value })}
          className="resize-none h-20 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setWizardStep(2)}
          className="text-brand-dark dark:text-brand-light border-brand-secondary/50"
        >
          ← Back
        </Button>
        <Button
          type="button"
          onClick={handleWizardComplete}
          className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
        >
          See the Score →
        </Button>
      </div>
    </div>
  );

  // --- RENDER HELPERS ---
  const renderScoreButton = (field: any, value: number) => (
    <button
      type="button"
      onClick={() => field.onChange(value)}
      className={cn(
        "flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-all duration-150",
        field.value === value
          ? value === 0
            ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300 shadow-sm"
            : value === 1
              ? "bg-orange-100 dark:bg-orange-900/40 border-orange-400 text-orange-700 dark:text-orange-300 shadow-sm"
              : value === 2
                ? "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-400 text-yellow-700 dark:text-yellow-300 shadow-sm"
                : "bg-green-100 dark:bg-green-900/40 border-green-400 text-green-700 dark:text-green-300 shadow-sm"
          : "bg-brand-light dark:bg-brand-dark border-brand-secondary/50 text-brand-dark/70 dark:text-brand-light/70 hover:border-brand-secondary"
      )}
    >
      {value}
    </button>
  );

  const renderFilterInput = (filter: FilterConfig) => {
    const scoreFieldName = `${filter.key}.score` as const;
    const detailsFieldName = `${filter.key}.details` as const;
    const isExpanded = expandedNotes.has(filter.key);

    return (
      <div key={filter.key} className="p-4 border border-brand-secondary/30 rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-brand-primary flex items-center gap-2">
            <filter.icon className="h-5 w-5 shrink-0" /> {filter.label}
          </h3>
          <Badge variant="outline" className="text-xs shrink-0">Weight: {filter.weight}</Badge>
        </div>
        <p className="text-sm text-brand-dark/80 dark:text-brand-light/80 italic">{filter.description}</p>

        {/* Inline Score Buttons */}
        <FormField
          control={form.control}
          name={scoreFieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal text-brand-dark dark:text-brand-light">Score</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(value => renderScoreButton(field, value))}
                </div>
              </FormControl>
              <div className="flex justify-between text-xs text-brand-dark/60 dark:text-brand-light/60 mt-1">
                <span>0 — {scoreLabels[0]}</span>
                <span>3 — {scoreLabels[3]}</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Collapsible Notes */}
        <div>
          <button
            type="button"
            onClick={() => toggleNotes(filter.key)}
            className="flex items-center gap-1 text-xs text-brand-dark/60 dark:text-brand-light/60 hover:text-brand-primary transition-colors"
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            {isExpanded ? 'Hide notes' : 'Add notes'}
          </button>
          {isExpanded && (
            <FormField
              control={form.control}
              name={detailsFieldName}
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 2hr travel, high cognitive load..."
                      className="resize-none h-20 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50"
                      value={field.value as string}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Sub-factors */}
        <div className="text-xs text-brand-dark/70 dark:text-brand-light/70">
          <span className="font-semibold">Sub-factors:</span> {filter.subFactors.join(', ')}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Daniele Decision Filter</h2>
            <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">Weighted opportunity evaluation with real-time context.</p>
          </div>
          <a
            href="https://claude.ai/chat/acbfb73b-d7a5-4afc-9297-db9474d7c3b4"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border border-brand-secondary/50 text-brand-dark/50 dark:text-brand-light/50 hover:text-brand-primary hover:border-brand-primary transition-colors"
            title="Open Claude chat for this tool"
          >
            <MessageCircle className="h-3 w-3" />
            <span>Chat</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://claude.ai/chat/acbfb73b-d7a5-4afc-9297-db9474d7c3b4"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border border-brand-secondary/50 text-brand-dark/50 dark:text-brand-light/50 hover:text-brand-primary hover:border-brand-primary transition-colors"
          >
            <MessageCircle className="h-3 w-3" />
            <span>Chat</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <div className="flex rounded-md border border-brand-secondary/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode('wizard')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                mode === 'wizard'
                  ? "bg-brand-primary text-brand-light"
                  : "bg-brand-light dark:bg-brand-dark text-brand-dark/70 dark:text-brand-light/70 hover:bg-brand-secondary/10"
              )}
            >
              Quick Start
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('detailed');
                if (!form.getValues('jobName')) {
                  showSuccess('Switched to detailed scoring. All scores start at 0.');
                }
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                mode === 'detailed'
                  ? "bg-brand-primary text-brand-light"
                  : "bg-brand-light dark:bg-brand-dark text-brand-dark/70 dark:text-brand-light/70 hover:bg-brand-secondary/10"
              )}
            >
              Detailed
            </button>
          </div>
          <Button onClick={handleReset} variant="outline" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
            <Calculator className="mr-2 h-4 w-4" /> {currentDecisionId ? 'New Decision' : 'Reset'}
          </Button>
        </div>
      </div>

      {/* Saved Decisions */}
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <FolderOpen className="h-5 w-5" /> Decision History
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
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-brand-primary truncate">{decision.job_name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-dark/80 dark:text-brand-light/80">
                      <span>Score: {decision.total_score}</span>
                      <span>Decision: {decision.decision_output}</span>
                      {decision.gut_feeling && <span>Gut: {decision.gut_feeling}</span>}
                      {decision.current_load && <span>Load: {decision.current_load}</span>}
                    </div>
                    <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">
                      {new Date(decision.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleLoadDecision(decision.id)} className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">Load</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteDecision(decision.id)} className="bg-red-600 hover:bg-red-700 text-white"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Form — Wizard or Detailed */}
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <Calculator className="h-5 w-5" /> {mode === 'wizard' ? 'Quick Assessment' : 'Detailed Scoring'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mode === 'wizard' ? (
            <div>
              {renderWizardHeader()}
              {wizardStep === 1 && renderWizardStep1()}
              {wizardStep === 2 && renderWizardStep2()}
              {wizardStep === 3 && renderWizardStep3()}
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveDecision)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobName"
                  render={({ field }) => (
                  <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-brand-dark dark:text-brand-light">Opportunity Name *</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={loadDemoDetailedData}
                          className="text-xs border-dashed border-brand-secondary/50 text-brand-dark/50 dark:text-brand-light/50 hover:text-brand-primary hover:border-brand-primary"
                        >
                          Load Demo
                        </Button>
                      </div>
                      <FormControl>
                        <Input placeholder="e.g., Christmas Carols Gig" className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Gut Check */}
                <Separator className="bg-brand-secondary/50" />
                <div className="p-4 border border-brand-secondary/30 rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30 space-y-3">
                  <h3 className="font-semibold text-lg text-brand-primary flex items-center gap-2">
                    <Activity className="h-5 w-5" /> Gut Check
                  </h3>
                  <p className="text-sm text-brand-dark/80 dark:text-brand-light/80 italic">
                    Before you see the score — what does your body say?
                  </p>
                  <FormField
                    control={form.control}
                    name="gutFeeling"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-3">
                            {[
                              { value: 'yes', label: 'Body Yes', className: 'border-green-400 text-green-700 dark:text-green-300 data-[active=true]:bg-green-100 dark:data-[active=true]:bg-green-900/40' },
                              { value: 'meh', label: 'Body Meh', className: 'border-yellow-400 text-yellow-700 dark:text-yellow-300 data-[active=true]:bg-yellow-100 dark:data-[active=true]:bg-yellow-900/40' },
                              { value: 'no', label: 'Body No', className: 'border-red-400 text-red-700 dark:text-red-300 data-[active=true]:bg-red-100 dark:data-[active=true]:bg-red-900/40' },
                            ].map(option => (
                              <button
                                key={option.value}
                                type="button"
                                data-active={field.value === option.value}
                                onClick={() => field.onChange(field.value === option.value ? undefined : option.value)}
                                className={cn(
                                  "flex-1 px-4 py-3 text-sm font-medium rounded-md border transition-all duration-150 bg-brand-light dark:bg-brand-dark border-brand-secondary/50 text-brand-dark/70 dark:text-brand-light/70 hover:border-brand-secondary",
                                  field.value === option.value && option.className
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Context: Time of Day + Current Load */}
                <Separator className="bg-brand-secondary/50" />
                <div className="p-4 border border-brand-secondary/30 rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30 space-y-4">
                  <h3 className="font-semibold text-lg text-brand-primary">Context</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="timeOfDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand-dark dark:text-brand-light">Time of Day</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                                <SelectValue placeholder="Select time window..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                              {timeOfDayOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label} {opt.optimal ? '(optimal window)' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value && field.value !== 'na' && (
                            <p className={cn("text-xs mt-1", isOutsideOptimalWindow ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")}>
                              {isOutsideOptimalWindow
                                ? 'Outside your 10am–4pm window. Energy Timing will be penalized (-1).'
                                : 'Within your 10am–4pm optimal window. No penalty applied.'}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentLoad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand-dark dark:text-brand-light">Current Week Load</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || 'normal'}>
                            <FormControl>
                              <SelectTrigger className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                                <SelectValue placeholder="Select load..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                              {loadOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label} (x{opt.multiplier} CC weight)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.value && field.value !== 'normal' && (
                            <p className={cn("text-xs mt-1", field.value === 'heavy' ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")}>
                              {field.value === 'heavy'
                                ? `Heavy week — Compounding Complexity weight increased to ${effectiveCcWeight}.`
                                : `Light week — Compounding Complexity weight reduced to ${effectiveCcWeight}.`}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="bg-brand-secondary/50" />

                {/* Red Flag Alert */}
                {redFlags.length > 0 && (
                  <div className="p-4 border-2 border-red-400 rounded-md bg-red-50 dark:bg-red-900/20 space-y-2">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-semibold">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Red Flag{redFlags.length > 1 ? 's' : ''} Detected</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
                      {redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                    </ul>
                  </div>
                )}

                {/* Filter Scores */}
                <div className="grid grid-cols-1 gap-6">
                  {filters.map(renderFilterInput)}
                </div>

                <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105" disabled={isSaving || !form.formState.isValid}>
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> {currentDecisionId ? 'Update Decision' : 'Save Decision'}</>}
                </Button>
              </form>
            </Form>
          )}
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
          {/* Gut Check Comparison */}
          {form.watch('gutFeeling') && (
            <div className="text-sm text-brand-dark/70 dark:text-brand-light/70">
              <span className="font-semibold">Gut feeling:</span>{' '}
              <span className={cn(
                form.watch('gutFeeling') === 'yes' ? 'text-green-600 dark:text-green-400' :
                form.watch('gutFeeling') === 'no' ? 'text-red-600 dark:text-red-400' :
                'text-yellow-600 dark:text-yellow-400'
              )}>
                {form.watch('gutFeeling') === 'yes' ? 'Body Yes' : form.watch('gutFeeling') === 'no' ? 'Body No' : 'Body Meh'}
              </span>
              <span className="text-brand-dark/50 dark:text-brand-light/50 ml-2">(recorded before score)</span>
            </div>
          )}

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

          {(isOutsideOptimalWindow || (currentLoad || 'normal') !== 'normal') && (
            <div className="text-xs text-brand-dark/60 dark:text-brand-light/60 space-y-1">
              {isOutsideOptimalWindow && <p>Energy Timing adjusted: effective score = {effectiveEtScore} (penalty applied)</p>}
              {(currentLoad || 'normal') !== 'normal' && <p>Compounding Complexity adjusted: weight = {effectiveCcWeight} (load multiplier: {loadMultiplier}x)</p>}
            </div>
          )}

          <Badge variant={decisionOutput.variant} className={cn("text-lg px-6 py-3", {
            'bg-brand-primary text-brand-light': decisionOutput.variant === 'default',
            'bg-brand-secondary text-brand-dark dark:text-brand-light': decisionOutput.variant === 'secondary',
            'bg-red-600 text-white': decisionOutput.variant === 'destructive',
          })}>
            {decisionOutput.text}
          </Badge>

          {/* Gut vs Math */}
          {form.watch('gutFeeling') && (
            <div className={cn(
              "text-sm px-4 py-2 rounded-md",
              (form.watch('gutFeeling') === 'yes' && normalizedScore >= 18) || (form.watch('gutFeeling') === 'no' && normalizedScore < 15)
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                : (form.watch('gutFeeling') === 'yes' && normalizedScore < 15) || (form.watch('gutFeeling') === 'no' && normalizedScore >= 18)
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                  : "bg-brand-secondary/10 dark:bg-brand-dark/30 text-brand-dark/70 dark:text-brand-light/70"
            )}>
              {form.watch('gutFeeling') === 'yes' && normalizedScore >= 18 && 'Gut and math agree — this feels right.'}
              {form.watch('gutFeeling') === 'no' && normalizedScore < 15 && 'Gut and math agree — this feels wrong.'}
              {form.watch('gutFeeling') === 'yes' && normalizedScore < 15 && 'Gut says yes but math says no. What is the math missing?'}
              {form.watch('gutFeeling') === 'no' && normalizedScore >= 18 && 'Gut says no but math says yes. What is the gut sensing?'}
              {form.watch('gutFeeling') === 'meh' && 'Gut is neutral. The math is your guide here.'}
            </div>
          )}

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
            <p className="mt-3 italic">Note: Nervous System Impact (x1.5) and Trajectory Value (x2) are weighted higher. Energy Timing penalized if outside 10am–4pm. Compounding Complexity scaled by current week load.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDecisionFilterPage;
