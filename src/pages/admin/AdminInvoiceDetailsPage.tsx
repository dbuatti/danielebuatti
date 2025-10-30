"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { showError } from '@/utils/toast';

interface Invoice {
  id: string;
  client_name: string;
  client_email: string;
  invoice_type: string;
  event_title?: string;
  event_date?: string;
  event_location?: string;
  prepared_by?: string;
  total_amount: number;
  details: any; // JSONB column
  accepted_at: string;
}

const AdminInvoiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;

      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching invoice details:', error);
        showError('Failed to load invoice details.');
        setInvoice(null);
      } else {
        setInvoice(data as Invoice);
      }
      setIsLoading(false);
    };

    fetchInvoice();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <span className="sr-only">Loading invoice details...</span>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center text-brand-dark dark:text-brand-light">
        <h2 className="text-3xl font-bold mb-4">Invoice Not Found</h2>
        <p className="text-lg mb-6">The invoice you are looking for does not exist or an error occurred.</p>
        <Button asChild>
          <Link to="/admin/invoices">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Invoices
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Invoice Details</h2>
        <Button asChild variant="outline" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
          <Link to="/admin/invoices">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Invoices
          </Link>
        </Button>
      </div>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-primary">{invoice.invoice_type} - {invoice.client_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-brand-dark/80 dark:text-brand-light/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Client Name:</strong> {invoice.client_name}</p>
              <p><strong>Client Email:</strong> {invoice.client_email}</p>
              {invoice.event_title && <p><strong>Event Title:</strong> {invoice.event_title}</p>}
              {invoice.event_date && <p><strong>Event Date:</strong> {invoice.event_date}</p>}
              {invoice.event_location && <p><strong>Event Location:</strong> {invoice.event_location}</p>}
              {invoice.prepared_by && <p><strong>Prepared By:</strong> {invoice.prepared_by}</p>}
            </div>
            <div>
              <p><strong>Total Amount:</strong> A${invoice.total_amount.toFixed(2)}</p>
              <p><strong>Accepted On:</strong> {format(new Date(invoice.accepted_at), 'PPP p')}</p>
            </div>
          </div>

          {invoice.details && (
            <div className="mt-6 p-4 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-md border border-brand-secondary/30">
              <h3 className="text-xl font-semibold text-brand-primary mb-3">Additional Details</h3>
              <pre className="whitespace-pre-wrap text-sm text-brand-dark/70 dark:text-brand-light/70">
                {JSON.stringify(invoice.details, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvoiceDetailsPage;