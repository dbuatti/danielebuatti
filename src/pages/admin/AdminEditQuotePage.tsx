"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Eye } from 'lucide-react';

const AdminEditQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<QuoteFormValues | null>(null);
  const [initialQuoteData, setInitialQuoteData] = useState<QuoteFormValues | null>(null);
  const [quoteSlug, setQuoteSlug] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuoteData(id);
    }
  }, [id]);

  const fetchQuoteData = async (quoteId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (error) throw error;

      if (data) {
        // Map the database data to form values
        const mappedData: QuoteFormValues = {
          clientName: data.client_name,
          clientEmail: data.client_email,
          invoiceType: data.invoice_type,
          eventTitle: data.event_title,
          eventDate: data.event_date,
          eventTime: data.details?.eventTime || '',
          eventLocation: data.event_location,
          preparedBy: data.prepared_by,
          depositPercentage: data.details?.depositPercentage || 50,
          paymentTerms: data.details?.paymentTerms || '',
          bankBSB: data.details?.bankDetails?.bsb || '',
          bankACC: data.details?.bankDetails?.acc || '',
          currencySymbol: data.details?.currencySymbol || '$',
          compulsoryItems: data.details?.compulsoryItems?.map((item: any) => ({
            id: item.id,
            description: item.name || item.description || '',
            amount: item.amount || 0
          })) || [{ description: '', amount: 0 }],
          addOns: data.details?.addOns?.map((addOn: any) => ({
            id: addOn.id,
            description: addOn.name || addOn.description || '',
            cost: addOn.cost || 0,
            quantity: addOn.quantity || 1
          })) || []
        };

        setInitialQuoteData(mappedData);
        setQuoteSlug(data.slug);
      }
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      showError(`Failed to load quote: ${error.message || 'Unknown error occurred'}`);
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

  const handleUpdateQuote = async (values: QuoteFormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    const toastId = showLoading('Updating quote...');

    try {
      // Calculate total amount based on compulsory items and add-ons
      const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + item.amount, 0);
      const addOnTotal = values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => sum + (addOn.cost * addOn.quantity), 0) || 0;
      const totalAmount = compulsoryTotal + addOnTotal;

      // Generate a base slug if needed
      let uniqueSlug = quoteSlug;
      if (!uniqueSlug) {
        const baseSlug = createSlug(`${values.eventTitle}-${values.clientName}-${values.eventDate}`);
        uniqueSlug = await generateUniqueSlug(baseSlug);
      }

      // Prepare details for JSONB column
      const details = {
        compulsoryItems: values.compulsoryItems.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substring(2, 11),
          name: item.description // Map description to name for compatibility
        })),
        addOns: values.addOns?.map(addOn => ({
          ...addOn,
          id: addOn.id || Math.random().toString(36).substring(2, 11),
          name: addOn.description // Map description to name for compatibility
        })) || [],
        depositPercentage: values.depositPercentage,
        bankDetails: {
          bsb: values.bankBSB || '',
          acc: values.bankACC || ''
        },
        eventTime: values.eventTime,
        currencySymbol: values.currencySymbol,
        paymentTerms: values.paymentTerms,
      };

      // Update the quote in the database
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
          slug: uniqueSlug,
        })
        .eq('id', id);

      if (error) throw error;

      showSuccess('Quote updated successfully!', { id: toastId });
      navigate('/admin/quotes');
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
    const addOnTotal = values.addOns?.reduce((sum: number, addOn: { cost: number, quantity: number }) => sum + (addOn.cost * addOn.quantity), 0) || 0;
    const totalAmount = compulsoryTotal + addOnTotal;

    return {
      id: id || Math.random().toString(36).substring(2, 11),
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
          bsb: values.bankBSB || '',
          acc: values.bankACC || ''
        },
        addOns: values.addOns?.map(addOn => ({
          ...addOn,
          id: addOn.id || Math.random().toString(36).substring(2, 11),
          name: addOn.description // Map description to name for compatibility
        })) || [],
        compulsoryItems: values.compulsoryItems.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substring(2, 11),
          name: item.description // Map description to name for compatibility
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
          <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Edit Quote</h2>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
            Update the details for this client-facing quote
          </p>
        </div>
      </div>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => initialQuoteData && handlePreviewQuote(initialQuoteData)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <QuoteForm 
            onSubmit={handleUpdateQuote} 
            isSubmitting={isSubmitting} 
            onPreview={handlePreviewQuote}
            initialValues={initialQuoteData}
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

export default AdminEditQuotePage;