"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Quote, QuoteVersion } from '@/types/quote';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Trash2, Edit, Copy, Clock, Eye, Send, CheckCircle, XCircle } from 'lucide-react';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import QuoteSendingModal from '@/components/admin/QuoteSendingModal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuoteWithStatus extends Quote {
  status: 'Draft' | 'Created' | 'Sent' | 'Accepted' | 'Rejected';
}

const AdminQuoteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quote, setQuote] = useState<QuoteWithStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendingModalOpen, setIsSendingModalOpen] = useState(false);
  const [, copy] = useCopyToClipboard();

  const fetchQuote = useCallback(async (showToast = false) => {
    if (!id) return;
    setIsLoading(true);
    const toastId = showToast ? showLoading('Loading quote details...') : undefined;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const fetchedQuote: QuoteWithStatus = {
        ...data,
        total_amount: parseFloat(data.total_amount),
        details: typeof data.details === 'string' ? JSON.parse(data.details) : data.details,
        status: data.status || 'Created',
      };

      setQuote(fetchedQuote);
      if (showToast) showSuccess('Quote loaded.', { id: toastId });
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      showError(`Failed to load quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
      setQuote(null);
    } finally {
      setIsLoading(false);
      if (toastId) dismissToast(toastId);
    }
  }, [id]);

  useEffect(() => {
    fetchQuote(true);
  }, [fetchQuote]);

  // --- LOGIC HELPERS ---
  const versions = quote?.details?.versions 
    ? [...quote.details.versions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) 
    : [];

  const activeVersion = versions.find(v => v.is_active);
  const displayVersion = activeVersion || versions[versions.length - 1] || null;

  // --- ACTIONS ---
  const handleDelete = async () => {
    if (!quote || !user) return;
    if (!window.confirm(`Delete quote for "${quote.event_title}"?`)) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', quote.id);
      if (error) throw error;
      showSuccess('Quote deleted.');
      navigate('/admin/quotes');
    } catch (error: any) {
      showError(error.message);
    } finally { setIsDeleting(false); }
  };

  const handleActivateVersion = async (versionId: string) => {
    if (!quote) return;
    setIsActivating(true);
    try {
      const updatedVersions = versions.map(v => ({ ...v, is_active: v.versionId === versionId }));
      const newActive = updatedVersions.find(v => v.is_active);
      if (!newActive) return;

      const { error } = await supabase.from('invoices').update({
        total_amount: newActive.total_amount,
        status: newActive.status,
        details: { ...quote.details, versions: updatedVersions },
      }).eq('id', quote.id);

      if (error) throw error;
      await fetchQuote(false);
      showSuccess('Version activated.');
    } catch (error: any) { showError(error.message); }
    finally { setIsActivating(false); }
  };

  const handleCopyLink = () => {
    if (!quote) return;
    copy(`${window.location.origin}/quotes/${quote.slug}`);
    showSuccess('Link copied!');
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
  if (!quote || !displayVersion) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>Quote or Versions missing.</AlertDescription></Alert>;

  // Now safe to destructure
  const { total_amount, accepted_at, rejected_at, theme, currencySymbol, versionId, status } = displayVersion;
  const isFinalized = !!accepted_at || !!rejected_at;
  const currentStatus = accepted_at ? 'Accepted' : rejected_at ? 'Rejected' : status || 'Created';

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{quote.event_title}</h2>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link to={`/admin/quotes/edit/${quote.id}`}><Edit className="h-4 w-4 mr-2" /> Edit Active</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Status & Actions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Badge className="w-full justify-center text-lg py-1" variant={accepted_at ? "default" : rejected_at ? "destructive" : "secondary"}>
              {currentStatus} ({versionId})
            </Badge>
            <Separator />
            {!isFinalized && (
              <Button onClick={() => setIsSendingModalOpen(true)} className="w-full bg-brand-primary">
                <Send className="h-4 w-4 mr-2" /> Send Quote
              </Button>
            )}
            <Button onClick={handleCopyLink} variant="secondary" className="w-full"><Copy className="h-4 w-4 mr-2" /> Copy Link</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-y-4">
            <div><p className="text-sm text-muted-foreground">Client</p><p className="font-medium">{quote.client_name}</p></div>
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{quote.client_email}</p></div>
            <div><p className="text-sm text-muted-foreground">Total</p><p className="text-xl font-bold">{currencySymbol}{total_amount.toFixed(2)}</p></div>
            <div><p className="text-sm text-muted-foreground">Theme</p><p className="font-medium">{theme}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Version History</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {versions.map((v) => (
              <div key={v.versionId} className={cn("p-4 border rounded-lg", v.is_active && "border-brand-primary bg-brand-primary/5")}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{v.versionName}</span>
                  {v.is_active && <Badge>Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{format(new Date(v.created_at), 'PP')}</p>
                <p className="font-bold mt-2">{v.currencySymbol}{v.total_amount}</p>
                {!v.is_active && (
                  <Button variant="link" size="sm" className="p-0 mt-2" onClick={() => handleActivateVersion(v.versionId)}>Set Active</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview</CardTitle>
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild><Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Full Preview</Button></DialogTrigger>
            <DialogContent className="max-w-[95vw] h-[90vh]"><ScrollArea className="h-full"><QuoteDisplay quote={quote} /></ScrollArea></DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg h-[400px] overflow-hidden relative">
            <div className="absolute inset-0 scale-[0.5] origin-top-left w-[200%]">
               <QuoteDisplay quote={quote} />
            </div>
          </div>
        </CardContent>
      </Card>

      <QuoteSendingModal isOpen={isSendingModalOpen} onClose={() => setIsSendingModalOpen(false)} quote={quote} onQuoteSent={fetchQuote} />
    </div>
  );
};

export default AdminQuoteDetailsPage;