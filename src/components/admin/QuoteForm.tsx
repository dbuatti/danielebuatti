"use client";

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import *s z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
// Removed unused 'cn' import
// import { cn } from '@/lib/utils'; 

// Zod schema for the quote form
const quoteFormSchema = z.object({
  clientName: z.string().min(1, { message: "Client name is required." }),
  clientEmail: z.string().email({ message: "A valid client email is required." }),
  eventTitle: z.string().min(1, { message: "Event title is required." }),
  eventDate: z.string().min(1, { message: "Event date is required (YYYY-MM-DD)." }),
  eventTime: z.string().optional(), // e.g., "6:00 PM - 9:00 PM"
  eventLocation: z.string().min(1, { message: "Event location is required." }),
  preparedBy: z.string().min(1, { message: "Prepared by name is required." }).default("Daniele Buatti"),
  baseServiceDescription: z.string().min(1, { message: "Base service description is required." }),
  baseServiceAmount: z.coerce.number().min(0, { message: "Base service amount must be a positive number." }),
  addOns: z.array(z.object({
    name: z.string().min(1, { message: "Add-on name is required." }),
    description: z.string().optional(),
    cost: z.coerce.number().min(0, { message: "Add-on cost must be a positive number." }),
  })).optional(),
  depositPercentage: z.coerce.number().min(0).max(100).default(50),
  bankBSB: z.string().min(1, { message: "Bank BSB is required." }).default("923100"),
  bankACC: z.string().min(1, { message: "Bank Account Number is required." }).default("301110875"),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  initialData?: QuoteFormValues;
  onSubmit: (values: QuoteFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: initialData || {
      clientName: '',
      clientEmail: '',
      eventTitle: '',
      eventDate: '',
      eventTime: '',
      eventLocation: '',
      preparedBy: 'Daniele Buatti',
      baseServiceDescription: '',
      baseServiceAmount: 0,
      addOns: [],
      depositPercentage: 50,
      bankBSB: '923100',
      bankACC: '301110875',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addOns",
  });

  const baseServiceAmount = form.watch('baseServiceAmount');
  const addOns = form.watch('addOns');
  const depositPercentage = form.watch('depositPercentage');

  const totalAmount = React.useMemo(() => {
    let total = baseServiceAmount || 0;
    addOns?.forEach(addOn => {
      total += addOn.cost || 0;
    });
    return total;
  }, [baseServiceAmount, addOns]);

  const requiredDeposit = React.useMemo(() => {
    return totalAmount * (depositPercentage / 100);
  }, [totalAmount, depositPercentage]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-xl font-semibold text-brand-primary">Client & Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Erin Kennedy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g., erin@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2025 Vocal Showcase" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Format: YYYY-MM-DD</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Time (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3:00 PM – 6:00 PM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., MC Showroom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preparedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prepared By</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-xl font-semibold text-brand-primary mt-8">Base Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="baseServiceDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., 3 hours of dedicated on-site presence" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baseServiceAmount"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Amount (A$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-xl font-semibold text-brand-primary mt-8">Optional Add-Ons</h3>
        <div className="space-y-4">
          {fields.map((item, index) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30">
              <FormField
                control={form.control}
                name={`addOns.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Add-on Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pre-event rehearsal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`addOns.${index}.description`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A 2-hour rehearsal session" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`addOns.${index}.cost`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Cost (A$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                className="self-end md:self-center"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: '', description: '', cost: 0 })}
            className="w-full border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Add-on
          </Button>
        </div>

        <h3 className="text-xl font-semibold text-brand-primary mt-8">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="depositPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit Percentage (%)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankBSB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank BSB</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankACC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8 p-6 bg-brand-primary/10 rounded-lg border border-brand-primary/30 shadow-lg text-center space-y-2">
          <p className="text-2xl font-bold text-brand-primary">Total Quote Amount: <span className="text-brand-dark dark:text-brand-light">A${totalAmount.toFixed(2)}</span></p>
          <p className="text-xl text-brand-dark/80 dark:text-brand-light/80">Required Deposit ({depositPercentage}%): <span className="font-semibold">A${requiredDeposit.toFixed(2)}</span></p>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Quote...
            </>
          ) : (
            'Create Quote'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuoteForm;