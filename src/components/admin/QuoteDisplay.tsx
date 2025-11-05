"use client";

import React from 'react';
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from '@/lib/utils'; // Import formatCurrency
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

// Define the structure for the data this component accepts
interface BaseService {
  description: string;
  amount: number;
}

interface AddOn {
  name: string;
  description?: string;
  cost: number;
  quantity: number;
}

// EXPORTED INTERFACE
export interface QuoteDisplayData {
  client_name: string;
  event_title: string;
  event_date?: string | null;
  event_location?: string;
  prepared_by?: string;
  total_amount: number;
  details: {
    baseService: BaseService;
    addOns: AddOn[];
    depositPercentage: number;
    requiredDeposit: number;
    bankDetails: { bsb: string; acc: string };
    eventTime?: string;
    currencySymbol: string;
    paymentTerms?: string;
    // Added specific properties for Erin Kennedy Quote
    on_site_performance_cost?: number;
    show_preparation_fee?: number;
  };
  isAccepted?: boolean;
  isRejected?: boolean;
  invoice_type?: string; // Added invoice_type for theme detection
}

interface QuoteDisplayProps {
  data: QuoteDisplayData;
  isLivePianoTheme?: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ data, isLivePianoTheme = false }) => {
  const {
    client_name,
    event_title,
    event_date,
    event_location,
    prepared_by,
    total_amount,
    details,
    isAccepted,
    isRejected,
    invoice_type,
  } = data;

  const {
    baseService,
    addOns,
    depositPercentage,
    requiredDeposit,
    bankDetails,
    eventTime,
    currencySymbol,
    paymentTerms,
  } = details;

  // Ensure total_amount is a number before using toFixed
  const safeTotalAmount = typeof total_amount === 'number' ? total_amount : parseFloat(String(total_amount)) || 0;
  const safeRequiredDeposit = typeof requiredDeposit === 'number' ? requiredDeposit : parseFloat(String(requiredDeposit)) || 0;
  
  // Safely access baseService amount
  const safeBaseServiceAmount = typeof baseService?.amount === 'number' ? baseService.amount : parseFloat(String(baseService?.amount)) || 0;

  // Determine if it's the hardcoded Erin Kennedy quote (for specific layout)
  const isErinKennedyQuote = invoice_type === "Erin Kennedy Quote";

  // --- Custom Erin Kennedy Quote Breakdown Renderer (Simplified for Preview) ---
  const renderErinKennedyQuote = () => {
    // Use data from the prop if available, otherwise fallback to hardcoded for consistency in preview
    const onSitePerformanceCost = data.details?.on_site_performance_cost || 300.00;
    const showPreparationFee = data.details?.show_preparation_fee || 100.00;
    const totalBaseInvoice = data.total_amount || 400.00; // Use total_amount from data
    const eventTimeEK = data.details?.eventTime || "3:00 PM – 6:00 PM";

    return (
      <>
        <section className={cn(
          "p-8 rounded-xl border space-y-6 overflow-hidden",
          "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
        )}>
          <h3 className="text-3xl font-bold mb-6 text-center font-display text-brand-primary">
            Quote Breakdown
          </h3>
          <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse font-sans">
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
                  <TableCell className="text-right font-semibold text-brand-primary">{formatCurrency(onSitePerformanceCost, 'A$')}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                  <TableCell className="font-semibold text-brand-dark dark:text-brand-light">Production Coordination & Music Preparation</TableCell>
                  <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                    A flat fee covering essential behind-the-scenes work: coordinating with all students, collecting and formatting sheet music, and preparing for a seamless production.
                  </TableCell>
                  <TableCell className="text-right font-semibold text-brand-primary">{formatCurrency(showPreparationFee, 'A$')}</TableCell>
                </TableRow>
                <TableRow className="bg-brand-primary/10 dark:bg-brand-primary/20 font-bold">
                  <TableCell colSpan={2} className="text-brand-primary text-lg">TOTAL BASE INVOICE <span className="font-normal text-sm text-brand-dark/70 dark:text-brand-light/70">(To be paid by Erin Kennedy)</span></TableCell>
                  <TableCell className="text-right text-brand-primary text-lg">{formatCurrency(totalBaseInvoice, 'A$')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
        <section className={cn(
          "p-8 rounded-xl border space-y-6 overflow-hidden",
          "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
        )}>
          <h3 className="text-3xl font-bold font-display text-brand-primary text-center">Optional Rehearsal Support for Students</h3>
          <p className="text-lg font-sans text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
            To help students feel fully prepared and confident for their performance, Daniele offers dedicated 1:1 rehearsal opportunities at his studio in Toorak.
          </p>
          <div className="max-w-md mx-auto space-y-4 font-sans">
            <h4 className="text-xl font-semibold text-brand-primary">Individual Rehearsal Rates:</h4>
            <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-1 pl-4">
              <li>15-minute rehearsal: {formatCurrency(30, 'A$')}</li>
              <li>30-minute rehearsal: {formatCurrency(50, 'A$')}</li>
              <li>45-minute rehearsal: {formatCurrency(75, 'A$')}</li>
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
      isLivePianoTheme ? "live-piano-theme bg-livePiano-background text-livePiano-light font-montserrat" : "bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light"
    )}>
      <section className="text-center space-y-6">
        <h2 className={cn(
          "text-4xl md:text-5xl font-extrabold mb-6 leading-none",
          isLivePianoTheme ? "font-libre-baskerville text-livePiano-primary" : "font-display text-brand-primary" // Use font-display for default theme
        )}>
          {event_title}
        </h2>
        <div className={cn(
          "text-lg max-w-3xl mx-auto space-y-3 font-medium font-sans",
          isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
        )}>
          <p>Prepared for: <strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>{client_name}</strong></p>
          <p>Date of Event: {event_date ? format(new Date(event_date), 'PPP') : 'N/A'}</p>
          {eventTime && <p>Time: {eventTime}</p>}
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
          {/* Base Service Section (Generic) */}
          {baseService && (
            <section className={cn(
              "p-8 rounded-xl border space-y-6 overflow-hidden",
              "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
            )}>
              <h3 className={cn(
                "text-3xl font-bold mb-6 text-center font-display",
                isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
              )}>
                {baseService.description || "Base Engagement Fee"}
              </h3>
              <p className={cn(
                "text-xl text-center max-w-3xl mx-auto font-sans",
                isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
              )}>
                This fee secures a premium, seamless musical experience for your event.
              </p>
              <div className={cn(
                "space-y-4 max-w-3xl mx-auto font-sans",
                isLivePianoTheme ? "text-livePiano-light/80" : "text-brand-dark/80 dark:text-brand-light/80"
              )}>
                  <h4 className={cn(
                    "text-2xl font-semibold text-center mb-4 font-display",
                    isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                  )}>
                    Service Components
                  </h4>
                  <ul className={cn(
                    "list-disc list-inside space-y-2 pl-4",
                    isLivePianoTheme ? "[&>li]:marker:text-livePiano-primary [&>li]:marker:text-xl" : ""
                  )}>
                    <li><strong>Performance:</strong> {baseService.description}</li>
                    <li><strong>All-Inclusive Logistics:</strong> Covers all sheet music preparation, travel, and setup required for the evening.</li>
                    {isLivePianoTheme && <li><strong>Flexible Timing:</strong> Performance timing is flexible to dynamically respond to the needs of guests (the "on-call buffer").</li>}
                  </ul>
                </div>
                <p className={cn(
                  "text-3xl font-semibold text-center mt-8 font-sans",
                  isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                )}>
                  All-Inclusive Engagement Fee: <strong className={isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>{formatCurrency(safeBaseServiceAmount, currencySymbol)}</strong>
                </p>
              </section>
            )}

            {/* Optional Add-Ons Section (Generic) */}
            {addOns.length > 0 && (
              <section className={cn(
                "p-8 rounded-xl border space-y-8 overflow-hidden",
                isLivePianoTheme ? "bg-livePiano-darker border-livePiano-border/30" : "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
              )}>
                <h3 className="text-3xl font-bold mb-6 text-center font-display text-brand-dark dark:text-brand-light">Optional Add-Ons</h3>
                <div className="space-y-4 max-w-2xl mx-auto">
                  {addOns.map((addOn: AddOn, index: number) => {
                    // Ensure cost and quantity are numbers
                    const cost = typeof addOn.cost === 'number' ? addOn.cost : parseFloat(String(addOn.cost)) || 0;
                    const quantity = typeof addOn.quantity === 'number' ? addOn.quantity : parseFloat(String(addOn.quantity)) || 1;
                    const subtotal = cost * quantity;
                    
                    return (
                      <div key={index} className={cn(
                        "flex flex-col sm:flex-row sm:items-center sm:justify-between w-full rounded-md border p-4",
                        isLivePianoTheme ? "border-livePiano-border/50 bg-livePiano-background/30" : "border-brand-secondary/50 bg-brand-secondary/10 dark:bg-brand-dark/30"
                      )}>
                        <div className="space-y-1 leading-none mb-4 sm:mb-0 sm:flex-1">
                          <p className={cn(
                            "text-xl font-bold leading-none font-sans",
                            isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                          )}>
                            {addOn.name}
                          </p>
                          {addOn.description && (
                            <p className={cn(
                              "text-base font-sans",
                              isLivePianoTheme ? "text-livePiano-light/70" : "text-brand-dark/70 dark:text-brand-light/70"
                            )}>
                              {addOn.description}
                            </p>
                          )}
                          <p className={cn(
                            "text-sm italic font-sans",
                            isLivePianoTheme ? "text-livePiano-light/60" : "text-brand-dark/60 dark:text-brand-light/60"
                          )}>
                            {quantity} x {formatCurrency(cost, currencySymbol)}
                          </p>
                        </div>
                        <div className={cn(
                          "text-3xl font-bold sm:ml-auto flex-shrink-0 min-w-[120px] text-right font-sans", // Adjusted width here
                          isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                        )}>
                          {formatCurrency(subtotal, currencySymbol)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

      {/* Total Estimated Cost */}
      <div className={cn(
        "text-center mt-10 p-6 rounded-lg border",
        isLivePianoTheme ? "bg-livePiano-primary/10 border-livePiano-primary/30" : "bg-brand-primary/10 border-brand-primary/30"
      )}>
        <p className={cn(
          "text-2xl md:text-3xl font-bold font-sans",
          isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
        )}>
          Total Estimated Cost: <span className={cn(isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light", "text-4xl md:text-5xl")}>{formatCurrency(safeTotalAmount, currencySymbol)}</span>
        </p>
      </div>

      {/* Booking Information / Important Details */}
      <section className={cn(
        "p-8 rounded-xl border space-y-6 overflow-hidden",
        "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
      )}>
        <h3 className={cn(
          "text-3xl font-bold mb-6 text-center font-display",
          isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
        )}>Important Booking Details</h3>
        <ul className={cn(
          "list-disc list-inside text-lg space-y-2 pl-4 font-sans",
          isLivePianoTheme ? "text-livePiano-light/90 [&>li::marker]:text-livePiano-primary" : "text-brand-dark/90 dark:text-brand-light/90 [&>li::marker]:text-brand-primary"
        )}>
          {isErinKennedyQuote ? (
            <>
              <li><strong className="text-brand-primary">Your final invoice for the base services to Erin Kennedy will be {formatCurrency(data.total_amount, 'A$')}.</strong></li>
              <li><strong className="text-brand-primary">A non-refundable 50% deposit ({formatCurrency(data.details?.requiredDeposit || 0, 'A$')}) is required immediately</strong> to formally secure the {event_date || 'event'} date.</li>
              <li>The remaining balance is due 7 days prior to the event.</li>
              <li><strong className="text-brand-primary">Bank Details for Payment:</strong> BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}</li>
              <li><strong className="text-brand-primary">Keyboard Provision:</strong> Daniele kindly requests that MC Showroom provides a fully weighted keyboard or piano on stage, ready for use by {eventTime || '3:00 PM'}.</li>
              <li>To ensure thorough preparation, Daniele kindly requests PDF sheet music for all songs and a complete song list at least two weeks prior to the event (or earlier, if possible).</li>
              <li>To facilitate efficient scheduling, please inform Daniele of the total number of students participating in the concert as soon as possible. Daniele will then work to schedule rehearsals in convenient, grouped time blocks.</li>
            </>
          ) : (
            <>
              <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>A non-refundable {depositPercentage}% deposit ({formatCurrency(safeRequiredDeposit, currencySymbol)}) is required immediately</strong> to formally secure the {event_date || 'event'} date.</li>
              {paymentTerms && <li>{paymentTerms}</li>}
              {!paymentTerms && <li>The remaining balance is due 7 days prior to the event.</li>}
              
              {bankDetails && (
                <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>Bank Details for Payment:</strong> BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}</li>
              )}
            </>
          )}
        </ul>
      </section>

      {/* Acceptance Status (Only for preview/admin view) */}
      {(isAccepted || isRejected) && (
        <div className="text-center space-y-4 font-sans p-6 rounded-xl bg-brand-secondary/20 dark:bg-brand-dark/50">
          {isAccepted && (
            <p className="text-2xl font-bold text-green-500">This quote has been accepted.</p>
          )}
          {isRejected && (
            <p className="text-2xl font-bold text-red-500">This quote has been rejected.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuoteDisplay;