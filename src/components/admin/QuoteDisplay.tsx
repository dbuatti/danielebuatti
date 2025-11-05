"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Minus, Plus, Phone, Mail } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator'; // Added import for Separator

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
  event_location?: string; // Added missing property
  prepared_by?: string; // Added missing property
  total_amount: number;
  requiredDeposit: number;
  depositPercentage: number;
  paymentTerms?: string;
  bankDetails?: { bsb: string; acc: string };
  addOns?: AddOnItem[]; // Assuming addOns come from the quote object
  currencySymbol?: string;
  baseService?: { // Added baseService to Quote interface
    description: string;
    amount: number;
  };
  eventTime?: string; // Added eventTime to Quote interface
}

interface QuoteDisplayProps {
  quote: Quote;
  isLivePianoTheme: boolean;
  isErinKennedyQuote: boolean;
}

// Define form schema
const QuoteFormSchema = z.object({
  clientName: z.string().min(1, { message: "Your full name is required." }),
  clientEmail: z.string().email({ message: "A valid email address is required." }),
  selectedAddOns: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    cost: z.number(),
    quantity: z.number().min(0).max(10),
  })),
  acceptTerms: z.boolean().refine((val: boolean) => val === true, {
    message: "You must accept the terms to proceed.",
  }),
});

type QuoteFormValues = z.infer<typeof QuoteFormSchema>;

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLivePianoTheme, isErinKennedyQuote }) => {
  const [isActionTaken, setIsActionTaken] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    defaultValues: {
      clientName: quote.client_name || "",
      clientEmail: quote.client_email || "",
      selectedAddOns: quote.addOns?.map(item => ({ ...item, quantity: item.quantity || 0 })) || [],
      acceptTerms: false,
    },
    mode: "onChange",
  });

  const { fields: addOnFields, update } = useFieldArray<QuoteFormValues, "selectedAddOns", "id">({ // Explicitly typed useFieldArray
    control: form.control,
    name: "selectedAddOns",
  });

  const updateAddOnField = (index: number, newItem: AddOnItem) => {
    update(index, newItem);
  };

  const baseTotalAmount = typeof quote.baseService?.amount === 'number' ? quote.baseService.amount : parseFloat(String(quote.total_amount)) || 0; // Use baseService.amount if available
  const calculatedTotal = form.watch("selectedAddOns").reduce((acc: number, item: AddOnItem) => { // Explicitly typed acc and item
    return acc + (item.cost * item.quantity);
  }, baseTotalAmount);

  const onSubmitGeneric = (values: QuoteFormValues) => {
    console.log("Form submitted:", values);
    // In a real scenario, this would send data to an API
    setTimeout(() => {
      setIsActionTaken(true);
      alert("Quote accepted successfully!");
    }, 1000);
  };

  const { depositPercentage, requiredDeposit, currencySymbol = '$' } = quote; // Removed eventTime as it's not used here

  const safeRequiredDeposit = typeof requiredDeposit === 'number' ? requiredDeposit : parseFloat(String(requiredDeposit)) || 0;

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
            {quote.event_title || quote.invoice_type}
          </h2>
          <div className={cn(
            "text-xl max-w-3xl mx-auto space-y-3 font-medium",
            isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
          )}>
            <p>Prepared for: <strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>{quote.client_name}</strong></p>
            <p>Date of Event: {quote.event_date || 'N/A'}</p>
            {isErinKennedyQuote ? <p>Time: 3:00 PM – 6:00 PM</p> : quote.eventTime && <p>Time: {quote.eventTime}</p>}
            <p>Location: {quote.event_location || 'N/A'}</p>
            <p>Prepared by: {quote.prepared_by || 'N/A'}</p>
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
            {quote.baseService && (
              <section className={cn(
                "p-8 rounded-xl border space-y-6 overflow-hidden",
                isLivePianoTheme ? "bg-livePiano-darker border-livePiano-border/30" : "bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/30"
              )}>
                <h3 className={cn(
                  "text-3xl font-bold mb-6 text-center",
                  isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                )}>
                  {quote.baseService.description || "Base Engagement Fee"}
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
                    <li><strong>Performance:</strong> {quote.baseService.description}</li>
                    <li><strong>All-Inclusive Logistics:</strong> Covers all sheet music preparation, travel, and setup required for the evening.</li>
                    {quote.invoice_type?.toLowerCase().includes('live piano') && <li><strong>Flexible Timing:</strong> Performance timing is flexible to dynamically respond to the needs of guests (the "on-call buffer").</li>}
                  </ul>
                </div>
                <p className={cn(
                  "text-3xl font-semibold text-center mt-8",
                  isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                )}>
                  All-Inclusive Engagement Fee: <strong className={isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>{currencySymbol}{baseTotalAmount.toFixed(2)}</strong>
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
                <li><strong className="text-brand-primary">A non-refundable 50% deposit (A$200.00) is required immediately</strong> to formally secure the {quote.event_date || 'event'} date.</li>
                <li>The remaining balance is due 7 days prior to the event.</li>
                <li><strong className="text-brand-primary">Bank Details for Payment:</strong> BSB: 923100, ACC: 301110875</li>
                <li><strong className="text-brand-primary">Keyboard Provision:</strong> Daniele kindly requests that MC Showroom provides a fully weighted keyboard or piano on stage, ready for use by 3:00 PM.</li>
                <li>To ensure thorough preparation, Daniele kindly requests PDF sheet music for all songs and a complete song list at least two weeks prior to the event (or earlier, if possible).</li>
                <li>To facilitate efficient scheduling, please inform Daniele of the total number of students participating in the concert as soon as possible. Daniele will then work to schedule rehearsals in convenient, grouped time blocks.</li>
              </>
            ) : (
              <>
                <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>A non-refundable {depositPercentage}% deposit ({currencySymbol}{safeRequiredDeposit.toFixed(2)}) is required immediately</strong> to formally secure the {quote.event_date || 'event'} date.</li>
                {quote.paymentTerms && <li>{quote.paymentTerms}</li>}
                {!quote.paymentTerms && <li>The remaining balance is due 7 days prior to the event.</li>}
                
                {quote.bankDetails && (
                  <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>Bank Details for Payment:</strong> BSB: {quote.bankDetails.bsb}, ACC: {quote.bankDetails.acc}</li>
                )}
              </>
            )}
          </ul>
        </section>

        <section className={cn(
          "p-8 rounded-xl border space-y-8 overflow-hidden",
          isLivePianoTheme ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
        )}>
          <h3 className={cn(
            "text-3xl font-bold mb-6 text-center",
            isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
          )}>Accept Your Quote</h3>
          {isActionTaken ? (
            <div className="text-center space-y-4 font-sans">
              <p className={cn(
                "text-xl font-semibold",
                isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
              )}>Thank you for accepting your quote!</p>
              <p className={cn(
                "text-lg",
                isLivePianoTheme ? "text-livePiano-light/80" : "text-brand-dark/80 dark:text-brand-light/80"
              )}>A confirmation email has been sent to {form.getValues("clientEmail") || quote.client_email}.</p>
              <Button asChild size="lg" className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 font-sans">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitGeneric)} className="space-y-6 max-w-2xl mx-auto font-sans">
                
                {addOnFields.length > 0 && !isErinKennedyQuote && (
                  <div className="space-y-8">
                    <h4 className={cn(
                      "text-2xl font-bold text-center font-display",
                      isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                    )}>Optional Add-Ons</h4>
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
                          <div key={item.name} className={cn(
                            "flex flex-col sm:flex-row sm:items-center sm:justify-between w-full rounded-md border p-4",
                            isLivePianoTheme ? "border-livePiano-border/50" : "border-brand-secondary/50",
                            currentQuantity > 0 ? (isLivePianoTheme ? "bg-livePiano-background/50" : "bg-brand-secondary/20 dark:bg-brand-dark/50") : (isLivePianoTheme ? "bg-livePiano-background/20" : "bg-brand-light dark:bg-brand-dark-alt")
                          )}>
                            <div className="flex-grow mb-4 sm:mb-0">
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
                                {formatCurrency(cost, currencySymbol)} per item
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={currentQuantity <= 0}
                                className={cn(
                                  "h-7 w-7",
                                  isLivePianoTheme ? "bg-livePiano-background border-livePiano-primary text-livePiano-primary hover:bg-livePiano-primary/20" : "border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                                )}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <FormField
                                control={form.control}
                                name={`selectedAddOns.${index}.quantity`}
                                render={({ field }: { field: ControllerRenderProps<QuoteFormValues, `selectedAddOns.${number}.quantity`> }) => (
                                  <FormItem className="w-12">
                                    <FormControl>
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          const value = parseInt(e.target.value);
                                          handleQuantityChange(value - currentQuantity);
                                        }}
                                        className={cn(
                                          "text-center h-7 px-1",
                                          isLivePianoTheme ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary"
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
                                  "h-7 w-7",
                                  isLivePianoTheme ? "bg-livePiano-background border-livePiano-primary text-livePiano-primary hover:bg-livePiano-primary/20" : "border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                                )}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className={cn(
                              "text-2xl font-bold flex-shrink-0 min-w-[140px] text-right font-sans",
                              isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                            )}>
                              {formatCurrency(subtotal, currencySymbol)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className={cn(
                  "text-center mt-10 p-6 rounded-lg border",
                  isLivePianoTheme ? "bg-livePiano-primary/10 border-livePiano-primary/30" : "bg-brand-primary/10 border-brand-primary/30"
                )}>
                  <p className={cn(
                    "text-2xl md:text-3xl font-bold",
                    isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"
                  )}>
                    Final Total Cost: <span className={cn(isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light", "text-4xl md:text-5xl")}>{formatCurrency(calculatedTotal, currencySymbol)}</span>
                  </p>
                  <p className={cn(
                    "text-xl text-center max-w-3xl mx-auto",
                    isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
                  )}>
                    This includes your selected add-ons and the base quote amount.
                  </p>
                </div>

                <p className={cn(
                  "text-xl text-center max-w-3xl mx-auto",
                  isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
                )}>
                  Please fill out your details below to formally accept this quote.
                </p>

                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }: { field: ControllerRenderProps<QuoteFormValues, "clientName"> }) => (
                    <FormItem>
                      <FormLabel className={isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>Your Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={quote.client_name || "Your Name"}
                          className={cn(
                            isLivePianoTheme ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60 focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
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
                  render={({ field }: { field: ControllerRenderProps<QuoteFormValues, "clientEmail"> }) => (
                    <FormItem>
                      <FormLabel className={isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"}>Your Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={quote.client_email || "your@email.com"}
                          className={cn(
                            isLivePianoTheme ? "bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60 focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2" : "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
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
                  render={({ field }: { field: ControllerRenderProps<QuoteFormValues, "acceptTerms"> }) => (
                    <FormItem className={cn(
                      "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
                      isLivePianoTheme ? "border-livePiano-border/50" : "border-brand-secondary"
                    )}>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="accept-terms"
                          className={cn(
                            "h-5 w-5 mt-1",
                            isLivePianoTheme ? "border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker" : "border-brand-primary text-brand-dark data-[state=checked]:bg-brand-primary data-[state=checked]:text-brand-light"
                          )}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="accept-terms" className={cn(
                          "text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                          isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                        )}>
                          I, <span className={isLivePianoTheme ? "text-livePiano-primary font-semibold" : "text-brand-primary font-semibold"}>{form.watch("clientName") || quote.client_name || "Your Name"}</span>, accept this quote for the {quote.event_title || quote.invoice_type} on {quote.event_date || 'the specified date'}.
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
                    "w-full text-xl py-7 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105",
                    isLivePianoTheme ? "bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker" : "bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
                  )}
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  {form.formState.isSubmitting ? "Submitting..." : `Accept Quote for ${currencySymbol}${calculatedTotal.toFixed(2)}`}
                </Button>
              </form>
            </Form>
          )}
        </section>
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