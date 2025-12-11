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
import { Quote, QuoteItem } from '@/types/quote';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExtractedQuoteContent } from '@/types/ai';
import AIQuoteExtractor from '@/components/admin/AIQuoteExtractor';
import DraftLoader from '@/components/admin/DraftLoader'; // Import DraftLoader

const defaultFormValues: Partial<QuoteFormValues> = {
  clientName: '',
  clientEmail: '',
  invoiceType: 'Quote',
  eventTitle: '',
  eventDate: new Date().toISOString().split('T')[0],
  eventTime: '', // Added explicit default value
  eventLocation: '',
  preparedBy: 'Daniele Buatti', // Updated default
  currencySymbol: '£', // Changed default currency to £
  depositPercentage: 50,
  paymentTerms: 'Payment due within 7 days.',
  bankBSB: '923100', // Default BSB
  bankACC: '301110875', // Default ACC
  // New defaults
  theme: 'black-gold', // Default theme set to the new Black/Gold theme
  headerImageUrl: '/blacktie.avif', // Updated default image URL to the blacktie image
  headerImagePosition: 'object-[50%_10%]', // NEW default: Custom position to focus slightly below the very top
  preparationNotes: 'This fee covers 7 hours of commitment, including the performance call, soundcheck, and all essential preparation required for a seamless, high-energy performance.\n\nThis fee secures a premium, seamless musical experience for your event.', // New default preparation notes
  // Updated item structure (using 'name' and 'description' now)
  compulsoryItems: [{ name: 'Live Piano Performance Fee', description: '3 hours of performance time.', amount: 1000 }], // Updated default item
  addOns: [],
};

// Define Draft type
interface QuoteDraft {
  id: string;
  title: string;
  updated_at: string;
  data: QuoteFormValues; // Assuming the full form data is stored in the 'data' JSONB column
}

const AdminQuoteBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(undefined);
  const [drafts, setDrafts] = useState<QuoteDraft[]>([]); // New state for draft list
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true); // New state for draft loading

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

  const handleLoadDraft = (draftId: string) => {
    const selectedDraft = drafts.find(d => d.id === draftId);
    if (selectedDraft) {
      // Reset the form with the draft data
      form.reset(selectedDraft.data);
      setCurrentDraftId(draftId);
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

      // Reset form if the deleted draft was the one currently loaded
      if (currentDraftId === draftId) {
        form.reset(defaultFormValues as QuoteFormValues);
        setCurrentDraftId(undefined);
      }
      
      await fetchDrafts(); // Refresh list
      showSuccess('Draft deleted successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error deleting draft:', error);
      // Extract specific Supabase error message if available
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

  // Generate a unique slug with a maximum number of attempts to prevent infinite loops
  const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    let uniqueSlug = baseSlug;
    let counter = 0;
    const maxAttempts = 100; // Prevent infinite loops

    while (counter < maxAttempts) {
      const { data: existingSlugs, error: slugCheckError } = await supabase
        .from('invoices')
        .select('slug')
        .eq('slug', uniqueSlug);

      if (slugCheckError) throw slugCheckError;

      if (existingSlugs && existingSlugs.length === 0) {
        return uniqueSlug; // Slug is unique
      }

      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    // If we've reached max attempts, generate a random suffix
    return `${baseSlug}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  };

  const handleSaveDraft = async (values: QuoteFormValues) => {
    if (!user) {
      showError('You must be logged in to save a draft.');
      return;
    }

    const toastId = showLoading(currentDraftId ? 'Updating draft...' : 'Saving draft...');

    try {
      const draftData = {
        user_id: user.id, // Ensure user_id is explicitly included
        title: values.eventTitle || `Draft: ${values.clientName || 'Untitled'}`,
        data: values, // Store the entire form values object
        updated_at: new Date().toISOString(),
      };

      let result;
      
      if (currentDraftId) {
        // Update existing draft
        result = await supabase
          .from('quote_drafts')
          .update(draftData)
          .eq('id', currentDraftId)
          .select('id')
          .single();
      } else {
        // Insert new draft
        result = await supabase
          .from('quote_drafts')
          .insert(draftData)
          .select('id')
          .single();
      }

      if (result.error) {
        // Log detailed error from Supabase
        console.error('Supabase Draft Save Error:', result.error);
        throw result.error;
      }

      const savedDraftId = result.data.id;
      setCurrentDraftId(savedDraftId);
      
      showSuccess('Draft saved successfully!', { id: toastId });
      await fetchDrafts(); // Refresh the draft list

    } catch (error: any) {
      console.error('Error saving draft:', error);
      // Extract specific Supabase error message if available
      const errorMessage = error.message || error.details || 'Unknown error occurred during draft save.';
      showError(`Failed to save draft: ${errorMessage}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const handleExtractAI = async (emailContent: string) => {
    setIsSubmitting(true);
    const toastId = showLoading('Extracting quote details from email...');

    try {
      const { data, error } = await supabase.functions.invoke('extract-quote-content', {
        body: { emailContent },
      });

      if (error) {
        throw error;
      }

      const extractedContent = data as ExtractedQuoteContent;

      // Update form fields with AI extracted content
      form.setValue('clientName', extractedContent.clientName);
      form.setValue('clientEmail', extractedContent.clientEmail);
      
      // Ensure extracted type is valid or default to 'Quote'
      const invoiceType = extractedContent.invoiceType === 'Invoice' ? 'Invoice' : 'Quote';
      form.setValue('invoiceType', invoiceType);
      
      form.setValue('eventTitle', extractedContent.eventTitle);
      form.setValue('eventDate', extractedContent.eventDate);
      form.setValue('eventTime', extractedContent.eventTime);
      form.setValue('eventLocation', extractedContent.eventLocation);
      
      // --- AI Extraction Mapping Update: Use new 'name' and 'description' fields ---
      form.setValue('compulsoryItems', extractedContent.compulsoryItems.map(item => ({
        id: Math.random().toString(36).substring(2, 11),
        name: item.name, // Use the new 'name' field from AI
        description: item.description || '', // Use the new 'description' field from AI
        amount: item.amount,
      })));
      
      // Set quantity to 0 for optional add-ons upon extraction, as requested
      form.setValue('addOns', extractedContent.addOns.map(item => ({
        id: Math.random().toString(36).substring(2, 11),
        name: item.name, // Use the new 'name' field from AI
        description: item.description || '', // Use the new 'description' field from AI
        cost: item.cost,
        quantity: 0, // Defaulting quantity to 0 for optional add-ons
      })));
      
      form.setValue('paymentTerms', extractedContent.paymentTerms);
      form.setValue('preparationNotes', extractedContent.preparationNotes);

      showSuccess('Quote details extracted and applied!', { id: toastId });

    } catch (error: any) {
      console.error('Error extracting AI content:', error);
      showError(`AI extraction failed: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const handleCreateQuote = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    const toastId = showLoading('Creating new quote...');

    try {
      // Errors 4, 5, 6 fix: Use nullish coalescing (?? 0) for optional number fields in calculations
      const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.amount ?? 0), 0);
      const addOnTotal = values.addOns?.reduce((sum: number, addOn) => 
        sum + ((addOn.cost ?? 0) * (addOn.quantity ?? 1)), 0) || 0;
      const totalAmount = compulsoryTotal + addOnTotal;

      // Generate a base slug
      const baseSlug = createSlug(`${values.eventTitle}-${values.clientName}-${values.eventDate}`);
      const uniqueSlug = await generateUniqueSlug(baseSlug);

      // Prepare details for JSONB column
      const details = {
        compulsoryItems: values.compulsoryItems.map(item => ({
          id: item.id || Math.random().toString(36).substring(2, 11),
          name: item.name, // Use new name field
          description: item.description || '', // Use new description field
          price: item.amount ?? 0, // Use amount as price for compulsory items
          quantity: 1, // Compulsory items always have quantity 1 in QuoteItem structure
        })),
        addOns: values.addOns?.map(addOn => ({
          id: addOn.id || Math.random().toString(36).substring(2, 11),
          name: addOn.name,
          description: addOn.description || '',
          price: addOn.cost ?? 0, // Use cost as price for add-ons
          quantity: addOn.quantity ?? 1, // Ensure quantity is a number
        })) || [],
        depositPercentage: values.depositPercentage,
        bankDetails: {
          bsb: values.bankBSB ?? '',
          acc: values.bankACC ?? '',
        },
        eventTime: values.eventTime ?? '', // Ensure eventTime is a string
        currencySymbol: values.currencySymbol,
        paymentTerms: values.paymentTerms,
        theme: values.theme, // Include new theme
        headerImageUrl: values.headerImageUrl, // Include new header image URL
        headerImagePosition: values.headerImagePosition || 'object-center', // NEW
        preparationNotes: values.preparationNotes || '', // Include new preparation notes
      };

      // Invoke the Edge Function to create the quote
      const { data, error } = await supabase.functions.invoke('create-quote', {
        body: {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          invoiceType: values.invoiceType,
          eventTitle: values.eventTitle,
          eventDate: values.eventDate,
          eventLocation: values.eventLocation,
          preparedBy: values.preparedBy,
          totalAmount: totalAmount,
          details: details,
          slug: uniqueSlug,
        },
      });

      if (error) {
        throw error;
      }

      // If successful, delete the draft if one exists
      if (currentDraftId) {
        const { error: deleteError } = await supabase.from('quote_drafts').delete().eq('id', currentDraftId);
        if (deleteError) {
          console.warn('Failed to delete draft after quote creation:', deleteError);
        }
        await fetchDrafts(); // Refresh draft list after deletion
      }

      showSuccess('Quote created successfully!', { id: toastId });

      // Redirect to the newly created quote's public page or admin details page
      if (data && data.slug) {
        navigate(`/quotes/${data.slug}`);
      } else {
        navigate('/admin/quotes');
      }
    } catch (error: any) {
      console.error('Error creating quote:', error);
      showError(`Failed to create quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  // Transform form values into Quote interface structure for preview
  const getPreviewData = (values: QuoteFormValues): Quote => {
    // Errors 7, 8, 9 fix: Use nullish coalescing (?? 0) for optional number fields in calculations
    const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.amount ?? 0), 0);
    const addOnTotal = values.addOns?.reduce((sum: number, addOn) => 
      sum + ((addOn.cost ?? 0) * (addOn.quantity ?? 1)), 0) || 0;
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
      id: Math.random().toString(36).substring(2, 11),
      slug: 'preview-slug', // Placeholder slug for preview
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
        eventTime: values.eventTime ?? '', // Ensure eventTime is a string for QuoteDetails
        theme: values.theme, // Pass theme
        headerImageUrl: values.headerImageUrl, // Pass image URL
        headerImagePosition: values.headerImagePosition || 'object-center', // NEW
        preparationNotes: values.preparationNotes || '', // Pass preparation notes
      },
    };
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Create New Quote</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Use this form to generate a new client-facing quote page.
      </p>
      
      {/* NEW: Draft Loader */}
      <DraftLoader
        drafts={drafts}
        isLoading={isLoadingDrafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
        currentDraftId={currentDraftId}
      />

      <AIQuoteExtractor 
        onExtract={handleExtractAI}
        isSubmitting={isSubmitting}
      />

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote Details {currentDraftId && <span className="text-sm text-gray-500">(Draft ID: {currentDraftId.substring(0, 8)}...)</span>}</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm 
            form={form}
            onSubmit={handleCreateQuote} 
            isSubmitting={isSubmitting} 
            onPreview={handlePreviewQuote} 
            onSaveDraft={handleSaveDraft}
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

export default AdminQuoteBuilderPage;