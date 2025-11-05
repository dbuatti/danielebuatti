"use client";

import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
// Removed Link import as it's not used in this display-only component
import { Phone, Mail } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns'; // Ensure format is imported

// Define AddOnItem type
export interface AddOnItem {
  name: string;
  description?: string;
  cost: number;
  quantity: number;
}

// Define Quote type (simplified based on usage)
export interface Quote {
  client_name?: string;
  client_email?: string;
  event_title?: string;
  invoice_type?: string;
  event_date?: string;
  event_location?: string;
  prepared_by?: string;
  total_amount: number;
  requiredDeposit: number;
  depositPercentage: number;
  paymentTerms?: string;
  bankDetails?: { bsb: string; acc: string };
  addOns?: AddOnItem[];
  currencySymbol?: string;
  baseService?: {
    description: string;
    amount: number;
  };
  eventTime?: string;
}

interface QuoteDisplayProps {
  quote: Quote;
  isLivePianoTheme: boolean;
  isErinKennedyQuote: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLivePianoTheme, isErinKennedyQuote }) => {
  // All data is accessed directly from the 'quote' prop
  const {
    client_name,
    client_email,
    event_title,
    invoice_type,
    event_date,
    event_location,
    prepared_by,
    // total_amount is used in calculatedTotal, so keep it
    requiredDeposit,
    depositPercentage,
    paymentTerms,
    bankDetails,
    addOns,
    currencySymbol = '$',
    baseService,
    eventTime,
  } = quote;

  const symbol = currencySymbol;
  const baseAmount = typeof baseService?.amount === 'number' ? baseService.amount : parseFloat(String(quote.total_amount)) || 0;
  const safeRequiredDeposit = typeof requiredDeposit === 'number' ? requiredDeposit : parseFloat(String(requiredDeposit)) || 0;

  // Calculate total for display, including add-ons
  const calculatedTotal = baseAmount + (addOns?.reduce((sum, item) => sum + (item.cost * item.quantity), 0) || 0);

  // --- Custom Erin Kennedy Quote Breakdown Renderer ---
  const renderErinKennedyQuote = () => {
    // Hardcoded values for Erin Kennedy Quote based on request
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
                  <TableCell colSpan={2} className="text-brand-primary text-lg">TOTAL BASE INVOICE <span className="font-normal text-sm text-brand-dark/70 dark:text-brand-light/70">(To be paid by Erin Kennedy)</span></TableCell>
                  <TableCell className="text-right text-brand-primary text-lg">A${totalBaseInvoice.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Optional Rehearsal Support Section */}
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
  // --- End Custom Erin Kennedy Quote Breakdown Renderer ---

  return (
    <div className={cn(
      "p-8 space-y-12",
      isLivePianoTheme ? "bg-livePiano-background text-livePiano-light" : "bg-brand-background text-brand-dark dark:text-brand-light"
    )}>
      <main className="space-y-12">
        <section className="text-center space-y-6">
          <h2 className={cn(
            "text-5xl md:text-6xl font-extrabold mb-6 leading-none",
            isLivePianoTheme ? "font-libre-baskerville text-livePiano-primary" : "text-brand-primary"
          )}>
            {event_title || invoice_type}
          </h2>
          <div className={cn(
            "text-xl max-w-3xl mx-auto space-y-3 font-medium",
            isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
          )}>
            <p>Prepared for: <strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>{client_name}</strong></p>
            <p>Client Email: <strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>{client_email}</strong></p> {/* Added client_email here */}
            <p>Date of Event: {event_date && format(new Date(event_date), 'EEEE d MMMM yyyy') || 'N/A'}</p>
            {isErinKennedyQuote ? <p>Time: 3:00 PM – 6:00 PM</p> : eventTime && <p>Time: {eventTime}</p>}
            <p>Location: {event_location || 'N/A'}</p>
            <p>Prepared by: {prepared_by || 'N/A'}</p>
          </div>
          <Separator className={cn(
            "max-w-lg mx-auto h-1 mt-10",
            isLivePianoTheme ? "bg-livePiano-primary" : "bg-brand-primary"
          )} />
        </section>

        {isErinKennedyQuote ? (
          renderErinKennedyQuote()
        ) : (
          <>
            {baseService && (
              <section className={cn(
                "p-8 rounded-xl border space-y-6 overflow-hidden",
                isLivePianoTheme ? "bg-livePiano-darker border-livePiano-border/30" : "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
              )}>
                <h3 className={cn(
                  "text-3xl font-bold mb-6 text-center",
                  isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                )}>
                  {baseService.description || "Base Engagement Fee"}
                </h3>
                <p className={cn(
                  "text-xl text-center max-w-3xl mx-auto",
                  isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
                )}>
                  This fee secures a premium, seamless musical experience for your event.
                </p>
                <div className={cn(
                  "space-y-4 max-w-3xl mx-auto",
                  isLivePianoTheme ? "text-livePiano-light/80" : "text-brand-dark/80 dark:text-brand-light/80"
                )}>
                  <h4 className={cn(
                    "text-2xl font-semibold text-center mb-4",
                    isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                  )}>
                    Service Components
                  </h4>
                  <ul className={cn(
                    "list-disc list-inside space-y-2",
                    isLivePianoTheme ? "[&>li]:marker:text-livePiano-primary [&>li]:marker:text-xl" : ""
                  )}>
                    <li><strong>Performance:</strong> {baseService.description}</li>
                    <li><strong>All-Inclusive Logistics:</strong> Covers all sheet music preparation, travel, and setup required for the evening.</li>
                    {invoice_type?.toLowerCase().includes('live piano') && <li><strong>Flexible Timing:</strong> Performance timing is flexible to dynamically respond to the needs of guests (the "on-call buffer").</li>}
                  </ul>
                </div>
                <p className={cn(
                  "text-3xl font-semibold text-center mt-8",
                  isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                )}>
                  All-Inclusive Engagement Fee: <strong className={isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>{currencySymbol}{baseAmount.toFixed(2)}</strong>
                </p>
              </section>
            )}
          </>
        )}

        <section className={cn(
          "p-8 rounded-xl border space-y-6 overflow-hidden",
          isLivePianoTheme ? "bg-livePiano-darker border-livePiano-border/30" : "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
        )}>
          <h3 className={cn(
            "text-3xl font-bold mb-6 text-center",
            isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
          )}>Important Booking Details</h3>
          <ul className={cn(
            "list-disc list-inside text-lg space-y-2",
            isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
          )}>
            {isErinKennedyQuote ? (
              <>
                <li><strong className="text-brand-primary">Your final invoice for the base services to Erin Kennedy will be A$400.00.</strong></li>
                <li><strong className="text-brand-primary">A non-refundable 50% deposit (A$200.00) is required immediately</strong> to formally secure the {event_date || 'event'} date.</li>
                <li>The remaining balance is due 7 days prior to the event.</li>
                <li><strong className="text-brand-primary">Bank Details for Payment:</strong> BSB: 923100, ACC: 301110875</li>
                <li><strong className="text-brand-primary">Keyboard Provision:</strong> Daniele kindly requests that MC Showroom provides a fully weighted keyboard or piano on stage, ready for use by 3:00 PM.</li>
                <li>To ensure thorough preparation, Daniele kindly requests PDF sheet music for all songs and a complete song list at least two weeks prior to the event (or earlier, if possible).</li>
                <li>To facilitate efficient scheduling, please inform Daniele of the total number of students participating in the concert as soon as possible. Daniele will then work to schedule rehearsals in convenient, grouped time blocks.</li>
              </>
            ) : (
              <>
                <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>A non-refundable {depositPercentage}% deposit ({currencySymbol}{safeRequiredDeposit.toFixed(2)}) is required immediately</strong> to formally secure the {event_date && format(new Date(event_date), 'EEEE d MMMM yyyy') || 'event'} date.</li>
                {paymentTerms && <li>{paymentTerms}</li>}
                {!paymentTerms && <li>The remaining balance is due 7 days prior to the event.</li>}
                
                {bankDetails && (
                  <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>Bank Details for Payment:</strong> BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}</li>
                )}
              </>
            )}
          </ul>
        </section>

        {/* Optional Add-Ons Section (for non-Erin Kennedy quotes) */}
        {addOns && addOns.length > 0 && !isErinKennedyQuote && (
          <section className={cn(
            "p-8 rounded-xl border space-y-8 overflow-hidden",
            isLivePianoTheme ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
          )}>
            <h3 className={cn(
              "text-3xl font-bold mb-6 text-center",
              isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
            )}>Optional Add-Ons</h3>
            <div className="space-y-4 max-w-2xl mx-auto">
              {addOns.map((item, index) => {
                const subtotal = item.cost * item.quantity;
                return (
                  <div key={index} className={cn(
                    "flex flex-col sm:flex-row sm:items-center sm:justify-between w-full rounded-md border p-4",
                    isLivePianoTheme ? "border-livePiano-border/50" : "border-brand-secondary/50",
                    item.quantity > 0 ? (isLivePianoTheme ? "bg-livePiano-background/50" : "bg-brand-secondary/20 dark:bg-brand-dark/50") : (isLivePianoTheme ? "bg-livePiano-background/20" : "bg-brand-light dark:bg-brand-dark-alt")
                  )}>
                    <div className="space-y-1 leading-none mb-4 sm:mb-0 sm:flex-1">
                      <p className={cn(
                        "text-xl font-bold leading-none",
                        isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                      )}>
                        {item.name}
                      </p>
                      {item.description && (
                        <p className={cn(
                          "text-base",
                          isLivePianoTheme ? "text-livePiano-light/70" : "text-brand-dark/70 dark:text-brand-light/70"
                        )}>
                          {item.description}
                        </p>
                      )}
                      <p className={cn(
                        "text-sm italic",
                        isLivePianoTheme ? "text-livePiano-light/60" : "text-brand-dark/60 dark:text-brand-light/60"
                      )}>
                        Unit Cost: {symbol}{item.cost.toFixed(2)} (Qty: {item.quantity})
                      </p>
                    </div>
                    <div className={cn(
                      "text-3xl font-bold flex-shrink-0 min-w-[180px] text-right",
                      isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                    )}>
                      {formatCurrency(subtotal, symbol)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Final Total Cost Display */}
        <div className={cn(
          "text-center mt-10 p-6 rounded-lg border",
          isLivePianoTheme ? "bg-livePiano-primary/10 border-livePiano-primary/30" : "bg-brand-primary/10 border-brand-primary/30"
        )}>
          <p className={cn(
            "text-2xl md:text-3xl font-bold",
            isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
          )}>
            Final Total Cost: <span className={cn(isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light", "text-4xl md:text-5xl")}>{formatCurrency(calculatedTotal, symbol)}</span>
          </p>
          <p className={cn(
            "text-xl text-center max-w-3xl mx-auto",
            isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
          )}>
            This includes your selected add-ons and the base quote amount.
          </p>
        </div>
      </main>

      <footer
        className={cn(
          "relative py-16 text-center overflow-hidden",
          isLivePianoTheme ? "" : "bg-brand-dark"
        )}
        style={{ backgroundImage: `url(/bowtie.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <p className={cn(
            "text-2xl font-semibold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8",
            isLivePianoTheme ? "text-livePiano-light" : "text-brand-light"
          )}>
            <a
              href="https://wa.me/61424174067"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 transition-colors",
                isLivePianoTheme ? "hover:text-livePiano-primary" : "hover:text-brand-primary"
              )}
            >
              <Phone size={24} /> 0424 174 067
            </a>
            <a
              href="mailto:info@danielebuatti.com"
              className={cn(
                "flex items-center gap-2 transition-colors",
                isLivePianoTheme ? "hover:text-livePiano-primary" : "hover:text-brand-primary"
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

export default QuoteDisplay;