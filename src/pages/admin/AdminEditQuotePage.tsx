"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormValues, QuoteFormSchema } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote } from '@/types/quote';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const AdminEditQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialQuoteData, setInitialQuoteData] = useState<QuoteFormValues | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        showError('Failed to load quote: ' + error.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        // Map database structure to QuoteFormValues
        const mappedData: QuoteFormValues = {
          clientName: data.client_name,
          clientEmail: data.client_email,
          invoiceType: data.invoice_type,
          eventTitle: data.event_title || '',
          eventDate: data.event_date || new Date().toISOString().split('T')[0],
          eventLocation: data.event_location || '',
          preparedBy: data.prepared_by || '',
          currencySymbol: data.details?.currencySymbol || '$',
          depositPercentage: data.details?.depositPercentage || 0,
          paymentTerms: data.details?.paymentTerms || '',
          bankBSB: data.details?.bankDetails?.bsb,
          bankACC: data.details?.bankDetails?.acc,
          compulsoryItems: data.details?.compulsoryItems || [],
          addOns: data.details?.addOns || [],
          eventTime: data.details?.eventTime || '',
        };
        setInitialQuoteData(mappedData);
        form.reset(mappedData); // Set form values using reset
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [id, form]); // Dependency array includes form instance

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const handleUpdateQuote = async (values: QuoteFormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    const toastId = showLoading('Updating quote...');

    try {
      // Calculate total amount based on compulsory items and add-ons
      const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + item.amount, 0);
      const addOnTotal = values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => 
        sum + (addOn.cost * addOn.quantity), 0) || 0;
      const totalAmount = compulsoryTotal + addOnTotal;

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

      const updateData = {
        client_name: values.clientName,
        client_email: values.clientEmail,
        invoice_type: values.invoiceType,
        event_title: values.eventTitle,
        event_date: values.eventDate,
        event_location: values.eventLocation,
        prepared_by: values.preparedBy,
        total_amount: totalAmount,
        details: details,
      };

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      showSuccess('Quote updated successfully!', { id: toastId });
      navigate(`/admin/quotes/${id}`);
      
    } catch (error: any) {
      console.error('Error updating quote:', error);
      showError(`Failed to update quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
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
      id: id || Math.random().toString(36).substring(2, 11),
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!initialQuoteData) {
    return <div className="text-center p-8">Quote not found.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Edit Quote: {initialQuoteData.eventTitle}</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Modify the details of this existing quote.
      </p>
      
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm
            form={form} // Pass the form instance
            onSubmit={handleUpdateQuote}
            isSubmitting={isSubmitting}
            onPreview={handlePreviewQuote}
            onSaveDraft={() => showError("Cannot save draft on a finalized quote.")} 
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

export default AdminEditQuotePage;