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
import DynamicImage from '@/components/DynamicImage'; // Import DynamicImage
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils'; // IMPORTED formatCurrency

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
    headerImagePosition?: string; // NEW: Added headerImagePosition
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
    return <div className="flex justify-center items-center h-screen text-red-500 text-xl">Error: {error || 'Quote data missing.'}</div>;
  }

  const { details, accepted_at, rejected_at } = quote;
  const { compulsoryItems, addOns: optionalAddOns, currencySymbol, depositPercentage, paymentTerms, bankDetails, eventTime, theme, headerImageUrl, preparationNotes, headerImagePosition } = details; // Destructure headerImagePosition
  
  const isAccepted = !!accepted_at;
  const isRejected = !!rejected_at;
  const isFinalized = isAccepted || isRejected;
  
  const symbol = currencySymbol || '$';

  // Calculate compulsory total once
  const compulsoryTotal = compulsoryItems?.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0) || 0;

  // Determine which list of add-ons to display and calculate subtotal
  let displayAddOns: QuoteItem[];
  let subtotal: number;
  
  if (isAccepted && quote.details.client_selected_add_ons) {
    // If accepted, use the finalized data
    displayAddOns = quote.details.client_selected_add_ons;
    subtotal = quote.total_amount;
  } else {
    // If pending/rejected, use the mutable state for calculation and display
    displayAddOns = currentOptionalAddOns;
    const addOnTotal = displayAddOns.reduce((sum: number, item: QuoteItem) => sum + item.price * item.quantity, 0);
    subtotal = compulsoryTotal + addOnTotal;
  }

  const depositAmount = subtotal * (depositPercentage / 100);
  
  // REMOVED LOCAL formatCurrency DEFINITION, now using imported utility
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
        tableHeaderBg: 'bg-brand-dark-alt/50', // Added
        tableText: 'text-brand-light', // Added
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
        tableHeaderBg: 'bg-brand-secondary/30', // Added
        tableText: 'text-brand-dark', // Added
      };
      
  const eventDateFormatted = quote.event_date ? format(new Date(quote.event_date), 'EEEE dd MMMM yyyy') : 'TBD';
  const eventDateShort = quote.event_date ? format(new Date(quote.event_date), 'EEEE dd MMMM yyyy') : 'the event date';


  return (
    <ScrollArea className={`min-h-screen ${themeClasses.bg}`}>
      <div className={`max-w-6xl mx-auto p-4 sm:p-8`}> {/* Increased max-width to 6xl */}
        <Card className={`shadow-2xl rounded-lg ${themeClasses.cardBg} ${themeClasses.text} border-2 ${themeClasses.border}`}>
          
          {/* Header Image */}
          {headerImageUrl && (
            <div className="mb-6">
              <DynamicImage 
                src={headerImageUrl} 
                alt="Quote Header" 
                className={`w-full h-64 object-cover rounded-t-lg shadow-md ${headerImagePosition || 'object-top'}`}
                width={1200} // Increased width for better display on wider container
                height={256}
              />
            </div>
          )}

          <CardHeader className="pb-4 text-center px-6">
            <CardTitle className={`text-4xl font-extrabold ${themeClasses.primary} leading-tight`}>{quote.event_title}</CardTitle>
            
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
                <p className={`text-xl font-extrabold ${themeClasses.text} max-w-4xl mx-auto whitespace-pre-wrap`}>
                  {preparationNotes}
                </p>
              </section>
            )}
            
            {/* Quote Breakdown */}
            <section className="space-y-6">
              <h2 className={`text-2xl font-bold text-center ${themeClasses.primary}`}>Service Components</h2>

              {/* Compulsory Items Table */}
              {compulsoryItems.length > 0 && (
                <div className={`border ${themeClasses.border} rounded-lg overflow-hidden ${themeClasses.tableText}`}>
                  <Table>
                    <TableHeader>
                      <TableRow className={`${themeClasses.tableHeaderBg} border-b ${themeClasses.border}`}>
                        <TableHead className={`font-bold ${themeClasses.primary} border-r ${themeClasses.border}`}>Description</TableHead>
                        <TableHead className={`text-center font-bold ${themeClasses.primary} w-[100px] border-r ${themeClasses.border}`}>Qty</TableHead>
                        <TableHead className={`text-right font-bold ${themeClasses.primary} w-[120px] border-r ${themeClasses.border}`}>Unit Price</TableHead>
                        <TableHead className={`text-right font-bold ${themeClasses.primary} w-[120px]`}>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compulsoryItems.map((item, index) => (
                        <TableRow key={index} className={`border-b ${themeClasses.border} last:border-b-0`}>
                          <TableCell className={`font-medium border-r ${themeClasses.border}`}>
                            {item.name}
                            {item.description && (
                              <p className={`text-sm ${themeClasses.secondary} mt-1`}>{item.description}</p>
                            )}
                          </TableCell>
                          <TableCell className={`text-center w-[100px] border-r ${themeClasses.border}`}>{item.quantity}</TableCell>
                          <TableCell className={`text-right w-[120px] border-r ${themeClasses.border}`}>
                            {formatCurrency(item.price, symbol)}
                          </TableCell>
                          <TableCell className={`text-right font-semibold w-[120px] ${themeClasses.primary}`}>
                            {formatCurrency(calculateItemTotal(item), symbol)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {/* All-Inclusive Total (Keep this separate for emphasis) */}
              <div className="text-center pt-4">
                <p className={`text-3xl font-extrabold ${themeClasses.primary}`}>
                  All-Inclusive Engagement Fee: {formatCurrency(compulsoryTotal, symbol)}
                </p>
              </div>
            </section>

            {/* Optional Add-Ons Section */}
            {optionalAddOns.length > 0 && (
              <div className={`mt-8 p-6 rounded-lg text-center border-2 ${themeClasses.acceptBoxBorder}`}>
                <h2 className={`text-2xl font-extrabold mb-6 ${themeClasses.text}`}>Optional Add-Ons</h2>
                
                <div className={`border ${themeClasses.border} rounded-lg overflow-hidden ${themeClasses.tableText}`}>
                  <Table>
                    <TableHeader>
                      <TableRow className={`${themeClasses.tableHeaderBg} border-b ${themeClasses.border}`}>
                        <TableHead className={`font-bold ${themeClasses.primary} border-r ${themeClasses.border}`}>Description</TableHead>
                        <TableHead className={`text-center font-bold ${themeClasses.primary} w-[100px] border-r ${themeClasses.border}`}>Qty</TableHead>
                        <TableHead className={`text-right font-bold ${themeClasses.primary} w-[120px] border-r ${themeClasses.border}`}>Unit Price</TableHead>
                        <TableHead className={`text-right font-bold ${themeClasses.primary} w-[120px]`}>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayAddOns.map((item) => {
                        const itemTotal = calculateItemTotal(item);
                        const isSelected = item.quantity > 0;
                        
                        // If finalized, we only show items with quantity > 0
                        if (isFinalized && item.quantity === 0) return null;

                        return (
                          <TableRow 
                            key={item.id} 
                            className={`border-b ${themeClasses.border} last:border-b-0 ${!isFinalized && !isSelected ? 'opacity-60' : ''}`}
                          >
                            <TableCell className={`font-medium border-r ${themeClasses.border}`}>
                              {item.name}
                              {item.description && (
                                <p className={`text-sm ${themeClasses.secondary} mt-1`}>{item.description}</p>
                              )}
                            </TableCell>
                            
                            <TableCell className={`text-center w-[100px] border-r ${themeClasses.border}`}>
                              {/* Quantity Controls or Static Quantity */}
                              {!isFinalized ? (
                                <div className="flex items-center justify-center border rounded-md border-current/30 mx-auto w-24">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    disabled={item.quantity <= 0}
                                    className={`h-8 w-8 ${themeClasses.text} hover:bg-current/10`}
                                  >
                                    -
                                  </Button>
                                  <span className={`w-8 text-center font-semibold ${themeClasses.text}`}>
                                    {item.quantity}
                                  </span>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    className={`h-8 w-8 ${themeClasses.text} hover:bg-current/10`}
                                  >
                                    +
                                  </Button>
                                </div>
                              ) : (
                                <span className={`font-semibold ${themeClasses.text}`}>
                                  {item.quantity}
                                </span>
                              )}
                            </TableCell>
                            
                            <TableCell className={`text-right w-[120px] border-r ${themeClasses.border}`}>
                              {formatCurrency(item.price, symbol)}
                            </TableCell>
                            
                            <TableCell className={`text-right font-semibold w-[120px] ${themeClasses.primary}`}>
                              {formatCurrency(itemTotal, symbol)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* NEW: Image Section for Black & Gold Theme */}
            {isBlackGoldTheme && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <DynamicImage 
                  src="/blackgoldquoteimage1.jpg" 
                  alt="Daniele Buatti playing piano" 
                  className={`w-full h-64 object-cover rounded-lg shadow-lg border-2 ${themeClasses.contentImageBorder}`}
                  width={400}
                  height={256}
                />
                <DynamicImage 
                  src="/blackgoldquoteimage2.jpg" 
                  alt="Daniele Buatti performing live" 
                  className={`w-full h-64 object-cover rounded-lg shadow-lg border-2 ${themeClasses.contentImageBorder}`}
                  width={400}
                  height={256}
                />
              </div>
            )}

            {/* Important Booking Details Section */}
            <section className={`mt-12 p-6 rounded-lg ${isBlackGoldTheme ? 'bg-brand-dark' : 'bg-brand-secondary/10'} border border-current/20`}>
              <h2 className={`text-2xl font-extrabold text-center mb-4 ${themeClasses.primary}`}>Important Booking Details</h2>
              
              <ul className={`space-y-3 text-base ${themeClasses.text} list-disc list-inside pl-4`}>
                <li>
                  <span className={`font-bold ${themeClasses.primary}`}>Deposit:</span> A non-refundable <span className="font-bold">{depositPercentage}% deposit ({formatCurrency(depositAmount, symbol)})</span> is required immediately to formally secure {eventDateShort}.
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
                Final Total Cost: {formatCurrency(subtotal, symbol)}
              </h3>
              <p className={`text-sm ${themeClasses.secondary}`}>
                This includes the All-Inclusive Engagement Fee and your selected optional add-ons.
              </p>
            </div>

            {/* Acceptance Form/Buttons */}
            <div className={`mt-8 p-6 rounded-lg text-center border-2 ${themeClasses.acceptBoxBorder}`}>
              <h2 className={`text-2xl font-extrabold mb-6 ${themeClasses.text}`}>Accept Your Quote</h2>
              
              <Form {...acceptanceForm}>
                <form onSubmit={handleAcceptQuote} className="space-y-6">
                  {!isFinalized && (
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
                                className={`${themeClasses.cardBg} ${themeClasses.text} border-current/30`}
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
                                className={`${themeClasses.cardBg} ${themeClasses.text} border-current/30`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <p className={`text-sm ${themeClasses.secondary}`}>
                        By clicking "Accept Quote", you agree to the terms and confirm your booking with a {depositPercentage}% deposit.
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex justify-center space-x-4">
                    {!isFinalized ? (
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
                    ) : (
                      <Button onClick={() => navigate('/')} className={themeClasses.acceptButton}>
                        Back to Home
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
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