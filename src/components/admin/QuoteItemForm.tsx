"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import PillToggle from './PillToggle';
import RichTextPreview from './RichTextPreview';
import { QuoteFormValues } from './QuoteForm'; // Import QuoteFormValues for context typing

interface QuoteItemFormProps {
  index: number;
  type: 'compulsoryItems' | 'addOns';
  onRemove: (index: number) => void;
  isRemovable: boolean;
}

const QuoteItemForm: React.FC<QuoteItemFormProps> = ({ index, type, onRemove, isRemovable }) => {
  const { control, watch } = useFormContext<QuoteFormValues>();
  const isCompulsory = type === 'compulsoryItems';
  
  const inputClasses = "bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary";
  
  const baseName = `${type}.${index}`;

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-md bg-brand-secondary/5 dark:bg-brand-dark/30">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
        {/* Item Name */}
        <FormField
          control={control}
          name={`${baseName}.name`}
          render={({ field: itemField }) => (
            <FormItem>
              <FormLabel>Item Name *</FormLabel>
              <FormControl>
                <Input placeholder={isCompulsory ? "Service Fee" : "Extra Hour"} {...itemField} className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Detailed Description */}
        <FormField
          control={control}
          name={`${baseName}.description`}
          render={({ field: itemField }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Detailed Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={isCompulsory ? "Detailed description of the service." : "Description of the add-on service."}
                  {...itemField}
                  rows={2}
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Schedule / Dates */}
        <FormField
          control={control}
          name={`${baseName}.scheduleDates`}
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
        
        {/* Rate & Quantity Group */}
        <div className="grid grid-cols-2 gap-4">
          {/* Rate (Price) */}
          <FormField
            control={control}
            name={`${baseName}.price`}
            render={({ field: itemField }) => (
              <FormItem>
                <FormLabel>Rate (per unit) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={isCompulsory ? "1000" : "200"}
                    {...itemField}
                    onChange={e => itemField.onChange(parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Quantity */}
          <FormField
            control={control}
            name={`${baseName}.quantity`}
            render={({ field: itemField }) => (
              <FormItem>
                <FormLabel>{isCompulsory ? 'Quantity *' : 'Quantity (Default)'}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={isCompulsory ? "1" : "0"}
                    {...itemField}
                    onChange={e => itemField.onChange(parseInt(e.target.value) || (isCompulsory ? 1 : 0))}
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
            <PillToggle name={`${baseName}.showScheduleDates`} label="Schedule" />
            <PillToggle name={`${baseName}.showQuantity`} label="Qty" />
            <PillToggle name={`${baseName}.showRate`} label="Rate" />
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onRemove(index)}
          disabled={!isRemovable}
          className="w-full md:w-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Live Preview for Description */}
      <div className="md:col-span-5">
        <FormLabel className="text-sm font-normal text-brand-dark/70 dark:text-brand-light/70">Description Preview:</FormLabel>
        <RichTextPreview text={watch(`${baseName}.description`) || ''} />
      </div>
    </div>
  );
};

export default QuoteItemForm;