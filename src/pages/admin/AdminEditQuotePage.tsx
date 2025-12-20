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

// Helper to map QuoteFormValues to a partial QuoteVersion
const mapFormValuesToVersionData = (values: QuoteFormValues): Omit<QuoteVersion, 'versionId' | 'versionName' | 'created_at' | 'is_active' | 'status' | 'accepted_at' | 'rejected_at' | 'client_selected_add_ons'> => {
    const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0);
    const addOnTotal = values.addOns?.reduce((sum: number, addOn) => 
      sum + ((addOn.price ?? 0) * (addOn.quantity ?? 0)), 0) || 0;
    const totalAmount = compulsoryTotal + addOnTotal;

    const mapItem = (item: { id?: string, name: string, description?: string, price?: number, quantity?: number, scheduleDates?: string, showScheduleDates?: boolean, showQuantity?: boolean, showRate?: boolean }): QuoteItem => ({
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

  // Update header image URL based on theme selection
  useEffect(() => {
    if (!isLoading) {
      const currentImageUrl = form.getValues('headerImageUrl');
      const defaultWhitePink = '/whitepinkquoteimage1.jpeg';
      const defaultBlackGold = '/blackgoldquoteimage1.jpg';
      
      let newImageUrl = currentImageUrl;

      const isCurrentEmptyOrDefault = !currentImageUrl || currentImageUrl === defaultWhitePink || currentImageUrl === defaultBlackGold;

      if (watchedTheme === 'black-gold' && isCurrentEmptyOrDefault) {
        newImageUrl = defaultBlackGold;
      } else if (watchedTheme === 'default' && isCurrentEmptyOrDefault) {
        newImageUrl = currentImageUrl || ''; 
      }
      
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
        ...data,
        total_amount: parseFloat(data.total_amount),
        details: data.details as Quote['details'],
        status: data.status || 'Created',
      };

      setQuote(fetchedQuote);
      
      // Determine the active version to load into the form
      const versions = fetchedQuote.details?.versions || [];
      
      if (versions.length === 0) {
          // If no versions exist, treat as not found/corrupted data
          console.error(`Quote ${fetchedQuote.id} loaded but contains no versions.`);
          showError('Quote data is corrupted: No versions found.');
          setQuote(null);
          return;
      }
      
      const activeVersion = versions.find(v => v.is_active);
      
      if (activeVersion) {
        const defaultValues = mapVersionToFormValues(fetchedQuote, activeVersion);
        form.reset(defaultValues);
        setActiveVersionId(activeVersion.versionId);
      } else {
        // Fallback: load the latest version if no active one is marked
        const latestVersion = versions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        const defaultValues = mapVersionToFormValues(fetchedQuote, latestVersion);
        form.reset(defaultValues);
        setActiveVersionId(latestVersion.versionId);
      }

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
    fetchQuote(true);
  }, [fetchQuote]);
  
  const handleVersionChange = useCallback((versionId: string) => {
    if (!quote) return;
    const selectedVersion = quote.details.versions.find(v => v.versionId === versionId);
    if (selectedVersion) {
      const defaultValues = mapVersionToFormValues(quote, selectedVersion);
      form.reset(defaultValues);
      setActiveVersionId(versionId);
      showSuccess(`Switched to version ${versionId}.`);
    }
  }, [quote, form]);
  
  const handleCreateNewVersion = async () => {
    if (!quote || !activeVersionId) return;
    
    if (!window.confirm('Are you sure you want to create a new version? The current active version will be marked inactive.')) {
        return;
    }
    
    setIsSubmitting(true);
    const toastId = showLoading('Creating new version...');
    
    try {
        const currentValues = form.getValues();
        const newVersionData = mapFormValuesToVersionData(currentValues);
        
        const versions = quote.details.versions;
        const nextVersionNumber = versions.length + 1;
        const newVersionId = `v${nextVersionNumber}`;
        
        // 1. Deactivate all existing versions
        const updatedVersions = versions.map(v => ({ ...v, is_active: false }));
        
        // 2. Create the new version based on current form data
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
        
        // 3. Update the database
        const { error } = await supabase
            .from('invoices')
            .update({
                details: { versions: updatedVersions },
                // Update top-level fields to reflect the new active version (Draft status)
                total_amount: newVersion.total_amount,
                status: newVersion.status,
                accepted_at: null,
                rejected_at: null,
            })
            .eq('id', quote.id);

        if (error) throw error;
        
        showSuccess(`New version ${newVersionId} created and set as active!`, { id: toastId });
        await fetchQuote(false); // Refetch to update state and form
        
    } catch (error: any) {
        console.error('Error creating new version:', error);
        showError(`Failed to create new version: ${error.message || 'Unknown error occurred'}`, { id: toastId });
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
    const toastId = showLoading('Updating active version...');

    try {
      const versionData = mapFormValuesToVersionData(values);
      
      // 1. Update the specific active version in the versions array
      const updatedVersions = quote.details.versions.map(v => {
        if (v.versionId === activeVersionId) {
          // Only update editable fields, preserve status/acceptance dates
          return {
            ...v,
            ...versionData,
            // Ensure status is 'Draft' if it was previously 'Draft' or 'Created'
            status: (v.status === 'Draft' || v.status === 'Created') ? 'Draft' : v.status,
            total_amount: versionData.total_amount,
          };
        }
        return v;
      });
      
      const updatedActiveVersion = updatedVersions.find(v => v.versionId === activeVersionId);
      if (!updatedActiveVersion) throw new Error("Active version not found after update.");

      // 2. Update the main invoice record
      const { error } = await supabase
        .from('invoices')
        .update({
          client_name: values.clientName,
          client_email: values.clientEmail,
          event_title: values.eventTitle,
          event_date: values.eventDate,
          event_location: values.eventLocation,
          prepared_by: values.preparedBy,
          
          // Update top-level fields to reflect the active version's data
          total_amount: updatedActiveVersion.total_amount,
          status: updatedActiveVersion.status,
          accepted_at: updatedActiveVersion.accepted_at,
          rejected_at: updatedActiveVersion.rejected_at,
          
          details: { versions: updatedVersions },
        })
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess('Active quote version updated successfully!', { id: toastId });
      await fetchQuote(false); 
      
    } catch (error: any) {
      console.error('Error updating quote version:', error);
      showError(`Failed to update quote version: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  // Transform form values into Quote interface structure for preview
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
      id: quote?.id || Math.random().toString(36).substring(2, 11),
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
      details: {
        versions: [previewVersion],
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
        <p className="text-gray-500">Could not load quote details for editing. This may be due to corrupted data (missing versions).</p>
      </div>
    );
  }
  
  const versions = quote.details?.versions || [];
  
  if (versions.length === 0) {
      return (
          <div className="p-8 text-center">
              <h3 className="text-xl font-semibold text-red-500">Error: Corrupted Quote Data</h3>
              <p className="text-gray-500">Quote data is corrupted: No versions found in quote details. Please delete this quote and recreate it.</p>
          </div>
      );
  }
  
  const activeVersion = versions.find(v => v.is_active);
  const isFinalized = !!activeVersion?.accepted_at || !!activeVersion?.rejected_at;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Edit Quote: {quote.event_title} ({quote.client_name})</h2>
        <Button asChild variant="outline" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
          <Link to={`/admin/quotes/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Details
          </Link>
        </Button>
      </div>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Modify the details of the <span className="font-semibold text-brand-primary">{activeVersionId}</span> version.
      </p>
      
      {/* Version Control Tab */}
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            {versions.map((version) => (
              <Button
                key={version.versionId}
                variant={version.versionId === activeVersionId ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVersionChange(version.versionId)}
                className={cn(
                    "transition-colors",
                    version.versionId === activeVersionId 
                        ? "bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
                        : "border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50"
                )}
              >
                {version.versionId}
                <span className="ml-2 text-xs font-normal opacity-80">
                    {version.is_active ? '(Active)' : ''}
                    {version.accepted_at ? ' (Accepted)' : version.rejected_at ? ' (Rejected)' : ''}
                </span>
              </Button>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={handleCreateNewVersion}
              disabled={isSubmitting || isFinalized}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Create New Version
            </Button>
            {isFinalized && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Cannot create new version: Active version is finalized.
                </p>
            )}
          </div>
          <Separator className="my-4 bg-brand-secondary/50" />
          <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">
            Editing the form below will modify the currently active version ({activeVersionId}).
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
              onCreateAndSend={handleUpdateQuote} // Use update handler
              isSubmitting={isSubmitting} 
              onPreview={handlePreviewQuote} 
              isQuoteCreated={true}
              // Hide draft saving/sending buttons on edit page, only show update button
              onSaveDraft={undefined} 
              submitButtonText="Update Active Version"
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