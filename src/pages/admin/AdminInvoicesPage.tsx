"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, ExternalLink } from 'lucide-react';
import { showError } from '@/utils/toast';

interface Invoice {
  id: string;
  client_name: string;
  client_email: string;
  invoice_type: string;
  event_title?: string;
  event_date?: string;
  total_amount: number;
  accepted_at: string;
}

const AdminInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('accepted_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        showError('Failed to load invoices.');
      } else {
        setInvoices(data || []);
      }
      setIsLoading(false);
    };

    fetchInvoices();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <span className="sr-only">Loading invoices...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">All Invoices</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        View and manage all accepted quotes and invoices submitted through your website.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No invoices found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                    <TableHead className="text-brand-primary">Client Name</TableHead>
                    <TableHead className="text-brand-primary">Invoice Type</TableHead>
                    <TableHead className="text-brand-primary">Event Date</TableHead>
                    <TableHead className="text-brand-primary text-right">Total Amount</TableHead>
                    <TableHead className="text-brand-primary">Accepted On</TableHead>
                    <TableHead className="text-brand-primary text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">{invoice.client_name}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{invoice.invoice_type}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{invoice.event_date || 'N/A'}</TableCell>
                      <TableCell className="text-right font-semibold text-brand-primary">A${invoice.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">{format(new Date(invoice.accepted_at), 'PPP p')}</TableCell>
                      <TableCell className="text-center">
                        <Link to={`/admin/invoices/${invoice.id}`} className="text-brand-primary hover:underline flex items-center justify-center">
                          View Details <ExternalLink className="ml-1 h-4 w-4" />
                        </Link>
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

export default AdminInvoicesPage;