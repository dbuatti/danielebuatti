"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Download, Edit, Trash2, Mail, Copy, Clock, Eye } from 'lucide-react';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const AdminQuoteDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [, copy] = useCopyToClipboard(); // Removed unused 'copiedText'

  const fetchQuote = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    const toastId = showLoading('Loading quote details...');

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Map data to Quote type
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
        details: data.details, // JSONB column already mapped
      };

      setQuote(fetchedQuote);
      showSuccess('Quote loaded.', { id: toastId });
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      showError(`Failed to load quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
      setQuote(null);
    } finally {
      setIsLoading(false);
      dismissToast(toastId);
    }
  }, [slug]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const handleDelete = async () => {
    if (!quote || !user) return;

    if (!window.confirm(`Are you sure you want to delete the quote for "${quote.event_title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    const toastId = showLoading('Deleting quote...');

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess('Quote deleted successfully!', { id: toastId });
      navigate('/admin/quotes');
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      showError(`Failed to delete quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsDeleting(false);
      dismissToast(toastId);
    }
  };

  const handleCopyLink = () => {
    if (!quote) return;
    const quoteUrl = `${window.location.origin}/quotes/${quote.slug}`;
    copy(quoteUrl);
    showSuccess('Quote link copied to clipboard!');
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
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Quote not found or an error occurred while loading.</AlertDescription>
      </Alert>
    );
  }

  const { details, accepted_at, rejected_at } = quote;
  const theme = details.theme;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">
          {quote.invoice_type} Details: {quote.event_title}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/admin/quotes/edit/${quote.slug}`)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl text-brand-primary">Status & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              {accepted_at ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : rejected_at ? (
                <XCircle className="h-6 w-6 text-red-500" />
              ) : (
                <Clock className="h-6 w-6 text-yellow-500" />
              )}
              <div>
                <p className="font-bold">
                  {accepted_at ? 'Accepted' : rejected_at ? 'Rejected' : 'Pending'}
                </p>
                <p className="text-sm text-gray-500">
                  {accepted_at ? `on ${format(new Date(accepted_at), 'PPP')}` : rejected_at ? `on ${format(new Date(rejected_at), 'PPP')}` : 'Awaiting client response'}
                </p>
              </div>
            </div>
            
            <Separator />

            <Button onClick={handleCopyLink} variant="secondary" className="w-full">
              <Copy className="h-4 w-4 mr-2" /> Copy Client Link
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Mail className="h-4 w-4 mr-2" /> Resend Email (WIP)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Download className="h-4 w-4 mr-2" /> Download PDF (WIP)
            </Button>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-brand-primary">Quote Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Name</p>
              <p className="text-lg">{quote.client_name}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Email</p>
              <p className="text-lg">{quote.client_email}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Event Date</p>
              <p className="text-lg">{quote.event_date}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prepared By</p>
              <p className="text-lg">{quote.prepared_by}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="text-lg font-bold">{details.currencySymbol}{quote.total_amount.toFixed(2)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quote Theme</p>
              <p className="text-lg">{theme === 'black-gold' ? 'Black & Gold' : 'Default (White/Pink)'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-brand-primary">Live Preview</CardTitle>
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" /> Full Screen Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] p-0 bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-brand-primary text-2xl">Quote Preview</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[calc(90vh-70px)]">
                {quote ? (
                  <QuoteDisplay quote={quote} />
                ) : (
                  <div className="p-8 text-center">No preview data available.</div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="scale-[0.7] origin-top-left w-[142%] h-[142%]">
              <QuoteDisplay quote={quote} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuoteDetailsPage;