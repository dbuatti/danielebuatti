"use client";

import React from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Gift card name is required.' }),
  type: z.enum(['fixed', 'open'], { message: 'Gift card type is required.' }),
  value: z.coerce.number().min(0.01, { message: 'Value must be a positive number.' }),
  code: z.string().min(4, { message: 'Redemption code must be at least 4 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type GiftCardFormValues = z.infer<typeof formSchema>;

interface GiftCardFormProps {
  onSubmit: (values: GiftCardFormValues) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
}

const GiftCardForm: React.FC<GiftCardFormProps> = ({ onSubmit, isSubmitting, onClose }) => {
  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'fixed', // Default to 'fixed'
      value: 0,
      code: '',
      email: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Gift Card Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 1-Hour Coaching Session"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                    <SelectValue placeholder="Select gift card type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                  <SelectItem value="fixed">Fixed Session</SelectItem>
                  <SelectItem value="open">Open Credit</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Value (A$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Redemption Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., GIFT12345"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Buyer/Recipient Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              'Create Gift Card'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GiftCardForm;