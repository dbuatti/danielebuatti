"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Quote, QuoteItem } from '@/types/quote';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import DynamicImage from '@/components/DynamicImage'; // Import DynamicImage

// Define the structure for the data fetched from Supabase (which includes the JSONB details)
interface QuoteData extends Omit<Quote, 'details'> {
  details: {
    depositPercentage: number;
    paymentTerms: string;
    bankDetails: {
      bsb: string;
      acc: string;
    };
    addOns: QuoteItem[];
    compulsoryItems: QuoteItem[];
    currencySymbol: string;
    eventTime: string;
    theme: 'default' | 'black-gold';
    headerImageUrl: string;
    preparationNotes: string;
    client_selected_add_ons?: QuoteItem[];
  };
}

const DynamicQuotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

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
          // Map the database structure to the client-side QuoteData interface
          const quoteData: QuoteData = {
            ...data,
            total_amount: parseFloat(data.total_amount),
            details: data.details as QuoteData['details'],
          };
          setQuote(quoteData);
          
          // If already accepted, initialize selectedAddOns from client_selected_add_ons
          if (quoteData.accepted_at && quoteData.details.client_selected_add_ons) {
            setSelectedAddOns(quoteData.details.client_selected_add_ons.map(item => item.id));
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
  }, [slug]);

  const handleAcceptQuote = async () => {
    if (!quote) return;

    setIsAccepting(true);
    const toastId = showLoading('Accepting quote...');

    try {
      // 1. Calculate final total based on selected add-ons
      const finalAddOns = quote.details.addOns.filter(item => selectedAddOns.includes(item.id));
      
      // Ensure compulsoryTotal is calculated here for the payload
      const compulsoryTotal = quote.details.compulsoryItems.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0) || 0;
      const addOnTotal = finalAddOns.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
      const finalTotal = compulsoryTotal + addOnTotal;

      // 2. Prepare data for Edge Function
      const acceptancePayload = {
        quoteId: quote.id,
        clientName: quote.client_name,
        clientEmail: quote.client_email,
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
  };

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

  const handleAddOnChange = (itemId: string, checked: boolean) => {
    setSelectedAddOns(prev => 
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
    </div>;
  }

  if (error || !quote) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-xl">Error: {error || 'Quote data missing.'}</div>;
  }

  const { details, accepted_at, rejected_at } = quote;
  const { compulsoryItems, addOns: optionalAddOns, currencySymbol, depositPercentage, paymentTerms, bankDetails, eventTime, theme, headerImageUrl, preparationNotes } = details;
  
  const isAccepted = !!accepted_at;
  const isRejected = !!rejected_at;
  const isFinalized = isAccepted || isRejected;
  
  const symbol = currencySymbol || '$';

  // Calculate compulsory total once
  const compulsoryTotal = compulsoryItems?.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0) || 0;

  // Calculate totals based on current selections (or accepted total if finalized)
  let selectedAddOnsData: QuoteItem[];
  let subtotal: number;
  
  if (isAccepted && details.client_selected_add_ons) {
    // Use the finalized data if accepted
    selectedAddOnsData = details.client_selected_add_ons;
    subtotal = quote.total_amount;
  } else {
    // Calculate based on current selection if pending or rejected
    selectedAddOnsData = optionalAddOns.filter(item => selectedAddOns.includes(item.id));
    const addOnTotal = selectedAddOnsData.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
    subtotal = compulsoryTotal + addOnTotal;
  }

  const depositAmount = subtotal * (depositPercentage / 100);
  
  const formatCurrency = (amount: number) => `${symbol}${amount.toFixed(2)}`;
  const calculateItemTotal = (item: QuoteItem) => item.price * item.quantity;

  // Theme setup
  const isBlackGoldTheme = theme === 'black-gold';
  const themeClasses = isBlackGoldTheme
    ? {
        // Black & Gold Theme (Premium Dark)
        bg: 'bg-brand-dark',
        cardBg: 'bg-brand-dark-alt',
        text: 'text-brand-light',
        primary: 'text-brand-yellow', // Gold
        secondary: 'text-brand-light/70',
        border: 'border-brand-yellow/50',
        separator: 'bg-brand-yellow',
        headerText: 'text-brand-light',
        acceptButton: 'bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90',
        rejectButton: 'bg-red-600 text-white hover:bg-red-700',
        totalBoxBg: 'bg-brand-dark',
        totalBoxText: 'text-brand-yellow',
        acceptBoxBorder: 'border-brand-yellow/50',
        checkbox: 'border-brand-yellow data-[state=checked]:bg-brand-yellow data-[state=checked]:text-brand-dark',
        contentImageBorder: 'border-brand-yellow/50',
      }
    : {
        // Default Theme (Premium Light/Pink)
        bg: 'bg-brand-light',
        cardBg: 'bg-white',
        text: 'text-brand-dark',
        primary: 'text-brand-primary', // Pink
        secondary: 'text-brand-dark/70',
        border: 'border-brand-primary/50',
        separator: 'bg-brand-primary',
        headerText: 'text-brand-dark',
        acceptButton: 'bg-brand-primary text-white hover:bg-brand-primary/90',
        rejectButton: 'bg-red-600 text-white hover:bg-red-700',
        totalBoxBg: 'bg-brand-secondary/20',
        totalBoxText: 'text-brand-primary',
        acceptBoxBorder: 'border-brand-primary/50',
        checkbox: 'border-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white',
        contentImageBorder: 'border-brand-primary/50',
      };
      
  const eventDateFormatted = quote.event_date ? format(new Date(quote.event_date), 'EEEE dd MMMM yyyy') : 'TBD';
  const eventDateShort = quote.event_date ? format(new Date(quote.event_date), 'EEEE dd MMMM yyyy') : 'the event date';


  return (
    <ScrollArea className={`min-h-screen ${themeClasses.bg}`}>
      <div className={`max-w-4xl mx-auto p-4 sm:p-8`}>
        <Card className={`shadow-2xl rounded-lg ${themeClasses.cardBg} ${themeClasses.text} border-2 ${themeClasses.border}`}>
          
          {/* Header Image */}
          {headerImageUrl && (
            <div className="mb-6">
              <DynamicImage 
                src={headerImageUrl} 
                alt="Quote Header" 
                className="w-full h-64 object-cover rounded-t-lg shadow-md"
                width={800}
                height={256}
              />
            </div>
          )}

          <CardHeader className="pb-4 text-center px-6">
            <CardTitle className={`text-5xl font-extrabold ${themeClasses.primary} leading-tight`}>{quote.event_title}</CardTitle>
            
            <div className="space-y-1 pt-4 text-lg">
              <p className={`${themeClasses.headerText}`}>Prepared for: <span className={`font-semibold ${themeClasses.primary}`}>{quote.client_name}</span></p>
              <p className={`${themeClasses.headerText}`}>Date of Event: <span className="font-semibold">{eventDateFormatted}</span></p>
              {eventTime && <p className={`${themeClasses.headerText}`}>Time: <span className="font-semibold">{eventTime}</span></p>}
              <p className={`${themeClasses.headerText}`}>Location: <span className="font-semibold">{quote.event_location}</span></p>
              <p className={`${themeClasses.headerText}`}>Prepared by: <span className="font-semibold">{quote.prepared_by}</span></p>
            </div>

            {/* Custom Separator Line */}
            <div className="flex justify-center pt-4">
              <div className={`w-1/3 h-0.5 ${themeClasses.separator}`}></div>
            </div>
            
            {isFinalized && (
              <div className={`mt-4 p-3 rounded-md font-semibold flex items-center justify-center space-x-2 ${isAccepted ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                {isAccepted ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span>This quote was {isAccepted ? 'ACCEPTED' : 'REJECTED'} on {format(new Date(accepted_at || rejected_at!), 'PPP')}.</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-8 px-6">
            
            {/* Main Content / Description Block (Using preparationNotes) */}
            {preparationNotes && (
              <section className="text-center mb-10">
                <p className={`text-xl font-extrabold ${themeClasses.text} max-w-3xl mx-auto whitespace-pre-wrap`}>
                  {preparationNotes}
                </p>
              </section>
            )}
            
            {/* Removed Content Images Section */}

            {/* Quote Breakdown */}
            <section className="space-y-6">
              <h2 className={`text-2xl font-bold text-center ${themeClasses.primary}`}>Service Components</h2>

              {/* Compulsory Items */}
              {compulsoryItems.length > 0 && (
                <div className="space-y-4 border-b border-current/20 pb-4">
                  {compulsoryItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <p className={`${themeClasses.text} flex items-start text-lg`}>
                          <span className={`mr-2 ${themeClasses.primary} text-xl leading-none`}>&bull;</span>
                          <span className="font-bold">{item.name}:</span>
                          {item.description && <span className={`text-base ml-2 ${themeClasses.secondary}`}>{item.description}</span>}
                        </p>
                      </div>
                      <p className={`font-bold text-lg ${themeClasses.primary}`}>{formatCurrency(calculateItemTotal(item))}</p>
                    </div>
                  ))}
                  
                  {/* All-Inclusive Total (Based on design) */}
                  <div className="text-center pt-4">
                    <p className={`text-3xl font-extrabold ${themeClasses.primary}`}>
                      All-Inclusive Engagement Fee: {formatCurrency(compulsoryTotal)}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Optional Add-Ons Section (Only show if pending or if accepted and add-ons were selected) */}
            {optionalAddOns.length > 0 && (!isFinalized || (isAccepted && selectedAddOnsData.length > 0)) && (
              <div className={`mt-8 p-6 rounded-lg text-center border-2 ${themeClasses.acceptBoxBorder}`}>
                <h2 className={`text-2xl font-extrabold mb-6 ${themeClasses.text}`}>Optional Add-Ons</h2>
                
                <div className="space-y-4 pt-4">
                  {optionalAddOns.map((item) => {
                    // Determine if this item was selected (either now, or when accepted)
                    const isSelected = selectedAddOns.includes(item.id);
                    
                    // If finalized and not selected, skip rendering unless we want to show all options
                    if (isFinalized && !isSelected) return null;

                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-md transition-colors hover:bg-current/5">
                        <div className="flex items-center space-x-3 flex-1">
                          <Checkbox
                            id={`addon-${item.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => handleAddOnChange(item.id, !!checked)}
                            disabled={isFinalized}
                            className={themeClasses.checkbox}
                          />
                          <Label htmlFor={`addon-${item.id}`} className="cursor-pointer flex-1 text-left">
                            <p className={`${themeClasses.text} flex items-start text-lg`}>
                              <span className="font-bold">{item.name}:</span>
                              {item.description && <span className={`text-base ml-2 ${themeClasses.secondary}`}>{item.description}</span>}
                            </p>
                            <p className={`text-sm ml-0 ${themeClasses.secondary}`}>Unit Cost: {formatCurrency(item.price)}</p>
                          </Label>
                        </div>
                        <p className={`font-semibold ${themeClasses.primary}`}>{formatCurrency(calculateItemTotal(item))}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Important Booking Details Section */}
            <section className={`mt-12 p-6 rounded-lg ${isBlackGoldTheme ? 'bg-brand-dark' : 'bg-brand-secondary/10'} border border-current/20`}>
              <h2 className={`text-2xl font-extrabold text-center mb-4 ${themeClasses.primary}`}>Important Booking Details</h2>
              
              <ul className={`space-y-3 text-base ${themeClasses.text} list-disc list-inside pl-4`}>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>Deposit:</span> A non-refundable <span className="font-bold">{depositPercentage}% deposit ({formatCurrency(depositAmount)})</span> is required immediately to formally secure {eventDateShort}.
                </li>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>Balance:</span> The remaining balance is due 7 days prior to the event.
                </li>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>Payment:</span> Bank Details: BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}
                </li>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>Terms:</span> {paymentTerms}
                </li>
              </ul>
            </section>
            
            {/* Final Total Cost Box */}
            <div className={`mt-8 p-6 rounded-lg text-center ${themeClasses.totalBoxBg} border-2 ${themeClasses.acceptBoxBorder}`}>
              <h3 className={`text-4xl font-extrabold ${themeClasses.totalBoxText}`}>
                Final Total Cost: {formatCurrency(subtotal)}
              </h3>
              <p className={`text-sm ${themeClasses.secondary}`}>
                This includes your selected add-ons and the base quote amount.
              </p>
            </div>

            {/* Acceptance Buttons */}
            <div className={`mt-8 p-6 rounded-lg text-center border-2 ${themeClasses.acceptBoxBorder}`}>
              <h2 className={`text-2xl font-extrabold mb-6 ${themeClasses.text}`}>Accept Your Quote</h2>
              
              <div className="mt-8 flex justify-center space-x-4">
                {!isFinalized ? (
                  <>
                    <Button 
                      variant="destructive" 
                      onClick={handleRejectQuote} 
                      disabled={isAccepting}
                      className={themeClasses.rejectButton}
                    >
                      Reject Quote
                    </Button>
                    <Button 
                      onClick={handleAcceptQuote} 
                      disabled={isAccepting}
                      className={themeClasses.acceptButton}
                    >
                      {isAccepting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Accept Quote
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => navigate('/')} className={themeClasses.acceptButton}>
                    Back to Home
                  </Button>
                )}
              </div>
            </div>

          </CardContent>

          <CardFooter className="flex justify-center pt-6 border-t border-current/20">
            <p className={`text-xs italic ${themeClasses.secondary}`}>
              Quote prepared by {quote.prepared_by} on {format(new Date(quote.created_at), 'PPP')}.
            </p>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default DynamicQuotePage;