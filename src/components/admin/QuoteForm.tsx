"use client";

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// --- Zod Schema Definition ---
const CompulsoryItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(), // New detailed description field
  amount: z.coerce.number().min(0, 'Amount must be non-negative'),
});

const AddOnSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Add-on name is required'),
  description: z.string().optional(), // New detailed description field
  cost: z.coerce.number().min(0, 'Cost must be non-negative'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
});

export const QuoteFormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email format'),
  invoiceType: z.string().min(1, 'Invoice type is required'),
  eventTitle: z.string().min(1, 'Event title is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  eventLocation: z.string().min(1, 'Event location is required'),
  preparedBy: z.string().min(1, 'Prepared by is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  depositPercentage: z.coerce.number().min(0).max(100),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  bankBSB: z.string().optional(),
  bankACC: z.string().optional(),
  compulsoryItems: z.array(CompulsoryItemSchema).min(1, 'At least one compulsory item is required'),
  addOns: z.array(AddOnSchema).optional(),
  
  // New fields
  theme: z.enum(['default', 'livePiano']),
  headerImageUrl: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof QuoteFormSchema>;

// --- Component Helpers ---

interface ItemFieldsProps {
  index: number;
  field: any; 
  remove: (index: number) => void;
  type: 'compulsoryItems' | 'addOns';
}

const ItemFields: React.FC<ItemFieldsProps> = ({ index, remove, type }) => { // Fix Error 11
  const { control } = useFormContext<QuoteFormValues>();
  const isAddOn = type === 'addOns';

  return (
    <div className="grid grid-cols-12 gap-4 p-4 border rounded-md mb-4 bg-gray-50 dark:bg-gray-800/50">
      <div className="col-span-12 flex justify-between items-center">
        <h4 className="font-semibold text-sm">{isAddOn ? `Add-On ${index + 1}` : `Compulsory Item ${index + 1}`}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="col-span-12 md:col-span-6">
        <FormField
          control={control}
          name={`${type}.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isAddOn ? 'Add-On Name' : 'Item Name'}</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Service Fee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="col-span-12 md:col-span-6">
        <FormField
          control={control}
          name={`${type}.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Full day coverage including setup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {isAddOn ? (
        <>
          <div className="col-span-6 md:col-span-3">
            <FormField
              control={control}
              name={`${type}.${index}.cost`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost (per unit)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <FormField
              control={control}
              name={`${type}.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      ) : (
        <div className="col-span-12 md:col-span-6">
          <FormField
            control={control}
            name={`${type}.${index}.amount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fixed Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};


// --- Main Component ---

interface QuoteFormProps {
  form: ReturnType<typeof useFormContext<QuoteFormValues>>;
  onSubmit: (values: QuoteFormValues) => Promise<void>;
  isSubmitting: boolean;
  onPreview: (values: QuoteFormValues) => void;
  onSaveDraft: (values: QuoteFormValues) => Promise<void>;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ form, onSubmit, isSubmitting, onPreview, onSaveDraft }) => {
  const { fields: compulsoryFields, append: appendCompulsory, remove: removeCompulsory } = useFieldArray({
    control: form.control,
    name: 'compulsoryItems',
  });

  const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
    control: form.control,
    name: 'addOns',
  });

  const handleSaveDraft = () => {
    // Get current form values without validation
    const values = form.getValues();
    onSaveDraft(values);
  };

  const handlePreview = () => {
    // Trigger validation before preview
    form.trigger().then(isValid => {
      if (isValid) {
        onPreview(form.getValues());
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* General Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
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
                <FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl>
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
                <FormControl><Input placeholder="Wedding Ceremony" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="invoiceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Type</FormLabel>
                <FormControl><Input placeholder="Quote" {...field} /></FormControl>
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
                <FormControl><Input type="date" {...field} /></FormControl>
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
                <FormControl><Input placeholder="7:00 PM" {...field} /></FormControl>
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
                <FormControl><Input placeholder="The Grand Hall" {...field} /></FormControl>
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
                <FormControl><Input placeholder="Admin" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Theme and Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default (White/Pink)</SelectItem>
                    <SelectItem value="livePiano">Live Piano (Gold/Black)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="headerImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Header Image URL (Optional)</FormLabel>
                <FormControl><Input placeholder="/images/placeholder.jpg" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Compulsory Items */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Compulsory Items</h3>
          {compulsoryFields.map((field, index) => (
            <ItemFields 
              key={field.id} 
              index={index} 
              field={field} 
              remove={removeCompulsory} 
              type="compulsoryItems" 
            />
          ))}
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => appendCompulsory({ name: '', description: '', amount: 0 })}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Compulsory Item
          </Button>
        </div>

        {/* Add-Ons */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Optional Add-Ons</h3>
          {addOnFields.map((field, index) => (
            <ItemFields 
              key={field.id} 
              index={index} 
              field={field} 
              remove={removeAddOn} 
              type="addOns" 
            />
          ))}
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => appendAddOn({ name: '', description: '', cost: 0, quantity: 1 })}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Optional Add-On
          </Button>
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="currencySymbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Symbol</FormLabel>
                <FormControl><Input placeholder="$" {...field} /></FormControl>
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
                <FormControl><Input type="number" placeholder="50" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Payment Terms</FormLabel>
                <FormControl><Textarea placeholder="Payment due within 7 days." {...field} /></FormControl>
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
                <FormControl><Input placeholder="000-000" {...field} /></FormControl>
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
                <FormControl><Input placeholder="000000000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={isSubmitting}>
            Save Draft
          </Button>
          <Button type="button" variant="outline" onClick={handlePreview} disabled={isSubmitting}>
            Preview Quote
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Quote'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoteForm;