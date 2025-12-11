"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns'; // Ensure format is imported
import { Quote, QuoteItem } from '@/types/quote'; // Import centralized interfaces
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
    eventTime?: string;
    theme: 'default' | 'livePiano';
    headerImageUrl?: string;
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
          
          // If the quote is already accepted, we should load the accepted items.
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
      
      const compulsoryTotal = quote.details.compulsoryItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const addOnTotal = finalAddOns.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const finalTotal = compulsoryTotal + addOnTotal;

      // 2. Update the invoice record in Supabase
      const { error } = await supabase
        .from('invoices')
        .update({
          accepted_at: new Date().toISOString(),
          rejected_at: null,
          total_amount: finalTotal,
          // Store the client's selected add-ons in the details JSONB
          details: {
            ...quote.details,
            client_selected_add_ons: finalAddOns,
          }
        })
        .eq('id', quote.id);

      if (error) throw error;

      showSuccess('Quote accepted successfully! Redirecting...', { id: toastId });
      // Refresh data or redirect to a confirmation page
      setQuote(prev => prev ? { ...prev, accepted_at: new Date().toISOString(), total_amount: finalTotal } : null);
      
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
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (error || !quote) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-xl">Error: {error || 'Quote data missing.'}</div>;
  }

  const { details, accepted_at, rejected_at } = quote;
  const { compulsoryItems, addOns: optionalAddOns, currencySymbol, depositPercentage, paymentTerms, bankDetails, eventTime, theme, headerImageUrl } = details;
  
  const isAccepted = !!accepted_at;
  const isRejected = !!rejected_at;
  const isFinalized = isAccepted || isRejected;
  
  const symbol = currencySymbol || '$';

  // Calculate totals based on current selections
  const selectedAddOnsData = optionalAddOns.filter(item => selectedAddOns.includes(item.id));
  
  const compulsoryTotal = compulsoryItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const addOnTotal = selectedAddOnsData.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = compulsoryTotal + addOnTotal;
  const depositAmount = subtotal * (depositPercentage / 100);
  
  const formatCurrency = (amount: number) => `${symbol}${amount.toFixed(2)}`;
  const calculateItemTotal = (item: QuoteItem) => item.price * item.quantity;

  // Theme setup
  const isLivePianoTheme = theme === 'livePiano';
  const themeClasses = isLivePianoTheme
    ? {
        // Gold/Black Theme (Live Piano)
        bg: 'bg-gray-900',
        cardBg: 'bg-gray-800',
        text: 'text-gray-100',
        primary: 'text-amber-400', // Gold color
        secondary: 'text-gray-400',
        border: 'border-amber-400/50',
        separator: 'bg-amber-400 h-0.5',
        headerText: 'text-gray-100',
        acceptButton: 'bg-amber-400 text-gray-900 hover:bg-amber-500',
        rejectButton: 'bg-gray-700 text-gray-100 hover:bg-gray-600',
        totalBoxBg: 'bg-gray-700',
        totalBoxText: 'text-amber-400',
        acceptBoxBorder: 'border-amber-400/50',
      }
    : {
        // White/Pink Theme (Default)
        bg: 'bg-gray-50',
        cardBg: 'bg-white',
        text: 'text-gray-800',
        primary: 'text-pink-600', // Corrected pink color
        secondary: 'text-gray-500',
        border: 'border-pink-600/50',
        separator: 'bg-pink-600 h-0.5',
        headerText: 'text-gray-800',
        acceptButton: 'bg-pink-600 text-white hover:bg-pink-700',
        rejectButton: 'bg-red-600 text-white hover:bg-red-700',
        totalBoxBg: 'bg-pink-50', // Light pink background
        totalBoxText: 'text-pink-600',
        acceptBoxBorder: 'border-pink-600/50',
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
              <img 
                src={headerImageUrl} 
                alt="Quote Header" 
                className="w-full h-64 object-cover rounded-t-lg shadow-md"
              />
            </div>
          )}

          {/* Logo Placeholder (Based on design images) */}
          <div className="text-center mb-8">
            {/* Placeholder for logo/branding */}
            <div className={`text-4xl font-serif font-bold ${themeClasses.primary}`}>
              {isLivePianoTheme ? 'Live Piano Services' : 'Daniele Buatti'}
            </div>
          </div>

          <CardHeader className="pb-4 text-center">
            <CardTitle className={`text-4xl font-extrabold ${themeClasses.primary}`}>{quote.event_title}</CardTitle>
            
            <div className="space-y-1 pt-4">
              {/* Metadata matching design structure */}
              <p className={`text-lg ${themeClasses.headerText}`}>Client Email: <span className={`font-semibold ${themeClasses.primary}`}>{quote.client_email}</span></p>
              <p className={`text-lg ${themeClasses.headerText}`}>Date of Event: <span className="font-semibold">{eventDateFormatted}</span></p>
              {eventTime && <p className={`text-lg ${themeClasses.headerText}`}>Time: <span className="font-semibold">{eventTime}</span></p>}
              <p className={`text-lg ${themeClasses.headerText}`}>Location: <span className="font-semibold">{quote.event_location}</span></p>
              <p className={`text-lg ${themeClasses.headerText}`}>Prepared by: <span className="font-semibold">{quote.prepared_by}</span></p>
            </div>

            {/* Custom Separator Line */}
            <div className="flex justify-center pt-4">
              <div className={`w-1/3 ${themeClasses.separator}`}></div>
            </div>
            
            {isFinalized && (
              <div className={`mt-4 p-3 rounded-md font-semibold flex items-center justify-center space-x-2 ${isAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isAccepted ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span>This quote was {isAccepted ? 'ACCEPTED' : 'REJECTED'} on {format(new Date(accepted_at || rejected_at!), 'PPP')}.</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-8">
            
            {/* Main Content / Description Block (Mimicking large bold text from design) */}
            <section className="text-center mb-10">
              <p className={`text-xl font-extrabold ${themeClasses.text} max-w-3xl mx-auto`}>
                This fee covers 7 hours of commitment, including the performance call, soundcheck, and all essential preparation required for a seamless, high-energy performance.
              </p>
              <p className={`text-sm ${themeClasses.secondary} mt-4`}>
                This fee secures a premium, seamless musical experience for your event.
              </p>
            </section>

            {/* Quote Breakdown */}
            <section className="space-y-6">
              <h2 className={`text-xl font-bold text-center ${themeClasses.primary}`}>Service Components</h2>

              {/* Compulsory Items */}
              {compulsoryItems.length > 0 && (
                <div className="space-y-4">
                  {compulsoryItems.map((item, index) => (
                    <div key={index} className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className={`${themeClasses.text} flex items-start`}>
                            <span className={`mr-2 ${themeClasses.primary} text-lg leading-none`}>&bull;</span>
                            <span className="font-bold">{item.name}:</span>
                            {item.description && <span className={`text-sm ml-1 ${themeClasses.secondary}`}>{item.description}</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* All-Inclusive Total (Based on design) */}
                  <div className="text-center pt-4">
                    <p className={`text-2xl font-extrabold ${themeClasses.primary}`}>
                      All-Inclusive Engagement Fee: {formatCurrency(compulsoryTotal)}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Important Booking Details Section */}
            <section className={`mt-12 p-6 rounded-lg ${isLivePianoTheme ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
              <h2 className={`text-2xl font-extrabold text-center mb-4 ${themeClasses.headerText}`}>Important Booking Details</h2>
              
              <ul className={`space-y-3 text-sm ${themeClasses.headerText}`}>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> A non-refundable <span className="font-bold">{details.depositPercentage}% deposit ({formatCurrency(depositAmount)})</span> is required immediately to formally secure {isLivePianoTheme ? `the ${eventDateShort} date` : 'the booking'}.
                </li>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> The remaining balance is due 7 days prior to the event.
                </li>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> Bank Details for Payment: BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}
                </li>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>&bull;</span> Terms: {paymentTerms}
                </li>
              </ul>
            </section>
            
            {/* Final Total Cost Box (Matching design) */}
            <div className={`mt-8 p-6 rounded-lg text-center ${themeClasses.totalBoxBg}`}>
              <h3 className={`text-3xl font-extrabold ${themeClasses.totalBoxText}`}>
                Final Total Cost: {formatCurrency(subtotal)}
              </h3>
              <p className={`text-sm ${isLivePianoTheme ? themeClasses.secondary : themeClasses.text}`}>
                This includes your selected add-ons and the base quote amount.
              </p>
            </div>

            {/* Accept Your Quote Section (Matching design) */}
            <div className={`mt-8 p-6 rounded-lg text-center border-2 ${themeClasses.acceptBoxBorder}`}>
              <h2 className={`text-2xl font-extrabold mb-6 ${themeClasses.text}`}>Accept Your Quote</h2>
              
              {/* Optional Add-Ons Section */}
              {optionalAddOns.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className={`text-xl font-extrabold text-center ${themeClasses.text}`}>Optional Add-Ons</h3>
                  {optionalAddOns.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox
                          id={`addon-${item.id}`}
                          checked={selectedAddOns.includes(item.id)}
                          onCheckedChange={(checked) => handleAddOnChange(item.id, !!checked)}
                          disabled={isFinalized}
                          className={isLivePianoTheme ? 'border-amber-400 data-[state=checked]:bg-amber-400 data-[state=checked]:text-gray-900' : 'border-pink-600 data-[state=checked]:bg-pink-600 data-[state=checked]:text-white'}
                        />
                        <Label htmlFor={`addon-${item.id}`} className="cursor-pointer flex-1 text-left">
                          <p className={`${themeClasses.text} flex items-start`}>
                            <span className={`mr-2 ${themeClasses.primary} text-lg leading-none`}>&bull;</span>
                            <span className="font-bold">{item.name}:</span>
                            {item.description && <span className={`text-sm ml-1 ${themeClasses.secondary}`}>{item.description}</span>}
                          </p>
                          <p className={`text-xs ml-4 ${themeClasses.secondary}`}>Unit Cost: {formatCurrency(item.price)}</p>
                        </Label>
                      </div>
                      <p className={`font-semibold ${themeClasses.primary}`}>{formatCurrency(calculateItemTotal(item))}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Acceptance Buttons */}
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
                  <Button onClick={() => navigate('/')}>
                    Back to Home
                  </Button>
                )}
              </div>
            </div>

          </CardContent>

          <CardFooter className="flex justify-center pt-6 border-t">
            <p className="text-xs italic text-gray-500">
              Quote prepared by {quote.prepared_by} on {format(new Date(quote.created_at), 'PPP')}.
            </p>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default DynamicQuotePage;