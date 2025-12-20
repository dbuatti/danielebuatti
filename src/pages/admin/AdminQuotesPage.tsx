"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, ExternalLink, Trash2, PlusCircle, FileText } from 'lucide-react';
import { showError } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Quote } from '@/types/quote'; // Import Quote interface
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Draft {
  id: string;
  title: string;
  data: {
    clientName: string;
    invoiceType: string;
    eventDate: string;
    compulsoryItems: { price: number; quantity: number }[];
    addOns: { price: number; quantity: number }[];
  };
  updated_at: string;
}

interface CombinedQuoteItem {
  id: string;
  type: 'quote' | 'draft';
  client_name: string;
  invoice_type: string;
  event_date: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  slug?: string;
}

const AdminQuotesPage: React.FC = () => {
  const [combinedItems, setCombinedItems] = useState<CombinedQuoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const calculateDraftTotal = (draft: Draft): number => {
    const compulsoryTotal = draft.data.compulsoryItems.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0);
    const addOnTotal = draft.data.addOns?.reduce((sum: number, addOn) => 
      sum + ((addOn.price ?? 0) * (addOn.quantity ?? 0)), 0) || 0;
    return compulsoryTotal + addOnTotal;
  };

  const fetchQuotesAndDrafts = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch finalized quotes (invoices)
      const { data: quotesData, error: quotesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      const quotes: Quote[] = quotesData as Quote[] || [];

      // 2. Fetch drafts
      const { data: draftsData, error: draftsError } = await supabase
        .from('quote_drafts')
        .select('id, title, data, updated_at');

      if (draftsError) throw draftsError;

      const drafts: Draft[] = draftsData as Draft[] || [];

      // 3. Combine and map data
      const mappedQuotes: CombinedQuoteItem[] = quotes.map(quote => ({
        id: quote.id,
        type: 'quote',
        client_name: quote.client_name,
        invoice_type: quote.invoice_type,
        event_date: quote.event_date || null,
        total_amount: quote.total_amount,
        status: quote.accepted_at ? 'Accepted' : quote.rejected_at ? 'Rejected' : quote.status || 'Pending',
        created_at: quote.created_at,
        slug: quote.slug,
      }));

      const mappedDrafts: CombinedQuoteItem[] = drafts.map(draft => ({
        id: draft.id,
        type: 'draft',
        client_name: draft.data.clientName || draft.title,
        invoice_type: draft.data.invoiceType || 'Draft',
        event_date: draft.data.eventDate || null,
        total_amount: calculateDraftTotal(draft),
        status: 'Draft',
        created_at: draft.updated_at, // Use updated_at for drafts for sorting relevance
      }));

      const combined = [...mappedQuotes, ...mappedDrafts].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setCombinedItems(combined);

    } catch (error) {
      console.error('Error fetching quotes/drafts:', error);
      showError('Failed to load proposals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotesAndDrafts();
  }, []);

  const handleDeleteItem = async (itemId: string, itemType: 'quote' | 'draft') => {
    toast.promise(
      async () => {
        let error;
        if (itemType === 'quote') {
          const result = await supabase
            .from('invoices')
            .delete()
            .eq('id', itemId);
          error = result.error;
        } else {
          const result = await supabase
            .from('quote_drafts')
            .delete()
            .eq('id', itemId);
          error = result.error;
        }

        if (error) throw error;
        
        // Optimistically update the UI
        setCombinedItems(prevItems => prevItems.filter(item => item.id !== itemId));
        return `${itemType === 'quote' ? 'Quote' : 'Draft'} deleted successfully!`;
      },
      {
        loading: `Deleting ${itemType}...`,
        success: (message) => message,
        error: (err) => {
          console.error(`Error deleting ${itemType}:`, err);
          return `Failed to delete ${itemType}.`;
        },
        action: {
          label: 'Confirm Delete',
          onClick: () => { /* The promise handles the actual deletion */ },
        },
        description: `Are you sure you want to delete this ${itemType}? This action cannot be undone.`,
      }
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Sent':
        return 'secondary';
      case 'Draft':
        return 'outline';
      case 'Created':
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <span className="sr-only">Loading proposals...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Manage Quotes & Drafts</h2>
        <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
          <Link to="/admin/create-quote">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Quote
          </Link>
        </Button>
      </div>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        View and manage all quote proposals and saved drafts.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <div className="p-6 border-b border-brand-secondary/50">
          <h3 className="text-xl font-semibold text-brand-primary">All Proposals</h3>
        </div>
        <CardContent>
          {combinedItems.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No quote proposals or drafts found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                    <TableHead className="text-brand-primary">Client Name</TableHead>
                    <TableHead className="text-brand-primary">Type</TableHead>
                    <TableHead className="text-brand-primary">Event Date</TableHead>
                    <TableHead className="text-brand-primary text-right">Total Amount</TableHead>
                    <TableHead className="text-brand-primary">Status</TableHead>
                    <TableHead className="text-brand-primary">Created/Updated On</TableHead>
                    <TableHead className="text-brand-primary text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">
                        {item.client_name}
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                        <div className="flex items-center gap-1">
                          <FileText className={cn("h-4 w-4", item.type === 'draft' ? 'text-gray-500' : 'text-brand-primary')} />
                          {item.invoice_type}
                        </div>
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                        {item.event_date && format(new Date(item.event_date), 'EEEE d MMMM yyyy') || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-brand-primary">A${item.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(item.status)} className="min-w-[80px] justify-center">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">
                        {format(new Date(item.created_at), 'PPP p')}
                      </TableCell>
                      <TableCell className="text-center flex gap-2 justify-center">
                        {item.type === 'quote' ? (
                          <Link to={`/admin/quotes/${item.id}`} className="text-brand-primary hover:underline flex items-center justify-center">
                            View Details <ExternalLink className="ml-1 h-4 w-4" />
                          </Link>
                        ) : (
                          <Link to="/admin/create-quote" state={{ loadDraftId: item.id }} className="text-brand-primary hover:underline flex items-center justify-center">
                            Edit Draft <ExternalLink className="ml-1 h-4 w-4" />
                          </Link>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id, item.type)}
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