"use client";

import React, { useState } from 'react';
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Save, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the schema for form validation
const quoteFormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  invoiceType: z.string().min(1, 'Invoice type is required'),
  eventTitle: z.string().min(1, 'Event title is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  eventLocation: z.string().min(1, 'Event location is required'),
  preparedBy: z.string().min(1, 'Prepared by is required'),
  depositPercentage: z.number().min(0).max(100),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  bankBSB: z.string().optional(),
  bankACC: z.string().optional(),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  compulsoryItems: z.array(z.object({
    id: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    amount: z.number().min(0, 'Amount must be positive'),
  })).min(1, 'At least one compulsory item is required'),
  addOns: z.array(z.object({
    id: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    cost: z.number().min(0, 'Cost must be positive'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
  })).optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  onSubmit: (values: QuoteFormValues) => void;
  onPreview?: (values: QuoteFormValues) => void;
  onSaveDraft?: (values: QuoteFormValues) => void;
  isSubmitting?: boolean;
  initialValues?: QuoteFormValues | null;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  onSubmit, 
  onPreview, 
  onSaveDraft,
  isSubmitting = false,
  initialValues 
}) => {
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      invoiceType: 'Standard Quote',
      eventTitle: '',
      eventDate: '',
      eventTime: '',
      eventLocation: '',
      preparedBy: '',
      depositPercentage: 50,
      paymentTerms: 'Payment due within 14 days',
      bankBSB: '',
      bankACC: '',
      currencySymbol: '$',
      compulsoryItems: [{ description: '', amount: 0 }],
      addOns: [],
      ...initialValues
    },
  });

  const { register, control, handleSubmit, formState: { errors }, watch } = form;
  
  const { fields: compulsoryFields, append: appendCompulsory, remove: removeCompulsory } = useFieldArray({
    control,
    name: "compulsoryItems"
  });
  
  const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
    control,
    name: "addOns"
  });

  const watchedCompulsoryItems = watch("compulsoryItems");
  const watchedAddOns = watch("addOns");
  
  const compulsoryTotal = watchedCompulsoryItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const addOnsTotal = watchedAddOns?.reduce((sum, addOn) => sum + ((addOn.cost || 0) * (addOn.quantity || 1)), 0) || 0;
  const totalAmount = compulsoryTotal + addOnsTotal;

  const handleSaveDraft = async (data: QuoteFormValues) => {
    if (!onSaveDraft) return;
    
    setIsSavingDraft(true);
    try {
      await onSaveDraft(data);
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-primary">Client Information</h3>
            
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input 
                id="clientName" 
                {...register("clientName")} 
                placeholder="Enter client name"
              />
              {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="clientEmail">Client Email *</Label>
              <Input 
                id="clientEmail" 
                type="email" 
                {...register("clientEmail")} 
                placeholder="Enter client email"
              />
              {errors.clientEmail && <p className="text-red-500 text-sm mt-1">{errors.clientEmail.message}</p>}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-primary">Event Details</h3>
            
            <div>
              <Label htmlFor="invoiceType">Invoice Type *</Label>
              <Controller
                name="invoiceType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select invoice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard Quote">Standard Quote</SelectItem>
                      <SelectItem value="Live Piano Quote">Live Piano Quote</SelectItem>
                      <SelectItem value="Erin Kennedy Quote">Erin Kennedy Quote</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.invoiceType && <p className="text-red-500 text-sm mt-1">{errors.invoiceType.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="eventTitle">Event Title *</Label>
              <Input 
                id="eventTitle" 
                {...register("eventTitle")} 
                placeholder="Enter event title"
              />
              {errors.eventTitle && <p className="text-red-500 text-sm mt-1">{errors.eventTitle.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input 
                  id="eventDate" 
                  type="date" 
                  {...register("eventDate")} 
                />
                {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="eventTime">Event Time</Label>
                <Input 
                  id="eventTime" 
                  type="time" 
                  {...register("eventTime")} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="eventLocation">Event Location *</Label>
              <Input 
                id="eventLocation" 
                {...register("eventLocation")} 
                placeholder="Enter event location"
              />
              {errors.eventLocation && <p className="text-red-500 text-sm mt-1">{errors.eventLocation.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="preparedBy">Prepared By *</Label>
              <Input 
                id="preparedBy" 
                {...register("preparedBy")} 
                placeholder="Enter preparer name"
              />
              {errors.preparedBy && <p className="text-red-500 text-sm mt-1">{errors.preparedBy.message}</p>}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-primary">Payment Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="depositPercentage">Deposit Percentage (%)</Label>
                <Input 
                  id="depositPercentage" 
                  type="number" 
                  {...register("depositPercentage", { valueAsNumber: true })} 
                  min="0" 
                  max="100"
                />
                {errors.depositPercentage && <p className="text-red-500 text-sm mt-1">{errors.depositPercentage.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="currencySymbol">Currency Symbol *</Label>
                <Input 
                  id="currencySymbol" 
                  {...register("currencySymbol")} 
                  placeholder="$"
                />
                {errors.currencySymbol && <p className="text-red-500 text-sm mt-1">{errors.currencySymbol.message}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="paymentTerms">Payment Terms *</Label>
              <Textarea 
                id="paymentTerms" 
                {...register("paymentTerms")} 
                placeholder="Enter payment terms"
              />
              {errors.paymentTerms && <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankBSB">Bank BSB</Label>
                <Input 
                  id="bankBSB" 
                  {...register("bankBSB")} 
                  placeholder="Enter BSB"
                />
              </div>
              
              <div>
                <Label htmlFor="bankACC">Bank Account</Label>
                <Input 
                  id="bankACC" 
                  {...register("bankACC")} 
                  placeholder="Enter account number"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-brand-primary">Compulsory Items *</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => appendCompulsory({ description: '', amount: 0 })}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {compulsoryFields.map((field, index) => (
                <Card key={field.id} className="bg-brand-light/50 dark:bg-brand-dark/50">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input 
                          placeholder="Item description" 
                          {...register(`compulsoryItems.${index}.description` as const)}
                        />
                        {errors.compulsoryItems?.[index]?.description && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.compulsoryItems?.[index]?.description?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-32">
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Amount" 
                          {...register(`compulsoryItems.${index}.amount` as const, { valueAsNumber: true })}
                        />
                        {errors.compulsoryItems?.[index]?.amount && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.compulsoryItems?.[index]?.amount?.message}
                          </p>
                        )}
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeCompulsory(index)}
                        disabled={compulsoryFields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="pt-2">
              <p className="text-right font-medium">
                Subtotal: {watch("currencySymbol")}{compulsoryTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-brand-primary">Add-Ons</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => appendAddOn({ description: '', cost: 0, quantity: 1 })}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Add-On
            </Button>
          </div>
          
          <div className="space-y-3">
            {addOnFields.length > 0 ? (
              addOnFields.map((field, index) => (
                <Card key={field.id} className="bg-brand-light/50 dark:bg-brand-dark/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-5">
                        <Input 
                          placeholder="Add-on description" 
                          {...register(`addOns.${index}.description` as const)}
                        />
                        {errors.addOns?.[index]?.description && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.addOns?.[index]?.description?.message}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Cost" 
                          {...register(`addOns.${index}.cost` as const, { valueAsNumber: true })}
                        />
                        {errors.addOns?.[index]?.cost && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.addOns?.[index]?.cost?.message}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Input 
                          type="number" 
                          placeholder="Quantity" 
                          {...register(`addOns.${index}.quantity` as const, { valueAsNumber: true })}
                        />
                        {errors.addOns?.[index]?.quantity && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.addOns?.[index]?.quantity?.message}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <p className="font-medium">
                          {watch("currencySymbol")}
                          {((watch(`addOns.${index}.cost`) || 0) * (watch(`addOns.${index}.quantity`) || 1)).toFixed(2)}
                        </p>
                      </div>
                      <div className="md:col-span-1">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeAddOn(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No add-ons added yet</p>
            )}
          </div>
          
          <div className="pt-2">
            <p className="text-right font-medium">
              Add-Ons Total: {watch("currencySymbol")}{addOnsTotal.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-brand-primary">Total Amount</h3>
              <p className="text-2xl font-bold">
                {watch("currencySymbol")}{totalAmount.toFixed(2)}
              </p>
            </div>
            
            <div className="flex gap-3">
              {onSaveDraft && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSubmit(handleSaveDraft)}
                  disabled={isSavingDraft || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
              
              {onPreview && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSubmit(onPreview)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              )}
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? 'Creating...' : 'Create Quote'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default QuoteForm;