"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormSchema, QuoteFormValues } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote, QuoteItem, QuoteVersion } from '@/types/quote';
import AIQuoteExtractor from '@/components/admin/AIQuoteExtractor';
import { useGeminiQuoteGenerator } from '@/hooks/use-gemini-quote-generator';
import DraftLoader from '@/components/admin/DraftLoader';
import QuoteSendingModal from '@/components/admin/QuoteSendingModal';
import { createSlug } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { calculateQuoteTotal } from '@/lib/quote-utils'; // Import calculateQuoteTotal

// Default values for a new quote
const defaultQuoteValues: QuoteFormValues = {
  clientName: '',
  clientEmail: '',
  invoiceType: 'Quote',
  eventTitle: '',
  eventDate: new Date().toISOString().split('T')[0],
  eventTime: '18:00',
  eventLocation: '',
  preparedBy: 'Daniele Buatti',
  currencySymbol: 'A$',
  depositPercentage: 50,
  discountPercentage: 0,
  discountAmount: 0,
  paymentTerms: 'Payment due within 7 days of acceptance.',
  bankBSB: '923100',
  bankACC: '301110875',
  theme: 'default',
  headerImageUrl: '', // Default to empty
  headerImagePosition: '', // Default to empty
  preparationNotes: 'This fee covers 7 hours of commitment, including preparation, travel, setup, performance, and pack down.',
  scopeOfWorkUrl: '', // NEW DEFAULT
  
  compulsoryItems: [
    { id: 'base-fee', name: 'Base Performance Fee', description: '3 hours of live piano performance.', price: 1000, quantity: 1, scheduleDates: '', showScheduleDates: false, showQuantity: true, showRate: true },
  ],
  addOns: [
    { id: 'extra-hour', name: 'Extra Hour of Performance', description: 'Additional hour of live piano music.', price: 200, quantity: 0, scheduleDates: '', showScheduleDates: false, showQuantity: true, showRate: true },
  ],
};

interface QuoteDraft {
  id: string;
  title: string;
  updated_at: string;
  data: QuoteFormValues;
}

const AdminQuoteBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access state
  const { user } = useAuth();
  const [currentQuoteId, setCurrentQuoteId] = useState<string | undefined>(undefined);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(undefined);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [drafts, setDrafts] = useState<QuoteDraft[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);
  const [isSendingModalOpen, setIsSendingModalOpen] = useState(false);

  const { extractedContent, loading: isAILoading, extractQuote } = useGeminiQuoteGenerator();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    mode: 'onChange',
    defaultValues: defaultQuoteValues,
  });

  const watchedTheme = form.watch('theme');

  // Update header image URL based on theme selection
  useEffect(() => {
    const currentImageUrl = form.getValues('headerImageUrl');
    const defaultWhitePink = '/whitepinkquoteimage1.jpeg';
    const defaultBlackGold = '/blackgoldquoteimage1.jpg';

    // Only auto-apply black-gold header if current image is empty or the white-pink default
    if (
      watchedTheme === 'black-gold' &&
      (!currentImageUrl || currentImageUrl === defaultWhitePink)
    ) {
      form.setValue('headerImageUrl', defaultBlackGold, { shouldDirty: true });
    }
    // For 'default' theme we do nothing – preserve whatever image the user has chosen
  }, [watchedTheme, form]);

  // --- Data Fetching ---
  const fetchDrafts = useCallback(async (draftIdToLoad?: string) => {
    setIsLoadingDrafts(true);
    const { data, error } = await supabase
      .from('quote_drafts')
      .select('id, title, updated_at, data')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts:', error);
      showError('Failed to load drafts.');
      setDrafts([]);
    } else {
      setDrafts(data || []);

      // Auto-load draft if ID is provided (e.g., from navigation state)
      if (draftIdToLoad) {
        const draft = data.find(d => d.id === draftIdToLoad);
        if (draft) {
          form.reset(draft.data);
          setCurrentDraftId(draftIdToLoad);
          setCurrentQuoteId(undefined);
          setCurrentQuote(null);
          showSuccess(`Draft "${draft.title}" loaded.`);
        }
      }
    }
    setIsLoadingDrafts(false);
  }, [form]);

  useEffect(() => {
    // Check if we navigated here with a draft ID in state
    const state = location.state as { loadDraftId?: string } | null;
    const draftIdToLoad = state?.loadDraftId;

    fetchDrafts(draftIdToLoad);

    // Clear state after loading to prevent re-loading on subsequent visits
    if (draftIdToLoad) {
        navigate(location.pathname, { replace: true, state: {} });
    }
  }, [fetchDrafts, location.state, location.pathname, navigate]);

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear the current form data?')) {
      form.reset(defaultQuoteValues);
      setCurrentDraftId(undefined);
      setCurrentQuoteId(undefined);
      setCurrentQuote(null);
      showSuccess('Form cleared.');
    }
  };

  // --- Handlers ---

  const mapFormValuesToVersion = (values: QuoteFormValues): Omit<QuoteVersion, 'versionId' | 'versionName' | 'created_at' | 'is_active' | 'status' | 'accepted_at' | 'rejected_at' | 'client_selected_add_ons'> => {
    
    // Use utility function for total calculation
    const totalAmount = calculateQuoteTotal(values);

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
      discountPercentage: values.discountPercentage, // NEW
      discountAmount: values.discountAmount, // NEW
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

  const handleSaveCreateQuote = async (values: QuoteFormValues, status: QuoteVersion['status']): Promise<Quote | null> => {
    setIsSubmitting(true);
    const action = status === 'Draft' ? (currentDraftId ? 'Updating Draft' : 'Saving Draft') : (currentQuoteId ? 'Updating Quote' : 'Creating Quote');
    const toastId = showLoading(`${action}...`);

    try {
      if (status === 'Draft') {
        // Handle Draft saving/updating
        const draftPayload = {
          id: currentDraftId,
          user_id: user?.id,
          title: values.eventTitle || 'Untitled Draft',
          data: values,
        };
        
        let result;
        if (currentDraftId) {
          result = await supabase
            .from('quote_drafts')
            .update(draftPayload)
            .eq('id', currentDraftId)
            .select()
            .single();
        } else {
          result = await supabase
            .from('quote_drafts')
            .insert(draftPayload)
            .select()
            .single();
        }
        
        if (result.error) throw result.error;
        
        setCurrentDraftId(result.data.id);
        await fetchDrafts();
        showSuccess(`${action} saved successfully!`, { id: toastId });
        return null;
        
      } else {
        // Handle Quote creation/update via Edge Function
        const versionData = mapFormValuesToVersion(values);
        
        // For a new quote, we create the first version (v1)
        const newVersion: QuoteVersion = {
            versionId: 'v1',
            versionName: 'Initial Proposal',
            created_at: new Date().toISOString(),
            is_active: true,
            status: status,
            accepted_at: null,
            rejected_at: null,
            ...versionData,
        };
        
        const payload = {
          id: currentQuoteId, // Will be undefined for new quotes
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          invoiceType: values.invoiceType,
          eventTitle: values.eventTitle,
          eventDate: values.eventDate,
          eventLocation: values.eventLocation,
          preparedBy: values.preparedBy,
          
          // Top-level fields reflect the active version (v1)
          totalAmount: newVersion.total_amount,
          status: newVersion.status,
          
          // Details now contains the versions array
          details: {
              versions: [newVersion]
          },
          slug: currentQuote?.slug || createSlug(`${values.eventTitle}-${values.clientName}`),
        };

        const { data: invokeData, error: invokeError } = await supabase.functions.invoke('save-create-quote', {
          body: payload,
        });

        if (invokeError) throw invokeError;
        
        const newQuoteId = invokeData.id;
        
        // Fetch the newly created/updated quote to set currentQuote state
        const { data: fetchedQuote, error: fetchError } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', newQuoteId)
          .single();
          
        if (fetchError) throw fetchError;
        
        const finalQuote: Quote = {
          ...fetchedQuote,
          total_amount: parseFloat(fetchedQuote.total_amount),
          details: fetchedQuote.details as Quote['details'],
          status: fetchedQuote.status,
        };

        setCurrentQuoteId(newQuoteId);
        setCurrentQuote(finalQuote);
        
        // If it was a draft, clear the draft ID
        if (currentDraftId) {
            await handleDeleteDraft(currentDraftId, false);
            setCurrentDraftId(undefined);
        }
        
        showSuccess(`${action} successful!`, { id: toastId });
        return finalQuote;
      }
    } catch (error: any) {
      console.error(`Error during ${action}:`, error);
      showError(`Failed to ${action.toLowerCase()}: ${error.message || 'Unknown error occurred'}`, { id: toastId });
      return null;
    } finally {
      setIsSubmitting(false);
      if (toastId) dismissToast(toastId);
    }
  };

  const handleLoadDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      form.reset(draft.data);
      setCurrentDraftId(draftId);
      setCurrentQuoteId(undefined);
      setCurrentQuote(null);
      showSuccess(`Draft "${draft.title}" loaded.`);
    }
  };

  const handleDeleteDraft = async (draftId: string, showToast: boolean = true) => {
    if (showToast && !window.confirm('Are you sure you want to delete this draft?')) return;
    
    const toastId = showToast ? showLoading('Deleting draft...') : undefined;

    try {
      const { error } = await supabase
        .from('quote_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      if (currentDraftId === draftId) {
        setCurrentDraftId(undefined);
        form.reset(defaultQuoteValues);
      }
      await fetchDrafts();
      if (showToast) showSuccess('Draft deleted successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error deleting draft:', error);
      if (showToast) showError(`Failed to delete draft: ${error.message}`, { id: toastId });
    } finally {
      if (toastId) dismissToast(toastId);
    }
  };

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };
  
  const handleExtractQuote = async (emailContent: string) => {
    await extractQuote(emailContent);
  };
  
  // Apply extracted content to form
  useEffect(() => {
    if (extractedContent) {
      const compulsoryItems = extractedContent.compulsoryItems.map(item => ({
        id: Math.random().toString(36).substring(2, 11),
        name: item.name,
        description: item.description || '',
        price: item.amount,
        quantity: 1,
        scheduleDates: extractedContent.eventDate,
        showScheduleDates: false,
        showQuantity: true,
        showRate: true,
      }));
      
      const addOns = extractedContent.addOns.map(item => ({
        id: Math.random().toString(36).substring(2, 11),
        name: item.name,
        description: item.description || '',
        price: item.cost,
        quantity: 0,
        scheduleDates: '',
        showScheduleDates: false,
        showQuantity: true,
        showRate: true,
      }));
      
      const newValues: QuoteFormValues = {
        ...defaultQuoteValues,
        clientName: extractedContent.clientName || defaultQuoteValues.clientName,
        clientEmail: extractedContent.clientEmail || defaultQuoteValues.clientEmail,
        invoiceType: extractedContent.invoiceType,
        eventTitle: extractedContent.eventTitle || defaultQuoteValues.eventTitle,
        eventDate: extractedContent.eventDate || defaultQuoteValues.eventDate,
        eventTime: extractedContent.eventTime || defaultQuoteValues.eventTime,
        eventLocation: extractedContent.eventLocation || defaultQuoteValues.eventLocation,
        paymentTerms: extractedContent.paymentTerms || defaultQuoteValues.paymentTerms,
        preparationNotes: extractedContent.preparationNotes || defaultQuoteValues.preparationNotes,
        compulsoryItems: compulsoryItems.length > 0 ? compulsoryItems : defaultQuoteValues.compulsoryItems,
        addOns: addOns,
        headerImageUrl: defaultQuoteValues.headerImageUrl,
        headerImagePosition: defaultQuoteValues.headerImagePosition,
        scopeOfWorkUrl: defaultQuoteValues.scopeOfWorkUrl,
        discountPercentage: 0, // Reset discounts on AI extraction
        discountAmount: 0, // Reset discounts on AI extraction
      };
      
      form.reset(newValues);
      showSuccess('AI extraction complete. Review and save the quote.');
    }
  }, [extractedContent, form]);

  const handleCreateAndSend = async (values: QuoteFormValues) => {
    const finalQuote = await handleSaveCreateQuote(values, 'Created');
    
    if (finalQuote) {
      setCurrentQuote(finalQuote);
      setIsSendingModalOpen(true);
    }
  };
  
  const handleQuoteSent = () => {
    navigate(`/admin/quotes/${currentQuoteId}`);
  };

  // Transform form values into Quote interface structure for preview
  const getPreviewData = (values: QuoteFormValues): Quote => {
    const versionData = mapFormValuesToVersion(values);
    const previewVersion: QuoteVersion = {
        versionId: 'v-preview',
        versionName: 'Live Preview',
        created_at: new Date().toISOString(),
        is_active: true,
        status: 'Draft',
        accepted_at: null,
        rejected_at: null,
        ...versionData,
    };
    
    return {
      id: currentQuoteId || Math.random().toString(36).substring(2, 11),
      slug: currentQuote?.slug || 'preview-slug',
      client_name: values.clientName,
      client_email: values.clientEmail,
      event_title: values.eventTitle,
      invoice_type: values.invoiceType,
      event_date: values.eventDate,
      event_location: values.eventLocation,
      prepared_by: values.preparedBy,
      total_amount: previewVersion.total_amount,
      accepted_at: null,
      rejected_at: null,
      created_at: currentQuote?.created_at || new Date().toISOString(),
      details: {
        versions: [previewVersion],
      },
      status: currentQuote?.status || 'Draft',
    };
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Quote Builder</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Create a new quote proposal or load an existing draft.
      </p>
      
      <DraftLoader
        drafts={drafts}
        isLoading={isLoadingDrafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
        currentDraftId={currentDraftId}
      />

      <AIQuoteExtractor 
        onExtract={handleExtractQuote} 
        isSubmitting={isAILoading} 
      />
      
      {isAILoading && (
        <div className="flex items-center justify-center p-4 bg-brand-secondary/10 dark:bg-brand-dark/50 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin mr-2 text-brand-primary" />
          <span className="text-brand-primary">Analyzing email content with AI...</span>
        </div>
      )}

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <QuoteForm 
              form={form}
              onCreateAndSend={handleCreateAndSend}
              isSubmitting={isSubmitting || isAILoading} 
              onPreview={handlePreviewQuote} 
              onSaveDraft={async (values: QuoteFormValues) => { await handleSaveCreateQuote(values, 'Draft'); }}
              isQuoteCreated={!!currentQuoteId}
              onClearForm={handleClearForm}
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
      
      {currentQuote && (
        <QuoteSendingModal
          isOpen={isSendingModalOpen}
          onClose={() => setIsSendingModalOpen(false)}
          quote={currentQuote}
          onQuoteSent={handleQuoteSent}
        />
      )}
    </div>
  );
};

export default AdminQuoteBuilderPage;