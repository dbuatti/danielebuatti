"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess } from '@/utils/toast';
import QuoteForm, { QuoteFormValues, QuoteFormSchema } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote, QuoteItem } from '@/types/quote';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

const AdminEditQuotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    mode: 'onChange',
  });

  const fetchQuote = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    const toastId = showLoading('Loading quote for editing...');
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('slug', slug)
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
        paymentTerms: details.paymentTerms,
        bankBSB: details.bankDetails.bsb,
        bankACC: details.bankDetails.acc,
        theme: details.theme,
        headerImageUrl: details.headerImageUrl || '',
        preparationNotes: details.preparationNotes || '',
        compulsoryItems: details.compulsoryItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          amount: item.price, // Use price as amount for compulsory items
        })),
        addOns: details.addOns.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          cost: item.price, // Use price as cost for add-ons
          quantity: item.quantity,
        })),
      };
      form.reset(defaultValues);
      showSuccess('Quote loaded.', { id: toastId });
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      showError(`Failed to load quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
      setQuote(null);
    } finally {
      setIsLoading(false);
      dismissToast(toastId);
    }
  }, [slug, form]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const handleSaveDraft = async () => {
    // Removed unused 'values' parameter
    // Draft saving logic is not typically used on an Edit page, but we keep the function signature
    showError('Draft saving is not supported on the Edit page. Use "Update Quote" instead.');
  };

  const handleUpdateQuote = async (values: QuoteFormValues) => {
    if (!quote) return;
    setIsSubmitting(true);
    const toastId = showLoading('Updating quote...');
    try {
      // Calculate total amount based on compulsory items and add-ons
      const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.amount ?? 0), 0);
      const addOnTotal = values.addOns?.reduce((sum: number, addOn) => sum + ((addOn.cost ?? 0) * (addOn.quantity ?? 1)), 0) || 0;
      const totalAmount = compulsoryTotal + addOnTotal;
      // Prepare details for JSONB column
      const details = {
        compulsoryItems: values.compulsoryItems.map(item => ({
          id: item.id || Math.random().toString(36).substring(2, 11),
          name: item.name,
          description: item.description || '',
          price: item.amount ?? 0, // Use amount as price
          quantity: 1, // Compulsory items always have quantity 1 in QuoteItem structure
        })),
        addOns: values.addOns?.map(addOn => ({
          id: addOn.id || Math.random().toString(36).substring(2, 11),
          name: addOn.name,
          description: addOn.description || '',
          price: addOn.cost ?? 0, // Use cost as price
          quantity: addOn.quantity ?? 1, // Ensure quantity is defined
        })) || [],
        depositPercentage: values.depositPercentage,
        bankDetails: {
          bsb: values.bankBSB ?? '',
          acc: values.bankACC ?? '',
        },
        eventTime: values.eventTime ?? '', // FIX: Ensure eventTime is a string
        currencySymbol: values.currencySymbol,
        paymentTerms: values.paymentTerms,
        theme: values.theme || 'black-gold',
        headerImageUrl: values.headerImageUrl || '',
        preparationNotes: values.preparationNotes || '',
      };
      // Update the quote record
      const { data, error } = await supabase
        .from('quotes')
        .update({
          client_name: values.clientName,
          client_email: values.clientEmail,
          invoice_type: values.invoiceType,
          event_title: values.eventTitle,
          event_date: values.eventDate,
          event_location: values.eventLocation,
          prepared_by: values.preparedBy,
          total_amount: totalAmount,
          details: details, // Slug remains unchanged
        })
        .eq('id', quote.id)
        .select('slug')
        .single();
      if (error) {
        throw error;
      }
      showSuccess('Quote updated successfully!', { id: toastId });
      // Refresh data and navigate back to details page
      if (data && data.slug) {
        navigate(`/admin/quotes/${data.slug}`);
      } else {
        navigate('/admin/quotes');
      }
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
    const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.amount ?? 0), 0);
    const addOnTotal = values.addOns?.reduce((sum: number, addOn) => sum + ((addOn.cost ?? 0) * (addOn.quantity ?? 1)), 0) || 0;
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
        paymentTerms: values.paymentTerms,
        bankDetails: {
          bsb: values.bankBSB ?? '',
          acc: values.bankACC ?? '',
        },
        addOns: values.addOns?.map(item => mapFormItemToQuoteItem(item)) || [],
        compulsoryItems: values.compulsoryItems.map(item => mapFormItemToQuoteItem(item)),
        currencySymbol: values.currencySymbol,
        eventTime: values.eventTime ?? '', // FIX: Ensure eventTime is a string
        theme: (values.theme as "black-gold" | "blue-white" | "green-white") || 'black-gold',
        headerImageUrl: values.headerImageUrl || '',
        preparationNotes: values.preparationNotes || '',
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
          <QuoteForm form={form} onSubmit={handleUpdateQuote} isSubmitting={isSubmitting} onPreview={handlePreviewQuote} onSaveDraft={handleSaveDraft} // Placeholder, not used for editing />
        </CardContent>
      </Card>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] p-0 bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-brand-primary text-2xl">Quote Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-70px)]">
            {previewData ? (
              <QuoteDisplay quote={getPreviewData(previewData)} />
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