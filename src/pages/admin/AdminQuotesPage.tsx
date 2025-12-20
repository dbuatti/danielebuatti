"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { 
  Loader2, 
  ExternalLink, 
  Trash2, 
  PlusCircle, 
  FileText, 
  Copy, 
  Eye, 
  PencilLine 
} from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { Quote } from '@/types/quote';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuoteWithStatus extends Quote {
  status: 'Draft' | 'Created' | 'Sent' | 'Accepted' | 'Rejected';
}

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
  const [, copy] = useCopyToClipboard();

  const calculateDraftTotal = (draft: Draft): number => {
    const compulsoryTotal = draft.data.compulsoryItems?.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0) || 0;
    const addOnTotal = draft.data.addOns?.reduce((sum: number, addOn) => 
      sum + ((addOn.price ?? 0) * (addOn.quantity ?? 0)), 0) || 0;
    return compulsoryTotal + addOnTotal;
  };

  const fetchQuotesAndDrafts = async () => {
    setIsLoading(true);
    try {
      const { data: quotesData, error: quotesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      const { data: draftsData, error: draftsError } = await supabase
        .from('quote_drafts')
        .select('id, title, data, updated_at');

      if (draftsError) throw draftsError;

      const quotes = (quotesData as any[]) || [];
      const drafts = (draftsData as any[]) || [];

      const mappedQuotes: CombinedQuoteItem[] = quotes.map(quote => ({
        id: quote.id,
        type: 'quote',
        client_name: quote.client_name,
        invoice_type: quote.invoice_type,
        event_date: quote.event_date || null,
        total_amount: parseFloat(quote.total_amount),
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
        created_at: draft.updated_at,
      }));

      const combined = [...mappedQuotes, ...mappedDrafts].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setCombinedItems(combined);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Failed to load proposals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotesAndDrafts();
  }, []);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/quotes/${slug}`;
    copy(url);
    showSuccess('Client link copied to clipboard!');
  };

  const openClientLink = (slug: string) => {
    window.open(`${window.location.origin}/quotes/${slug}`, '_blank');
  };

  const handleDeleteItem = async (itemId: string, itemType: 'quote' | 'draft') => {
    if (!window.confirm(`Are you sure you want to delete this ${itemType}?`)) return;
    
    try {
      const table = itemType === 'quote' ? 'invoices' : 'quote_drafts';
      const { error } = await supabase.from(table).delete().eq('id', itemId);
      if (error) throw error;
      
      setCombinedItems(prev => prev.filter(item => item.id !== itemId));
      showSuccess(`${itemType === 'quote' ? 'Quote' : 'Draft'} deleted.`);
    } catch (err) {
      showError(`Failed to delete ${itemType}.`);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Accepted': return 'default';
      case 'Rejected': return 'destructive';
      case 'Sent': return 'secondary';
      case 'Draft': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <p className="text-brand-dark/60 animate-pulse">Synchronizing quotes...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Proposals</h2>
            <p className="text-brand-dark/60 dark:text-brand-light/60">Manage your active quotes and saved drafts.</p>
          </div>
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light shadow-lg shadow-brand-primary/20">
            <Link to="/admin/create-quote">
              <PlusCircle className="mr-2 h-4 w-4" /> New Quote
            </Link>
          </Button>
        </div>

        <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-xl border-brand-secondary/20">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-brand-secondary/10">
                  <TableHead className="w-[200px] py-4">Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combinedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No proposals found. Start by creating a new quote.
                    </TableCell>
                  </TableRow>
                ) : (
                  combinedItems.map((item) => (
                    <TableRow key={item.id} className="group border-b border-brand-secondary/5">
                      <TableCell className="font-semibold py-4">
                        {item.client_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className={cn("h-4 w-4", item.type === 'draft' ? 'text-muted-foreground' : 'text-brand-primary')} />
                          {item.invoice_type}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.event_date ? format(new Date(item.event_date), 'dd MMM yyyy') : '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        A${item.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize">
                          {item.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          {item.type === 'quote' && (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-primary" onClick={() => openClientLink(item.slug!)}>
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Open Client Link</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-primary" onClick={() => handleCopyLink(item.slug!)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy URL</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-brand-primary">
                                    <Link to={`/admin/quotes/${item.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Details</TooltipContent>
                              </Tooltip>
                            </>
                          )}

                          {item.type === 'draft' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-brand-primary">
                                  <Link to="/admin/create-quote" state={{ loadDraftId: item.id }}>
                                    <PencilLine className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Draft</TooltipContent>
                            </Tooltip>
                          )}

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteItem(item.id, item.type)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default AdminQuotesPage;