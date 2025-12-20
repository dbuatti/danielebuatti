"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Quote, QuoteVersion } from '@/types/quote';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Download, Edit, Trash2, Copy, Clock, Eye, Send, CheckCircle, XCircle, Wrench, ExternalLink } from 'lucide-react';
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

// Extend Quote interface locally to include the new status field
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
  const [isMigrating, setIsMigrating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendingModalOpen, setIsSendingModal] = useState(false);
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
      
      console.log('Fetched Quote Data:', data);

      // Map data to QuoteWithStatus type
      const fetchedQuote: QuoteWithStatus = {
        ...data,
        total_amount: parseFloat(data.total_amount),
        details: data.details as Quote['details'],
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

  const handleMigrateData = async () => {
    if (!quote || !id) return;

    if (!window.confirm('This action will attempt to fix corrupted quote data by creating a new version structure based on existing fields. Proceed?')) {
      return;
    }

    setIsMigrating(true);
    const toastId = showLoading('Migrating quote data...');

    try {
      const { data, error } = await supabase.functions.invoke('migrate-quote-version', {
        body: { invoice_id: id },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      showSuccess(data.message || 'Quote data successfully migrated!', { id: toastId });
      await fetchQuote(false); // Refetch to load the fixed structure

    } catch (error: any) {
      console.error('Migration Error:', error);
      showError(`Failed to migrate data: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsMigrating(false);
      dismissToast(toastId);
    }
  };

  const handleDelete = async () => {
    if (!quote || !user) return;

    if (!window.confirm(`Are you sure you want to delete the quote for "${quote.event_title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    const toastId = showLoading('Deleting quote...');

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess('Quote deleted successfully!', { id: toastId });
      navigate('/admin/quotes');
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      showError(`Failed to delete quote: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsDeleting(false);
      dismissToast(toastId);
    }
  };


  const handleResetStatus = async () => {
    if (!quote || !user) return;

    if (!window.confirm(`Are you sure you want to reset the status of the ACTIVE version back to Created? This will clear acceptance/rejection dates and set status to 'Created'.`)) {
      return;
    }

    setIsResetting(true);
    const toastId = showLoading('Resetting quote status...');

    try {
      // Defensive check for details and versions
      const versions = quote.details?.versions || [];
      if (versions.length === 0) throw new Error("No versions found in quote details.");
      
      const activeVersion = versions.find(v => v.is_active);

      if (!activeVersion) throw new Error("No active version found to reset.");

      // Update the active version
      const updatedVersions = versions.map(v => {
        if (v.versionId === activeVersion.versionId) {
          return {
            ...v,
            accepted_at: null,
            rejected_at: null,
            status: 'Created' as QuoteVersion['status'],
          };
        }
        return v;
      });

      // Update the main invoice record
      const { error } = await supabase
        .from('invoices')
        .update({
          accepted_at: null,
          rejected_at: null,
          status: 'Created',
          details: { versions: updatedVersions },
        })
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess('Active version status reset to Created!', { id: toastId });
      await fetchQuote(false);
    } catch (error: any) {
      console.error('Error resetting quote status:', error);
      showError(`Failed to reset quote status: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsResetting(false);
      dismissToast(toastId);
    }
  };


  const handleActivateVersion = async (versionId: string) => {
    if (!quote || !user) return;

    if (!window.confirm(`Are you sure you want to set version ${versionId} as the ACTIVE version? This will be the version the client sees.`)) {
      return;
    }

    setIsActivating(true);
    const toastId = showLoading(`Activating version ${versionId}...`);

    try {
      // Defensive check for details and versions
      const versions = quote.details?.versions || [];
      if (versions.length === 0) throw new Error("No versions found in quote details.");
      
      let newActiveVersion: QuoteVersion | undefined;

      // 1. Update versions array: set selected version to active, others to inactive
      const updatedVersions = versions.map(v => {
        const isActive = v.versionId === versionId;
        if (isActive) {
          newActiveVersion = { ...v, is_active: true };
          return newActiveVersion;
        }
        return { ...v, is_active: false };
      });

      if (!newActiveVersion) throw new Error("Version not found.");

      // 2. Update the main invoice record (top-level fields must reflect the new active version)
      const { error } = await supabase
        .from('invoices')
        .update({
          total_amount: newActiveVersion.total_amount,
          status: newActiveVersion.status,
          accepted_at: newActiveVersion.accepted_at,
          rejected_at: newActiveVersion.rejected_at,
          details: { versions: updatedVersions },
        })
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess(`Version ${versionId} successfully set as active!`, { id: toastId });
      await fetchQuote(false);

    } catch (error: any) {
      console.error('Error activating version:', error);
      showError(`Failed to activate version: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsActivating(false);
      dismissToast(toastId);
    }
  };


  const handleCopyLink = () => {
    if (!quote) return;
    const quoteUrl = `${window.location.origin}/quotes/${quote.slug}`;
    copy(quoteUrl);
    showSuccess('Quote link copied to clipboard!');
  };
  
  const handleOpenLink = () => {
    if (!quote) return;
    const quoteUrl = `${window.location.origin}/quotes/${quote.slug}`;
    window.open(quoteUrl, '_blank');
  };


  const handleQuoteSent = () => {
    // Update status locally after successful send
    // We need to find the active version and update its status to 'Sent'
    const updatedVersions = quote?.details?.versions?.map(v => {
      if (v.is_active) {
        return { ...v, status: 'Sent' as QuoteVersion['status'] };
      }
      return v;
    }) || [];

    setQuote(prev => prev ? {
      ...prev,
      status: 'Sent', // Update top-level status
      details: { versions: updatedVersions }
    } : null);
  };


  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Sent':
        return 'secondary';
      case 'Created':
        return 'outline';
      case 'Draft':
      default:
        return 'outline';
    }
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }



  if (!quote) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Quote not found or an error occurred while loading.</AlertDescription>
      </Alert>
    );
  }



  // Defensive check added here: Ensure details and versions exist
  const versions = quote.details?.versions ? [...quote.details.versions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : [];

  if (versions.length === 0) {
      return (
          <Alert variant="destructive">
              <AlertTitle>Error: Corrupted Quote Data</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>Quote data is corrupted: No versions found in quote details. This usually happens with older records created before versioning was implemented.</p>
                <Button 
                  onClick={handleMigrateData} 
                  disabled={isMigrating}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isMigrating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wrench className="h-4 w-4 mr-2" />}
                  Fix Data Structure (Migrate)
                </Button>
              </AlertDescription>
          </Alert>
      );
  }
  
  const activeVersion = versions.find(v => v.is_active);


  // Fallback for display if active version is somehow missing (shouldn't happen if creation logic is correct)
  const displayVersion = activeVersion || versions[versions.length - 1];

  const isFinalized = !!displayVersion?.accepted_at || !!displayVersion?.rejected_at;

  const currentStatus = displayVersion?.accepted_at ? 'Accepted' : displayVersion?.rejected_at ? 'Rejected' : displayVersion?.status || 'Pending';

  const isSendable = !isFinalized;


  // Use active version data for top-level display

  const { total_amount, accepted_at, rejected_at, theme } = displayVersion;



  return (

    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">

          {quote.invoice_type} Details: {quote.event_title} ({quote.client_name})

        </h2>

        <div className="flex space-x-2">

          {isFinalized && (

            <Button

              variant="outline"

              onClick={handleResetStatus}

              disabled={isResetting}

              className="text-yellow-600 border-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50"

            >

              {isResetting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Clock className="h-4 w-4 mr-2" />}

              Reset Status

            </Button>

          )}

          <Button asChild variant="outline" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">

            <Link to={`/admin/quotes/edit/${quote.id}`}>

              <Edit className="h-4 w-4 mr-2" /> Edit Active Version

            </Link>

          </Button>

          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>

            {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}

            Delete Quote

          </Button>

        </div>

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Status & Actions Card */}

        <Card className="lg:col-span-1 bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">

          <CardHeader>

            <CardTitle className="text-xl text-brand-primary">Status & Actions</CardTitle>

          </CardHeader>

          <CardContent className="space-y-4">

            <div className="flex flex-col space-y-2">

              <Badge variant={getStatusBadgeVariant(currentStatus)} className="text-lg px-3 py-1 justify-center">

                {currentStatus} ({displayVersion.versionId})

              </Badge>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">

                {accepted_at ? `Accepted on ${format(new Date(accepted_at), 'PPP')}` :

                  rejected_at ? `Rejected on ${format(new Date(rejected_at), 'PPP')}` :

                    'Awaiting client response'}

              </p>

            </div>


            <Separator />



            {isSendable && (

              <Button onClick={() => setIsSendingModal(true)} className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light">

                <Send className="h-4 w-4 mr-2" /> {currentStatus === 'Sent' ? 'Resend Quote' : 'Send Quote'}

              </Button>

            )}
            
            <div className="flex gap-2">
              <Button onClick={handleOpenLink} variant="secondary" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" /> Open Client Link
              </Button>
              <Button onClick={handleCopyLink} variant="outline" size="icon" className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
                <Copy className="h-4 w-4" />
              </Button>
            </div>


            <Button variant="outline" className="w-full" disabled>

              <Download className="h-4 w-4 mr-2" /> Download PDF (WIP)

            </Button>

          </CardContent>

        </Card>



        {/* Details Card */}

        <Card className="lg:col-span-2 bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">

          <CardHeader>

            <CardTitle className="text-xl text-brand-primary">Quote Information</CardTitle>

          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-4">

            <div className="flex flex-col">

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Name</p>

              <p className="text-lg">{quote.client_name}</p>

            </div>

            <div className="flex flex-col">

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Email</p>

              <p className="text-lg">{quote.client_email}</p>

            </div>

            <div className="flex flex-col">

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Event Date</p>

              <p className="text-lg">{quote.event_date}</p>

            </div>

            <div className="flex flex-col">

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prepared By</p>

              <p className="text-lg">{quote.prepared_by}</p>

            </div>

            <div className="flex flex-col">

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount (Active)</p>

              <p className="text-lg font-bold">{displayVersion.currencySymbol}{total_amount.toFixed(2)}</p>

            </div>

            <div className="flex flex-col">

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quote Theme (Active)</p>

              <p className="text-lg">{theme === 'black-gold' ? 'Black & Gold' : 'Default (White/Pink)'}</p>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* Version History Card */}

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">

        <CardHeader>

          <CardTitle className="text-xl text-brand-primary">Version History</CardTitle>

        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {versions.map((version) => (

              <div

                key={version.versionId}

                className={cn(

                  "p-4 rounded-lg border transition-all duration-300 cursor-pointer",

                  version.is_active

                    ? "border-brand-primary ring-2 ring-brand-primary/50 bg-brand-secondary/20 dark:bg-brand-dark/50"

                    : "border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/30"

                )}

                onClick={() => handleActivateVersion(version.versionId)}

              >

                <div className="flex justify-between items-center mb-2">

                  <h4 className="font-semibold text-lg text-brand-dark dark:text-brand-light">{version.versionName}</h4>

                  {version.is_active && <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>}

                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">

                  Created: {format(new Date(version.created_at), 'PPP')}

                </p>

                <p className="text-sm font-bold mt-1 text-brand-primary">

                  Total: {version.currencySymbol}{version.total_amount.toFixed(2)}

                </p>

                <div className="mt-2 flex items-center gap-2 text-sm">

                  {version.accepted_at ? (

                    <span className="text-green-600 dark:text-green-400 flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Accepted</span>

                  ) : version.rejected_at ? (

                    <span className="text-red-600 dark:text-red-400 flex items-center"><XCircle className="h-4 w-4 mr-1" /> Rejected</span>

                  ) : (

                    <span className="text-gray-500 dark:text-gray-400">Status: {version.status}</span>

                  )}

                </div>

                {!version.is_active && (

                  <Button

                    variant="link"

                    size="sm"

                    onClick={(e) => { e.stopPropagation(); handleActivateVersion(version.versionId); }}

                    disabled={isActivating}

                    className="p-0 h-auto mt-2 text-brand-primary"

                  >

                    {isActivating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : 'Set as Active'}

                  </Button>

                )}

              </div>

            ))}

          </div>

        </CardContent>

      </Card>


      {/* Preview Section */}

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle className="text-xl text-brand-primary">Live Preview (Active Version: {displayVersion.versionId})</CardTitle>

          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>

            <DialogTrigger asChild>

              <Button variant="outline">

                <Eye className="h-4 w-4 mr-2" /> Full Screen Preview

              </Button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] p-0 bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">

              <DialogHeader className="p-6 pb-0">

                <DialogTitle className="text-brand-primary text-2xl">Quote Preview</DialogTitle>

              </DialogHeader>

              <ScrollArea className="h-[calc(90vh-70px)]">

                {quote ? (

                  <QuoteDisplay quote={quote as Quote} />

                ) : (

                  <div className="p-8 text-center">No preview data available.</div>

                )}

              </ScrollArea>

            </DialogContent>

          </Dialog>

        </CardHeader>

        <CardContent>

          <div className="border rounded-lg overflow-hidden">

            <div className="scale-[0.7] origin-top-left w-[142%] h-[142%]">

              {/* Pass the entire quote object, QuoteDisplay will find the active version */}

              <QuoteDisplay quote={quote as Quote} />

            </div>

          </div>

        </CardContent>

      </Card>


      {quote && (

        <QuoteSendingModal

          isOpen={isSendingModalOpen}

          onClose={() => setIsSendingModal(false)}

          quote={quote as Quote}

          onQuoteSent={handleQuoteSent}

        />

      )}

    </div>

  );

};



export default AdminQuoteDetailsPage;