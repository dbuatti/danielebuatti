"use client";

import React from 'react';
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
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
  };
  isAccepted?: boolean;
  isRejected?: boolean;
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
  const isErinKennedyQuote = data.event_title === "Erin Kennedy Quote";

  // --- Custom Erin Kennedy Quote Breakdown Renderer (Simplified for Preview) ---
  const renderErinKennedyQuote = () => {
    const onSitePerformanceCost = 300.00;
    const showPreparationFee = 100.00;
    const totalBaseInvoice = 400.00;
    const eventTimeEK = "3:00 PM – 6:00 PM";

    return (
      <>
        <section className={cn(
          "p-8 rounded-xl border space-y-6 overflow-hidden", // Removed shadow-2xl
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
        <section className={cn(
          "p-8 rounded-xl border space-y-6 overflow-hidden", // Removed shadow-2xl
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
      isLivePianoTheme ? "live-piano-theme bg-livePiano-background text-livePiano-light font-montserrat" : "bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light"
    )}>
      <section className="text-center space-y-6">
        <h2 className={cn(
          "text-4xl md:text-5xl font-extrabold mb-6 leading-none",
          isLivePianoTheme ? "font-libre-baskerville text-livePiano-primary" : "text-brand-primary"
        )}>
          {event_title}
        </h2>
        <div className={cn(
          "text-lg max-w-3xl mx-auto space-y-3 font-medium",
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
              "p-8 rounded-xl border space-y-6 overflow-hidden", // Removed shadow-2xl
              isLivePianoTheme ? "bg-livePiano-darker border-livePiano-border/30" : "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
            )}>
              <h3 className={cn(
                "text-3xl font-bold mb-6 text-center", // Removed text-shadow-sm
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
              <p className={cn(
                "text-3xl font-semibold text-center mt-8", // Removed text-shadow-sm
                isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
              )}>
                All-Inclusive Engagement Fee: <strong className={isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>{currencySymbol}{safeBaseServiceAmount.toFixed(2)}</strong>
              </p>
            </section>
          )}

          {/* Optional Add-Ons Section (Generic) */}
          {addOns.length > 0 && (
            <section className={cn(
              "p-8 rounded-xl border space-y-8 overflow-hidden", // Removed shadow-2xl
              isLivePianoTheme ? "bg-livePiano-darker border-livePiano-border/30" : "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
            )}>
              <h3 className="text-3xl font-bold mb-6 text-center text-brand-dark dark:text-brand-light">Optional Add-Ons</h3>
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
                      <div className="space-y-1 leading-none mb-4 sm:mb-0">
                        <p className={cn(
                          "text-xl font-bold leading-none",
                          isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                        )}>
                          {addOn.name}
                        </p>
                        {addOn.description && (
                          <p className={cn(
                            "text-base",
                            isLivePianoTheme ? "text-livePiano-light/70" : "text-brand-dark/70 dark:text-brand-light/70"
                          )}>
                            {addOn.description}
                          </p>
                        )}
                        <p className={cn(
                          "text-sm italic",
                          isLivePianoTheme ? "text-livePiano-light/60" : "text-brand-dark/60 dark:text-brand-light/60"
                        )}>
                          {quantity} x {currencySymbol}{cost.toFixed(2)}
                        </p>
                      </div>
                      <div className={cn(
                        "text-3xl font-bold sm:ml-auto",
                        isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                      )}>
                        {currencySymbol}{subtotal.toFixed(2)}
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
        "text-center mt-10 p-6 rounded-lg border", // Removed shadow-lg
        isLivePianoTheme ? "bg-livePiano-primary/10 border-livePiano-primary/30" : "bg-brand-primary/10 border-brand-primary/30"
      )}>
        <p className={cn(
          "text-2xl md:text-3xl font-bold",
          isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
        )}>
          Total Estimated Cost: <span className={cn(isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light", "text-4xl md:text-5xl")}>{currencySymbol}{safeTotalAmount.toFixed(2)}</span>
        </p>
      </div>

      {/* Booking Information / Important Details */}
      <section className={cn(
        "p-8 rounded-xl border space-y-6 overflow-hidden", // Removed shadow-2xl
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
              <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>A non-refundable {depositPercentage}% deposit ({currencySymbol}{safeRequiredDeposit.toFixed(2)}) is required immediately</strong> to formally secure the {event_date || 'event'} date.</li>
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
        <div className="text-center space-y-4 p-6 rounded-xl bg-brand-secondary/20 dark:bg-brand-dark/50">
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