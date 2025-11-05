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

  // Define symbol and calculatedTotal for this component
  const symbol = currencySymbol || 'A$';

  const calculatedTotal = React.useMemo(() => {
    let total = safeBaseServiceAmount;
    addOns?.forEach((addOn: AddOn) => {
      const quantity = typeof addOn.quantity === 'number' ? addOn.quantity : parseFloat(String(addOn.quantity)) || 0;
      const cost = typeof addOn.cost === 'number' ? addOn.cost : parseFloat(String(addOn.cost)) || 0;
      total += cost * quantity;
    });
    return total;
  }, [addOns, safeBaseServiceAmount]);

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
                <TableRow className="border-b border-brand-secondary/20">
                  <TableCell className="font-semibold text-brand-dark dark:text-brand-light">Performance & On-Site Engagement</TableCell>
                  <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                    3 hours of dedicated on-site presence, including arrival, setup, soundcheck, and performance ({eventTimeEK}).
                    <br />
                    Rate: A$100/hr (effective rate for this package)
                  </TableCell>
                  <TableCell className="text-right font-semibold text-brand-primary">{formatCurrency(onSitePerformanceCost, 'A$')}</TableCell>
                </TableRow>
                <TableRow className="border-b border-brand-secondary/20">
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
                          "text-2xl font-bold sm:ml-auto flex-shrink-0 min-w-[140px] text-right font-sans", // Adjusted width here
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
          Total Estimated Cost: <span className={cn(isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light", "text-4xl md:text-5xl")}>{formatCurrency(calculatedTotal, symbol)}</span>
        </p>
      </div>

      {/* Booking Information / Important Details */}
      <section className={cn(
        "p-8 rounded-xl border space-y-6 overflow-hidden",
        "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
      )}>
        <h3 className={cn(
            "text-3xl font-bold mb-6 text-center font-display",
            isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
          )}>Important Booking Details</h3>
        <ul className={cn(
          "list-disc list-inside text-lg space-y-2 pl-4 font-sans",
          isLivePianoTheme ? "text-livePiano-light/90 [&>li::marker]:text-livePiano-primary" : "text-brand-dark/90 dark:text-brand-light/90 [&>li::marker]:text-brand-primary"
        )}>
          {isErinKennedyQuote ? (
            <>
              <li><strong className="text-brand-primary">Your final invoice for the base services to Erin Kennedy will be {formatCurrency(total_amount, 'A$')}.</strong></li>
              <li><strong className="text-brand-primary">A non-refundable 50% deposit ({formatCurrency(safeRequiredDeposit, 'A$')}) is required immediately</strong> to formally secure the {event_date || 'event'} date.</li>
              <li>The remaining balance is due 7 days prior to the event.</li>
              <li><strong className="text-brand-primary">Bank Details for Payment:</strong> BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}</li>
              <li><strong className="text-brand-primary">Keyboard Provision:</strong> Daniele kindly requests that MC Showroom provides a fully weighted keyboard or piano on stage, ready for use by {eventTime || '3:00 PM'}.</li>
              <li>To ensure thorough preparation, Daniele kindly requests PDF sheet music for all songs and a complete song list at least two weeks prior to the event (or earlier, if possible).</li>
              <li>To facilitate efficient scheduling, please inform Daniele of the total number of students participating in the concert as soon as possible. Daniele will then work to schedule rehearsals in convenient, grouped time blocks.</li>
            </>
          ) : (
            <>
              <li><strong className={isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"}>A non-refundable {depositPercentage}% deposit ({formatCurrency(safeRequiredDeposit, currencySymbol)}) is required immediately</strong> to formally secure the {event_date || 'event'} date.</li>
              {paymentTerms && <li>{paymentTerms}</li>}
              {!paymentTerms && <li>The remaining balance is due 7 days prior to the event.</li>}
              
              {bankDetails && (
                <li><strong className={isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"}>Bank Details for Payment:</strong> BSB: {bankDetails.bsb}, ACC: {bankDetails.acc}</li>
              )}
            </>
          )}
        </ul>
      </section>

      {/* Client Acceptance Form - WRAP EVERYTHING DYNAMIC INSIDE HERE */}
      <section className={cn(
        "p-8 rounded-xl border space-y-8 overflow-hidden",
        isLivePianoQuote ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
      )}>
        <h3 className={cn(
            "text-3xl font-bold mb-6 text-center font-display",
            isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
          )}>Accept Your Quote</h3>
          {isActionTaken ? (
            <div className="text-center space-y-4 font-sans">
              {isAccepted && (
                <p className="text-2xl font-bold text-green-500">This quote has already been accepted!</p>
              )}
              {isRejected && (
                <p className="text-2xl font-bold text-red-500">This quote has been rejected.</p>
              )}
              <Button asChild size="lg" className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 font-sans">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitGeneric)} className="space-y-6 max-w-xl mx-auto font-sans">
                
                {/* MOVED: Optional Add-Ons Section (Generic) - Now interactive with quantity */}
                {addOnFields.length > 0 && !isErinKennedyQuote && (
                  <div className="space-y-8">
                    <h4 className="text-2xl font-bold text-center font-display text-brand-dark dark:text-brand-light">Adjust Optional Add-Ons</h4>
                    <div className="space-y-4 max-w-2xl mx-auto">
                      {addOnFields.map((item: AddOnItem, index) => { // Explicitly type item
                        const cost = parseFloat(String(item.cost)) || 0;
                        const currentQuantity = parseFloat(String(form.watch(`selectedAddOns.${index}.quantity`))) || 0;
                        const subtotal = cost * currentQuantity;
                        
                        const handleQuantityChange = (delta: number) => {
                          const newQuantity = Math.max(0, Math.min(10, currentQuantity + delta));
                          updateAddOnField(index, { ...item, quantity: newQuantity });
                        };

                        return (
                          <div key={item.id} className={cn(
                            "flex flex-col sm:flex-row sm:items-center sm:justify-between w-full rounded-md border p-4",
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
                                Unit Cost: {formatCurrency(cost, symbol)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 sm:w-auto sm:flex-shrink-0 sm:justify-end"> {/* Reduced gap */}
                              <div className="flex items-center space-x-1"> {/* Reduced space-x */}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(-1)}
                                  disabled={currentQuantity <= 0}
                                  className={cn(
                                    "h-7 w-7", // Smaller buttons
                                    isLivePianoQuote ? "bg-livePiano-background border-livePiano-primary text-livePiano-primary hover:bg-livePiano-primary/20" : "border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                                  )}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <FormField
                                  control={form.control}
                                  name={`selectedAddOns.${index}.quantity`}
                                  render={({ field }) => (
                                    <FormItem className="w-12"> {/* Smaller width */}
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
                                            "text-center h-7 px-1", // Smaller height and padding
                                            isLivePianoQuote ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary"
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
                                    "h-7 w-7", // Smaller buttons
                                    isLivePianoQuote ? "bg-livePiano-background border-livePiano-primary text-livePiano-primary hover:bg-livePiano-primary/20" : "border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                                  )}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className={cn(
                                "text-2xl font-bold flex-shrink-0 min-w-[140px] text-right font-sans", // Adjusted width here
                                isLivePianoQuote ? "text-livePiano-primary" : "text-brand-primary"
                              )}>
                                {formatCurrency(subtotal, symbol)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* MOVED: Total Estimated Cost (Now Dynamic) */}
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
                </div>
              
              <p className={cn(
                "text-xl text-center max-w-3xl mx-auto",
                isLivePianoQuote ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
              )}>
                Please fill out your details below to formally accept this quote.
              </p>

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>Your Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={quote.client_name || "Your Name"}
                        className={cn(
                          isLivePianoQuote ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60 focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                        )}
                        {...field}
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
                    <FormLabel className={isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>Your Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={quote.client_email || "your@email.com"}
                        className={cn(
                          isLivePianoQuote ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60 focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                        )}
                        {...field}
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
                  <FormItem className={cn(
                    "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
                    isLivePianoQuote ? "border-livePiano-border/50" : "border-brand-secondary"
                  )}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="accept-terms"
                        className={cn(
                          "h-5 w-5 mt-1",
                          isLivePianoQuote ? "border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker" : "border-brand-primary text-brand-dark data-[state=checked]:bg-brand-primary data-[state=checked]:text-brand-light"
                        )}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="accept-terms" className={cn(
                        "text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        isLivePianoQuote ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                      )}>
                        I, <span className={isLivePianoQuote ? "text-livePiano-primary font-semibold" : "text-brand-primary font-semibold"}>{form.watch("clientName") || quote.client_name || "Your Name"}</span>, accept this quote for the {quote.event_title || quote.invoice_type} on {quote.event_date || 'the specified date'}.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className={cn(
                  "w-full text-xl py-7 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 font-sans",
                  isLivePianoQuote ? "bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker" : "bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
                )}
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? "Submitting..." : `Accept Quote for ${formatCurrency(calculatedTotal, symbol)}`}
              </Button>
            </form>
            </Form>
          )}
        </section>
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
            "text-2xl font-semibold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 font-sans",
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