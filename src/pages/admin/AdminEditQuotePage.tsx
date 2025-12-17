"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormSchema, QuoteFormValues } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote, QuoteItem } from '@/types/quote';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

const AdminEditQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    mode: 'onChange',
  });
  
  const watchedTheme = form.watch('theme');

  // Update header image URL based on theme selection
  useEffect(() => {
    // Only run this if the form is initialized and the theme changes
    if (!isLoading) {
      const currentImageUrl = form.getValues('headerImageUrl');
      const defaultWhitePink = '/whitepinkquoteimage1.jpeg';
      const defaultBlackGold = '/blackgoldquoteimage1.jpg';
      
      let newImageUrl = currentImageUrl;

      // Check if the current image is empty OR if it matches the default for the *other* theme
      const isCurrentEmptyOrDefault = !currentImageUrl || currentImageUrl === defaultWhitePink || currentImageUrl === defaultBlackGold;

      if (watchedTheme === 'black-gold' && isCurrentEmptyOrDefault) {
        newImageUrl = defaultBlackGold;
      } else if (watchedTheme === 'default' && isCurrentEmptyOrDefault) {
        // If the user cleared the field, we respect the empty string.
        // We only set the default if the field is currently empty.
        newImageUrl = currentImageUrl || ''; 
      }
      
      // If the current image is NOT empty and NOT a default, we leave it alone.
      if (newImageUrl !== currentImageUrl) {
          form.setValue('headerImageUrl', newImageUrl, { shouldDirty: true });
      }
    }
  }, [watchedTheme, form, isLoading]);


  const fetchQuote = useCallback(async (showToast = false) => {
    if (!id) return;

    setIsLoading(true);
    const toastId = showToast ? showLoading('Loading quote for editing...') : undefined;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const fetchedQuote: Quote = {
        id: data.id,
        slug: data.slug,
        client_name: data.client_name,
        client_email: data.client_email,
        event_title: data.event_title,
        invoice_type: data.invoice_type,
        event_date: data.event_date,
        event_location: data.event_location,
        prepared_by: data.prepared_by,
        total_amount: data.total_amount,
        accepted_at: data.accepted_at,
        rejected_at: data.rejected_at,
        created_at: data.created_at,
        details: data.details,
        status: data.status || 'Created',
      };

      setQuote(fetchedQuote);

      const details = fetchedQuote.details;

      // Map Quote data to Form values
      const defaultValues: QuoteFormValues = {
        clientName: fetchedQuote.client_name,
        clientEmail: fetchedQuote.client_email,
        invoiceType: fetchedQuote.invoice_type,
        eventTitle: fetchedQuote.event_title,
        eventDate: fetchedQuote.event_date,
        eventTime: details.eventTime || '',
        eventLocation: fetchedQuote.event_location,
        preparedBy: fetchedQuote.prepared_by,
        currencySymbol: details.currencySymbol,
        depositPercentage: details.depositPercentage,
        paymentTerms: details.paymentTerms || '', // Preserve empty string
        bankBSB: details.bankDetails.bsb,
        bankACC: details.bankDetails.acc,
        theme: details.theme,
        headerImageUrl: details.headerImageUrl || '', // Preserve empty string
        headerImagePosition: details.headerImagePosition || '', // Preserve empty string
        preparationNotes: details.preparationNotes || '',
        
        compulsoryItems: details.compulsoryItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          scheduleDates: item.scheduleDates || '', // Preserve empty string
          showScheduleDates: item.showScheduleDates ?? false, // Use false default
          showQuantity: item.showQuantity ?? true,
          showRate: item.showRate ?? true,
        })),
        addOns: details.addOns.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          scheduleDates: item.scheduleDates || '', // Preserve empty string
          showScheduleDates: item.showScheduleDates ?? false, // Use false default
          showQuantity: item.showQuantity ?? true,
          showRate: item.showRate ?? true,
        })),
      };

      form.reset(defaultValues);
      if (showToast) showSuccess('Quote loaded.', { id: toastId });
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      showError(`Failed to load quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
      setQuote(null);
    } finally {
      setIsLoading(false);
      if (toastId) dismissToast(toastId);
    }
  }, [id, form]);

  useEffect(() => {
    fetchQuote(true); // Fetch with toast on initial load
  }, [fetchQuote]);

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const handleUpdateQuote = async (values: QuoteFormValues) => {
    if (!quote) return;

    setIsSubmitting(true);
    const toastId = showLoading('Updating quote...');

    try {
      // Calculate total amount based on compulsory items and add-ons
      const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0);
      const addOnTotal = values.addOns?.reduce((sum: number, addOn) => 
        sum + ((addOn.price ?? 0) * (addOn.quantity ?? 1)), 0) || 0;
      const totalAmount = compulsoryTotal + addOnTotal;

      // Prepare details for JSONB column
      const details = {
        compulsoryItems: values.compulsoryItems.map(item => ({
          id: item.id || Math.random().toString(36).substring(2, 11),
          name: item.name,
          description: item.description || '',
          price: item.price ?? 0,
          quantity: item.quantity ?? 1,
          scheduleDates: item.scheduleDates || '', // Preserve empty string
          showScheduleDates: item.showScheduleDates ?? false,
          showQuantity: item.showQuantity ?? true,
          showRate: item.showRate ?? true,
        })),
        addOns: values.addOns?.map(addOn => ({
          id: addOn.id || Math.random().toString(36).substring(2, 11),
          name: addOn.name,
          description: addOn.description || '',
          price: addOn.price ?? 0,
          quantity: addOn.quantity ?? 1,
          scheduleDates: addOn.scheduleDates || '', // Preserve empty string
          showScheduleDates: addOn.showScheduleDates ?? false,
          showQuantity: addOn.showQuantity ?? true,
          showRate: addOn.showRate ?? true,
        })) || [],
        depositPercentage: values.depositPercentage,
        bankDetails: {
          bsb: values.bankBSB ?? '',
          acc: values.bankACC ?? '',
        },
        eventTime: values.eventTime ?? '',
        currencySymbol: values.currencySymbol,
        paymentTerms: values.paymentTerms || '', // Preserve empty string
        theme: values.theme,
        headerImageUrl: values.headerImageUrl || '', // Preserve empty string
        headerImagePosition: values.headerImagePosition || '', // Preserve empty string
        preparationNotes: values.preparationNotes || '',
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
          // Slug remains unchanged
        })
        .eq('id', quote.id);

      if (error) {
        throw error;
      }

      showSuccess('Quote updated successfully!', { id: toastId });

      // Stay on the edit page and refresh the data
      await fetchQuote(false); 
      
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
    const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0);
    const addOnTotal = values.addOns?.reduce((sum: number, addOn) => 
      sum + ((addOn.price ?? 0) * (addOn.quantity ?? 1)), 0) || 0;
    const totalAmount = compulsoryTotal + addOnTotal;

    // Helper function to map form item to QuoteItem structure
    const mapFormItemToQuoteItem = (item: { id?: string, name: string, description?: string, price?: number, quantity?: number, scheduleDates?: string, showScheduleDates?: boolean, showQuantity?: boolean, showRate?: boolean }): QuoteItem => {
      const quantity = item.quantity ?? 1;
      const price = item.price ?? 0;
      
      return {
        id: item.id || Math.random().toString(36).substring(2, 11),
        name: item.name,
        description: item.description || '',
        quantity: quantity,
        price: price,
        scheduleDates: item.scheduleDates || '',
        showScheduleDates: item.showScheduleDates ?? false,
        showQuantity: item.showQuantity ?? true,
        showRate: item.showRate ?? true,
      };
    };

    return {
      id: quote?.id || Math.random().toString(36).substring(2, 11),
      slug: quote?.slug || 'preview-slug',
      client_name: values.clientName,
      client_email: values.clientEmail,
      event_title: values.eventTitle,
      invoice_type: values.invoiceType,
      event_date: values.eventDate,
      event_location: values.eventLocation,
      prepared_by: values.preparedBy,
      total_amount: totalAmount,
      accepted_at: quote?.accepted_at || null,
      rejected_at: quote?.rejected_at || null,
      created_at: quote?.created_at || new Date().toISOString(),
      details: {
        depositPercentage: values.depositPercentage,
        paymentTerms: values.paymentTerms || '',
        bankDetails: {
          bsb: values.bankBSB ?? '',
          acc: values.bankACC ?? '',
        },
        addOns: values.addOns?.map(item => mapFormItemToQuoteItem(item)) || [],
        compulsoryItems: values.compulsoryItems.map(item => mapFormItemToQuoteItem(item)),
        currencySymbol: values.currencySymbol,
        eventTime: values.eventTime ?? '',
        theme: values.theme,
        headerImageUrl: values.headerImageUrl || '',
        headerImagePosition: values.headerImagePosition || '',
        preparationNotes: values.preparationNotes || '',
      },
      status: quote?.status || 'Created',
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold">Quote Not Found</h3>
        <p className="text-gray-500">Could not load quote details for editing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Edit Quote: {quote.event_title}</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Modify the details of this existing quote.
      </p>
      
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <QuoteForm 
              form={form}
              onCreateAndSend={handleUpdateQuote}
              isSubmitting={isSubmitting} 
              onPreview={handlePreviewQuote} 
              isQuoteCreated={true}
            />
          </FormProvider>
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