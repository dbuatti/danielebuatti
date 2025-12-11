"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { QuoteItemField } from './QuoteItemField';
import { PlusCircle, Eye, Save } from 'lucide-react';

// Define the form schema
export const QuoteFormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  invoiceType: z.enum(['Quote', 'Invoice']),
  eventTitle: z.string().min(1, 'Event title is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  eventLocation: z.string().min(1, 'Event location is required'),
  preparedBy: z.string().min(1, 'Prepared by is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  depositPercentage: z.number().min(0).max(100),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  bankBSB: z.string().optional(),
  bankACC: z.string().optional(),
  theme: z.string().optional(),
  headerImageUrl: z.string().optional(),
  preparationNotes: z.string().optional(),
  compulsoryItems: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    amount: z.number().min(0, 'Amount must be positive'),
  })).min(1, 'At least one compulsory item is required'),
  addOns: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Add-on name is required'),
    description: z.string().optional(),
    cost: z.number().min(0, 'Cost must be positive'),
    quantity: z.number().min(0, 'Quantity must be non-negative'),
  })).optional(),
});

export type QuoteFormValues = z.infer<typeof QuoteFormSchema>;

interface QuoteFormProps {
  onSubmit: (values: QuoteFormValues) => void;
  onPreview: (values: QuoteFormValues) => void;
  onSaveDraft: (values: QuoteFormValues) => void;
  isSubmitting: boolean;
  form: any;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  onSubmit, 
  onPreview, 
  onSaveDraft,
  isSubmitting,
  form
}) => {
  const { handleSubmit, control, watch } = form;
  
  // Watch form values for preview
  const formValues = watch();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
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
                    <FormLabel>Client Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="invoiceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type *</FormLabel>
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
                name="eventTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date *</FormLabel>
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
                    <FormLabel>Event Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="eventLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={control}
              name="preparedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prepared By *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter preparer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Quote Items */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Compulsory Items *</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentItems = form.getValues('compulsoryItems') || [];
                    form.setValue('compulsoryItems', [
                      ...currentItems,
                      { id: Date.now().toString(), name: '', description: '', amount: 0 }
                    ]);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              <FormField
                control={control}
                name="compulsoryItems"
                render={({ field }) => (
                  <FormItem>
                    {field.value?.map((_: any, index: number) => (
                      <QuoteItemField
                        key={field.value[index]?.id || index}
                        itemType="compulsory"
                        index={index}
                        form={form}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add-Ons</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentAddOns = form.getValues('addOns') || [];
                    form.setValue('addOns', [
                      ...currentAddOns,
                      { id: Date.now().toString(), name: '', description: '', cost: 0, quantity: 1 }
                    ]);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Add-On
                </Button>
              </div>
              
              <FormField
                control={control}
                name="addOns"
                render={({ field }) => (
                  <FormItem>
                    {field.value?.map((_: any, index: number) => (
                      <QuoteItemField
                        key={field.value[index]?.id || index}
                        itemType="addOn"
                        index={index}
                        form={form}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Details */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="currencySymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Symbol *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="depositPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit Percentage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="e.g., 50" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
                  <FormLabel>Payment Terms *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter payment terms" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Accordion type="single" collapsible>
              <AccordionItem value="bank-details">
                <AccordionTrigger>Bank Details</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="bankBSB"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BSB</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter BSB" {...field} />
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
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter account number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Design Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Design Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || 'black-gold'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="black-gold">Black/Gold</SelectItem>
                        <SelectItem value="blue-white">Blue/White</SelectItem>
                        <SelectItem value="green-white">Green/White</SelectItem>
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
                    <FormLabel>Header Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={control}
              name="preparationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparation Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter preparation notes" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    These notes will appear on the quote to explain what the fee covers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onPreview(formValues)}
            disabled={isSubmitting}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Quote
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => onSaveDraft(formValues)}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            type="submit" 
            className="bg-brand-primary hover:bg-brand-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Processing...
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