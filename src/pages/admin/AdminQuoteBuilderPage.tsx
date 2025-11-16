"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormValues } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { createSlug } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote } from '@/types/quote';

const AdminQuoteBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const handleCreateQuote = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    const toastId = showLoading('Creating new quote...');

    try {
      const totalAmount = values.baseServiceAmount + (values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => sum + (addOn.cost * addOn.quantity), 0) || 0);

      // Generate a base slug
      const baseSlug = createSlug(`${values.eventTitle}-${values.clientName}-${values.eventDate}`);
      let uniqueSlug = baseSlug;
      let counter = 0;

      // Ensure slug uniqueness
      while (true) {
        const { data: existingSlugs, error: slugCheckError } = await supabase
          .from('invoices')
          .select('slug')
          .eq('slug', uniqueSlug);

        if (slugCheckError) throw slugCheckError;

        if (existingSlugs && existingSlugs.length === 0) {
          break; // Slug is unique
        }

        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
      }

      // Prepare details for JSONB column
      const details = {
        baseService: {
          description: values.baseServiceDescription,
          amount: values.baseServiceAmount,
        },
        addOns: values.addOns?.map(addOn => ({
          ...addOn,
          id: addOn.id || Math.random().toString(36).substring(2, 11),
        })) || [],
        depositPercentage: values.depositPercentage,
        bankDetails: {
          bsb: values.bankBSB,
          acc: values.bankACC,
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

      showSuccess('Quote created successfully!', { id: toastId });
      // Redirect to the newly created quote's public page or admin details page
      if (data && data.slug) {
        navigate(`/quotes/${data.slug}`);
      } else {
        navigate('/admin/quotes');
      }
    } catch (error: any) {
      console.error('Error creating quote:', error);
      showError(`Failed to create quote: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  // Transform form values into Quote interface structure for preview
  const getPreviewData = (values: QuoteFormValues): Quote => {
    const totalAmount = values.baseServiceAmount + (values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => sum + (addOn.cost * addOn.quantity), 0) || 0);

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
          bsb: values.bankBSB,
          acc: values.bankACC,
        },
        addOns: values.addOns?.map(addOn => ({
          ...addOn,
          id: addOn.id || Math.random().toString(36).substring(2, 11),
        })) || [],
        currencySymbol: values.currencySymbol,
        baseService: {
          description: values.baseServiceDescription,
          amount: values.baseServiceAmount,
        },
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
          <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm 
            onSubmit={handleCreateQuote} 
            isSubmitting={isSubmitting} 
            onPreview={handlePreviewQuote}
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