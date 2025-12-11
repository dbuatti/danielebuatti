"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns'; // Ensure format is imported
import { Quote, QuoteItem } from '@/types/quote'; // Import centralized interfaces (Fix Errors 1, 2)
import { CheckCircle, XCircle, Loader2, Calendar, MapPin, Clock } from 'lucide-react';
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
          
          // Initialize selected add-ons based on compulsory items (if any)
          // Or based on previously selected items if the quote was already accepted/rejected
          // For now, we assume all add-ons are optional unless explicitly selected later.
          // If the quote was already accepted, we should load the accepted items.
          
          // Since we don't have a mechanism for storing client selections yet, 
          // we'll just ensure the compulsory items are always included in calculations.
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
          // Optionally store the client's selected add-ons in the details JSONB
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
  
  // Define compulsoryTotal here so it's available in JSX
  const compulsoryTotal = compulsoryItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0; // Fix Error 3
  const addOnTotal = selectedAddOnsData.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = compulsoryTotal + addOnTotal;
  const depositAmount = subtotal * (depositPercentage / 100);
  
  const formatCurrency = (amount: number) => `${symbol}${amount.toFixed(2)}`;
  const calculateItemTotal = (item: QuoteItem) => item.price * item.quantity;

  // Theme setup
  const isLivePianoTheme = theme === 'livePiano';
  const themeClasses = isLivePianoTheme
    ? {
        bg: 'bg-gray-900 text-yellow-400',
        cardBg: 'bg-gray-800',
        text: 'text-gray-100',
        primary: 'text-yellow-400',
        secondary: 'text-gray-400',
        border: 'border-yellow-400/50',
      }
    : {
        bg: 'bg-gray-50 text-gray-800',
        cardBg: 'bg-white',
        text: 'text-gray-800',
        primary: 'text-pink-600',
        secondary: 'text-gray-500',
        border: 'border-pink-600/50',
      };

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

          <CardHeader className="pb-4">
            <CardTitle className={`text-4xl font-extrabold ${themeClasses.primary}`}>{quote.event_title}</CardTitle>
            <p className={`${themeClasses.secondary} text-lg`}>{quote.invoice_type} for {quote.client_name}</p>
            
            {isFinalized && (
              <div className={`mt-4 p-3 rounded-md font-semibold flex items-center space-x-2 ${isAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isAccepted ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span>This quote was {isAccepted ? 'ACCEPTED' : 'REJECTED'} on {format(new Date(accepted_at || rejected_at!), 'PPP')}.</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-8">
            
            {/* Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className={`h-5 w-5 ${themeClasses.primary}`} />
                <span className={themeClasses.text}>{format(new Date(quote.event_date), 'PPP')}</span>
              </div>
              {eventTime && (
                <div className="flex items-center space-x-2">
                  <Clock className={`h-5 w-5 ${themeClasses.primary}`} />
                  <span className={themeClasses.text}>{eventTime}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <MapPin className={`h-5 w-5 ${themeClasses.primary}`} />
                <span className={themeClasses.text}>{quote.event_location}</span>
              </div>
            </div>

            <Separator className={themeClasses.border} />

            {/* Quote Breakdown */}
            <section className="space-y-6">
              <h2 className={`text-2xl font-bold ${themeClasses.primary}`}>Quote Breakdown</h2>

              {/* Compulsory Items */}
              {compulsoryItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Required Services</h3>
                  {compulsoryItems.map((item, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className={`font-medium ${themeClasses.text}`}>{item.name}</p>
                          {item.description && <p className={`text-sm italic ${themeClasses.secondary}`}>{item.description}</p>}
                        </div>
                        <p className={`font-semibold ${themeClasses.primary}`}>{formatCurrency(calculateItemTotal(item))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Add-Ons */}
              {optionalAddOns.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Optional Add-Ons (Select to include)</h3>
                  {optionalAddOns.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox
                          id={`addon-${item.id}`}
                          checked={selectedAddOns.includes(item.id)}
                          onCheckedChange={(checked) => handleAddOnChange(item.id, !!checked)}
                          disabled={isFinalized}
                          className={isLivePianoTheme ? 'border-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-gray-900' : ''}
                        />
                        <Label htmlFor={`addon-${item.id}`} className="cursor-pointer flex-1">
                          <p className={`font-medium ${themeClasses.text}`}>{item.name}</p>
                          {item.description && <p className={`text-sm italic ${themeClasses.secondary}`}>{item.description}</p>}
                          <p className={`text-xs ${themeClasses.secondary}`}>{formatCurrency(item.price)} x {item.quantity}</p>
                        </Label>
                      </div>
                      <p className={`font-semibold ${themeClasses.primary}`}>{formatCurrency(calculateItemTotal(item))}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <Separator className={`my-8 ${themeClasses.border}`} />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span className={themeClasses.text}>Subtotal:</span>
                  <span className={themeClasses.text}>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t">
                  <span className={themeClasses.primary}>Total Quote Amount:</span>
                  <span className={themeClasses.primary}>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className={themeClasses.text}>Required Deposit ({depositPercentage}%):</span>
                  <span className={themeClasses.text}>{formatCurrency(depositAmount)}</span>
                </div>
              </div>
            </div>

            <Separator className={`my-8 ${themeClasses.border}`} />

            {/* Terms and Bank Details */}
            <section className="text-sm space-y-4">
              <h3 className={`text-lg font-semibold ${themeClasses.primary}`}>Payment Information</h3>
              <p className={themeClasses.secondary}>Terms: {paymentTerms}</p>
              {(bankDetails.bsb || bankDetails.acc) && (
                <div className={themeClasses.secondary}>
                  <p>Bank Details:</p>
                  {bankDetails.bsb && <p>BSB: {bankDetails.bsb}</p>}
                  {bankDetails.acc && <p>Account: {bankDetails.acc}</p>}
                </div>
              )}
            </section>

          </CardContent>

          <CardFooter className="flex justify-end space-x-4 pt-6 border-t">
            {!isFinalized ? (
              <>
                <Button 
                  variant="destructive" 
                  onClick={handleRejectQuote} 
                  disabled={isAccepting}
                >
                  Reject Quote
                </Button>
                <Button 
                  onClick={handleAcceptQuote} 
                  disabled={isAccepting}
                  className={isLivePianoTheme ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' : 'bg-pink-600 hover:bg-pink-700'}
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
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default DynamicQuotePage;