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
  client_id: string;
  client_name: string;
  client_email: string;
  status: 'pending' | 'accepted' | 'rejected';
  total_amount: number;
  created_at: string;
  accepted_at: string | null;
  rejected_at: string | null;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
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
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        showError('Failed to load quote details.');
        setQuote(null);
      } else {
        setQuote(data);
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [id]);

  const handleUpdateStatus = async (newStatus: 'accepted' | 'rejected') => {
    if (!quote) return;

    setIsUpdatingStatus(true);
    const updateData: Partial<Quote> = { status: newStatus };
    if (newStatus === 'accepted') {
      updateData.accepted_at = new Date().toISOString();
      updateData.rejected_at = null;
    } else if (newStatus === 'rejected') {
      updateData.rejected_at = new Date().toISOString();
      updateData.accepted_at = null;
    }

    const { error } = await supabase
      .from('quotes')
      .update(updateData)
      .eq('id', quote.id);

    if (error) {
      console.error(`Error updating quote status to ${newStatus}:`, error);
      showError(`Failed to update quote status to ${newStatus}.`);
    } else {
      showSuccess(`Quote status updated to ${newStatus}.`);
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

  const getStatusBadgeVariant = (status: Quote['status']) => {
    switch (status) {
      case 'accepted':
        return 'secondary'; // Changed from 'success' to 'secondary'
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
    quoteTotalAmount: `A$${quote.total_amount.toFixed(2)}`,
    quoteStatus: quote.status,
    quoteCreatedAt: format(new Date(quote.created_at), 'PPP p'),
    // Add other quote-specific details as needed
  };

  return (
    <div className="p-6 bg-brand-light dark:bg-brand-dark-alt min-h-screen">
      <Button onClick={() => navigate('/admin/quotes')} className="mb-6 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-light">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotes
      </Button>

      <Card className="bg-brand-card dark:bg-brand-card-dark text-brand-dark dark:text-brand-light border-brand-secondary/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-brand-primary">Quote Details #{quote.id.substring(0, 8)}</CardTitle>
          <Badge variant={getStatusBadgeVariant(quote.status)} className="text-lg px-3 py-1">
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Client Name:</strong> {quote.client_name}</p>
            <p><strong>Client Email:</strong> {quote.client_email}</p>
            <p><strong>Created At:</strong> {format(new Date(quote.created_at), 'PPP p')}</p>
            {quote.accepted_at && <p><strong>Accepted On:</strong> {format(new Date(quote.accepted_at), 'PPP p')}</p>}
            {quote.rejected_at && <p><strong>Rejected On:</strong> {format(new Date(quote.rejected_at), 'PPP p')}</p>}
          </div>

          <h3 className="text-xl font-semibold text-brand-primary mt-6 mb-3">Items</h3>
          <div className="space-y-2">
            {quote.items.map((item, index) => (
              <Card key={index} className="bg-brand-light dark:bg-brand-dark border-brand-secondary/30 p-4">
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Unit Price:</strong> A${item.unit_price.toFixed(2)}</p>
                <p><strong>Total:</strong> A${item.total.toFixed(2)}</p>
              </Card>
            ))}
          </div>

          <div className="text-right text-xl font-bold text-brand-primary mt-6">
            <p><strong>Total Amount:</strong> A${quote.total_amount.toFixed(2)}</p>
            {quote.accepted_at && <p><strong>Accepted On:</strong> {format(new Date(quote.accepted_at), 'PPP p')}</p>}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {quote.status === 'pending' && (
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
        initialSubject={`Regarding your quote #${quote.id.substring(0, 8)}`}
        dynamicDetails={dynamicEmailDetails}
      />
    </div>
  );
};

export default AdminQuoteDetailsPage;