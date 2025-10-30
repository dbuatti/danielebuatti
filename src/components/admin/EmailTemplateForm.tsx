"use client";

import React, { useEffect } from 'react'; // Removed useState
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
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Template name is required.' }),
  subject: z.string().min(1, { message: 'Subject is required.' }),
  body: z.string().min(1, { message: 'Body is required.' }),
});

export type EmailTemplateFormValues = z.infer<typeof formSchema>;

interface EmailTemplateFormProps {
  initialData?: EmailTemplateFormValues;
  onSubmit: (values: EmailTemplateFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      subject: '',
      body: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Template Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., AMEB Reply Template"
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
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Your AMEB Accompanying Inquiry"
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
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your email template body here..."
                  rows={10}
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Template'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EmailTemplateForm;