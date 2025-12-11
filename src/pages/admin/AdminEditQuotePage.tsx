"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormValues, QuoteFormSchema } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote, QuoteItem, QuoteDetails } from '@/types/quote';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

const AdminEditQuotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!slug) {
      showError('Quote slug is missing.');
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      const toastId = showLoading('Loading quote for editing...');
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        if (data) {
          const details = data.details as QuoteDetails;
          setQuoteId(data.id);

          // Map database structure to QuoteFormValues
          const mappedData: QuoteFormValues = {
            clientName: data.client_name,
            clientEmail: data.client_email,
            invoiceType: data.invoice_type,
            eventTitle: data.event_title,
            eventDate: data.event_date,
            eventLocation: data.event_location,
            preparedBy: data.prepared_by,
            currencySymbol: details.currencySymbol,
            depositPercentage: details.depositPercentage,
            paymentTerms: details.paymentTerms,
            bankBSB: details.bankDetails.bsb,
            bankACC: details.bankDetails.acc,
            eventTime: details.eventTime,
            theme: details.theme,
            headerImageUrl: details.headerImageUrl,
            compulsoryItems: details.compulsoryItems.map(item => ({
              id: item.id,
              name: item.name,
              description: item.description,
              amount: item.price, // Map QuoteItem.price to CompulsoryItem.amount
            })),
            addOns: details.addOns.map(item => ({
              id: item.id,
              name: item.name,
              description: item.description,
              cost: item.price, // Map QuoteItem.price to AddOn.cost
              quantity: item.quantity,
            })),
          };

          form.reset(mappedData);
        } else {
          showError('Quote not found.');
        }
      } catch (err: any) {
        console.error('Error fetching quote:', err);
        showError(`Failed to load quote: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
        dismissToast(toastId);
      }
    };

    fetchQuote();
  }, [slug, form]);

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const handleUpdateQuote = async (values: QuoteFormValues) => {
    if (!quoteId) return;

    setIsSubmitting(true);
    const toastId = showLoading('Updating quote...');

    try {
      // Calculate total amount based on compulsory items and add-ons
      const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + item.amount, 0);
      const addOnTotal = values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => 
        sum + (addOn.cost * addOn.quantity), 0) || 0;
      const totalAmount = compulsoryTotal + addOnTotal;

      // Prepare details for JSONB column
      const details: QuoteDetails = {
        depositPercentage: values.depositPercentage,
        paymentTerms: values.paymentTerms,
        bankDetails: {
          bsb: values.bankBSB ?? '',
          acc: values.bankACC ?? '',
        },
        eventTime: values.eventTime,
        currencySymbol: values.currencySymbol,
        theme: values.theme,
        headerImageUrl: values.headerImageUrl,
        
        // Map form items back to QuoteItem structure
        compulsoryItems: values.compulsoryItems.map(item => ({
          id: item.id || Math.random().toString(36).substring(2, 11),
          name: item.name,
          description: item.description || '',
          quantity: 1, // Compulsory items are quantity 1
          price: item.amount, // Map amount to price
        })),
        addOns: values.addOns?.map(addOn => ({
          id: addOn.id || Math.random().toString(36).substring(2, 11),
          name: addOn.name,
          description: addOn.description || '',
          quantity: addOn.quantity,
          price: addOn.cost, // Map cost to price
        })) || [],
      };

      // Update the invoice record
      const { error } = await supabase
        .from('invoices')
        .update({
          client_name: values.clientName,
          client_email: values.clientEmail,
          invoice_type: values.invoiceType,
          event_title: values.eventTitle,
          event_date: values.eventDate,
          event_location: values.eventLocation,
          prepared_by: values.preparedBy,
          total_amount: totalAmount,
          details: details,
        })
        .eq('id', quoteId);

      if (error) throw error;

      showSuccess('Quote updated successfully!', { id: toastId });
      navigate(`/admin/quotes/${slug}`);
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

    // Helper function to map form item to QuoteItem structure
    const mapFormItemToQuoteItem = (item: { id?: string, name: string, description?: string, amount?: number, cost?: number, quantity?: number }): QuoteItem => {
      const quantity = item.quantity ?? 1;
      const price = item.amount ?? item.cost ?? 0;
      
      return {
        id: item.id || Math.random().toString(36).substring(2, 11),
        name: item.name,
        description: item.description || '',
        quantity: quantity,
        price: price,
      };
    };

    return {
      id: quoteId || Math.random().toString(36).substring(2, 11),
      slug: slug || 'preview-slug', // Required for Quote interface
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
        addOns: values.addOns?.map(item => mapFormItemToQuoteItem(item)) || [],
        compulsoryItems: values.compulsoryItems.map(item => mapFormItemToQuoteItem(item)),
        currencySymbol: values.currencySymbol,
        eventTime: values.eventTime,
        theme: values.theme,
        headerImageUrl: values.headerImageUrl,
      },
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Edit Quote: {form.getValues('eventTitle') || slug}</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Modify the details of this existing quote.
      </p>
      
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm 
            form={form}
            onSubmit={handleUpdateQuote} 
            isSubmitting={isSubmitting} 
            onPreview={handlePreviewQuote} 
            onSaveDraft={async () => showError("Cannot save draft on a finalized quote.")}
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