"use client";

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, Brain, Clock, TrendingUp, HeartHandshake, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const scoreSchema = z.coerce.number().min(0).max(3, 'Score must be between 0 and 3.');

const formSchema = z.object({
  effortToMoney: scoreSchema,
  nervousSystemImpact: scoreSchema,
  timeContainment: scoreSchema,
  trajectoryValue: scoreSchema,
  identityAlignment: scoreSchema,
  energyTiming: scoreSchema,
});

type JobDecisionFormValues = z.infer<typeof formSchema>;

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

// Define the expected type for decisionOutput
interface DecisionOutput {
  text: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
}

const JobDecisionFilterPage: React.FC = () => {
  const form = useForm<JobDecisionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  const totalScore = useMemo(() => {
    return Object.values(watchedScores).reduce((sum, score) => sum + (score || 0), 0);
  }, [watchedScores]);

  const decisionOutput: DecisionOutput = useMemo(() => {
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

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Job Decision Filter</h2>
        <Button onClick={handleReset} variant="outline" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
          <Calculator className="mr-2 h-4 w-4" /> Reset Scores
        </Button>
      </div>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Use this filter to evaluate potential jobs based on Daniele's non-negotiable criteria.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <Calculator className="h-5 w-5" /> Score Your Job Opportunity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
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