"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  company_name: z.string().min(1, { message: 'Company/Lead name is required.' }),
  contact_name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  venue: z.string().optional(),
  source: z.string().optional(),
  outcome: z.string().optional(),
  notes: z.string().optional(),
  goal: z.string().optional(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost', 'Converted']).default('New'),
});

export type LeadFormValues = z.infer<typeof formSchema>;

interface LeadFormProps {
  onSubmit: (values: LeadFormValues) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
  initialData?: Partial<LeadFormValues>;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isSubmitting, onClose, initialData }) => {
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      venue: '',
      source: '',
      outcome: '',
      notes: '',
      goal: '',
      status: 'New',
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        venue: '',
        source: '',
        outcome: '',
        notes: '',
        goal: '',
        status: 'New',
        ...initialData,
      });
    }
  }, [initialData, form]);

  const inputClasses = "bg-brand-secondary/10 dark:bg-brand-dark border-none h-12 rounded-xl text-brand-dark dark:text-brand-light placeholder:text-gray-500 focus-visible:ring-brand-primary";
  const labelClasses = "text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60 mb-2 block";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Company / Lead Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Australian Club" className={inputClasses} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Alexandra" className={inputClasses} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Pipeline Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClasses}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50 rounded-xl">
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="private.events@..." className={inputClasses} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="0424 174 067" className={inputClasses} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Venue / Location</FormLabel>
                <FormControl>
                  <Input placeholder="Sydney" className={inputClasses} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Source / Referral</FormLabel>
                <FormControl>
                  <Input placeholder="Referral via Graham" className={inputClasses} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Outcome of Contact</FormLabel>
              <FormControl>
                <Textarea placeholder="Summary of the conversation..." className={cn(inputClasses, "h-24 py-3 resize-none")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Goal / Next Steps</FormLabel>
              <FormControl>
                <Textarea placeholder="What needs to happen next?" className={cn(inputClasses, "h-24 py-3 resize-none")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>General Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional context..." className={cn(inputClasses, "h-24 py-3 resize-none")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-6 border-t border-brand-secondary/20">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="rounded-full px-8">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light rounded-full px-10 py-6 text-lg font-bold shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" /> Save Lead Entry
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeadForm;