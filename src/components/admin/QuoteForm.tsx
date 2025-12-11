"use client";

import { z } from 'zod';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Eye, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Define the schema for a single item (compulsory or add-on)
const ItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Item name is required.'),
  description: z.string().optional(),
  amount: z.number().min(0, 'Amount must be non-negative.').optional(), // Used for compulsory items
  cost: z.number().min(0, 'Cost must be non-negative.').optional(), // Used for add-ons
  quantity: z.number().min(1, 'Quantity must be at least 1.').optional(), // Used for add-ons
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
  paymentTerms: z.string().min(1, 'Payment Terms are required.'),
  bankBSB: z.string().min(1, 'BSB is required.'),
  bankACC: z.string().min(1, 'Account Number is required.'),
  theme: z.enum(['default', 'black-gold']), // Added 'black-gold' theme
  headerImageUrl: z.string(), // Simplified validation
  contentImageUrl1: z.string(), // Simplified validation
  contentImageUrl2: z.string(), // Simplified validation
  
  // New field for detailed notes
  preparationNotes: z.string().optional(), 

  compulsoryItems: z.array(ItemSchema).min(1, 'At least one compulsory item is required.'),
  addOns: z.array(ItemSchema),
});

export type QuoteFormValues = z.infer<typeof QuoteFormSchema>;

interface QuoteFormProps {
  form: ReturnType<typeof useFormContext<QuoteFormValues>>;
  onSubmit: (values: QuoteFormValues) => Promise<void>;
  isSubmitting: boolean;
  onPreview: (values: QuoteFormValues) => void;
  onSaveDraft: (values: QuoteFormValues) => Promise<void>;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ form, onSubmit, isSubmitting, onPreview, onSaveDraft }) => {
  const { control, handleSubmit, getValues } = form;

  const { fields: compulsoryFields, append: appendCompulsory, remove: removeCompulsory } = useFieldArray({
    control,
    name: 'compulsoryItems',
  });

  const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
    control,
    name: 'addOns',
  });

  const handlePreview = () => {
    onPreview(getValues());
  };

  const handleSave = () => {
    // Manually trigger validation before saving draft if needed, 
    // but for drafts, we often allow partial data. We rely on the parent component's handler.
    onSaveDraft(getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
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
            control={control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="eventTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Wedding Reception" {...field} />
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
                  <Input type="date" {...field} />
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
                  <Input type="time" {...field} />
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
                <Input placeholder="The Grand Ballroom, City" {...field} />
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                  <Input placeholder="Your Name" {...field} />
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
                  <Input placeholder="A$" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Theme and Header Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Content Images (New Section) */}
        <h3 className="text-lg font-semibold pt-4">Content Images (Black/Gold Theme Only)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="contentImageUrl1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Image 1 URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="/quote-option-2.jpeg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="contentImageUrl2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Image 2 URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="/quote-option-3.jpeg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Preparation Notes Field */}
        <FormField
          control={control}
          name="preparationNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preparation & Service Notes (Displayed under Compulsory Items)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., This fee covers 7 hours of commitment..." 
                  {...field} 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Compulsory Items */}
        <h3 className="text-lg font-semibold">Compulsory Items (Fixed Fees)</h3>
        <div className="space-y-4">
          {compulsoryFields.map((field, index) => (
            <div key={field.id} className="flex space-x-4 items-start p-4 border rounded-md">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name={`compulsoryItems.${index}.name`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Service Fee" {...itemField} />
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
                        <Input placeholder="Detailed description of the service." {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`compulsoryItems.${index}.amount`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1000" 
                          {...itemField} 
                          onChange={e => itemField.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => removeCompulsory(index)}
                className="mt-8"
                disabled={compulsoryFields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendCompulsory({ name: '', description: '', amount: 0 })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Compulsory Item
          </Button>
        </div>

        <Separator />

        {/* Add-Ons */}
        <h3 className="text-lg font-semibold">Optional Add-Ons (Quantity/Cost)</h3>
        <div className="space-y-4">
          {addOnFields.map((field, index) => (
            <div key={field.id} className="flex space-x-4 items-start p-4 border rounded-md">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={control}
                  name={`addOns.${index}.name`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Extra Hour" {...itemField} />
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
                        <Input placeholder="Description of the add-on service." {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`addOns.${index}.cost`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Cost (per unit)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="200" 
                            {...itemField} 
                            onChange={e => itemField.onChange(parseFloat(e.target.value) || 0)}
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
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1" 
                            {...itemField} 
                            onChange={e => itemField.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => removeAddOn(index)}
                className="mt-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendAddOn({ name: '', description: '', cost: 0, quantity: 1 })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Optional Add-On
          </Button>
        </div>

        <Separator />

        {/* Payment Details */}
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
                  <Input placeholder="923100" {...field} />
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
                  <Input placeholder="301110875" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms</FormLabel>
              <FormControl>
                <Textarea placeholder="Payment due within 7 days." {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={handleSave} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button type="button" variant="outline" onClick={handlePreview} disabled={isSubmitting}>
            <Eye className="h-4 w-4 mr-2" /> Preview Quote
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create & Send Quote'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoteForm;