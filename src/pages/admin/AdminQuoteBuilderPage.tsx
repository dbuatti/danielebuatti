"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormValues } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { createSlug } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Quote } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Save, FileText, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';

const AdminQuoteBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId);
  const [initialFormValues, setInitialFormValues] = useState<QuoteFormValues | null>(null);

  // Load drafts on component mount
  useEffect(() => {
    loadDrafts();
    
    // If draftId is provided in URL, load that draft
    if (draftId) {
      loadDraft(draftId);
    }
  }, [draftId]);

  const loadDrafts = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_drafts')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setDrafts(data || []);
    } catch (error: any) {
      console.error('Error loading drafts:', error);
      showError(`Failed to load drafts: ${error.message || 'Unknown error occurred'}`);
    }
  };

  const loadDraft = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('quote_drafts')
        .select('data')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setInitialFormValues(data.data as QuoteFormValues);
        setCurrentDraftId(id);
        showSuccess('Draft loaded successfully!');
      }
    } catch (error: any) {
      console.error('Error loading draft:', error);
      showError(`Failed to load draft: ${error.message || 'Unknown error occurred'}`);
    }
  };

  const saveDraft = async (values: QuoteFormValues) => {
    const toastId = showLoading('Saving draft...');
    
    try {
      let result;
      
      if (currentDraftId) {
        // Update existing draft
        result = await supabase
          .from('quote_drafts')
          .update({
            data: values,
            title: `${values.eventTitle || 'Untitled'} - ${values.clientName || 'No client'}`,
            updated_at: new Date()
          })
          .eq('id', currentDraftId);
      } else {
        // Create new draft
        const title = `${values.eventTitle || 'Untitled'} - ${values.clientName || 'No client'}`;
        result = await supabase
          .from('quote_drafts')
          .insert({
            data: values,
            title,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
      }
      
      const { error } = result;
      
      if (error) throw error;
      
      showSuccess('Draft saved successfully!', { id: toastId });
      loadDrafts(); // Refresh drafts list
      
      // If this was a new draft, get the ID
      if (!currentDraftId) {
        const { data, error: fetchError } = await supabase
          .from('quote_drafts')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!fetchError && data) {
          setCurrentDraftId(data.id);
        }
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      showError(`Failed to save draft: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const deleteDraft = async (id: string) => {
    const toastId = showLoading('Deleting draft...');
    
    try {
      const { error } = await supabase
        .from('quote_drafts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showSuccess('Draft deleted successfully!', { id: toastId });
      loadDrafts(); // Refresh drafts list
      
      // If we deleted the current draft, reset
      if (currentDraftId === id) {
        setCurrentDraftId(null);
        setInitialFormValues(null);
        navigate('/admin/quotes/new');
      }
    } catch (error: any) {
      console.error('Error deleting draft:', error);
      showError(`Failed to delete draft: ${error.message || 'Unknown error occurred'}`, { id: toastId });
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

  const handleCreateQuote = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    const toastId = showLoading('Creating new quote...');
    
    try {
      // Calculate total amount based on compulsory items and add-ons
      const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + item.amount, 0);
      const addOnTotal = values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => sum + (addOn.cost * addOn.quantity), 0) || 0;
      const totalAmount = compulsoryTotal + addOnTotal;
      
      // Generate a base slug
      const baseSlug = createSlug(`${values.eventTitle}-${values.clientName}-${values.eventDate}`);
      const uniqueSlug = await generateUniqueSlug(baseSlug);
      
      // Prepare details for JSONB column
      const details = {
        compulsoryItems: values.compulsoryItems.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substring(2, 11),
        })),
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
      
      // If we successfully created the quote, delete the draft
      if (currentDraftId) {
        await supabase
          .from('quote_drafts')
          .delete()
          .eq('id', currentDraftId);
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
    const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + item.amount, 0);
    const addOnTotal = values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => sum + (addOn.cost * addOn.quantity), 0) || 0;
    const totalAmount = compulsoryTotal + addOnTotal;
    
    return {
      id: Math.random().toString(36).substring(2, 11),
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
        compulsoryItems: values.compulsoryItems.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substring(2, 11),
        })),
        currencySymbol: values.currencySymbol,
        eventTime: values.eventTime,
      },
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Create New Quote</h2>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
            {currentDraftId ? "Editing saved draft" : "Use this form to generate a new client-facing quote page"}
          </p>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Drafts
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem 
                onClick={() => {
                  setCurrentDraftId(null);
                  setInitialFormValues(null);
                  navigate('/admin/quotes/new');
                }}
                className="flex flex-col items-start"
              >
                <span>New Quote</span>
                <span className="text-xs text-muted-foreground">Start a fresh quote</span>
              </DropdownMenuItem>
              <div className="border-t my-1"></div>
              {drafts.length > 0 ? (
                drafts.map((draft) => (
                  <DropdownMenuItem 
                    key={draft.id}
                    onClick={() => {
                      navigate(`/admin/quotes/new?draftId=${draft.id}`);
                    }}
                    className="flex justify-between items-center"
                  >
                    <div className="flex flex-col items-start">
                      <span>{draft.title || 'Untitled Draft'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(draft.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDraft(draft.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No saved drafts
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
            {initialFormValues && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => saveDraft(initialFormValues)}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <QuoteForm 
            onSubmit={handleCreateQuote} 
            isSubmitting={isSubmitting} 
            onPreview={handlePreviewQuote}
            onSaveDraft={saveDraft}
            initialValues={initialFormValues}
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

export default AdminQuoteBuilderPage;