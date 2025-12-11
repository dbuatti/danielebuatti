"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Quote, QuoteItem, QuoteDetails } from '@/types/quote';
import { format } from 'date-fns';
import { Loader2, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Define the structure for the data fetched from Supabase (which includes the JSONB details)
interface QuoteData extends Omit<Quote, 'details'> {
  details: QuoteDetails;
}

const AdminQuoteDetailsPage: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug; // Fix Error 3
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!slug) {
      showError('Quote slug is missing.');
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      const toastId = showLoading('Loading quote details...');
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        if (data) {
          const quoteData: QuoteData = {
            ...data,
            total_amount: parseFloat(data.total_amount),
            details: data.details as QuoteDetails,
          };
          setQuote(quoteData);
        } else {
          showError('Quote not found.');
        }
      } catch (err: any) {
        console.error('Error fetching quote:', err);
        showError(`Failed to load quote: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
        dismissToast(toastId);
      }
    };

    fetchQuote();
  }, [slug]);

  const handleDeleteQuote = async () => {
    if (!quote) return;

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
    } catch (err: any) {
      console.error('Error deleting quote:', err);
      showError(`Failed to delete quote: ${err.message || 'Unknown error'}`, { id: toastId });
    } finally {
      setIsDeleting(false);
      dismissToast(toastId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!quote) {
    return <div className="text-center p-8 text-red-500">Quote not found or failed to load.</div>;
  }

  const {
    client_name,
    client_email,
    event_title,
    event_date,
    event_location,
    prepared_by,
    total_amount,
    accepted_at,
    rejected_at,
  } = quote;

  const { compulsoryItems, currencySymbol, depositPercentage, bankDetails, eventTime, paymentTerms, addOns: quoteAddOns, theme } = quote.details || {};
  const symbol = currencySymbol || 'A$';

  const isAccepted = !!accepted_at;
  const isRejected = !!rejected_at;
  // const isFinalized = isAccepted || isRejected; // Fix Error 7: Removed unused variable

  const calculateItemTotal = (item: QuoteItem) => item.price * item.quantity;

  // Calculate totals
  const compulsoryTotal = compulsoryItems?.reduce((sum, item) => sum + calculateItemTotal(item), 0) || 0;
  const addOnTotal = quoteAddOns?.reduce((sum, item) => sum + calculateItemTotal(item), 0) || 0;
  const subtotal = compulsoryTotal + addOnTotal;
  const depositAmount = subtotal * (depositPercentage / 100);

  const formatCurrency = (amount: number) => `${symbol}${amount.toFixed(2)}`;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Quote Details: {event_title}</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(`/admin/quotes/edit/${slug}`)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Quote
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the quote and its associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteQuote} disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Status & Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
            {isAccepted ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" /> Accepted
              </span>
            ) : isRejected ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <XCircle className="h-4 w-4 mr-1" /> Rejected
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Pending
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</p>
            <p className="text-2xl font-bold text-brand-primary">{formatCurrency(total_amount)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Public Link</p>
            <a 
              href={`/quotes/${slug}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-secondary hover:underline break-all"
            >
              {`/quotes/${slug}`}
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Client & Event Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Name</p>
            <p className="text-lg">{client_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Email</p>
            <p className="text-lg">{client_email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Event Date</p>
            <p className="text-lg">{format(new Date(event_date), 'PPP')}</p>
          </div>
          {eventTime && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Event Time</p>
              <p className="text-lg">{eventTime}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
            <p className="text-lg">{event_location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prepared By</p>
            <p className="text-lg">{prepared_by}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quote Theme</p>
            <p className="text-lg">{theme === 'livePiano' ? 'Live Piano (Gold/Black)' : 'Default (White/Pink)'}</p>
          </div>
          {quote.details.headerImageUrl && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Header Image URL</p>
              <p className="text-sm break-all">{quote.details.headerImageUrl}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Itemized Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Price ({symbol})</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Total ({symbol})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compulsoryItems?.map((item, index) => (
                <TableRow key={`comp-${index}`} className="bg-gray-50 dark:bg-gray-800/50">
                  <TableCell className="font-medium">{item.name} (Required)</TableCell>
                  <TableCell className="text-sm text-gray-500">{item.description || '-'}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(calculateItemTotal(item))}</TableCell>
                </TableRow>
              ))}
              {quoteAddOns?.map((item, index) => (
                <TableRow key={`add-${index}`}>
                  <TableCell className="font-medium">{item.name} (Add-On)</TableCell>
                  <TableCell className="text-sm text-gray-500">{item.description || '-'}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(calculateItemTotal(item))}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t-2 border-brand-primary/50">
                <TableCell colSpan={4} className="text-right">Subtotal</TableCell>
                <TableCell className="text-right">{formatCurrency(subtotal)}</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell colSpan={4} className="text-right">Deposit ({depositPercentage}%)</TableCell>
                <TableCell className="text-right">{formatCurrency(depositAmount)}</TableCell>
              </TableRow>
              <TableRow className="font-bold text-lg bg-brand-secondary/10 dark:bg-brand-secondary/20">
                <TableCell colSpan={4} className="text-right text-brand-primary">Total Quote Amount</TableCell>
                <TableCell className="text-right text-brand-primary">{formatCurrency(subtotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Financial Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Terms</p>
            <p>{paymentTerms}</p>
          </div>
          {(bankDetails.bsb || bankDetails.acc) && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Details</p>
              {bankDetails.bsb && <p>BSB: {bankDetails.bsb}</p>}
              {bankDetails.acc && <p>Account: {bankDetails.acc}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuoteDetailsPage;