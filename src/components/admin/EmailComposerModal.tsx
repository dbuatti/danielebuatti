"use client";

import React, { useEffect, useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { format } from 'date-fns'; // Import format for date placeholders

const formSchema = z.object({
  recipientEmail: z.string().email({ message: 'A valid recipient email is required.' }),
  subject: z.string().min(1, { message: 'Subject cannot be empty.' }),
  body: z.string().min(1, { message: 'Email body cannot be empty.' }),
  templateId: z.string().optional(), // Optional: to select a template
});

export type EmailComposerFormValues = z.infer<typeof formSchema>;

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface AmebBookingDetails {
  student_parent_name: string;
  contact_email: string;
  exam_date: string;
  exam_time: string;
  exam_board_grade: string;
  teacher_name?: string;
  service_required: string[];
}

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipientEmail: string;
  initialSubject?: string;
  initialBody?: string;
  bookingDetails?: AmebBookingDetails; // New prop for booking details
}

const EmailComposerModal: React.FC<EmailComposerModalProps> = ({
  isOpen,
  onClose,
  initialRecipientEmail,
  initialSubject = '',
  initialBody = '',
  bookingDetails, // Destructure new prop
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const form = useForm<EmailComposerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientEmail: initialRecipientEmail,
      subject: initialSubject,
      body: initialBody,
      templateId: '',
    },
  });

  // Function to replace placeholders
  const replacePlaceholders = (text: string, details?: AmebBookingDetails) => {
    if (!details) return text;

    let newText = text;
    newText = newText.replace(/{{studentParentName}}/g, details.student_parent_name || '');
    newText = newText.replace(/{{contactEmail}}/g, details.contact_email || '');
    newText = newText.replace(/{{examDate}}/g, details.exam_date ? format(new Date(details.exam_date), 'PPP') : '');
    newText = newText.replace(/{{examTime}}/g, details.exam_time || '');
    newText = newText.replace(/{{examBoardGrade}}/g, details.exam_board_grade || '');
    newText = newText.replace(/{{teacherName}}/g, details.teacher_name || 'N/A');
    newText = newText.replace(/{{serviceRequired}}/g, details.service_required?.join(', ') || '');
    // Add more placeholders as needed

    return newText;
  };

  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name, subject, body')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching email templates:', error);
        showError('Failed to load email templates.');
      } else {
        setTemplates(data || []);
      }
      setIsLoadingTemplates(false);
    };
    fetchTemplates();
  }, []);

  // Update form fields when initial props change or template is selected
  useEffect(() => {
    const populatedSubject = replacePlaceholders(initialSubject, bookingDetails);
    const populatedBody = replacePlaceholders(initialBody, bookingDetails);

    form.reset({
      recipientEmail: initialRecipientEmail,
      subject: populatedSubject,
      body: populatedBody,
      templateId: '', // Reset template selection
    });
  }, [initialRecipientEmail, initialSubject, initialBody, bookingDetails, form]);

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = templates.find((t) => t.id === templateId);
    if (selectedTemplate) {
      const populatedSubject = replacePlaceholders(selectedTemplate.subject, bookingDetails);
      const populatedBody = replacePlaceholders(selectedTemplate.body, bookingDetails);
      form.setValue('subject', populatedSubject);
      form.setValue('body', populatedBody);
      form.setValue('templateId', templateId);
    } else {
      form.setValue('templateId', '');
      // If no template is selected, revert to initial (placeholder-populated) values
      form.setValue('subject', replacePlaceholders(initialSubject, bookingDetails));
      form.setValue('body', replacePlaceholders(initialBody, bookingDetails));
    }
  };

  const onSubmit = async (values: EmailComposerFormValues) => {
    setIsSending(true);
    const toastId = showLoading('Sending email...');

    try {
      const { error } = await supabase.functions.invoke('send-admin-email', {
        body: {
          recipientEmail: values.recipientEmail,
          subject: values.subject,
          body: values.body,
        },
      });

      if (error) {
        throw error;
      }

      showSuccess('Email sent successfully!', { id: toastId });
      onClose(); // Close modal on success
    } catch (error: any) {
      console.error('Error sending email:', error);
      showError(`Failed to send email: ${error.message}`, { id: toastId });
    } finally {
      setIsSending(false);
      dismissToast(toastId);
    }
  };

  const availablePlaceholders = [
    '{{studentParentName}}',
    '{{contactEmail}}',
    '{{examDate}}',
    '{{examTime}}',
    '{{examBoardGrade}}',
    '{{teacherName}}',
    '{{serviceRequired}}',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
        <DialogHeader>
          <DialogTitle className="text-brand-primary">Compose Email</DialogTitle>
          <DialogDescription className="text-brand-dark/70 dark:text-brand-light/70">
            Send a direct email to the client. Use placeholders like `{{studentParentName}}` in your templates.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recipientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-dark dark:text-brand-light">Recipient Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Select Template</FormLabel>
              <Select onValueChange={handleTemplateChange} value={form.watch('templateId')}>
                <FormControl>
                  <SelectTrigger className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                    <SelectValue placeholder={isLoadingTemplates ? 'Loading templates...' : 'Select a template (Optional)'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                  {templates.length === 0 && !isLoadingTemplates ? (
                    <SelectItem value="no-templates" disabled>No templates available</SelectItem>
                  ) : (
                    templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormItem>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-dark dark:text-brand-light">Subject</FormLabel>
                  <FormControl>
                    <Input
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
                      rows={10}
                      className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm text-brand-dark/70 dark:text-brand-light/70">
              <p className="font-semibold mb-1">Available Placeholders:</p>
              <ul className="list-disc list-inside grid grid-cols-2 gap-1">
                {availablePlaceholders.map((placeholder) => (
                  <li key={placeholder}>{placeholder}</li>
                ))}
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Email
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailComposerModal;