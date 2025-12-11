"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormValues, QuoteFormSchema } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { createSlug } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote } from '@/types/quote';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AIQuoteContent } from '@/types/ai';

const defaultFormValues: Partial<QuoteFormValues> = {
  clientName: '',
  clientEmail: '',
  invoiceType: 'Quote',
  eventTitle: '',
  eventDate: new Date().toISOString().split('T')[0],
  eventLocation: '',
  preparedBy: 'Admin',
  currencySymbol: '$',
  depositPercentage: 50,
  paymentTerms: 'Payment due within 7 days.',
  bankBSB: '',
  bankACC: '',
  compulsoryItems: [{ description: 'Service Fee', amount: 1000 }],
  addOns: [],
};

const AdminQuoteBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(undefined);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    defaultValues: defaultFormValues as QuoteFormValues,
    mode: 'onChange',
  });

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  // Generate a unique slug with a maximum number of attempts to prevent infinite loops
  const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    let uniqueSlug = baseSlug;
    let counter = 0;
    const maxAttempts = 100; // Prevent infinite loops

    while (counter < maxAttempts) {
      const { data: existingSlugs, error: slugCheckError } = await supabase
        .from('invoices')
        .select('slug')
        .eq('slug', uniqueSlug);

      if (slugCheckError) throw slugCheckError;

      if (existingSlugs && existingSlugs.length === 0) {
        return uniqueSlug; // Slug is unique
      }

      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    // If we've reached max attempts, generate a random suffix
    return `${baseSlug}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  };

  const handleSaveDraft = async (values: QuoteFormValues) => {
    if (!user) {
      showError('You must be logged in to save a draft.');
      return;
    }

    const toastId = showLoading(currentDraftId ? 'Updating draft...' : 'Saving draft...');

    try {
      const draftData = {
        user_id: user.id,
        title: values.eventTitle || `Draft: ${values.clientName || 'Untitled'}`,
        data: values, // Store the entire form values object
        updated_at: new Date().toISOString(),
      };

      let result;
      
      if (currentDraftId) {
        // Update existing draft
        result = await supabase
          .from('quote_drafts')
          .update(draftData)
          .eq('id', currentDraftId)
          .select('id')
          .single();
      } else {
        // Insert new draft
        result = await supabase
          .from('quote_drafts')
          .insert(draftData)
          .select('id')
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      const savedDraftId = result.data.id;
      setCurrentDraftId(savedDraftId);
      
      showSuccess('Draft saved successfully!', { id: toastId });

    } catch (error: any) {
      console.error('Error saving draft:', error);
      showError(`Failed to save draft: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const handleGenerateAI = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    const toastId = showLoading('Generating content with AI...');

    try {
      const { data, error } = await supabase.functions.invoke('generate-quote-content', {
        body: {
          clientName: values.clientName,
          eventTitle: values.eventTitle,
          invoiceType: values.invoiceType,
        },
      });

      if (error) {
        throw error;
      }

      const aiContent = data as AIQuoteContent;

      // Update form fields with AI generated content
      form.setValue('compulsoryItems', aiContent.compulsoryItems.map(item => ({
        ...item,
        id: Math.random().toString(36).substring(2, 11), // Add temporary ID
      })));
      form.setValue('addOns', aiContent.addOns.map(item => ({
        ...item,
        id: Math.random().toString(36).substring(2, 11), // Add temporary ID
      })));
      form.setValue('paymentTerms', aiContent.paymentTerms);

      showSuccess('AI content generated and applied!', { id: toastId });

    } catch (error: any) {
      console.error('Error generating AI content:', error);
      showError(`AI generation failed: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const handleCreateQuote = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    const toastId = showLoading('Creating new quote...');

    try {
      // Calculate total amount based on compulsory items and add-ons
      const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + item.amount, 0);
      const addOnTotal = values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => 
        sum + (addOn.cost * addOn.quantity), 0) || 0;
      const totalAmount = compulsoryTotal + addOnTotal;

      // Generate a base slug
      const baseSlug = createSlug(`${values.eventTitle}-${values.clientName}-${values.eventDate}`);
      const uniqueSlug = await generateUniqueSlug(baseSlug);

      // Prepare details for JSONB column
      const details = {
        compulsoryItems: values.compulsoryItems.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substring(2, 11),
          name: item.description,
        })),
        addOns: values.addOns?.map(addOn => ({
          ...addOn,
          id: addOn.id || Math.random().toString(36).substring(2, 11),
          name: addOn.description,
        })) || [],
        depositPercentage: values.depositPercentage,
        bankDetails: {
          bsb: values.bankBSB ?? '',
          acc: values.bankACC ?? '',
        },
        eventTime: values.eventTime,
        currencySymbol: values.currencySymbol,
        paymentTerms: values.paymentTerms,
      };

      // Invoke the Edge Function to create the quote
      const { data, error } = await supabase.functions.invoke('create-quote', {
        body: {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          invoiceType: values.invoiceType,
          eventTitle: values.eventTitle,
          eventDate: values.eventDate,
          eventLocation: values.eventLocation,
          preparedBy: values.preparedBy,
          totalAmount: totalAmount,
          details: details,
          slug: uniqueSlug,
        },
      });

      if (error) {
        throw error;
      }

      // If successful, delete the draft if one exists
      if (currentDraftId) {
        const { error: deleteError } = await supabase.from('quote_drafts').delete().eq('id', currentDraftId);
        if (deleteError) {
          console.warn('Failed to delete draft after quote creation:', deleteError);
        }
      }

      showSuccess('Quote created successfully!', { id: toastId });

      // Redirect to the newly created quote's public page or admin details page
      if (data && data.slug) {
        navigate(`/quotes/${data.slug}`);
      } else {
        navigate('/admin/quotes');
      }
    } catch (error: any) {
      console.error('Error creating quote:', error);
      showError(`Failed to create quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  // Transform form values into Quote interface structure for preview
  const getPreviewData = (values: QuoteFormValues): Quote => {
    const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + item.amount, 0);
    const addOnTotal = values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => 
      sum + (addOn.cost * addOn.quantity), 0) || 0;
    const totalAmount = compulsoryTotal + addOnTotal;

    return {
      id: Math.random().toString(36).substring(2, 11),
      client_name: values.clientName,
      client_email: values.clientEmail,
      event_title: values.eventTitle,
      invoice_type: values.invoiceType,
      event_date: values.eventDate,
      event_location: values.eventLocation,
      prepared_by: values.preparedBy,
      total_amount: totalAmount,
      accepted_at: null,
      rejected_at: null,
      created_at: new Date().toISOString(),
      details: {
        depositPercentage: values.depositPercentage,
        paymentTerms: values.paymentTerms,
        bankDetails: {
          bsb: values.bankBSB ?? '',
          acc: values.bankACC ?? '',
        },
        addOns: values.addOns?.map(addOn => ({
          ...addOn,
          id: addOn.id || Math.random().toString(36).substring(2, 11),
          name: addOn.description,
        })) || [],
        compulsoryItems: values.compulsoryItems.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substring(2, 11),
          name: item.description,
        })),
        currencySymbol: values.currencySymbol,
        eventTime: values.eventTime,
      },
    };
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Create New Quote</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Use this form to generate a new client-facing quote page. The slug will be automatically generated but can be customized in the QuoteForm if needed.
      </p>
      
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote Details {currentDraftId && <span className="text-sm text-gray-500">(Draft ID: {currentDraftId.substring(0, 8)}...)</span>}</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm 
            form={form}
            onSubmit={handleCreateQuote} 
            isSubmitting={isSubmitting} 
            onPreview={handlePreviewQuote} 
            onSaveDraft={handleSaveDraft}
            onGenerateAI={handleGenerateAI}
          />
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] p-0 bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-brand-primary text-2xl">Quote Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-70px)]">
            {previewData ? (
              <QuoteDisplay 
                quote={getPreviewData(previewData)} 
                isLivePianoTheme={previewData.invoiceType.toLowerCase().includes('live piano')} 
                isErinKennedyQuote={previewData.invoiceType === 'Erin Kennedy Quote'} 
              />
            ) : (
              <div className="p-8 text-center">No preview data available.</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuoteBuilderPage;