"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormValues, QuoteFormSchema } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { createSlug } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote } from '@/types/quote';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AIQuoteExtractor from '@/components/admin/AIQuoteExtractor';
import DraftLoader from '@/components/admin/DraftLoader';
import QuoteSendingModal from '@/components/admin/QuoteSendingModal'; // Import the new modal
import { useGeminiQuoteGenerator } from '@/hooks/use-gemini-quote-generator'; // Import hook

const defaultFormValues: Partial<QuoteFormValues> = {
  clientName: '',
  clientEmail: '',
  invoiceType: 'Quote',
  eventTitle: '',
  eventDate: new Date().toISOString().split('T')[0],
  eventTime: '',
  eventLocation: '',
  preparedBy: 'Daniele Buatti',
  currencySymbol: '£',
  depositPercentage: 50,
  paymentTerms: 'Payment due within 7 days.',
  bankBSB: '923100',
  bankACC: '301110875',
  theme: 'black-gold',
  headerImageUrl: '/blacktie.avif',
  headerImagePosition: 'object-[50%_10%]',
  preparationNotes: 'This fee covers 7 hours of commitment, including the performance call, soundcheck, and all essential preparation required for a seamless, high-energy performance.\n\nThis fee secures a premium, seamless musical experience for your event.',
  compulsoryItems: [{ name: 'Live Piano Performance Fee', description: '3 hours of performance time.', amount: 1000 }],
  addOns: [],
};

// Define Draft type
interface QuoteDraft {
  id: string;
  title: string;
  updated_at: string;
  data: QuoteFormValues;
}

const AdminQuoteBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendingModalOpen, setIsSendingModal] = useState(false); // New state for sending modal
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null); // Holds the saved/created quote data
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(undefined);
  const [drafts, setDrafts] = useState<QuoteDraft[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  
  const { extractQuote, extractedContent, loading: isAILoading } = useGeminiQuoteGenerator();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    defaultValues: defaultFormValues as QuoteFormValues,
    mode: 'onChange',
  });

  const fetchDrafts = useCallback(async () => {
    if (!user) return;
    setIsLoadingDrafts(true);
    const { data, error } = await supabase
      .from('quote_drafts')
      .select('id, title, updated_at, data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts:', error);
      showError('Failed to load saved drafts.');
      setDrafts([]);
    } else {
      setDrafts(data as QuoteDraft[]);
    }
    setIsLoadingDrafts(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDrafts();
    }
  }, [user, fetchDrafts]);
  
  // Effect to apply AI extracted content to the form
  useEffect(() => {
    if (extractedContent) {
      const compulsoryItems = extractedContent.compulsoryItems.map(item => ({
        id: Math.random().toString(36).substring(2, 11),
        name: item.name,
        description: item.description,
        amount: item.amount,
      }));
      
      const addOns = extractedContent.addOns.map(item => ({
        id: Math.random().toString(36).substring(2, 11),
        name: item.name,
        description: item.description,
        cost: item.cost,
        quantity: 0, // Default quantity to 0 for optional add-ons
      }));

      form.reset({
        clientName: extractedContent.clientName,
        clientEmail: extractedContent.clientEmail,
        invoiceType: extractedContent.invoiceType,
        eventTitle: extractedContent.eventTitle,
        eventDate: extractedContent.eventDate,
        eventTime: extractedContent.eventTime,
        eventLocation: extractedContent.eventLocation,
        paymentTerms: extractedContent.paymentTerms,
        preparationNotes: extractedContent.preparationNotes,
        compulsoryItems: compulsoryItems,
        addOns: addOns,
        // Keep default values for theme, currency, bank details if not provided by AI
        preparedBy: form.getValues('preparedBy'),
        currencySymbol: form.getValues('currencySymbol'),
        depositPercentage: form.getValues('depositPercentage'),
        bankBSB: form.getValues('bankBSB'),
        bankACC: form.getValues('bankACC'),
        theme: form.getValues('theme'),
        headerImageUrl: form.getValues('headerImageUrl'),
        headerImagePosition: form.getValues('headerImagePosition'),
      });
      showSuccess('Quote details extracted successfully from AI!');
    }
  }, [extractedContent, form]);

  const handleLoadDraft = (draftId: string) => {
    const selectedDraft = drafts.find(d => d.id === draftId);
    if (selectedDraft) {
      form.reset(selectedDraft.data);
      setCurrentDraftId(draftId);
      setCurrentQuote(null); // Clear current quote if loading a draft
      showSuccess(`Draft "${selectedDraft.title}" loaded.`);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    const toastId = showLoading('Deleting draft...');
    try {
      const { error } = await supabase
        .from('quote_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      if (currentDraftId === draftId) {
        form.reset(defaultFormValues as QuoteFormValues);
        setCurrentDraftId(undefined);
      }
      
      await fetchDrafts();
      showSuccess('Draft deleted successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error deleting draft:', error);
      const errorMessage = error.message || error.details || 'Unknown error occurred during draft save.';
      showError(`Failed to delete draft: ${errorMessage}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const handlePreviewQuote = (values: QuoteFormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    let uniqueSlug = baseSlug;
    let counter = 0;
    const maxAttempts = 100;

    while (counter < maxAttempts) {
      const { data: existingSlugs, error: slugCheckError } = await supabase
        .from('invoices')
        .select('slug')
        .eq('slug', uniqueSlug);

      if (slugCheckError) throw slugCheckError;

      if (existingSlugs && existingSlugs.length === 0) {
        return uniqueSlug;
      }

      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }
    return `${baseSlug}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  };

  // Function to transform form values into the Quote structure
  const transformFormToQuote = (values: QuoteFormValues, existingId?: string, existingSlug?: string): Quote => {
    const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.amount ?? 0), 0);
    const addOnTotal = values.addOns?.reduce((sum: number, addOn) => 
      sum + ((addOn.cost ?? 0) * (addOn.quantity ?? 1)), 0) || 0;
    const totalAmount = compulsoryTotal + addOnTotal;

    const details = {
      compulsoryItems: values.compulsoryItems.map(item => ({
        id: item.id || Math.random().toString(36).substring(2, 11),
        name: item.name,
        description: item.description || '',
        price: item.amount ?? 0,
        quantity: 1,
      })),
      addOns: values.addOns?.map(addOn => ({
        id: addOn.id || Math.random().toString(36).substring(2, 11),
        name: addOn.name,
        description: addOn.description || '',
        price: addOn.cost ?? 0,
        quantity: addOn.quantity ?? 1,
      })) || [],
      depositPercentage: values.depositPercentage,
      bankDetails: {
        bsb: values.bankBSB ?? '',
        acc: values.bankACC ?? '',
      },
      eventTime: values.eventTime ?? '',
      currencySymbol: values.currencySymbol,
      paymentTerms: values.paymentTerms,
      theme: values.theme,
      headerImageUrl: values.headerImageUrl,
      headerImagePosition: values.headerImagePosition || 'object-center',
      preparationNotes: values.preparationNotes || '',
    };

    return {
      id: existingId || Math.random().toString(36).substring(2, 11),
      slug: existingSlug || 'temp-slug',
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
      details: details,
      status: currentQuote?.status || 'Draft',
    };
  };

  const handleSaveCreateQuote = async (values: QuoteFormValues, status: 'Draft' | 'Created') => {
    setIsSubmitting(true);
    const toastId = showLoading(status === 'Draft' ? 'Saving draft...' : 'Creating quote...');

    try {
      const baseSlug = createSlug(`${values.eventTitle}-${values.clientName}-${values.eventDate}`);
      const uniqueSlug = currentQuote?.slug || await generateUniqueSlug(baseSlug);
      
      const quoteData = transformFormToQuote(values, currentQuote?.id, uniqueSlug);

      // Invoke the new save-create-quote Edge Function
      const { data, error } = await supabase.functions.invoke('save-create-quote', {
        body: {
          id: currentQuote?.id, // Pass ID if updating existing quote
          clientName: quoteData.client_name,
          clientEmail: quoteData.client_email,
          invoiceType: quoteData.invoice_type,
          eventTitle: quoteData.event_title,
          eventDate: quoteData.event_date,
          eventLocation: quoteData.event_location,
          preparedBy: quoteData.prepared_by,
          totalAmount: quoteData.total_amount,
          details: quoteData.details,
          slug: uniqueSlug,
          status: status,
        },
      });

      if (error) throw error;

      const newQuoteId = data.id;
      
      // Update currentQuote state with the newly saved/created data
      const updatedQuote: Quote = {
        ...quoteData,
        id: newQuoteId,
        slug: data.slug,
        status: data.status,
      };
      setCurrentQuote(updatedQuote);

      // If successful, delete the draft if one exists
      if (currentDraftId) {
        const { error: deleteError } = await supabase.from('quote_drafts').delete().eq('id', currentDraftId);
        if (deleteError) {
          console.warn('Failed to delete draft after quote creation:', deleteError);
        }
        setCurrentDraftId(undefined);
        await fetchDrafts(); // Refresh draft list after deletion
      }

      showSuccess(`Quote successfully ${status === 'Draft' ? 'saved as draft' : 'created'}!`, { id: toastId });
      return updatedQuote;

    } catch (error: any) {
      console.error('Error saving/creating quote:', error);
      showError(`Failed to ${status === 'Draft' ? 'save draft' : 'create quote'}: ${error.message || 'Unknown error occurred'}`, { id: toastId });
      return null;
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const handleCreateAndSend = async (values: QuoteFormValues) => {
    // 1. Save/Create the quote first, setting status to 'Created'
    const createdQuote = await handleSaveCreateQuote(values, 'Created');

    if (createdQuote) {
      // 2. Open the sending modal immediately
      setIsSendingModal(true);
    }
  };
  
  const handleQuoteSent = (slug: string) => {
    // Navigate to the admin details page after successful send
    if (currentQuote) {
      navigate(`/admin/quotes/${currentQuote.id}`);
    } else {
      navigate('/admin/quotes');
    }
  };
  
  const handleExtractAI = async (emailContent: string) => {
    await extractQuote(emailContent);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Create New Quote</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Use this form to generate a new client-facing quote page.
      </p>
      
      <DraftLoader
        drafts={drafts}
        isLoading={isLoadingDrafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
        currentDraftId={currentDraftId}
      />

      <AIQuoteExtractor 
        onExtract={handleExtractAI}
        isSubmitting={isSubmitting || isAILoading}
      />

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">
            Quote Details 
            {currentQuote && <span className="text-sm text-gray-500 ml-2">(ID: {currentQuote.id.substring(0, 8)}... | Status: {currentQuote.status})</span>}
            {currentDraftId && <span className="text-sm text-gray-500 ml-2">(Draft ID: {currentDraftId.substring(0, 8)}...)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm 
            form={form}
            onCreateAndSend={handleCreateAndSend}
            isSubmitting={isSubmitting} 
            onPreview={handlePreviewQuote} 
            onSaveDraft={(values) => handleSaveCreateQuote(values, 'Draft')} // Save Draft now uses the new function
            isQuoteCreated={!!currentQuote} // Pass state to enable 'Send' button logic
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
                quote={transformFormToQuote(previewData)} 
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
          onClose={() => setIsSendingModal(false)}
          quote={currentQuote}
          onQuoteSent={handleQuoteSent}
        />
      )}
    </div>
  );
};

export default AdminQuoteBuilderPage;