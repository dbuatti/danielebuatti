"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { cn, formatCurrency } from '@/lib/utils'; // Assuming formatCurrency is here
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Minus, Plus, Phone, Mail } from 'lucide-react';

// Define AddOnItem type
export interface AddOnItem { // Exported for potential external use
  name: string;
  description?: string;
  cost: number;
  quantity: number;
}

// Define Quote type (simplified based on usage)
export interface Quote { // <--- EXPORTED THIS INTERFACE
  client_name?: string;
  client_email?: string;
  event_title?: string;
  invoice_type?: string;
  event_date?: string;
  total_amount: number;
  requiredDeposit: number;
  depositPercentage: number;
  paymentTerms?: string;
  bankDetails?: { bsb: string; acc: string };
  addOns?: AddOnItem[]; // Assuming addOns come from the quote object
  currencySymbol?: string;
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
    quantity: z.number().min(0).max(10), // Assuming max quantity 10
  })),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms to proceed.",
  }),
});

type QuoteFormValues = z.infer<typeof QuoteFormSchema>;

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLivePianoTheme, isErinKennedyQuote }) => {
  const [isActionTaken, setIsActionTaken] = useState(false); // State for action taken

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteFormSchema),
    defaultValues: {
      clientName: quote.client_name || "",
      clientEmail: quote.client_email || "",
      selectedAddOns: quote.addOns?.map(item => ({ ...item, quantity: item.quantity || 0 })) || [], // Ensure quantity is initialized
      acceptTerms: false,
    },
    mode: "onChange", // Validate on change
  });

  const { fields: addOnFields, update } = useFieldArray({
    control: form.control,
    name: "selectedAddOns",
  });

  // Function to update add-on field quantity
  const updateAddOnField = (index: number, newItem: AddOnItem) => {
    update(index, newItem);
  };

  // Calculate total based on selected add-ons
  const baseTotalAmount = typeof quote.total_amount === 'number' ? quote.total_amount : parseFloat(String(quote.total_amount)) || 0;
  const calculatedTotal = form.watch("selectedAddOns").reduce((acc, item) => {
    return acc + (item.cost * item.quantity);
  }, baseTotalAmount); // Start with base total_amount

  const onSubmitGeneric = (values: QuoteFormValues) => {
    console.log("Form submitted:", values);
    // Simulate API call
    setTimeout(() => {
      setIsActionTaken(true); // Set action taken to true on successful submission
      alert("Quote accepted successfully!");
    }, 1000);
  };

  const { depositPercentage, requiredDeposit, currencySymbol = '$' } = quote;

  // safeRequiredDeposit is used, so keep it.
  const safeRequiredDeposit = typeof requiredDeposit === 'number' ? requiredDeposit : parseFloat(String(requiredDeposit)) || 0;

  return (
    <div className={cn(
      "p-8 space-y-12",
      isLivePianoTheme ? "bg-livePiano-background text-livePiano-light" : "bg-brand-background text-brand-dark dark:text-brand-light"
    )}>
      <main className="space-y-12">
        {/* Important Booking Details Section */}
        <section className={cn(
          "p-8 rounded-xl border space-y-8 overflow-hidden",
          isLivePianoTheme ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
        )}>
          <h3 className={cn(
            "text-3xl font-bold mb-6 text-center font-display",
            isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
          )}>Important Booking Details</h3>
          <ul className={cn(
            "list-disc list-inside space-y-2 text-lg font-sans",
            isLivePianoTheme ? "text-livePiano-light/90" : "text-brand-dark/90 dark:text-brand-light/90"
          )}>
            {depositPercentage && requiredDeposit && (
              <>
                <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>A non-refundable {depositPercentage}% deposit ({formatCurrency(safeRequiredDeposit, currencySymbol)}) is required immediately</strong> to formally secure the {quote.event_date || 'event'} date.</li>
                {quote.paymentTerms && <li>{quote.paymentTerms}</li>}
              </>
            )}
            {quote.bankDetails && (
              <li><strong className={isLivePianoTheme ? "text-livePiano-primary" : "text-brand-primary"}>Bank Details for Payment:</strong> BSB: {quote.bankDetails.bsb}, ACC: {quote.bankDetails.acc}</li>
            )}
          </ul>
        </section>

        {/* Accept Your Quote Section */}
        <section className={cn(
          "p-8 rounded-xl border space-y-8 overflow-hidden",
          isLivePianoTheme ? "bg-livePiano-darker border-livePiano-primary/50" : "bg-brand-light dark:bg-brand-dark-alt border-brand-primary/50"
        )}>
          <h3 className={cn(
            "text-3xl font-bold mb-6 text-center font-display",
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
              <form onSubmit={form.handleSubmit(onSubmitGeneric)} className="space-y-6 max-w-xl mx-auto font-sans">
                {/* MOVED: Optional Add-Ons Section (Generic) - Now interactive with quantity */}
                {addOnFields.length > 0 && !isErinKennedyQuote && (
                  <div className="space-y-8">
                    <h4 className={cn(
                      "text-2xl font-bold text-center font-display",
                      isLivePianoTheme ? "text-livePiano-light" : "text-brand-dark dark:text-brand-light"
                    )}>Optional Add-Ons</h4>
                    <div className="space-y-4 max-w-2xl mx-auto">
                      {addOnFields.map((item: AddOnItem, index: number) => { // Explicitly type item and index
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
                            <div className="flex items-center space-x-1"> {/* Reduced space-x */}
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(-1)}
                                className={cn(
                                  "h-7 w-7", // Smaller buttons
                                  isLivePianoTheme ? "bg-livePiano-background border-livePiano-primary text-livePiano-primary hover:bg-livePiano-primary/20" : "border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                                )}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <FormField
                                control={form.control}
                                name={`selectedAddOns.${index}.quantity`}
                                render={({ field }: { field: ControllerRenderProps<QuoteFormValues, `selectedAddOns.${number}.quantity`> }) => (
                                  <FormItem className="w-12"> {/* Smaller width */}
                                    <FormControl>
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          const value = parseInt(e.target.value);
                                          handleQuantityChange(value - currentQuantity); // Adjust quantity based on input
                                        }}
                                        className={cn(
                                          "text-center h-7 px-1", // Smaller height and padding
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
                                className={cn(
                                  "h-7 w-7", // Smaller buttons
                                  isLivePianoTheme ? "bg-livePiano-background border-livePiano-primary text-livePiano-primary hover:bg-livePiano-primary/20" : "border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                                )}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className={cn(
                              "text-2xl font-bold flex-shrink-0 min-w-[140px] text-right font-sans", // Adjusted width here
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

                {/* Final Total Cost Display */}
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

                {/* Client Name Field */}
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

                {/* Client Email Field */}
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

                {/* Accept Terms Checkbox */}
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
                  className={cn(
                    "w-full text-xl py-7 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 font-sans",
                    isLivePianoTheme ? "bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker" : "bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
                  )}
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  {form.formState.isSubmitting ? "Submitting..." : `Accept Quote for ${formatCurrency(calculatedTotal, currencySymbol)}`}
                </Button>
              </form>
            </Form>
          )}
        </section>
      </main>

      {/* Footer Section */}
      <footer className={cn(
        "relative py-16 text-center overflow-hidden",
        isLivePianoTheme ? "" : "bg-brand-dark"
      )}>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <p className={cn(
            "text-2xl font-semibold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 font-sans",
            isLivePianoTheme ? "text-livePiano-light" : "text-brand-light"
          )}>
            <a href="tel:+61424174067" className={cn(
              "flex items-center gap-2 transition-colors",
              isLivePianoTheme ? "hover:text-livePiano-primary" : "hover:text-brand-primary"
            )}>
              <Phone size={24} /> 0424 174 067
            </a>
            <a href="mailto:info@danielebuatti.com" className={cn(
              "flex items-center gap-2 transition-colors",
              isLivePianoTheme ? "hover:text-livePiano-primary" : "hover:text-brand-primary"
            )}>
              <Mail size={24} /> info@danielebuatti.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuoteDisplay;