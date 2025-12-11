"use client";

import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Eye, Save, Send } from 'lucide-react';

// --- Schemas and Types ---

const CompulsoryItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().min(0, 'Amount must be non-negative'),
});

const AddOnSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  cost: z.coerce.number().min(0, 'Cost must be non-negative'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
});

export const QuoteFormSchema = z.object({
  // Client & Event Details
  clientName: z.string().min(1, 'Client Name is required'),
  clientEmail: z.string().email('Invalid email format'),
  invoiceType: z.string().min(1, 'Invoice Type is required'),
  eventTitle: z.string().min(1, 'Event Title is required'),
  eventDate: z.string().min(1, 'Event Date is required'),
  eventTime: z.string().optional(),
  eventLocation: z.string().min(1, 'Event Location is required'),
  preparedBy: z.string().min(1, 'Prepared By is required'),

  // Financial Details
  currencySymbol: z.string().default('$'),
  depositPercentage: z.coerce.number().min(0).max(100).default(0),
  paymentTerms: z.string().optional(),
  bankBSB: z.string().optional(),
  bankACC: z.string().optional(),

  // Items
  compulsoryItems: z.array(CompulsoryItemSchema).min(1, 'At least one compulsory item is required'),
  addOns: z.array(AddOnSchema).optional().default([]),
});

export type QuoteFormValues = z.infer<typeof QuoteFormSchema>;

// --- Component ---

interface QuoteFormProps {
  form: UseFormReturn<QuoteFormValues>; // Accept form instance
  onSubmit: (values: QuoteFormValues) => void;
  onSaveDraft: (values: QuoteFormValues) => void;
  onPreview: (values: QuoteFormValues) => void;
  isSubmitting: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  form,
  onSubmit, 
  onSaveDraft, 
  onPreview, 
  isSubmitting, 
}) => {
  const { fields: compulsoryFields, append: appendCompulsory, remove: removeCompulsory } = useFieldArray({
    control: form.control,
    name: 'compulsoryItems',
  });

  const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
    control: form.control,
    name: 'addOns',
  });

  const handleSave = () => {
    onSaveDraft(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Client & Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                  <Input type="email" placeholder="john@example.com" {...field} />
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
                <FormLabel>Invoice Type / Theme</FormLabel>
                <FormControl>
                  <Input placeholder="Live Piano Quote" {...field} />
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
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Wedding Ceremony" {...field} />
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
                  <Input placeholder="7:00 PM" {...field} />
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
                  <Input placeholder="The Grand Ballroom" {...field} />
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
                  <Input placeholder="Admin Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Compulsory Items */}
        <h3 className="text-lg font-semibold mt-6">Compulsory Items</h3>
        <div className="space-y-3">
          {compulsoryFields.map((field, index) => (
            <div key={field.id} className="flex items-end space-x-2">
              <FormField
                control={form.control}
                name={`compulsoryItems.${index}.description`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel className={index > 0 ? 'sr-only' : undefined}>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Item description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`compulsoryItems.${index}.amount`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel className={index > 0 ? 'sr-only' : undefined}>Amount ({form.watch('currencySymbol')})</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Amount" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={() => removeCompulsory(index)}
                disabled={compulsoryFields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => appendCompulsory({ description: '', amount: 0 })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Compulsory Item
          </Button>
        </div>

        {/* Add-Ons */}
        <h3 className="text-lg font-semibold mt-6">Add-Ons (Optional)</h3>
        <div className="space-y-3">
          {addOnFields.map((field, index) => (
            <div key={field.id} className="flex items-end space-x-2">
              <FormField
                control={form.control}
                name={`addOns.${index}.description`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel className={index > 0 ? 'sr-only' : undefined}>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Add-on description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`addOns.${index}.cost`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel className={index > 0 ? 'sr-only' : undefined}>Cost</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Cost" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`addOns.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel className={index > 0 ? 'sr-only' : undefined}>Qty</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Qty" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value === '' ? 1 : parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={() => removeAddOn(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => appendAddOn({ description: '', cost: 0, quantity: 1 })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Optional Add-On
          </Button>
        </div>

        {/* Financial & Terms */}
        <h3 className="text-lg font-semibold mt-6">Financial & Payment Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="currencySymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} />
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
                  <Input 
                    type="number" 
                    placeholder="50" 
                    {...field} 
                    onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankBSB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank BSB (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="000-000" {...field} />
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
                <FormLabel>Bank Account (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms (Optional)</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Payment due within 7 days of acceptance." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onPreview(form.getValues())}
            disabled={isSubmitting}
          >
            <Eye className="h-4 w-4 mr-2" /> Preview
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" /> {isSubmitting ? 'Creating...' : 'Create Quote'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoteForm;