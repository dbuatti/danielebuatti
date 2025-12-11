"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Eye, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Quote } from '@/types/quote';
import { ScrollArea } from '@/components/ui/scroll-area';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface QuoteSendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  onQuoteSent: (slug: string) => void;
}

const QuoteSendingModal: React.FC<QuoteSendingModalProps> = ({
  isOpen,
  onClose,
  quote,
  onQuoteSent,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(quote.client_email);
  const [emailSubject, setEmailSubject] = useState(`Quote Proposal: ${quote.event_title}`);
  const [htmlBody, setHtmlBody] = useState('');
  const [isHtmlLoading, setIsHtmlLoading] = useState(true);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [, copy] = useCopyToClipboard(); // Fix 1: Removed unused copiedText

  // Function to generate the HTML body (simplified client-side rendering)
  const generateHtmlBody = useCallback(() => {
    // Since we cannot render React components to a string easily on the client,
    // we provide a simple HTML wrapper that links to the public quote page.
    // The full QuoteDisplay component is shown in the modal's preview tab.
    const quoteUrl = `${window.location.origin}/quotes/${quote.slug}`;
    
    const html = `
      <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #DB4CA3; text-align: center; margin-bottom: 20px;">Your Quote Proposal is Ready!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Dear ${quote.client_name},</p>
          <p style="font-size: 16px; line-height: 1.6;">Please find attached your personalized quote proposal for <strong>${quote.event_title}</strong> on ${quote.event_date}.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${quoteUrl}" style="background-color: #DB4CA3; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">
              View & Accept Quote
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">The total proposed amount is <strong>${quote.details.currencySymbol}${quote.total_amount.toFixed(2)}</strong>. You can review the full details and select any optional add-ons directly on the quote page.</p>
          
          <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
            If you have any questions, please reply to this email.
          </p>
        </div>
      </div>
    `;
    
    setHtmlBody(html);
    setIsHtmlLoading(false);
  }, [quote]);

  useEffect(() => {
    if (isOpen) {
      setRecipientEmail(quote.client_email);
      setEmailSubject(`Quote Proposal: ${quote.event_title}`);
      generateHtmlBody();
    }
  }, [isOpen, quote, generateHtmlBody]);

  const handleSendQuote = async () => {
    if (!recipientEmail || !emailSubject || !htmlBody) {
      showError('Email content is incomplete.');
      return;
    }

    setIsSending(true);
    const toastId = showLoading('Dispatching quote email...');

    try {
      // Invoke the new Edge Function to send the email and update status
      const { error: invokeError } = await supabase.functions.invoke('send-quote', {
        body: {
          quoteId: quote.id,
          recipientEmail: recipientEmail,
          subject: emailSubject,
          htmlBody: htmlBody,
        },
      });

      if (invokeError) throw invokeError;

      showSuccess('Quote sent successfully!', { id: toastId });
      onQuoteSent(quote.slug); // Notify parent component
      onClose();
    } catch (err: any) {
      console.error('Error sending quote:', err);
      showError(`Failed to send quote: ${err.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      setIsSending(false);
      dismissToast(toastId);
    }
  };
  
  const handleCopyLink = () => {
    const quoteUrl = `${window.location.origin}/quotes/${quote.slug}`;
    copy(quoteUrl);
    showSuccess('Quote link copied to clipboard!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] p-0 bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-brand-primary text-2xl">Send Quote: {quote.event_title}</DialogTitle>
          <DialogDescription className="text-brand-dark/70 dark:text-brand-light/70">
            Final confirmation before sending the quote to the client. The quote status will be updated to 'Sent'.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(90vh-150px)] overflow-hidden">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 p-6 space-y-6 border-r border-brand-secondary/50 overflow-y-auto">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-brand-primary">Recipient Details</h3>
              <Input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Client Email"
              />
              <Input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email Subject"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-brand-primary">Quote Link</h3>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/quotes/${quote.slug}`}
                  className="flex-grow"
                />
                <Button type="button" variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-brand-primary">Email Content (HTML Preview)</h3>
              <Textarea
                readOnly
                value={htmlBody}
                rows={10}
                className="text-xs font-mono h-48"
              />
            </div>

            <Button
              type="button"
              onClick={handleSendQuote}
              disabled={isSending || isHtmlLoading || !recipientEmail || !emailSubject || !htmlBody}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> SEND TO CLIENT
                </>
              )}
            </Button>
          </div>
          
          {/* Right Column: Live Quote Preview */}
          <div className="lg:col-span-2 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-brand-primary">Live Quote Preview (Client View)</h3>
              <Button variant="outline" onClick={() => setIsFullPreviewOpen(true)}>
                <Eye className="h-4 w-4 mr-2" /> Full Screen
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-50px)] border rounded-lg">
              {isHtmlLoading ? (
                <div className="flex justify-center items-center h-full min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                </div>
              ) : (
                <QuoteDisplay quote={quote} isClientView={false} />
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
      
      {/* Full Screen Preview Modal */}
      <Dialog open={isFullPreviewOpen} onOpenChange={setIsFullPreviewOpen}>
        <DialogContent className="sm:max-w-[95vw] w-[95vw] h-[95vh] p-0 bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-brand-primary text-2xl">Full Screen Quote Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(95vh-70px)]">
            <QuoteDisplay quote={quote} isClientView={false} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default QuoteSendingModal;