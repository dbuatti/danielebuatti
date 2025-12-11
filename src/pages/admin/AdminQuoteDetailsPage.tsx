import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddOnItem, Quote, CompulsoryItem } from '@/types/quote';

const AdminQuoteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) {
        setError("Quote ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        setError('Failed to load quote details. It might not exist or you do not have access.');
        setQuote(null);
      } else {
        setQuote(data as Quote);
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [id]);

  const handleDelete = async () => {
    if (!quote || !window.confirm(`Are you sure you want to delete the quote for ${quote.client_name}?`)) {
      return;
    }

    const loadingToastId = toast.loading("Deleting quote...");
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', quote.id);

      if (error) throw error;

      toast.success("Quote deleted successfully!", { id: loadingToastId });
      // Redirect to admin quotes list after deletion
      window.location.href = '/admin/quotes';
    } catch (error: any) {
      console.error("Error deleting quote:", error);
      toast.error(`Failed to delete quote: ${error.message}`, { id: loadingToastId });
    }
  };

  const handleAccept = async () => {
    if (!quote || quote.accepted_at) return;

    const loadingToastId = toast.loading("Accepting quote...");
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ accepted_at: new Date().toISOString(), rejected_at: null })
        .eq('id', quote.id);

      if (error) throw error;

      setQuote((prev: Quote | null) => prev ? { ...prev, accepted_at: new Date().toISOString(), rejected_at: null } : null);
      toast.success("Quote marked as accepted!", { id: loadingToastId });
    } catch (error: any) {
      console.error("Error accepting quote:", error);
      toast.error(`Failed to accept quote: ${error.message}`, { id: loadingToastId });
    }
  };

  const handleReject = async () => {
    if (!quote || quote.rejected_at) return;

    const loadingToastId = toast.loading("Rejecting quote...");
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ rejected_at: new Date().toISOString(), accepted_at: null })
        .eq('id', quote.id);

      if (error) throw error;

      setQuote((prev: Quote | null) => prev ? { ...prev, rejected_at: new Date().toISOString(), accepted_at: null } : null);
      toast.success("Quote marked as rejected!", { id: loadingToastId });
    } catch (error: any) {
      console.error("Error rejecting quote:", error);
      toast.error(`Failed to reject quote: ${error.message}`, { id: loadingToastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <span className="sr-only">Loading quote...</span>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
        <h2 className="text-3xl font-bold mb-4">Error</h2>
        <p className="text-lg text-red-500 mb-6">{error || "Quote not found."}</p>
        <Button asChild>
          <Link to="/admin/quotes">Back to Quotes List</Link>
        </Button>
      </div>
    );
  }

  const {
    client_name,
    client_email,
    invoice_type,
    event_title,
    event_date,
    event_location,
    prepared_by,
    details,
    accepted_at,
    rejected_at,
    slug,
  } = quote;

  const { compulsoryItems, currencySymbol, depositPercentage, bankDetails, eventTime, paymentTerms, addOns: quoteAddOns, client_selected_add_ons } = details || {};
  const symbol = currencySymbol || 'A$';
  
  const addOns = client_selected_add_ons && client_selected_add_ons.length > 0 ? client_selected_add_ons : quoteAddOns;

  const isErinKennedyQuote = invoice_type === "Erin Kennedy Quote";
  const erinKennedyBaseInvoice = 400.00; // Hardcoded for Erin Kennedy quote type

  const compulsoryTotal = compulsoryItems?.reduce((sum, item) => sum + item.amount, 0) || 0;

  const calculatedTotal = isErinKennedyQuote
    ? erinKennedyBaseInvoice
    : compulsoryTotal + (addOns?.reduce((sum: number, item: AddOnItem) => sum + (item.cost * item.quantity), 0) || 0);
  
  const requiredDeposit = calculatedTotal * ((depositPercentage || 0) / 100);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
            <Link to="/admin/quotes">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Quotes
            </Link>
          </Button>
          <div className="flex space-x-2">
            <Button asChild variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link to={`/admin/quotes/edit/${id}`}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          {event_title || invoice_type}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-lg"><strong className="font-semibold">Client Name:</strong> {client_name}</p>
            <p className="text-lg"><strong className="font-semibold">Client Email:</strong> {client_email}</p>
            <p className="text-lg"><strong className="font-semibold">Invoice Type:</strong> {invoice_type}</p>
            <p className="text-lg"><strong className="font-semibold">Prepared By:</strong> {prepared_by || 'N/A'}</p>
          </div>
          <div>
            <p className="text-lg"><strong className="font-semibold">Event Date:</strong> {event_date ? format(new Date(event_date), 'EEEE d MMMM yyyy') : 'N/A'}</p>
            <p className="text-lg"><strong className="font-semibold">Event Time:</strong> {eventTime || 'N/A'}</p>
            <p className="text-lg"><strong className="font-semibold">Event Location:</strong> {event_location || 'N/A'}</p>
            {slug && (
              <p className="text-lg">
                <strong className="font-semibold">Public Link:</strong>{' '}
                <a
                  href={`${window.location.origin}/quotes/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Quote
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="mb-8 p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
          <p className="text-lg">
            <strong className="font-semibold">Status:</strong>{' '}
            {accepted_at ? (
              <span className="text-green-600 dark:text-green-400">Accepted on {format(new Date(accepted_at), 'PPP')}</span>
            ) : rejected_at ? (
              <span className="text-red-600 dark:text-red-400">Rejected on {format(new Date(rejected_at), 'PPP')}</span>
            ) : (
              <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
            )}
          </p>
          {!accepted_at && !rejected_at && (
            <div className="flex space-x-4 mt-4">
              <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700 text-white">
                Mark as Accepted
              </Button>
              <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white">
                Mark as Rejected
              </Button>
            </div>
          )}
        </div>

        {/* Quote Breakdown Section */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Quote Breakdown</h2>
        <div className="overflow-x-auto mb-8">
          <Table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700">
                <TableHead className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</TableHead>
                <TableHead className="py-3 px-4 text-right text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Quantity</TableHead>
                <TableHead className="py-3 px-4 text-right text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Unit Cost</TableHead>
                <TableHead className="py-3 px-4 text-right text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isErinKennedyQuote ? (
                <>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableCell className="py-3 px-4 font-medium">Performance & On-Site Engagement</TableCell>
                    <TableCell className="py-3 px-4 text-right">1</TableCell>
                    <TableCell className="py-3 px-4 text-right">{formatCurrency(300.00, symbol)}</TableCell>
                    <TableCell className="py-3 px-4 text-right font-semibold">{formatCurrency(300.00, symbol)}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableCell className="py-3 px-4 font-medium">Production Coordination & Music Preparation</TableCell>
                    <TableCell className="py-3 px-4 text-right">1</TableCell>
                    <TableCell className="py-3 px-4 text-right">{formatCurrency(100.00, symbol)}</TableCell>
                    <TableCell className="py-3 px-4 text-right font-semibold">{formatCurrency(100.00, symbol)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-gray-50 dark:bg-gray-700 font-bold">
                    <TableCell colSpan={3} className="py-3 px-4 text-right text-lg">TOTAL BASE INVOICE (Erin Kennedy)</TableCell>
                    <TableCell className="py-3 px-4 text-right text-lg">{formatCurrency(erinKennedyBaseInvoice, symbol)}</TableCell>
                  </TableRow>
                </>
              ) : (
                <>
                  {/* Compulsory Items */}
                  {compulsoryItems && compulsoryItems.length > 0 && (
                    <>
                      <TableRow className="bg-gray-50 dark:bg-gray-700">
                        <TableCell colSpan={4} className="py-2 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Compulsory Services
                        </TableCell>
                      </TableRow>
                      {compulsoryItems.map((item: CompulsoryItem, index: number) => (
                        <TableRow key={index} className="border-b border-gray-200 dark:border-gray-700">
                          <TableCell className="py-3 px-4 font-medium">
                            {item.name}
                            {item.description && <span className="text-gray-500 dark:text-gray-400 text-sm block">{item.description}</span>}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-right">1</TableCell>
                          <TableCell className="py-3 px-4 text-right">{formatCurrency(item.amount, symbol)}</TableCell>
                          <TableCell className="py-3 px-4 text-right font-semibold">{formatCurrency(item.amount, symbol)}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                  
                  {/* Existing Add-Ons */}
                  {addOns && addOns.length > 0 && (
                    <>
                      <TableRow className="bg-gray-50 dark:bg-gray-700">
                        <TableCell colSpan={4} className="py-2 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Selected Optional Add-Ons
                        </TableCell>
                      </TableRow>
                      {addOns.map((item: AddOnItem, index: number) => (
                        <TableRow key={index} className="border-b border-gray-200 dark:border-gray-700">
                          <TableCell className="py-3 px-4">{item.name} {item.description && <span className="text-gray-500 dark:text-gray-400 text-sm">({item.description})</span>}</TableCell>
                          <TableCell className="py-3 px-4 text-right">{item.quantity}</TableCell>
                          <TableCell className="py-3 px-4 text-right">{formatCurrency(item.cost, symbol)}</TableCell>
                          <TableCell className="py-3 px-4 text-right font-semibold">{formatCurrency(item.cost * item.quantity, symbol)}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </>
              )}
              <TableRow className="bg-blue-50 dark:bg-blue-900/30 font-bold">
                <TableCell colSpan={3} className="py-4 px-4 text-right text-xl text-blue-700 dark:text-blue-300">Total Amount</TableCell>
                <TableCell className="py-4 px-4 text-right text-xl text-blue-700 dark:text-blue-300">{formatCurrency(calculatedTotal, symbol)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Payment Details */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Payment Details</h2>
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700 mb-8">
          <p className="text-lg mb-2">
            <strong className="font-semibold">Required Deposit:</strong>{' '}
            {symbol}{requiredDeposit.toFixed(2)} ({depositPercentage || 0}%)
          </p>
          <p className="text-lg mb-2">
            <strong className="font-semibold">Payment Terms:</strong>{' '}
            {paymentTerms || 'The remaining balance is due 7 days prior to the event.'}
          </p>
          {bankDetails && (
            <p className="text-lg">
              <strong className="font-semibold">Bank Details:</strong> BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQuoteDetailsPage;