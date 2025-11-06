"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft, Phone, Mail, Loader2, Minus, Plus } from 'lucide-react';
import { useTheme } from "next-themes";
import { toast } from 'sonner';
import { useForm, useFieldArray } from "react-hook-form";
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
import { cn, formatCurrency } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns'; // Ensure format is imported
import { AddOnItem, Quote } from '@/types/quote'; // Import centralized interfaces

// Zod schema for generic quote acceptance
const genericQuoteAcceptanceSchema = z.object({
  clientName: z.string().min(2, { message: "Your full name is required." }),
  clientEmail: z.string().email({ message: "A valid email address is required." }),
  acceptTerms: z.boolean().refine((val: boolean) => val === true, { message: "You must accept the terms to proceed." }),
  selectedAddOns: z.array(z.object({
    id: z.string(), // Added for useFieldArray
    name: z.string(),
    cost: z.number(),
    quantity: z.coerce.number().min(0).max(10, { message: "Max quantity is 10." }),
    description: z.string().optional(),
  })).optional(),
});

type QuoteFormValues = z.infer<typeof genericQuoteAcceptanceSchema>;

const DynamicQuotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(genericQuoteAcceptanceSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      acceptTerms: false,
      selectedAddOns: [],
    },
  });

  const { fields: addOnFields, update: updateAddOnField } = useFieldArray<QuoteFormValues, "selectedAddOns", "id">({
    control: form.control,
    name: "selectedAddOns",
  });

  useEffect(() => {
    const fetchQuote = async () => {
      if (!slug) {
        setError("Quote slug is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        setError('Failed to load quote details. It might not exist or you do not have access.');
        setQuote(null);
      } else {
        setQuote(data as Quote);
        
        const initialAddOns = (data.details?.addOns || []).map((addOn: AddOnItem) => ({ // Explicitly type addOn here
          ...addOn, // Keep existing properties
          id: addOn.id || Math.random().toString(36).substring(2, 11), // Ensure ID exists for useFieldArray
          quantity: 0, // Explicitly set quantity to 0 on load
        }));

        form.reset({
          clientName: data.client_name || '',
          clientEmail: data.client_email || '',
          acceptTerms: false,
          selectedAddOns: initialAddOns,
        });
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [slug, form]);

  const watchedAddOns = form.watch('selectedAddOns');
  
  const { baseService, currencySymbol, depositPercentage, bankDetails, eventTime, paymentTerms } = quote?.details || {};
  const baseAmount = parseFloat(String(baseService?.amount)) || 0;
  const symbol = currencySymbol || 'A$';

  const isErinKennedyQuote = quote?.invoice_type === "Erin Kennedy Quote";
  const erinKennedyBaseInvoice = 400.00; // Hardcoded for Erin Kennedy quote type

  const calculatedTotal = useMemo(() => {
    if (!quote) return 0;
    
    if (isErinKennedyQuote) {
      return erinKennedyBaseInvoice;
    }

    let total = baseAmount;
    
    watchedAddOns?.forEach(addOn => {
      const quantity = parseFloat(String(addOn.quantity)) || 0;
      const cost = parseFloat(String(addOn.cost)) || 0;
      total += cost * quantity;
    });
    return total;
  }, [watchedAddOns, baseAmount, quote, isErinKennedyQuote]);

  const requiredDeposit = calculatedTotal * ((depositPercentage || 0) / 100);

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <span className="sr-only">Loading quote...</span>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light p-4">
        <h2 className="text-3xl font-bold mb-4">Error</h2>
        <p className="text-lg text-red-500 mb-6">{error || "Quote not found."}</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const isAccepted = !!quote.accepted_at;
  const isRejected = !!quote.rejected_at;
  const isActionTaken = isAccepted || isRejected;

  const isLivePianoQuote = quote.invoice_type.toLowerCase().includes("live piano");

  async function onSubmitGeneric(values: QuoteFormValues) {
    const loadingToastId = toast.loading("Submitting your acceptance...");
    
    const finalSelectedAddOns = values.selectedAddOns?.filter(a => (parseFloat(String(a.quantity)) || 0) > 0) || [];

    try {
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          accepted_at: new Date().toISOString(),
          client_name: values.clientName,
          client_email: values.clientEmail,
          total_amount: calculatedTotal,
          details: {
            ...quote!.details,
            final_total_amount: calculatedTotal,
            client_selected_add_ons: finalSelectedAddOns,
          }
        })
        .eq('id', quote!.id);

      if (updateError) throw updateError;

      const EMAIL_SERVICE_API_KEY = import.meta.env.VITE_EMAIL_SERVICE_API_KEY;
      const CONTACT_FORM_RECIPIENT_EMAIL = import.meta.env.VITE_CONTACT_FORM_RECIPIENT_EMAIL;
      const EMAIL_SERVICE_ENDPOINT = import.meta.env.VITE_EMAIL_SERVICE_ENDPOINT;

      if (EMAIL_SERVICE_API_KEY && CONTACT_FORM_RECIPIENT_EMAIL && EMAIL_SERVICE_ENDPOINT) {
        const adminQuoteLink = `${window.location.origin}/admin/quotes/${quote!.id}`;
        const subject = `🎉 Quote Accepted: ${quote!.event_title || quote!.invoice_type} from ${values.clientName}`;
        
        const addOnList = finalSelectedAddOns.length > 0 
          ? finalSelectedAddOns.map(a => `<li>${a.name} (Qty: ${a.quantity}, Cost: ${symbol}${(a.cost * a.quantity).toFixed(2)})</li>`).join('')
          : '<li>None selected.</li>';

        const emailHtml = `
          <div style="font-family: 'Outfit', sans-serif; color: #1b1b1b; background-color: #F8F8F8; padding: 20px; border-radius: 8px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #fdb813; text-align: center; margin-bottom: 20px;">Quote Accepted!</h2>
              <p style="font-size: 16px; line-height: 1.6;">A client has accepted your quote proposal:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${values.clientName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Client Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><a href="mailto:${values.clientEmail}" style="color: #fdb813; text-decoration: none;">${values.clientEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Quote Title:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${quote!.event_title || quote!.invoice_type}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Base Amount:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${symbol}${baseAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Selected Add-Ons:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;"><ul>${addOnList}</ul></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE; font-weight: bold; width: 150px;">FINAL TOTAL:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #EEEEEE;">${symbol}${calculatedTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Accepted On:</td>
                  <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-top: 1px solid #EEEEEE; font-weight: bold; width: 150px;">Admin Link:</td>
                  <td style="padding: 8px 0; border-top: 1px solid #EEEEEE;"><a href="${adminQuoteLink}" style="color: #fdb813; text-decoration: none;">View in Admin Panel</a></td>
                </tr>
              </table>
              <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 30px;">
                This notification was sent from your website.
              </p>
            </div>
          </div>
        `;

        await fetch(EMAIL_SERVICE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'info@danielebuatti.com',
            to: CONTACT_FORM_RECIPIENT_EMAIL,
            subject: subject,
            html: emailHtml,
          }),
        });
      }

      toast.success("Quote accepted successfully!", { id: loadingToastId });
      form.reset();
      navigate('/live-piano-services/quote-confirmation');
    } catch (error: any) {
      console.error("Error submitting quote acceptance:", error);
      toast.error(`Failed to submit quote acceptance: ${error.message}`, { id: loadingToastId });
    }
  }

  const renderErinKennedyQuote = () => {
    const onSitePerformanceCost = 300.00;
    const showPreparationFee = 100.00;
    const totalBaseInvoice = 400.00;
    const eventTimeEK = "3:00 PM – 6:00 PM";

    return (
      <>
        <section className={cn(
          "p-8 rounded-xl border space-y-6 overflow-hidden",
          "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
        )}>
          <h3 className="text-3xl font-bold mb-6 text-center text-brand-primary">
            Quote Breakdown
          </h3>
          <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse">
              <TableHeader>
                <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                  <TableHead className="text-brand-primary w-[30%]">Service Component</TableHead>
                  <TableHead className="text-brand-primary w-[50%]">Details</TableHead>
                  <TableHead className="text-brand-primary w-[20%] text-right">Investment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                  <TableCell className="font-semibold text-brand-dark dark:text-brand-light">Performance & On-Site Engagement</TableCell>
                  <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                    3 hours of dedicated on-site presence, including arrival, setup, soundcheck, and performance ({eventTimeEK}).
                    <br />
                    Rate: A$100/hr (effective rate for this package)
                  </TableCell>
                  <TableCell className="text-right font-semibold text-brand-primary">A${onSitePerformanceCost.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                  <TableCell className="font-semibold text-brand-dark dark:text-brand-light">Production Coordination & Music Preparation</TableCell>
                  <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                    A flat fee covering essential behind-the-scenes work: coordinating with all students, collecting and formatting sheet music, and preparing for a seamless production.
                  </TableCell>
                  <TableCell className="text-right font-semibold text-brand-primary">A${showPreparationFee.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow className="bg-brand-primary/10 dark:bg-brand-primary/20 font-bold">
                  <TableCell colSpan={2} className="text-brand-primary text-lg">TOTAL BASE INVOICE <span className="font-semibold text-base text-brand-dark/70 dark:text-brand-light/70">(To be paid by Erin Kennedy)</span></TableCell>
                  <TableCell className="text-right text-brand-primary text-lg">A${totalBaseInvoice.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <section className={cn(
          "p-8 rounded-xl border space-y-6 overflow-hidden",
          "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
        )}>
          <h3 className="text-3xl font-bold text-brand-primary text-center">Optional Rehearsal Support for Students</h3>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
            To help students feel fully prepared and confident for their performance, Daniele offers dedicated 1:1 rehearsal opportunities at his studio in Toorak.
          </p>
          <div className="max-w-md mx-auto space-y-4">
            <h4 className="text-xl font-semibold text-brand-primary">Individual Rehearsal Rates:</h4>
            <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-1 pl-4">
              <li>15-minute rehearsal: A$30</li>
              <li>30-minute rehearsal: A$50</li>
              <li>45-minute rehearsal: A$75</li>
            </ul>
            <p className="text-base text-brand-dark/70 dark:text-brand-light/70 italic">
              Each session is designed for a focused run-through of a student's piece, with time for essential touch-ups and feedback. Students can book these sessions directly with Daniele.
            </p>
          </div>
        </section>
      </>
    );
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isLivePianoQuote ? "live-piano-theme bg-livePiano-background text-livePiano-light font-montserrat" : "bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light"
    )}>
      <header className={cn(
        "py-4 px-6 md:px-12 relative z-10 border-b",
        isLivePianoQuote ? "bg-livePiano-darker border-livePiano-border/50" : "bg-brand-light dark:bg-brand-dark border-brand-secondary/50"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className={cn(
            "transition-colors duration-200 px-0 py-0 h-auto",
            isLivePianoQuote ? "text-livePiano-light hover:text-livePiano-primary" : "text-brand-dark dark:text-brand-light hover:text-brand-primary"
          )}>
            <Link to="/">
              <span className="flex items-center text-base md:text-lg font-semibold">
                <ArrowLeft className="h-5 w-5 mr-2" /> <span>Back to Home</span>
              </span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <DynamicImage
              src={isLivePianoQuote ? "/gold-36.png" : brandSymbolSrc}
              alt="Daniele Buatti Brand Symbol"
              className="h-16 md:h-20"
              width={80}
              height={80}
            />
            <DynamicImage
              src={textLogoSrc}
              alt="Daniele Buatti Logo"
              className="h-12 w-auto"
              width={220}
              height={48}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 space-y-12">
        <section className="text-center space-y-6">
          <h2 className={cn(
            "text-5xl md:text-6xl font-extrabold mb-6 leading-none",
            isLivePianoQuote ? "font-libre-baskerville text-livePiano-primary" : "text-brand-primary"
          )}>
            {quote.event_title || quote.invoice_type}
          </h2>
          <div className={cn(
            "text-xl max-w-3xl mx-auto space-y-3 font-medium",
            isLivePianoQuote ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
          )}>
            <p>Prepared for: <strong className={isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"}>{quote.client_name}</strong></p>
            <p>Client Email: <strong className={isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"}>{quote.client_email}</strong></p> {/* Added client_email here */}
            <p>Date of Event: {quote.event_date && format(new Date(quote.event_date), 'EEEE d MMMM yyyy') || 'N/A'}</p>
            {isErinKennedyQuote ? <p>Time: 3:00 PM – 6:00 PM</p> : eventTime && <p>Time: {eventTime}</p>}
            <p>Location: {quote.event_location || 'N/A'}</p>
            <p>Prepared by: {quote.prepared_by || 'N/A'}</p>
          </div>
          <Separator className={cn(
            "max-w-lg mx-auto h-1 mt-10",
            isLivePianoQuote ? "bg-livePiano-primary" : "bg-brand-primary"
          )} />
        </section>

        {isErinKennedyQuote ? (
          renderErinKennedyQuote()
        ) : (
          <>
            {baseService && (
              <section className={cn(
                "p-8 rounded-xl border space-y-6 overflow-hidden",
                isLivePianoQuote ? "bg-livePiano-darker border-livePiano-border/30" : "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
              )}>
                <h3 className={cn(
                  "text-3xl font-bold mb-6 text-center",
                  isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                )}>
                  {baseService.description || "Base Engagement Fee"}
                </h3>
                <p className={cn(
                  "text-xl text-center max-w-3xl mx-auto",
                  isLivePianoQuote ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
                )}>
                  This fee secures a premium, seamless musical experience for your event.
                </p>
                <div className={cn(
                  "space-y-4 max-w-3xl mx-auto",
                  isLivePianoQuote ? "text-livePiano-light/80" : "text-brand-dark/80 dark:text-brand-light/80"
                )}>
                  <h4 className={cn(
                    "text-2xl font-semibold text-center mb-4",
                    isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"
                  )}>
                    Service Components
                  </h4>
                  <ul className={cn(
                    "list-disc list-inside space-y-2",
                    isLivePianoQuote ? "[&>li]:marker:text-livePiano-primary [&>li]:marker:text-xl" : ""
                  )}>
                    <li><strong>Performance:</strong> {baseService.description}</li>
                    <li><strong>All-Inclusive Logistics:</strong> Covers all sheet music preparation, travel, and setup required for the evening.</li>
                    {quote.invoice_type?.toLowerCase().includes('live piano') && <li><strong>Flexible Timing:</strong> Performance timing is flexible to dynamically respond to the needs of guests (the "on-call buffer").</li>}
                  </ul>
                </div>
                <p className={cn(
                  "text-3xl font-semibold text-center mt-8",
                  isLivePianoQuote ? "text-livePiano-primary" : "text-brand-dark dark:text-brand-light"
                )}>
                  All-Inclusive Engagement Fee: <strong className={isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>{currencySymbol}{baseAmount.toFixed(2)}</strong>
                </p>
              </section>
            )}
          </>
        )}

        <section className={cn(
          "p-8 rounded-xl border space-y-6 overflow-hidden",
          isLivePianoQuote ? "bg-livePiano-darker border-livePiano-border/30" : "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
        )}>
          <h3 className={cn(
            "text-3xl font-bold mb-6 text-center",
            isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
          )}>Important Booking Details</h3>
          <ul className={cn(
            "list-disc list-inside text-lg space-y-3", // Changed space-y-2 to space-y-3
            isLivePianoQuote ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
          )}>
            {isErinKennedyQuote ? (
              <>
                <li><strong className="text-brand-primary">Your final invoice for the base services to Erin Kennedy will be A$400.00.</strong></li>
                <li><strong className="text-brand-primary">A non-refundable 50% deposit (A$200.00) is required immediately</strong> to formally secure the {quote.event_date || 'event'} date.</li>
                <li>The remaining balance is due 7 days prior to the event.</li>
                <li><strong className="text-brand-primary">Bank Details for Payment:</strong> BSB: 923100, ACC: 301110875</li>
                <li><strong className="text-brand-primary">Keyboard Provision:</strong> Daniele kindly requests that MC Showroom provides a fully weighted keyboard or piano on stage, ready for use by 3:00 PM.</li>
                <li>To ensure thorough preparation, Daniele kindly requests <strong>PDF sheet music</strong> for all songs and a <strong>complete song list</strong> at least two weeks prior to the event (or earlier, if possible).</li>
                <li>To facilitate efficient scheduling, please inform Daniele of the <strong>total number of students</strong> participating in the concert as soon as possible. Daniele will then work to schedule rehearsals in convenient, grouped time blocks.</li>
              </>
            ) : (
              <>
                <li><strong className={isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"}>A non-refundable {depositPercentage}% deposit ({symbol}{requiredDeposit.toFixed(2)}) is required immediately</strong> to formally secure the {quote.event_date && format(new Date(quote.event_date), 'EEEE d MMMM yyyy') || 'event'} date.</li>
                {paymentTerms && <li>{paymentTerms}</li>}
                {!paymentTerms && <li>The remaining balance is due 7 days prior to the event.</li>}
                
                {bankDetails && (
                  <li><strong className={isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"}>Bank Details for Payment:</strong> BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}</li>
                )}
              </>
            )}
          </ul>
        </section>

        {/* Final Total Cost Display */}
        <div className={cn(
          "text-center mt-10 p-6 rounded-lg border",
          isLivePianoQuote ? "bg-livePiano-primary/10 border-livePiano-primary/30" : "bg-brand-primary/10 border-brand-primary/30"
        )}>
          <p className={cn(
            "text-2xl md:text-3xl font-bold",
            isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"
          )}>
            Final Total Cost: <span className={cn(isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light", "text-4xl md:text-5xl")}>{formatCurrency(calculatedTotal, symbol)}</span>
          </p>
          <p className={cn(
            "text-xl text-center max-w-3xl mx-auto",
            isLivePianoQuote ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
          )}>
            This includes your selected add-ons and the base quote amount.
          </p>
        </div>

        {/* Quote Acceptance Form / Status Message */}
        {!isErinKennedyQuote && (
          <>
            {!isActionTaken ? (
              <section className={cn(
                "p-8 rounded-xl border space-y-6",
                isLivePianoQuote ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
              )}>
                <h3 className={cn(
                  "text-3xl font-bold mb-6 text-center",
                  isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                )}>
                  Accept Your Quote
                </h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitGeneric)} className="space-y-8">
                    {/* Optional Add-Ons Section (for non-Erin Kennedy quotes) - MOVED HERE */}
                    {quote?.details?.addOns && quote.details.addOns.length > 0 && (
                      <section className={cn(
                        "p-8 rounded-xl border space-y-8 overflow-hidden",
                        isLivePianoQuote ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
                      )}>
                        <h3 className={cn(
                          "text-3xl font-bold mb-6 text-center",
                          isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                        )}>Optional Add-Ons</h3>
                        <div className="space-y-4 max-w-2xl mx-auto">
                          {addOnFields.map((item: AddOnItem, index: number) => {
                            const cost = parseFloat(String(item.cost)) || 0;
                            const currentQuantity = parseFloat(String(form.watch(`selectedAddOns.${index}.quantity`))) || 0;
                            const subtotal = cost * currentQuantity;
                            
                            const handleQuantityChange = (delta: number) => {
                              const newQuantity = Math.max(0, Math.min(10, currentQuantity + delta));
                              updateAddOnField(index, { ...item, quantity: newQuantity });
                            };

                            return (
                              <div key={item.id} className={cn(
                                "flex flex-col sm:flex-row sm:items-center sm:justify-between w-full rounded-md border p-4 transition-all",
                                isLivePianoQuote ? "border-livePiano-border/50" : "border-brand-secondary/50",
                                currentQuantity > 0 ? (isLivePianoQuote ? "bg-livePiano-background/50" : "bg-brand-secondary/20 dark:bg-brand-dark/50") : (isLivePianoQuote ? "bg-livePiano-background/20" : "bg-brand-light dark:bg-brand-dark-alt")
                              )}>
                                <div className="space-y-1 leading-none mb-4 sm:mb-0 sm:flex-1">
                                  <p className={cn(
                                    "text-xl font-bold leading-none",
                                    isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                                  )}>
                                    {item.name}
                                  </p>
                                  {item.description && (
                                    <p className={cn(
                                      "text-base",
                                      isLivePianoQuote ? "text-livePiano-light/70" : "text-brand-dark/70 dark:text-brand-light/70"
                                    )}>
                                      {item.description}
                                    </p>
                                  )}
                                  <p className={cn(
                                    "text-sm italic",
                                    isLivePianoQuote ? "text-livePiano-light/60" : "text-brand-dark/60 dark:text-brand-light/60"
                                  )}>
                                    Unit Cost: {symbol}{cost.toFixed(2)}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-4 sm:w-auto sm:flex-shrink-0 sm:justify-end">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleQuantityChange(-1)}
                                      disabled={currentQuantity <= 0}
                                      className={cn(
                                        "h-8 w-8",
                                        isLivePianoQuote ? "bg-livePiano-background border-livePiano-primary text-livePiano-primary hover:bg-livePiano-primary/20" : "border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                                      )}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <FormField
                                      control={form.control}
                                      name={`selectedAddOns.${index}.quantity`}
                                      render={({ field }) => (
                                        <FormItem className="w-16">
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min={0}
                                              max={10}
                                              {...field}
                                              onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                field.onChange(isNaN(value) ? 0 : Math.max(0, Math.min(10, value)));
                                              }}
                                              className={cn(
                                                isLivePianoQuote ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                                              )}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleQuantityChange(1)}
                                      disabled={currentQuantity >= 10}
                                      className={cn(
                                        "h-8 w-8",
                                        isLivePianoQuote ? "bg-livePiano-background border-livePiano-primary text-livePiano-primary hover:bg-livePiano-primary/20" : "border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                                      )}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className={cn(
                                    "text-3xl font-bold flex-shrink-0 min-w-[180px] text-right",
                                    isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"
                                  )}>
                                    {formatCurrency(subtotal, symbol)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light")}>Your Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className={cn(
                                isLivePianoQuote ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light")}>Your Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              {...field}
                              className={cn(
                                isLivePianoQuote ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className={cn(
                                isLivePianoQuote ? "border-livePiano-primary data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker" : "border-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-brand-light"
                              )}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className={cn(isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light")}>
                              I agree to the terms and conditions of this quote.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className={cn(
                        "w-full py-3 text-lg font-semibold",
                        isLivePianoQuote ? "bg-livePiano-primary text-livePiano-darker hover:bg-livePiano-primary/90" : "bg-brand-primary text-brand-light hover:bg-brand-primary/90"
                      )}
                    >
                      Accept Quote
                    </Button>
                  </form>
                </Form>
              </section>
            ) : (
              <section className={cn(
                "p-8 rounded-xl border space-y-6 text-center",
                isLivePianoQuote ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
              )}>
                <h3 className={cn(
                  "text-3xl font-bold",
                  isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                )}>
                  {isAccepted ? "Quote Accepted!" : "Quote Rejected."}
                </h3>
                <p className={cn(
                  "text-xl",
                  isLivePianoQuote ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
                )}>
                  This quote has already been {isAccepted ? "accepted" : "rejected"}.
                </p>
                <Button asChild className={cn(
                  isLivePianoQuote ? "bg-livePiano-primary text-livePiano-darker hover:bg-livePiano-primary/90" : "bg-brand-primary text-brand-light hover:bg-brand-primary/90"
                )}>
                  <Link to="/">Return to Home</Link>
                </Button>
              </section>
            )}
          </>
        )}
      </main>

      <footer
        className={cn(
          "relative py-16 text-center overflow-hidden",
          isLivePianoQuote ? "" : "bg-brand-dark"
        )}
        style={{ backgroundImage: `url(/bowtie.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <p className={cn(
            "text-2xl font-semibold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8",
            isLivePianoQuote ? "text-livePiano-light" : "text-brand-light"
          )}>
            <a
              href="https://wa.me/61424174067"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 transition-colors",
                isLivePianoQuote ? "hover:text-livePiano-primary" : "hover:text-brand-primary"
              )}
            >
              <Phone size={24} /> 0424 174 067
            </a>
            <a
              href="mailto:info@danielebuatti.com"
              className={cn(
                "flex items-center gap-2 transition-colors",
                isLivePianoQuote ? "hover:text-livePiano-primary" : "hover:text-brand-primary"
              )}
            >
              <Mail size={24} /> info@danielebuatti.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DynamicQuotePage;