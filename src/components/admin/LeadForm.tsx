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
import { Loader2 } from 'lucide-react';

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

  const inputClasses = "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company / Lead Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Australian Club" className={inputClasses} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
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
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClasses}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="04..." className={inputClasses} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue / Location</FormLabel>
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
              <FormLabel>How connection was made (Source)</FormLabel>
              <FormControl>
                <Input placeholder="Referral via Graham" className={inputClasses} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outcome of Contact</FormLabel>
              <FormControl>
                <Textarea placeholder="Pianist found for this Saturday, but encouraged to email..." className={inputClasses} {...field} />
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
              <FormLabel>General Notes / About</FormLabel>
              <FormControl>
                <Textarea placeholder="Professional jazz/contemporary pianist based in Melbourne..." className={inputClasses} {...field} />
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
              <FormLabel>Goal / Next Steps</FormLabel>
              <FormControl>
                <Textarea placeholder="Introduce himself properly, express genuine interest..." className={inputClasses} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              'Save Lead'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeadForm;