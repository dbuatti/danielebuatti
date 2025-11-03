import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Mail, CheckCircle, XCircle } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import EmailComposerModal from '@/components/admin/EmailComposerModal';
import { format } from 'date-fns'; // Import format from date-fns

interface Quote {
  id: string;
  client_name: string;
  client_email: string;
  invoice_type: string; // This will be 'Live Piano Services Quote' or 'Erin Kennedy Quote'
  event_title?: string;
  event_date?: string;
  event_location?: string;
  prepared_by?: string;
  total_amount: number;
  details: any; // JSONB column for additional specific details
  accepted_at: string | null;
  rejected_at: string | null;
  slug?: string | null;
  created_at: string; // Added created_at to the interface
}

const AdminQuoteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoices') // Fetching from 'invoices' table
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        showError('Failed to load quote details.');
        setQuote(null);
      } else {
        setQuote(data as Quote); // Cast data to Quote interface
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [id]);

  const handleUpdateStatus = async (newStatus: 'accepted' | 'rejected') => {
    if (!quote) return;

    setIsUpdatingStatus(true);
    const updateData: { accepted_at: string | null; rejected_at: string | null } = {
      accepted_at: null,
      rejected_at: null,
    };

    if (newStatus === 'accepted') {
      updateData.accepted_at = new Date().toISOString();
    } else if (newStatus === 'rejected') {
      updateData.rejected_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('invoices')
      .update(updateData) // Directly update accepted_at/rejected_at
      .eq('id', quote.id);

    if (error) {
      console.error(`Error updating quote status to ${newStatus}:`, error);
      showError(`Failed to update quote status to ${newStatus}.`);
    } else {
      showSuccess(`Quote status updated to ${newStatus}.`);
      // Manually update the local state to reflect the change
      setQuote((prev) => (prev ? { ...prev, ...updateData } : null));
    }
    setIsUpdatingStatus(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-brand-dark dark:text-brand-light">Quote not found.</p>
        <Button onClick={() => navigate('/admin/quotes')} className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotes
        </Button>
      </div>
    );
  }

  // Determine current status based on accepted_at and rejected_at
  const currentStatus = quote.accepted_at ? 'accepted' : (quote.rejected_at ? 'rejected' : 'pending');

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'pending':
      default:
        return 'default';
    }
  };

  const dynamicEmailDetails = {
    clientName: quote.client_name,
    clientEmail: quote.client_email,
    quoteId: quote.id,
    quoteType: quote.invoice_type,
    eventTitle: quote.event_title || 'N/A',
    eventDate: quote.event_date ? format(new Date(quote.event_date), 'PPP') : 'N/A',
    eventLocation: quote.event_location || 'N/A',
    preparedBy: quote.prepared_by || 'N/A',
    totalAmount: `A$${quote.total_amount.toFixed(2)}`,
    quoteStatus: currentStatus,
    quoteCreatedAt: format(new Date(quote.created_at), 'PPP p'),
    // Add other quote-specific details from the 'details' JSONB column if needed
    ...quote.details, // Spread all properties from the 'details' JSONB column
  };

  return (
    <div className="p-6 bg-brand-light dark:bg-brand-dark-alt min-h-screen">
      <Button onClick={() => navigate('/admin/quotes')} className="mb-6 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-light">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotes
      </Button>

      <Card className="bg-brand-card dark:bg-brand-card-dark text-brand-dark dark:text-brand-light border-brand-secondary/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-brand-primary">Quote Details #{quote.id.substring(0, 8)}</CardTitle>
          <Badge variant={getStatusBadgeVariant(currentStatus)} className="text-lg px-3 py-1">
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Client Name:</strong> {quote.client_name}</p>
            <p><strong>Client Email:</strong> {quote.client_email}</p>
            <p><strong>Quote Type:</strong> {quote.invoice_type}</p>
            {quote.event_title && <p><strong>Event Title:</strong> {quote.event_title}</p>}
            {quote.event_date && <p><strong>Event Date:</strong> {format(new Date(quote.event_date), 'PPP')}</p>}
            {quote.event_location && <p><strong>Event Location:</strong> {quote.event_location}</p>}
            {quote.prepared_by && <p><strong>Prepared By:</strong> {quote.prepared_by}</p>}
            <p><strong>Created At:</strong> {format(new Date(quote.created_at), 'PPP p')}</p>
            {quote.accepted_at && <p><strong>Accepted On:</strong> {format(new Date(quote.accepted_at), 'PPP p')}</p>}
            {quote.rejected_at && <p><strong>Rejected On:</strong> {format(new Date(quote.rejected_at), 'PPP p')}</p>}
          </div>

          {/* Display details from the JSONB column if available */}
          {quote.details && Object.keys(quote.details).length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-brand-primary mt-6 mb-3">Additional Details</h3>
              <div className="space-y-2">
                {Object.entries(quote.details).map(([key, value], index) => (
                  <div key={index} className="bg-brand-light dark:bg-brand-dark border-brand-secondary/30 p-3 rounded-md">
                    <p><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {
                      typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                      (typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value))
                    }</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="text-right text-xl font-bold text-brand-primary mt-6">
            <p><strong>Total Amount:</strong> A${quote.total_amount.toFixed(2)}</p>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {currentStatus === 'pending' && (
              <>
                <Button
                  onClick={() => handleUpdateStatus('accepted')}
                  disabled={isUpdatingStatus}
                  className="bg-green-600 hover:bg-green-700 text-brand-light"
                >
                  {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  Accept Quote
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={isUpdatingStatus}
                  className="bg-red-600 hover:bg-red-700 text-brand-light"
                >
                  {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                  Reject Quote
                </Button>
              </>
            )}
            <Button
              onClick={() => setIsEmailModalOpen(true)}
              className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
            >
              <Mail className="mr-2 h-4 w-4" /> Compose Email
            </Button>
          </div>
        </CardContent>
      </Card>

      <EmailComposerModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        initialRecipientEmail={quote.client_email}
        initialSubject={`Regarding your quote for ${quote.event_title || quote.invoice_type}`}
        dynamicDetails={dynamicEmailDetails}
      />
    </div>
  );
};

export default AdminQuoteDetailsPage;