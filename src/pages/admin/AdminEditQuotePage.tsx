"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormValues } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Quote } from '@/types/quote';

const AdminEditQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialQuoteData, setInitialQuoteData] = useState<QuoteFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) {
        showError("Quote ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote for editing:', error);
        showError('Failed to load quote for editing.');
        navigate('/admin/quotes');
      } else {
        const mappedData: QuoteFormValues = {
          emailContent: '',
          clientName: data.client_name,
          clientEmail: data.client_email,
          invoiceType: data.invoice_type, // Fixed: use invoice_type from database
          eventTitle: data.event_title || '',
          eventDate: data.event_date || '',
          eventTime: data.details?.eventTime || '',
          eventLocation: data.event_location || '',
          preparedBy: data.prepared_by || 'Daniele Buatti',
          baseServiceDescription: data.details?.baseService?.description || '',
          baseServiceAmount: data.details?.baseService?.amount || 0,
          addOns: data.details?.addOns?.map((addOn: any) => ({
            id: addOn.id || Math.random().toString(36).substring(2, 11),
            name: addOn.name,
            description: addOn.description,
            cost: addOn.cost,
            quantity: addOn.quantity,
          })) || [],
          depositPercentage: data.details?.depositPercentage || 50,
          bankBSB: data.details?.bankDetails?.bsb || '923100',
          bankACC: data.details?.bankDetails?.acc || '301110875',
          currencySymbol: data.details?.currencySymbol || 'A$',
          paymentTerms: data.details?.paymentTerms || 'The remaining balance is due 7 days prior to the event.',
        };
        setInitialQuoteData(mappedData);
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [id, navigate]);

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const handleUpdateQuote = async (values: QuoteFormValues) => {
    if (!id) {
      showError("Quote ID is missing for update.");
      return;
    }

    setIsSubmitting(true);
    const toastId = showLoading('Updating quote...');

    try {
      const totalAmount = values.baseServiceAmount + (values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => sum + (addOn.cost * addOn.quantity), 0) || 0);

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

      const { error } = await supabase
        .from('invoices')
        .update({
          client_name: values.clientName,
          client_email: values.clientEmail,
          invoice_type: values.invoiceType, // Fixed: use invoice_type for database column
          event_title: values.eventTitle,
          event_date: values.eventDate,
          event_location: values.eventLocation,
          prepared_by: values.preparedBy,
          total_amount: totalAmount,
          details: details,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      showSuccess('Quote updated successfully!', { id: toastId });
      navigate(`/admin/quotes/${id}`);
    } catch (error: any) {
      console.error('Error updating quote:', error);
      showError(`Failed to update quote: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const getPreviewData = (values: QuoteFormValues): Quote => {
    const totalAmount = values.baseServiceAmount + (values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => sum + (addOn.cost * addOn.quantity), 0) || 0);

    return {
      id: id || '',
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!initialQuoteData) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-brand-dark dark:text-brand-light">Quote not found or could not be loaded for editing.</p>
        <Button onClick={() => navigate('/admin/quotes')} className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate(`/admin/quotes/${id}`)} className="bg-brand-secondary hover:bg-brand-secondary/90 text-brand-light">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quote Details
        </Button>
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Edit Quote</h2>
      </div>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Modify the details of this existing quote. The public URL (slug) remains unchanged to maintain existing links.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm
            initialData={initialQuoteData}
            onSubmit={handleUpdateQuote}
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

export default AdminEditQuotePage;