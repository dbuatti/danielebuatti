"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, ExternalLink, Trash2, PlusCircle } from 'lucide-react';
import { showError } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Quote } from '@/types/quote'; // Import Quote interface

const AdminQuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false }); // Order by creation date to see all recent activity

      if (error) {
        console.error('Error fetching quotes:', error);
        showError('Failed to load quotes.');
      } else {
        setQuotes(data || []);
      }
      setIsLoading(false);
    };

    fetchQuotes();
  }, []);

  const handleDeleteQuote = async (quoteId: string) => {
    toast.promise(
      async () => {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', quoteId);

        if (error) throw error;
        
        // Optimistically update the UI
        setQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== quoteId));
        return 'Quote deleted successfully!';
      },
      {
        loading: 'Deleting quote...',
        success: (message) => message,
        error: (err) => {
          console.error('Error deleting quote:', err);
          return 'Failed to delete quote.';
        },
        action: {
          label: 'Confirm Delete',
          onClick: () => { /* The promise handles the actual deletion */ },
        },
        description: 'Are you sure you want to delete this quote? This action cannot be undone.',
      }
    );
  };

  const getQuoteStatus = (quote: Quote) => {
    if (quote.accepted_at) return 'Accepted';
    if (quote.rejected_at) return 'Rejected';
    return 'Pending';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <span className="sr-only">Loading quotes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Manage Quotes</h2>
        <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
          <Link to="/admin/create-quote">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Quote
          </Link>
        </Button>
      </div>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        View and manage all quote proposals submitted through your website, regardless of their acceptance status.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">All Quote Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No quote proposals found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                    <TableHead className="text-brand-primary">Client Name</TableHead>
                    <TableHead className="text-brand-primary">Quote Type</TableHead>
                    <TableHead className="text-brand-primary">Event Date</TableHead>
                    <TableHead className="text-brand-primary text-right">Total Amount</TableHead>
                    <TableHead className="text-brand-primary">Status</TableHead>
                    <TableHead className="text-brand-primary">Created On</TableHead>
                    <TableHead className="text-brand-primary text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">{quote.client_name}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{quote.invoice_type}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{quote.event_date && format(new Date(quote.event_date), 'EEEE d MMMM yyyy') || 'N/A'}</TableCell>
                      <TableCell className="text-right font-semibold text-brand-primary">A${quote.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                        {getQuoteStatus(quote)}
                      </TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">{format(new Date(quote.created_at), 'PPP p')}</TableCell>
                      <TableCell className="text-center flex gap-2 justify-center">
                        <Link to={`/admin/quotes/${quote.id}`} className="text-brand-primary hover:underline flex items-center justify-center">
                          View Details <ExternalLink className="ml-1 h-4 w-4" />
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteQuote(quote.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuotesPage;