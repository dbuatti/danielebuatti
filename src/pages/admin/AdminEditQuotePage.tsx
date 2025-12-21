"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormSchema, QuoteFormValues } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote, QuoteItem, QuoteVersion } from '@/types/quote';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, PlusCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { calculateQuoteTotal } from '@/lib/quote-utils'; // Assuming you moved this to a shared util

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
    compulsoryItems: version.compulsoryItems.map((item) => ({
      ...item,
      scheduleDates: item.scheduleDates || '',
      showScheduleDates: item.showScheduleDates ?? false,
      showQuantity: item.showQuantity ?? true,
      showRate: item.showRate ?? true,
    })),
    addOns: version.addOns.map((item) => ({
      ...item,
      scheduleDates: item.scheduleDates || '',
      showScheduleDates: item.showScheduleDates ?? false,
      showQuantity: item.showQuantity ?? true,
      showRate: item.showRate ?? true,
    })),
  };
};

// Helper to map form values to version data
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

  // Improved theme header image handling
  useEffect(() => {
    const currentImageUrl = form.getValues('headerImageUrl');
    const defaultBlackGold = '/blackgoldquoteimage1.jpg';
    const defaultWhitePink = '/whitepinkquoteimage1.jpeg';

    if (watchedTheme === 'black-gold' && (!currentImageUrl || currentImageUrl === defaultWhitePink)) {
      form.setValue('headerImageUrl', defaultBlackGold, { shouldDirty: true });
    }
    // Do nothing for 'default' — preserve user choice
  }, [watchedTheme, form]);

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
        status: data.status || 'Created',
      };

      setQuote(fetchedQuote);

      const versions = fetchedQuote.details?.versions || [];
      if (versions.length === 0) {
        throw new Error('No versions found in quote');
      }

      const activeVersion = versions.find((v) => v.is_active) || versions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      const defaultValues = mapVersionToFormValues(fetchedQuote, activeVersion);
      form.reset(defaultValues);
      setActiveVersionId(activeVersion.versionId);

      if (showToast) showSuccess('Quote loaded.', { id: toastId });
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      showError(`Failed to load quote: ${error.message || 'Unknown error'}`);
      setQuote(null);
    } finally {
      setIsLoading(false);
      if (toastId) dismissToast(toastId);
    }
  }, [id, form]);

  useEffect(() => {
    fetchQuote(true);
  }, [fetchQuote]);

  const handleVersionChange = useCallback(async (versionId: string) => {
    if (!quote) return;

    // Check if form is dirty
    if (form.formState.isDirty) {
      if (!window.confirm('You have unsaved changes. Switching versions will discard them. Continue?')) {
        return;
      }
    }

    const selectedVersion = quote.details.versions.find((v) => v.versionId === versionId);
    if (selectedVersion) {
      const defaultValues = mapVersionToFormValues(quote, selectedVersion);
      form.reset(defaultValues);
      setActiveVersionId(versionId);
      showSuccess(`Switched to version ${versionId}.`);
    }
  }, [quote, form]);

  const handleCreateNewVersion = async () => {
    if (!quote || !activeVersionId) return;

    if (!window.confirm('Create a new version? The current active version will be marked inactive.')) {
      return;
    }

    setIsSubmitting(true);
    const toastId = showLoading('Creating new version...');

    try {
      const currentValues = form.getValues();
      const newVersionData = mapFormValuesToVersionData(currentValues);

      const versions = [...quote.details.versions];
      const nextVersionNumber = versions.length + 1;
      const newVersionId = `v${nextVersionNumber}`;

      // Deactivate all existing versions
      const updatedVersions = versions.map((v) => ({ ...v, is_active: false }));

      // Create new active version
      const newVersion: QuoteVersion = {
        versionId: newVersionId,
        versionName: `Revision ${nextVersionNumber}`,
        created_at: new Date().toISOString(),
        is_active: true,
        status: 'Draft',
        accepted_at: null,
        rejected_at: null,
        ...newVersionData,
      };

      updatedVersions.push(newVersion);

      // Optimistic update
      setQuote((prev) =>
        prev
          ? {
              ...prev,
              details: { versions: updatedVersions },
              total_amount: newVersion.total_amount,
              status: newVersion.status,
            }
          : null
      );

      const { error } = await supabase
        .from('invoices')
        .update({
          details: { versions: updatedVersions },
          total_amount: newVersion.total_amount,
          status: newVersion.status,
          accepted_at: null,
          rejected_at: null,
        })
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess(`New version ${newVersionId} created!`, { id: toastId });
      await fetchQuote(false); // Sync with server
    } catch (error: any) {
      console.error('Error creating new version:', error);
      showError(`Failed to create new version: ${error.message}`);
      await fetchQuote(false); // Revert on error
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const handleUpdateQuote = async (values: QuoteFormValues) => {
    if (!quote || !activeVersionId) return;

    setIsSubmitting(true);
    const toastId = showLoading('Updating version...');

    try {
      const versionData = mapFormValuesToVersionData(values);

      const updatedVersions = quote.details.versions.map((v) =>
        v.versionId === activeVersionId
          ? {
              ...v,
              ...versionData,
              total_amount: versionData.total_amount,
              status: v.status === 'Draft' || v.status === 'Created' ? 'Draft' : v.status,
            }
          : v
      );

      const updatedActiveVersion = updatedVersions.find((v) => v.versionId === activeVersionId)!;

      // Optimistic update
      setQuote((prev) =>
        prev
          ? {
              ...prev,
              details: { versions: updatedVersions },
              total_amount: updatedActiveVersion.total_amount,
              status: updatedActiveVersion.status,
              accepted_at: updatedActiveVersion.accepted_at,
              rejected_at: updatedActiveVersion.rejected_at,
            }
          : null
      );

      const { error } = await supabase
        .from('invoices')
        .update({
          client_name: values.clientName,
          client_email: values.clientEmail,
          event_title: values.eventTitle,
          event_date: values.eventDate,
          event_location: values.eventLocation,
          prepared_by: values.preparedBy,
          total_amount: updatedActiveVersion.total_amount,
          status: updatedActiveVersion.status,
          accepted_at: updatedActiveVersion.accepted_at,
          rejected_at: updatedActiveVersion.rejected_at,
          details: { versions: updatedVersions },
        })
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess('Version updated successfully!', { id: toastId });
      await fetchQuote(false);
    } catch (error: any) {
      console.error('Error updating version:', error);
      showError(`Failed to update version: ${error.message}`);
      await fetchQuote(false); // Revert on error
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const getPreviewData = (values: QuoteFormValues): Quote => {
    const versionData = mapFormValuesToVersionData(values);
    const previewVersion: QuoteVersion = {
      versionId: activeVersionId || 'v-preview',
      versionName: 'Live Preview',
      created_at: new Date().toISOString(),
      is_active: true,
      status: 'Draft',
      accepted_at: null,
      rejected_at: null,
      ...versionData,
    };

    return {
      id: quote?.id || 'preview',
      slug: quote?.slug || 'preview-slug',
      client_name: values.clientName,
      client_email: values.clientEmail,
      event_title: values.eventTitle,
      invoice_type: values.invoiceType,
      event_date: values.eventDate,
      event_location: values.eventLocation,
      prepared_by: values.preparedBy,
      total_amount: previewVersion.total_amount,
      accepted_at: quote?.accepted_at || null,
      rejected_at: quote?.rejected_at || null,
      created_at: quote?.created_at || new Date().toISOString(),
      details: { versions: [previewVersion] },
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

  if (!quote || !quote.details?.versions?.length) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold text-red-500">Quote Not Found or Corrupted</h3>
        <p className="text-gray-500">No versions found. Please delete and recreate this quote.</p>
      </div>
    );
  }

  const activeVersion = quote.details.versions.find((v) => v.is_active) || quote.details.versions[0];
  const isFinalized = !!activeVersion.accepted_at || !!activeVersion.rejected_at;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">
          Edit Quote: {quote.event_title} ({quote.client_name})
        </h2>
        <Button asChild variant="outline">
          <Link to={`/admin/quotes/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Details
          </Link>
        </Button>
      </div>

      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Editing version <span className="font-semibold text-brand-primary">{activeVersionId}</span>
      </p>

      {/* Version Control */}
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            {quote.details.versions.map((version) => (
              <Button
                key={version.versionId}
                variant={version.versionId === activeVersionId ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVersionChange(version.versionId)}
                disabled={isSubmitting}
                className={cn(
                  version.versionId === activeVersionId && 'bg-brand-primary text-brand-light hover:bg-brand-primary/90',
                  version.accepted_at && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                  version.rejected_at && 'border-red-500 bg-red-50 dark:bg-red-900/20'
                )}
              >
                {version.versionName || version.versionId}
                {version.is_active && <span className="ml-2 text-xs opacity-80">(Active)</span>}
                {version.accepted_at && <span className="ml-2 text-xs text-green-600">Accepted</span>}
                {version.rejected_at && <span className="ml-2 text-xs text-red-600">Rejected</span>}
              </Button>
            ))}
            <Button
              variant="default"
              onClick={handleCreateNewVersion}
              disabled={isSubmitting || isFinalized}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Version
            </Button>
            {isFinalized && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Active version is finalized — create a new version to edit.
              </p>
            )}
          </div>
          <Separator className="my-4" />
          <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">
            Changes will apply to the active version ({activeVersionId}).
          </p>
        </CardContent>
      </Card>

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
              onSaveDraft={undefined}
              submitButtonText="Update Active Version"
            />
          </FormProvider>
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-brand-primary text-2xl">Quote Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-70px)]">
            {previewData ? <QuoteDisplay quote={getPreviewData(previewData)} /> : <div className="p-8 text-center">No preview data.</div>}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEditQuotePage;