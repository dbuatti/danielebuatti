"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, Edit, PlusCircle } from 'lucide-react';
import { showError } from '@/utils/toast';

// Define a type for the data fetched from the 'invoices' table
interface InvoiceRow {
  id: string;
  slug: string;
  event_title: string;
  client_name: string;
  total_amount: number;
  invoice_type: string;
  created_at: string;
  accepted_at: string | null;
}

const AdminQuotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        // Fetch necessary fields from the 'invoices' table, ordered by creation date
        const { data, error } = await supabase
          .from('invoices')
          .select('id, slug, event_title, client_name, total_amount, invoice_type, created_at, accepted_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedData: InvoiceRow[] = data.map(item => ({
          id: item.id,
          slug: item.slug,
          event_title: item.event_title,
          client_name: item.client_name,
          total_amount: item.total_amount,
          invoice_type: item.invoice_type,
          created_at: item.created_at,
          accepted_at: item.accepted_at,
        }));

        setInvoices(mappedData);
      } catch (error: any) {
        console.error('Error fetching invoices:', error);
        showError(`Failed to load quotes: ${error.message || 'Unknown error occurred'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatCurrency = (amount: number) => {
    // Assuming AUD based on default BSB/ACC in builder page
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD', 
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (acceptedAt: string | null) => {
    if (acceptedAt) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Accepted</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</span>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Finalized Quotes & Invoices</h2>
        <Button onClick={() => navigate('/admin/quote-builder')} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> New Quote
        </Button>
      </div>
      
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        This page lists all finalized quotes (invoices) that have been sent to clients.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote List ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No finalized quotes found. Start by creating a new quote.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium text-sm">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">{invoice.client_name}</TableCell>
                      <TableCell className="text-sm">{invoice.event_title}</TableCell>
                      <TableCell className="text-sm">{invoice.invoice_type}</TableCell>
                      <TableCell className="text-right font-semibold text-sm">
                        {formatCurrency(invoice.total_amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.accepted_at)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => navigate(`/quotes/${invoice.slug}`)}
                          title="View Public Quote"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => navigate(`/admin/quotes/edit/${invoice.slug}`)}
                          title="Edit Quote"
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
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