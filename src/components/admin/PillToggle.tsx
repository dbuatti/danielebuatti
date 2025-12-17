"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface PillToggleProps {
  name: string;
  label: string;
  className?: string;
}

const PillToggle: React.FC<PillToggleProps> = ({ name, label, className }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <Select 
            onValueChange={(val) => field.onChange(val === 'true')} 
            value={field.value ? 'true' : 'false'}
          >
            <FormControl>
              <SelectTrigger 
                className={cn(
                  "h-8 px-2 py-1 text-xs font-medium rounded-full transition-colors",
                  field.value ? "bg-brand-primary text-brand-light hover:bg-brand-primary/90" : "bg-brand-secondary/50 dark:bg-brand-dark/50 text-brand-dark dark:text-brand-light hover:bg-brand-secondary/70 dark:hover:bg-brand-dark/70",
                  "border-none focus:ring-0 focus:ring-offset-0"
                )}
              >
                <SelectValue placeholder={label} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
              <SelectItem value="true">{label}: Visible</SelectItem>
              <SelectItem value="false">{label}: Hidden</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PillToggle;