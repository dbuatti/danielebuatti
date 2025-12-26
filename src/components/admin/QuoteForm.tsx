"use client";

import { z } from 'zod';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Eye, Save, Send, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrency } from '@/lib/utils';
import { useMemo } from 'react';
import PillToggle from './PillToggle';
import RichTextPreview from './RichTextPreview';
import { calculateQuoteTotal, calculatePreDiscountTotal } from '@/lib/quote-utils'; // Import both calculation utilities

// Define the schema for a single item (compulsory or add-on)
const ItemSchema = z.object({
  id: z.string().min(1, 'ID is required.'), // Changed to required string
  name: z.string().min(1, 'Item name is required.'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative.'), // Consolidated field
  quantity: z.number().min(1, 'Quantity must be at least 1.').optional(), // Made optional here, but enforced below for compulsory items
  scheduleDates: z.string().optional(), // NEW: Schedule/Dates field
  // NEW: Item-level visibility toggles
  showScheduleDates: z.boolean().default(false), // Default to false
  showQuantity: z.boolean().default(true),
  showRate: z.boolean().default(true),
});

// Define the main form schema
export const QuoteFormSchema = z.object({
  clientName: z.string().min(1, 'Client Name is required.'),
  clientEmail: z.string().email('Must be a valid email address.'),
  invoiceType: z.enum(['Quote', 'Invoice']),
  eventTitle: z.string().min(1, 'Event Title is required.'),
  eventDate: z.string().min(1, 'Event Date is required.'),
  eventTime: z.string().optional(),
  eventLocation: z.string().min(1, 'Event Location is required.'),
  preparedBy: z.string().min(1, 'Prepared By is required.'),
  currencySymbol: z.string().min(1, 'Currency symbol is required.'),
  depositPercentage: z.number().min(0).max(100, 'Deposit must be between 0 and 100.'),
  
  // --- Discount Fields ---
  discountPercentage: z.number().min(0).max(100, 'Discount percentage must be between 0 and 100.').default(0),
  discountAmount: z.number().min(0, 'Discount amount must be non-negative.').default(0),
  // -----------------------
  
  paymentTerms: z.string().optional(),
  bankBSB: z.string().min(1, 'BSB is required.'),
  bankACC: z.string().min(1, 'Account Number is required.'),
  theme: z.enum(['default', 'black-gold']),
  headerImageUrl: z.string().optional(),
  headerImagePosition: z.string().optional(),

  preparationNotes: z.string().optional(),
  scopeOfWorkUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')), // NEW FIELD

  // Ensure compulsory items have a quantity of at least 1
  compulsoryItems: z.array(ItemSchema.extend({
    quantity: z.number().min(1, 'Quantity must be at least 1.'),
  })).min(1, 'At least one compulsory item is required.'),
  
  // Add-ons can have a quantity of 0
  addOns: z.array(ItemSchema.extend({
    quantity: z.number().min(0, 'Quantity must be non-negative.'),
  })),
});

export type QuoteFormValues = z.infer<typeof QuoteFormSchema>;

interface QuoteFormProps {
  form: ReturnType<typeof useFormContext<QuoteFormValues>>;
  onCreateAndSend: (values: QuoteFormValues) => Promise<void>;
  isSubmitting: boolean;
  onPreview: (values: QuoteFormValues) => void;
  onSaveDraft?: (values: QuoteFormValues) => Promise<void>;
  isQuoteCreated?: boolean;
  onClearForm?: () => void;
  submitButtonText?: string; // NEW: Custom submit button text
}

const QuoteForm: React.FC<QuoteFormProps> = ({ form, onCreateAndSend, isSubmitting, onPreview, onSaveDraft, isQuoteCreated = false, onClearForm, submitButtonText }) => {
  const { control, handleSubmit, getValues, watch, formState: { isValid } } = form;

  const { fields: compulsoryFields, append: appendCompulsory, remove: removeCompulsory } = useFieldArray({
    control,
    name: 'compulsoryItems',
  });

  const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
    control,
    name: 'addOns',
  });

  // Watch all relevant fields for dynamic calculation
  const watchedFields = watch(['compulsoryItems', 'addOns', 'currencySymbol', 'depositPercentage', 'discountPercentage', 'discountAmount']);

  const { totalAmount, depositAmount, currencySymbol, depositPercentage, discountPercentage, discountAmount, preDiscountTotal, totalDiscountApplied } = useMemo<{
    preDiscountTotal: number;
    totalAmount: number;
    depositAmount: number;
    currencySymbol: string;
    depositPercentage: number;
    discountPercentage: number;
    discountAmount: number;
    totalDiscountApplied: number;
  }>(() => {
    const values = getValues(); // Get current form values for calculation
    const currencySymbol = values.currencySymbol || '£';
    const depositPercentage = values.depositPercentage || 0;
    const discountPercentage = values.discountPercentage || 0;
    const discountAmount = values.discountAmount || 0;

    const preDiscountTotal = calculatePreDiscountTotal(values.compulsoryItems, values.addOns);
    const totalAmount = calculateQuoteTotal(values);
    const depositAmount = totalAmount * (depositPercentage / 100);
    const totalDiscountApplied = preDiscountTotal - totalAmount;

    return { preDiscountTotal, totalAmount, depositAmount, currencySymbol, depositPercentage, discountPercentage, discountAmount, totalDiscountApplied };
  }, [watchedFields, getValues]); // Recalculate when watched fields change

  const handlePreview = () => {
    onPreview(getValues());
  };

  const handleSave = () => {
    if (onSaveDraft) {
      onSaveDraft(getValues());
    }
  };

  const handleFinalSubmit = (values: QuoteFormValues) => {
    onCreateAndSend(values);
  };

  const defaultSubmitText = isQuoteCreated
    ? (onSaveDraft ? 'Create & Send Quote' : 'Update Quote')
    : 'Create & Send Quote';
    
  const finalSubmitButtonText = submitButtonText || defaultSubmitText;

  const inputClasses = "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary";

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-8">

        {/* Action Buttons & Totals */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-brand-secondary/10 dark:bg-brand-dark/50 rounded-lg border border-brand-secondary/30">
            <div className="space-y-1">
                <p className="text-sm font-medium text-brand-dark/70 dark:text-brand-light/70">Subtotal (Pre-Discount):</p>
                <p className="text-xl font-bold text-brand-dark/70 dark:text-brand-light/70">
                    {formatCurrency(preDiscountTotal, currencySymbol)}
                </p>
                {totalDiscountApplied > 0.01 && (
                    <>
                        <p className="text-sm font-medium text-brand-dark/70 dark:text-brand-light/70">Discount Applied:</p>
                        <p className="text-xl font-bold text-red-500">
                            - {formatCurrency(totalDiscountApplied, currencySymbol)}
                        </p>
                    </>
                )}
                <p className="text-sm font-medium text-brand-dark/70 dark:text-brand-light/70">Final Total:</p>
                <p className="text-2xl font-bold text-brand-primary">
                    {formatCurrency(totalAmount, currencySymbol)}
                </p>
                <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">
                    Deposit ({depositPercentage}%): {formatCurrency(depositAmount, currencySymbol)}
                </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
                {onClearForm && (
                    <Button type="button" variant="outline" onClick={onClearForm} disabled={isSubmitting}>
                        <RotateCcw className="h-4 w-4 mr-2" /> Clear Form
                    </Button>
                )}
                {onSaveDraft && (
                    <Button type="button" variant="secondary" onClick={handleSave} disabled={isSubmitting}>
                        <Save className="h-4 w-4 mr-2" /> Save Draft
                    </Button>
                )}
                <Button type="button" variant="outline" onClick={handlePreview} disabled={isSubmitting}>
                    <Eye className="h-4 w-4 mr-2" /> Preview Quote
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={cn(
                        "bg-brand-primary hover:bg-brand-primary/90 text-brand-light",
                        isQuoteCreated && !onSaveDraft ? "bg-green-600 hover:bg-green-700" : ""
                    )}
                >
                    {finalSubmitButtonText.includes('Send') ? <Send className="h-4 w-4 mr-2" /> : null}
                    {finalSubmitButtonText}
                </Button>
            </div>
        </div>

        {/* Client Details (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Event Details (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="eventTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Wedding Reception" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="eventTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Time (Optional)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="eventLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Location</FormLabel>
              <FormControl>
                <Input placeholder="The Grand Ballroom, City" {...field} className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Quote Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="invoiceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClasses}>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                    <SelectItem value="Quote">Quote</SelectItem>
                    <SelectItem value="Invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="preparedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prepared By</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="currencySymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="£" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Theme and Header Image (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClasses}>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                    <SelectItem value="default">Default (White/Pink)</SelectItem>
                    <SelectItem value="black-gold">Black & Gold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="headerImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Header Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="headerImagePosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Header Image Position (Tailwind Class)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., object-center, object-top, object-[50%_20%]" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* NEW: Scope of Work URL */}
        <FormField
          control={control}
          name="scopeOfWorkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope of Work URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://docs.google.com/document/d/..." {...field} className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Preparation Notes Field (with live preview) */}
        <FormField
          control={control}
          name="preparationNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preparation & Service Notes (Displayed under Compulsory Items)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl>
                  <Textarea
                    placeholder="e.g., This fee covers 7 hours of commitment...\n\n- First bullet point\n* Second bullet point"
                    {...field}
                    rows={4}
                    className={inputClasses}
                  />
                </FormControl>
                <RichTextPreview text={form.watch(`preparationNotes`) || ''} />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Terms Field (unchanged) */}
        <FormField
          control={control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Payment due within 7 days." {...field} rows={3} className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Discount Fields */}
        <h3 className="text-lg font-semibold">Discount</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="discountPercentage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Discount Percentage (%)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                className={inputClasses}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="discountAmount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Discount Amount ({currencySymbol})</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                className={inputClasses}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <Separator />

        {/* Compulsory Items */}
        <h3 className="text-lg font-semibold">Compulsory Items (Fixed Fees)</h3>
        <div className="space-y-4">
          {compulsoryFields.map((field, index) => (
            <div key={field.id} className="flex flex-col space-y-4 p-4 border rounded-md bg-brand-secondary/5 dark:bg-brand-dark/30">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                <FormField
                  control={control}
                  name={`compulsoryItems.${index}.name`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Service Fee" {...itemField} className={inputClasses} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`compulsoryItems.${index}.description`}
                  render={({ field: itemField }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Detailed Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the service."
                          {...itemField}
                          rows={2}
                          className={inputClasses}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`compulsoryItems.${index}.scheduleDates`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Schedule / Dates</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2025-12-11" {...itemField} className={inputClasses} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`compulsoryItems.${index}.price`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Rate (per unit)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000"
                            {...itemField}
                            onChange={e => itemField.onChange(parseFloat(e.target.value) || 0)}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`compulsoryItems.${index}.quantity`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...itemField}
                            onChange={e => itemField.onChange(parseInt(e.target.value) || 1)}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Item Toggles and Delete Button */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-2 border-t border-brand-secondary/20 md:border-none md:pt-0">
                <div className="flex flex-wrap justify-start gap-2">
                    <PillToggle name={`compulsoryItems.${index}.showScheduleDates`} label="Schedule" />
                    <PillToggle name={`compulsoryItems.${index}.showQuantity`} label="Qty" />
                    <PillToggle name={`compulsoryItems.${index}.showRate`} label="Rate" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeCompulsory(index)}
                  disabled={compulsoryFields.length === 1}
                  className="w-full md:w-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Live Preview for Description */}
              <div className="md:col-span-5">
                <FormLabel className="text-sm font-normal text-brand-dark/70 dark:text-brand-light/70">Description Preview:</FormLabel>
                <RichTextPreview text={form.watch(`compulsoryItems.${index}.description`) || ''} />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendCompulsory({ id: Math.random().toString(36).substring(2, 11), name: '', description: '', price: 0, quantity: 1, scheduleDates: '', showScheduleDates: false, showQuantity: true, showRate: true })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Compulsory Item
          </Button>
        </div>

        <Separator />

        {/* Add-Ons */}
        <h3 className="text-lg font-semibold">Optional Add-Ons (Quantity/Price)</h3>
        <div className="space-y-4">
          {addOnFields.map((field, index) => (
            <div key={field.id} className="flex flex-col space-y-4 p-4 border rounded-md bg-brand-secondary/5 dark:bg-brand-dark/30">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                <FormField
                  control={control}
                  name={`addOns.${index}.name`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Extra Hour" {...itemField} className={inputClasses} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`addOns.${index}.description`}
                  render={({ field: itemField }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Detailed Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description of the add-on service."
                          {...itemField}
                          rows={2}
                          className={inputClasses}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`addOns.${index}.scheduleDates`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Schedule / Dates</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2025-12-11" {...itemField} className={inputClasses} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`addOns.${index}.price`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Rate (per unit)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="200"
                            {...itemField}
                            onChange={e => itemField.onChange(parseFloat(e.target.value) || 0)}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`addOns.${index}.quantity`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Quantity (Default)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...itemField}
                            onChange={e => itemField.onChange(parseInt(e.target.value) || 0)}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Item Toggles and Delete Button */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-2 border-t border-brand-secondary/20 md:border-none md:pt-0">
                <div className="flex flex-wrap justify-start gap-2">
                    <PillToggle name={`addOns.${index}.showScheduleDates`} label="Schedule" />
                    <PillToggle name={`addOns.${index}.showQuantity`} label="Qty" />
                    <PillToggle name={`addOns.${index}.showRate`} label="Rate" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeAddOn(index)}
                  className="w-full md:w-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Live Preview for Description */}
              <div className="md:col-span-5">
                <FormLabel className="text-sm font-normal text-brand-dark/70 dark:text-brand-light/70">Description Preview:</FormLabel>
                <RichTextPreview text={form.watch(`addOns.${index}.description`) || ''} />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendAddOn({ id: Math.random().toString(36).substring(2, 11), name: '', description: '', price: 0, quantity: 0, scheduleDates: '', showScheduleDates: false, showQuantity: true, showRate: true })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Optional Add-On
          </Button>
        </div>

        <Separator />

        {/* Payment Details (unchanged) */}
        <h3 className="text-lg font-semibold">Payment & Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="depositPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit Percentage (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="bankBSB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank BSB</FormLabel>
                <FormControl>
                  <Input placeholder="923100" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="bankACC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="301110875" {...field} className={inputClasses} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Payment Terms is now optional and moved above */}
      </form>
    </Form>
  );
};

export default QuoteForm;