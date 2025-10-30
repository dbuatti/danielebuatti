"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react'; // Added CheckCircle2, XCircle
import { format } from 'date-fns';
import { showError } from '@/utils/toast';

interface Quote {
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

const AdminQuoteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) return;

      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote details:', error);
        showError('Failed to load quote details.');
        setQuote(null);
      } else {
        setQuote(data as Quote);
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <span className="sr-only">Loading quote details...</span>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center text-brand-dark dark:text-brand-light">
        <h2 className="text-3xl font-bold mb-4">Quote Not Found</h2>
        <p className="text-lg mb-6">The quote you are looking for does not exist or an error occurred.</p>
        <Button asChild>
          <Link to="/admin/quotes">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quotes
          </Link>
        </Button>
      </div>
    );
  }

  const renderAdditionalDetails = (details: any, invoiceType: string) => {
    if (!details) return <p>No additional details provided.</p>;

    if (invoiceType === "Live Piano Services Quote") {
      const { selected_package_id, has_add_on, selected_add_ons } = details;
      return (
        <div className="space-y-2">
          <p><strong>Selected Package:</strong> {selected_package_id}</p>
          <p className="flex items-center gap-2">
            <strong>Has Add-Ons:</strong> {has_add_on ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
          </p>
          {has_add_on && selected_add_ons && (
            <div className="ml-4 space-y-1">
              <p className="flex items-center gap-2">
                <strong>Extra Hour:</strong> {selected_add_ons.extraHour ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
              </p>
              <p className="flex items-center gap-2">
                <strong>Rehearsal:</strong> {selected_add_ons.rehearsal ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
              </p>
            </div>
          )}
        </div>
      );
    } else if (invoiceType === "Erin Kennedy Quote") {
      const { on_site_performance_cost, show_preparation_fee, rehearsal_bundle_cost_per_student } = details;
      return (
        <div className="space-y-2">
          <p><strong>On-Site Performance Cost:</strong> A${on_site_performance_cost?.toFixed(2)}</p>
          <p><strong>Show Preparation Fee:</strong> A${show_preparation_fee?.toFixed(2)}</p>
          <p><strong>Rehearsal Bundle Cost (per student):</strong> A${rehearsal_bundle_cost_per_student?.toFixed(2)}</p>
        </div>
      );
    }
    // Fallback for any other invoice types or if structure is unexpected
    return (
      <pre className="whitespace-pre-wrap text-sm text-brand-dark/70 dark:text-brand-light/70">
        {JSON.stringify(details, null, 2)}
      </pre>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Quote Details</h2>
        <Button asChild variant="outline" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
          <Link to="/admin/quotes">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quotes
          </Link>
        </Button>
      </div>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-primary">{quote.invoice_type} - {quote.client_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-brand-dark/80 dark:text-brand-light/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Client Name:</strong> {quote.client_name}</p>
              <p><strong>Client Email:</strong> {quote.client_email}</p>
              {quote.event_title && <p><strong>Event Title:</strong> {quote.event_title}</p>}
              {quote.event_date && <p><strong>Event Date:</strong> {quote.event_date}</p>}
              {quote.event_location && <p><strong>Event Location:</strong> {quote.event_location}</p>}
              {quote.prepared_by && <p><strong>Prepared By:</strong> {quote.prepared_by}</p>}
            </div>
            <div>
              <p><strong>Total Amount:</strong> A${quote.total_amount.toFixed(2)}</p>
              <p><strong>Accepted On:</strong> {format(new Date(quote.accepted_at), 'PPP p')}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-md border border-brand-secondary/30">
            <h3 className="text-xl font-semibold text-brand-primary mb-3">Additional Details</h3>
            {renderAdditionalDetails(quote.details, quote.invoice_type)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuoteDetailsPage;