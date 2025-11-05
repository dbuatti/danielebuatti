"use client";

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2, Wand2, Eye, Copy } from 'lucide-react';
import { useGeminiQuoteGenerator } from '@/hooks/use-gemini-quote-generator';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils'; // Import formatCurrency

// Zod schema for the quote form
const quoteFormSchema = z.object({
  emailContent: z.string().optional(), // New field for AI input
  clientName: z.string().min(1, { message: "Client name is required." }),
  clientEmail: z.string().email({ message: "A valid client email is required." }),
  invoiceType: z.string().min(1, { message: "Invoice type is required for categorization." }), // NEW FIELD
  eventTitle: z.string().min(1, { message: "Event title is required." }),
  eventDate: z.string().min(1, { message: "Event date is required (YYYY-MM-DD)." }),
  eventTime: z.string().optional(), // e.g., "6:00 PM - 9:00 PM"
  eventLocation: z.string().min(1, { message: "Event location is required." }),
  preparedBy: z.string().min(1, { message: "Prepared by name is required." }).default("Daniele Buatti"),
  baseServiceDescription: z.string().min(1, { message: "Base service description is required." }),
  baseServiceAmount: z.coerce.number().min(0, { message: "Base service amount must be a positive number." }),
  addOns: z.array(z.object({
    name: z.string().min(1, { message: "Add-on name is required." }),
    description: z.string().optional(),
    cost: z.coerce.number().min(0, { message: "Add-on cost must be a positive number." }),
    quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }).default(1), // ADDED QUANTITY
  })).optional(),
  depositPercentage: z.coerce.number().min(0).max(100).default(50),
  bankBSB: z.string().min(1, { message: "Bank BSB is required." }).default("923100"),
  bankACC: z.string().min(1, { message: "Bank Account Number is required." }).default("301110875"),
  currencySymbol: z.string().min(1, { message: "Currency symbol is required." }).default("A$"),
  paymentTerms: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  initialData?: QuoteFormValues;
  onSubmit: (values: QuoteFormValues) => Promise<void>;
  isSubmitting: boolean;
  onPreview: (values: QuoteFormValues) => void; // NEW PROP
}

const QuoteForm: React.FC<QuoteFormProps> = ({ initialData, onSubmit, isSubmitting, onPreview }) => {
  const { generateQuote, isGenerating } = useGeminiQuoteGenerator();
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: initialData || {
      emailContent: '',
      clientName: '',
      clientEmail: '',
      invoiceType: '', // Default value for new field
      eventTitle: '',
      eventDate: '',
      eventTime: '',
      eventLocation: '',
      preparedBy: 'Daniele Buatti',
      baseServiceDescription: '',
      baseServiceAmount: 0,
      addOns: [],
      depositPercentage: 50,
      bankBSB: '923100',
      bankACC: '301110875',
      currencySymbol: 'A$',
      paymentTerms: 'The remaining balance is due 7 days prior to the event.',
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "addOns",
  });

  // Watch the entire form state to ensure instant updates on any field change (including blur)
  const watchedFormValues = form.watch();
  
  const totalAmount = React.useMemo(() => {
    // Use watchedFormValues to access the latest state
    const baseServiceAmount = watchedFormValues.baseServiceAmount;
    const addOns = watchedFormValues.addOns;
    
    // Ensure baseServiceAmount is treated as a number, defaulting to 0 if invalid
    const base = typeof baseServiceAmount === 'number' ? baseServiceAmount : parseFloat(String(baseServiceAmount)) || 0;
    
    let total = base;
    addOns?.forEach((addOn: { cost: number, quantity: number }) => {
      // Ensure cost and quantity are treated as numbers, defaulting quantity to 1 if invalid
      const cost = typeof addOn.cost === 'number' ? addOn.cost : parseFloat(String(addOn.cost)) || 0;
      const quantity = typeof addOn.quantity === 'number' ? addOn.quantity : parseFloat(String(addOn.quantity)) || 1;
      total += cost * quantity;
    });
    return total;
  }, [watchedFormValues]); // Depend on the entire watched object

  const depositPercentage = watchedFormValues.depositPercentage;

  const requiredDeposit = React.useMemo(() => {
    return totalAmount * (depositPercentage / 100);
  }, [totalAmount, depositPercentage]);

  const handleAutoGenerate = async () => {
    console.log("Attempting AI Quote Generation...");
    
    const emailContent = watchedFormValues.emailContent;

    if (!emailContent || emailContent.trim().length < 50) {
      toast.warning("Please paste the full email conversation content (at least 50 characters) into the field above before auto-generating.");
      return;
    }
    
    console.log("Input content length:", emailContent.trim().length);

    const result = await generateQuote(emailContent);

    if (result) {
      // Map AI results to form fields
      form.setValue('clientName', result.clientName, { shouldValidate: true });
      form.setValue('clientEmail', result.clientEmail, { shouldValidate: true });
      form.setValue('eventTitle', result.eventTitle, { shouldValidate: true });
      form.setValue('invoiceType', result.eventTitle, { shouldValidate: true }); // Use event title as default invoice type
      form.setValue('eventDate', result.eventDate, { shouldValidate: true });
      form.setValue('eventTime', result.eventTime, { shouldValidate: true });
      form.setValue('eventLocation', result.eventLocation, { shouldValidate: true });
      form.setValue('baseServiceDescription', result.baseServiceDescription, { shouldValidate: true });
      form.setValue('baseServiceAmount', result.baseServiceAmount, { shouldValidate: true });
      form.setValue('currencySymbol', result.currencySymbol || 'A$', { shouldValidate: true });
      form.setValue('paymentTerms', result.paymentTerms || 'The remaining balance is due 7 days prior to the event.', { shouldValidate: true });
      
      // Ensure generated add-ons have a default quantity of 1
      const generatedAddOnsWithQuantity = result.addOns.map(a => ({ ...a, quantity: 1 }));
      replace(generatedAddOnsWithQuantity); // Replace existing add-ons with generated ones
      
      toast.success("Quote details auto-populated successfully!");
    }
  };

  const handlePreviewClick = () => {
    // Validate only the fields necessary for a basic preview
    const { clientName, eventTitle, eventDate, eventLocation, baseServiceDescription, baseServiceAmount } = form.getValues();
    if (!clientName || !eventTitle || !eventDate || !eventLocation || !baseServiceDescription || baseServiceAmount === 0) {
      toast.warning("Please fill out the required Client & Event Details and Base Service fields before previewing.");
      form.trigger(); // Trigger validation to show errors
      return;
    }
    onPreview(form.getValues());
  };

  const handleDuplicateAddOn = (index: number) => {
    const addOnToDuplicate = form.getValues('addOns')?.[index];
    if (addOnToDuplicate) {
      append({
        name: `${addOnToDuplicate.name} (Copy)`,
        description: addOnToDuplicate.description,
        cost: addOnToDuplicate.cost,
        quantity: addOnToDuplicate.quantity,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* AI Input Section */}
        <Card className="bg-brand-secondary/10 dark:bg-brand-dark/30 p-6 border-brand-secondary/50 shadow-none"> {/* Removed shadow */}
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
              <Wand2 className="h-5 w-5" /> AI Quote Extractor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <FormField
              control={form.control}
              name="emailContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paste Email Conversation Here</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste the full email thread (Client/Event/Fee details) here to auto-populate the form." 
                      rows={8} 
                      className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={handleAutoGenerate}
              disabled={isGenerating || isSubmitting || !watchedFormValues.emailContent || watchedFormValues.emailContent.trim().length < 50}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 text-brand-light"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting & Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Auto-Generate Quote from Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <h3 className="text-xl font-semibold text-brand-primary">Client & Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mama Alto" {...field} />
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
                <FormLabel>Client Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g., mama.alto@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="invoiceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Type (For Admin Categorization)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Live Piano Quote" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title (Public Facing)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mama Alto Holiday Special" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Format: YYYY-MM-DD</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Time (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3:30 PM arrival for 7 PM show" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Chapel off Chapel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preparedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prepared By</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-xl font-semibold text-brand-primary mt-8">Quote Line Items</h3>
        
        <h4 className="text-lg font-medium text-brand-dark dark:text-brand-light">Base Service</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="baseServiceDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., 3 hours of dedicated on-site presence" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baseServiceAmount"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>Amount ({watchedFormValues.currencySymbol})</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h4 className="text-lg font-medium text-brand-dark dark:text-brand-light mt-8">Optional Add-Ons</h4>
        <div className="space-y-4">
          {fields.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-4 p-4 border rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30 shadow-none">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"> {/* Added items-end for alignment */}
                <FormField
                  control={form.control}
                  name={`addOns.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Add-on Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pre-event rehearsal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`addOns.${index}.cost`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Cost ({watchedFormValues.currencySymbol})</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`addOns.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`addOns.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A 2-hour rehearsal session" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicateAddOn(index)}
                  className="border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50"
                >
                  <Copy className="h-4 w-4 mr-2" /> Duplicate
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: '', description: '', cost: 0, quantity: 1 })}
            className="w-full border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Add-on
          </Button>
        </div>

        <h3 className="text-xl font-semibold text-brand-primary mt-8">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currencySymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., A$" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="depositPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit Percentage (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="0" max="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bankBSB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank BSB</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankACC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
          />
        </div>
        </div>
        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms / Important Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., The remaining balance is due 7 days prior to the event." 
                  rows={4} 
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-8 p-6 bg-brand-primary/10 rounded-lg border border-brand-primary/30 text-center space-y-2">
          <p className="text-2xl font-bold text-brand-primary">Total Quote Amount: <span className="text-brand-dark dark:text-brand-light">{formatCurrency(totalAmount, watchedFormValues.currencySymbol)}</span></p>
          <p className="text-xl text-brand-dark/80 dark:text-brand-light/80">Required Deposit ({depositPercentage}%): <span className="font-semibold">{formatCurrency(requiredDeposit, watchedFormValues.currencySymbol)}</span></p>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handlePreviewClick}
            className="flex-1 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-dark dark:text-brand-light text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={isSubmitting || isGenerating}
          >
            <Eye className="mr-2 h-4 w-4" /> Preview Quote
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={isSubmitting || isGenerating}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Quote...
              </>
            ) : (
              'Create Quote'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoteForm;