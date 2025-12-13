"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Quote, QuoteItem } from '@/types/quote';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SeoMetadata from '@/components/SeoMetadata'; // Import SeoMetadata

// Define favicon paths
const BRAND_FAVICON_PATH = '/blue-pink-ontrans.png?v=1';
const GOLD_FAVICON_PATH = '/gold-36.png';

// Define the structure for the data fetched from Supabase (which includes the JSONB details)
interface QuoteData extends Omit<Quote, 'details'> {
  details: {
    depositPercentage: number;
    paymentTerms: string;
    bankDetails: {
      bsb: string;
      acc: string;
    };
    addOns: QuoteItem[]; // Original optional items list
    compulsoryItems: QuoteItem[];
    currencySymbol: string;
    eventTime: string;
    theme: 'default' | 'black-gold';
    headerImageUrl: string;
    headerImagePosition?: string;
    preparationNotes: string;
    client_selected_add_ons?: QuoteItem[]; // Final selected items list
  };
}

// Define schema for acceptance form
const acceptanceSchema = z.object({
  clientName: z.string().min(1, { message: "Your name is required for acceptance." }),
  clientEmail: z.string().email({ message: "A valid email is required for acceptance." }),
});

const DynamicQuotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  // State to hold the mutable quantities for optional add-ons (only used if not finalized)
  const [currentOptionalAddOns, setCurrentOptionalAddOns] = useState<QuoteItem[]>([]); 
  
  // Initialize acceptance form (will be reset once quote data is loaded)
  const acceptanceForm = useForm<z.infer<typeof acceptanceSchema>>({
    resolver: zodResolver(acceptanceSchema),
    defaultValues: {
        clientName: '',
        clientEmail: '',
    },
  });

  // --- Favicon Management ---
  useEffect(() => {
    if (!quote) return;

    const isBlackGoldTheme = quote.details.theme === 'black-gold';
    const faviconPath = isBlackGoldTheme ? GOLD_FAVICON_PATH : BRAND_FAVICON_PATH;

    const updateFavicon = (rel: string, path: string) => {
      let link: HTMLLinkElement | null = document.querySelector(`link[rel*='${rel}']`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      
      // Only update if the path is different to avoid unnecessary DOM manipulation
      if (link.getAttribute('href') !== path) {
          link.href = path;
      }
    };

    updateFavicon('icon', faviconPath);
    updateFavicon('shortcut icon', faviconPath);
    
  }, [quote]);

  useEffect(() => {
    if (!slug) {
      setError('Quote slug is missing.');
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      const toastId = showLoading('Loading quote...');
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        if (data) {
          const quoteData: QuoteData = {
            ...data,
            total_amount: parseFloat(data.total_amount),
            details: data.details as QuoteData['details'],
          };
          setQuote(quoteData);
          
          // Reset acceptance form with client data
          acceptanceForm.reset({
            clientName: quoteData.client_name,
            clientEmail: quoteData.client_email,
          });

          // Initialize mutable state for quantity controls
          if (quoteData.accepted_at && quoteData.details.client_selected_add_ons) {
            // If accepted, use the final selected list for display (though controls will be disabled)
            setCurrentOptionalAddOns(quoteData.details.client_selected_add_ons);
          } else {
            // If pending/rejected, use the original optional list, ensuring quantity is initialized
            setCurrentOptionalAddOns(quoteData.details.addOns.map(item => ({
                ...item,
                quantity: item.quantity || 0 // Default to 0 if not set
            })));
          }
        } else {
          setError('Quote not found.');
        }
      } catch (err: any) {
        console.error('Error fetching quote:', err);
        setError(err.message || 'Failed to load quote.');
      } finally {
        setLoading(false);
        dismissToast(toastId);
      }
    };

    fetchQuote();
  }, [slug, acceptanceForm]);

  const handleQuantityChange = (itemId: string, delta: number) => {
    if (isFinalized) return;

    setCurrentOptionalAddOns(prev => 
        prev.map(item => {
            if (item.id === itemId) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        })
    );
  };

  const handleAcceptQuote = acceptanceForm.handleSubmit(async (values) => {
    if (!quote) return;

    setIsAccepting(true);
    const toastId = showLoading('Accepting quote...');

    try {
      // 1. Calculate final total based on selected add-ons
      const finalAddOns = currentOptionalAddOns.filter(item => item.quantity > 0);
      
      // Ensure compulsoryTotal is calculated here for the payload
      const compulsoryTotal = quote.details.compulsoryItems.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0) || 0;
      const addOnTotal = finalAddOns.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
      const finalTotal = compulsoryTotal + addOnTotal;

      // 2. Prepare data for Edge Function
      const acceptancePayload = {
        quoteId: quote.id,
        clientName: values.clientName, // Use form value
        clientEmail: values.clientEmail, // Use form value
        finalTotal: finalTotal,
        finalSelectedAddOns: finalAddOns,
      };

      // 3. Invoke the Edge Function to update the database and send notification
      const { error: invokeError } = await supabase.functions.invoke('submit-generic-quote-acceptance', {
        body: acceptancePayload,
      });

      if (invokeError) throw invokeError;

      showSuccess('Quote accepted successfully! Redirecting...', { id: toastId });
      
      // Redirect to a confirmation page after successful acceptance
      navigate('/live-piano-services/quote-confirmation');
      
    } catch (err: any) {
      console.error('Error accepting quote:', err);
      showError(`Failed to accept quote: ${err.message || 'Unknown error'}`, { id: toastId });
    } finally {
      setIsAccepting(false);
      dismissToast(toastId);
    }
  });

  const handleRejectQuote = async () => {
    if (!quote) return;

    const toastId = showLoading('Rejecting quote...');

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          rejected_at: new Date().toISOString(),
          accepted_at: null,
        })
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess('Quote rejected.', { id: toastId });
      setQuote(prev => prev ? { ...prev, rejected_at: new Date().toISOString() } : null);
    } catch (err: any) {
      console.error('Error rejecting quote:', err);
      showError(`Failed to reject quote: ${err.message || 'Unknown error'}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
    </div>;
  }

  if (error || !quote) {
    const themeClasses = quote?.details.theme === 'black-gold' 
      ? { bg: 'bg-brand-dark', text: 'text-brand-light' } 
      : { bg: 'bg-brand-light', text: 'text-brand-dark' };
      
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${themeClasses.bg} ${themeClasses.text} p-8`}>
        <XCircle className="h-12 w-12 mb-4 text-red-500" />
        <h1 className="text-3xl font-bold mb-2">Quote Not Found</h1>
        <p className="text-lg text-center text-brand-dark/70 dark:text-brand-light/70">
          The quote you are looking for (Slug: {slug}) could not be loaded.
        </p>
        {error && <p className="text-sm mt-4 text-red-600 dark:text-red-400">Error details: {error}</p>}
        <Button asChild className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  const isAccepted = !!quote.accepted_at;
  const isRejected = !!quote.rejected_at;
  const isFinalized = isAccepted || isRejected;
  
  const { depositPercentage, theme } = quote.details;

  // Theme setup (copied from QuoteDisplay for the wrapper elements)
  const isBlackGoldTheme = theme === 'black-gold';
  const themeClasses = isBlackGoldTheme
    ? {
        bg: 'bg-brand-dark',
        cardBg: 'bg-brand-dark-alt',
        text: 'text-brand-light',
        primary: 'text-brand-yellow', // Gold
        secondary: 'text-brand-light/70',
        border: 'border-brand-yellow/50',
        acceptButton: 'bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90',
        rejectButton: 'bg-red-600 text-white hover:bg-red-700',
        acceptBoxBg: 'bg-brand-dark',
        inputBg: 'bg-brand-dark',
        inputBorder: 'border-brand-yellow/30',
        statusAcceptedBg: 'bg-green-900/50',
        statusAcceptedText: 'text-green-400',
        statusRejectedBg: 'bg-red-900/50',
        statusRejectedText: 'text-red-400',
      }
    : {
        bg: 'bg-brand-light',
        cardBg: 'bg-white',
        text: 'text-brand-dark',
        primary: 'text-brand-primary',
        secondary: 'text-brand-dark/70',
        border: 'border-brand-primary/50',
        acceptButton: 'bg-brand-primary text-white hover:bg-brand-primary/90',
        rejectButton: 'bg-red-600 text-white hover:bg-red-700',
        acceptBoxBg: 'bg-brand-secondary/10',
        inputBg: 'bg-brand-light',
        inputBorder: 'border-brand-secondary/50',
        statusAcceptedBg: 'bg-green-100',
        statusAcceptedText: 'text-green-700',
        statusRejectedBg: 'bg-red-100',
        statusRejectedText: 'text-red-700',
      };
      
  // SEO Metadata for Quote Page
  const quoteTitle = `${quote.invoice_type} for ${quote.client_name} - ${quote.event_title}`;
  const quoteDescription = `Review your personalized quote proposal for ${quote.event_title} on ${quote.event_date}. Total: ${quote.details.currencySymbol}${quote.total_amount.toFixed(2)}.`;
  const quoteImage = isBlackGoldTheme ? `${window.location.origin}/blackgoldquoteimage1.jpg` : `${window.location.origin}/whitepinkquoteimage1.jpeg`;
  const quoteUrl = `${window.location.origin}/quotes/${quote.slug}`;

  return (
    <ScrollArea className={`min-h-screen ${themeClasses.bg}`}>
      <SeoMetadata 
        title={quoteTitle}
        description={quoteDescription}
        image={quoteImage}
        url={quoteUrl}
      />
      <div className={`max-w-6xl mx-auto p-4 sm:p-8`}>
        <Card className={`shadow-2xl rounded-lg ${themeClasses.cardBg} ${themeClasses.text} border-2 ${themeClasses.border} p-0`}>
          
          {/* Use QuoteDisplay for the main content area */}
          <QuoteDisplay 
            quote={quote as Quote} // Cast to Quote interface
            isClientView={true}
            onQuantityChange={handleQuantityChange}
            mutableAddOns={currentOptionalAddOns}
          />

          {/* Acceptance Form/Buttons Wrapper */}
          <CardFooter className={`p-8 pt-12 flex flex-col space-y-8 border-t border-current/20 ${themeClasses.cardBg}`}>
            
            <div className={`p-8 rounded-xl text-center shadow-2xl border ${themeClasses.border} ${themeClasses.acceptBoxBg}`}>
              <h2 className={`text-3xl font-extrabold mb-8 ${themeClasses.primary}`}>
                {isFinalized ? 'Booking Status' : 'Accept Your Quote'}
              </h2>
              
              <Form {...acceptanceForm}>
                <form onSubmit={handleAcceptQuote} className="space-y-6">
                  {!isFinalized ? (
                    <div className="space-y-4 max-w-md mx-auto">
                      <FormField
                        control={acceptanceForm.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={themeClasses.text}>Your Full Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your name" 
                                {...field} 
                                className={`
                                  ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.inputBorder} 
                                  placeholder:${themeClasses.secondary} focus-visible:ring-brand-primary
                                `}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={acceptanceForm.control}
                        name="clientEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={themeClasses.text}>Your Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="Enter your email" 
                                {...field} 
                                className={`
                                  ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.inputBorder} 
                                  placeholder:${themeClasses.secondary} focus-visible:ring-brand-primary
                                `}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <p className={`text-sm ${themeClasses.secondary} pt-2`}>
                        By clicking "Accept Quote", you agree to the terms and confirm your booking with a {depositPercentage}% deposit.
                      </p>
                    </div>
                  ) : (
                    // Display status message if finalized
                    <div className={`mt-4 p-4 rounded-md font-semibold flex flex-col sm:flex-row items-center justify-center space-x-2 ${isAccepted ? `${themeClasses.statusAcceptedBg} ${themeClasses.statusAcceptedText}` : `${themeClasses.statusRejectedBg} ${themeClasses.statusRejectedText}`}`}>
                        {isAccepted ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span className="mt-2 sm:mt-0">This quote was {isAccepted ? 'ACCEPTED' : 'REJECTED'} on {format(new Date(quote.accepted_at || quote.rejected_at!), 'PPP')}.</span>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {!isFinalized && (
                      <>
                        <Button 
                          type="button"
                          variant="destructive" 
                          onClick={handleRejectQuote} 
                          disabled={isAccepting}
                          className={themeClasses.rejectButton}
                        >
                          Reject Quote
                        </Button>
                        <Button 
                          type="submit"
                          disabled={isAccepting}
                          className={themeClasses.acceptButton}
                        >
                          {isAccepting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                          Accept Quote
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </Form>
            </div>
            
            <p className={`text-xs italic ${themeClasses.secondary} text-center`}>
              Quote prepared by {quote.prepared_by} on {format(new Date(quote.created_at), 'PPP')}.
            </p>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default DynamicQuotePage;