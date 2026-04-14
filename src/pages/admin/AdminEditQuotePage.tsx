"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormSchema, QuoteFormValues } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote, QuoteItem, QuoteVersion } from '@/types/quote';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateQuoteTotal } from '@/lib/quote-utils';

// Helper to map QuoteVersion back to QuoteFormValues
const mapVersionToFormValues = (quote: Quote, version: QuoteVersion): QuoteFormValues => {
  return {
    clientName: quote.client_name,
    clientEmail: quote.client_email,
    invoiceType: quote.invoice_type,
    eventTitle: quote.event_title,
    eventDate: quote.event_date,
    eventTime: version.eventTime || '',
    eventLocation: quote.event_location,
    preparedBy: quote.prepared_by,
    currencySymbol: version.currencySymbol,
    depositPercentage: version.depositPercentage,
    discountPercentage: version.discountPercentage || 0,
    discountAmount: version.discountAmount || 0,
    paymentTerms: version.paymentTerms || '',
    bankBSB: version.bankDetails.bsb,
    bankACC: version.bankDetails.acc,
    theme: version.theme,
    headerImageUrl: version.headerImageUrl || '',
    headerImagePosition: version.headerImagePosition || '',
    preparationNotes: version.preparationNotes || '',
    scopeOfWorkUrl: version.scopeOfWorkUrl || '',
    
    compulsoryItems: version.compulsoryItems.map(item => ({
      ...item,
      scheduleDates: item.scheduleDates || '',
      showScheduleDates: item.showScheduleDates ?? false,
      showQuantity: item.showQuantity ?? true,
      showRate: item.showRate ?? true,
    })),
    addOns: version.addOns.map(item => ({
      ...item,
      scheduleDates: item.scheduleDates || '',
      showScheduleDates: item.showScheduleDates ?? false,
      showQuantity: item.showQuantity ?? true,
      showRate: item.showRate ?? true,
    })),
  };
};

const mapFormValuesToVersionData = (values: QuoteFormValues): Omit<QuoteVersion, 'versionId' | 'versionName' | 'created_at' | 'is_active' | 'status' | 'accepted_at' | 'rejected_at' | 'client_selected_add_ons'> => {
    const totalAmount = calculateQuoteTotal(values);
    const mapItem = (item: any): QuoteItem => ({
      id: item.id || Math.random().toString(36).substring(2, 11),
      name: item.name,
      description: item.description || '',
      quantity: item.quantity ?? 1,
      price: item.price ?? 0,
      scheduleDates: item.scheduleDates || '',
      showScheduleDates: item.showScheduleDates ?? false,
      showQuantity: item.showQuantity ?? true,
      showRate: item.showRate ?? true,
    });

    return {
      total_amount: totalAmount,
      depositPercentage: values.depositPercentage,
      discountPercentage: values.discountPercentage,
      discountAmount: values.discountAmount,
      paymentTerms: values.paymentTerms || '',
      bankDetails: {
        bsb: values.bankBSB ?? '',
        acc: values.bankACC ?? '',
      },
      addOns: values.addOns?.map(mapItem) || [],
      compulsoryItems: values.compulsoryItems.map(mapItem),
      currencySymbol: values.currencySymbol,
      eventTime: values.eventTime ?? '',
      theme: values.theme,
      headerImageUrl: values.headerImageUrl || '',
      headerImagePosition: values.headerImagePosition || '',
      preparationNotes: values.preparationNotes || '',
      scopeOfWorkUrl: values.scopeOfWorkUrl || '',
    };
};

const AdminEditQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    mode: 'onChange',
  });
  
  const watchedTheme = form.watch('theme');

  useEffect(() => {
    if (!isLoading) {
      const currentImageUrl = form.getValues('headerImageUrl');
      const defaultWhitePink = '/whitepinkquoteimage1.jpeg';
      const defaultBlackGold = '/blackgoldquoteimage1.jpg';
      if (watchedTheme === 'black-gold' && (!currentImageUrl || currentImageUrl === defaultWhitePink || currentImageUrl === '/blacktie.avif')) {
          form.setValue('headerImageUrl', defaultBlackGold, { shouldDirty: true });
      }
    }
  }, [watchedTheme, form, isLoading]);

  const fetchQuote = useCallback(async (showToast = false) => {
    if (!id) return;
    setIsLoading(true);
    const toastId = showToast ? showLoading('Loading quote...') : undefined;
    try {
      const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
      if (error) throw error;
      const fetchedQuote: Quote = {
        ...data,
        total_amount: parseFloat(data.total_amount),
        details: data.details as Quote['details'],
        status: (data.status || 'Created') as Quote['status'],
      };
      setQuote(fetchedQuote);
      const versions = fetchedQuote.details?.versions || [];
      const activeVersion = versions.find(v => v.is_active) || versions[0];
      if (activeVersion) {
        form.reset(mapVersionToFormValues(fetchedQuote, activeVersion));
        setActiveVersionId(activeVersion.versionId);
      }
    } catch (error: any) {
      showError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      if (toastId) dismissToast(toastId);
    }
  }, [id, form]);

  useEffect(() => { fetchQuote(true); }, [fetchQuote]);
  
  const handleUpdateQuote = async (values: QuoteFormValues) => {
    if (!quote || !activeVersionId) return;
    setIsSubmitting(true);
    const toastId = showLoading('Updating quote...');
    try {
      const versionData = mapFormValuesToVersionData(values);
      const updatedVersions = quote.details.versions.map(v => v.versionId === activeVersionId ? { ...v, ...versionData, total_amount: versionData.total_amount } : v);
      const { error } = await supabase.from('invoices').update({
          client_name: values.clientName,
          client_email: values.clientEmail,
          event_title: values.eventTitle,
          event_date: values.eventDate,
          event_location: values.eventLocation,
          total_amount: versionData.total_amount,
          details: { versions: updatedVersions },
      }).eq('id', quote.id);
      if (error) throw error;
      showSuccess('Quote updated!');
      await fetchQuote(false);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const getPreviewData = (values: QuoteFormValues): Quote => {
    const versionData = mapFormValuesToVersionData(values);
    return {
      id: quote?.id || 'preview',
      slug: quote?.slug || 'preview',
      client_name: values.clientName,
      client_email: values.clientEmail,
      event_title: values.eventTitle,
      invoice_type: values.invoiceType,
      event_date: values.eventDate,
      event_location: values.eventLocation,
      prepared_by: values.preparedBy,
      total_amount: versionData.total_amount,
      accepted_at: null, rejected_at: null, created_at: new Date().toISOString(),
      details: { versions: [{ ...versionData, versionId: 'v-preview', versionName: 'Preview', created_at: new Date().toISOString(), is_active: true, status: 'Draft', accepted_at: null, rejected_at: null }] },
      status: 'Draft',
    };
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Edit Quote: {quote?.event_title}</h2>
        <Button asChild variant="outline"><Link to={`/admin/quotes/${id}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link></Button>
      </div>
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardContent className="pt-6">
          <FormProvider {...form}>
            <QuoteForm 
              form={form}
              onCreateAndSend={handleUpdateQuote}
              isSubmitting={isSubmitting} 
              onPreview={(v) => { setPreviewData(v); setIsPreviewOpen(true); }} 
              isQuoteCreated={true}
              submitButtonText="Update Quote Details"
            />
          </FormProvider>
        </CardContent>
      </Card>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] p-0">
          <ScrollArea className="h-full">
            {previewData && <QuoteDisplay quote={getPreviewData(previewData)} />}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEditQuotePage;