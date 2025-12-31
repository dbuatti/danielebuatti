"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription, // NEW: Imported FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { generateGiftCardCode } from '@/lib/utils'; // Import the utility function

const formSchema = z.object({
  name: z.string().min(1, { message: 'Gift card name is required.' }),
  type: z.enum(['fixed_session', 'open_credit', 'discount'], { message: 'Gift card type is required.' }),
  value: z.coerce.number().min(0.01, { message: 'Value must be a positive number.' }),
  code: z.string().min(4, { message: 'Redemption code must be at least 4 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  purchased_at: z.string().optional(), // Will be set by DB default, but allow input for manual override
  payment_status: z.enum(['paid', 'pending', 'refunded']).default('paid'),
  redemption_status: z.enum(['unused', 'partially_used', 'redeemed']).default('unused'),
  amount_redeemed: z.coerce.number().min(0).default(0),
  remaining_balance: z.coerce.number().min(0).default(0), // NEW: Added remaining_balance to schema
  expiration_date: z.string().optional(),
  notes: z.string().optional(),
  stripe_payment_link: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  manual_redeemed: z.boolean().default(false),
  stripe_checkout_session_id: z.string().optional(), // NEW: Added stripe_checkout_session_id
});

export type GiftCardFormValues = z.infer<typeof formSchema>;

interface GiftCardFormProps {
  onSubmit: (values: GiftCardFormValues) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
  initialData?: GiftCardFormValues; // For editing existing cards
}

const GiftCardForm: React.FC<GiftCardFormProps> = ({ onSubmit, isSubmitting, onClose, initialData }) => {
  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      type: 'fixed_session',
      value: 0,
      code: generateGiftCardCode(), // Auto-generate code for new cards
      email: '',
      purchased_at: new Date().toISOString().split('T')[0], // Default to today
      payment_status: 'paid',
      redemption_status: 'unused',
      amount_redeemed: 0,
      remaining_balance: 0, // Initialize remaining_balance
      expiration_date: '',
      notes: '',
      stripe_payment_link: '',
      manual_redeemed: false,
      stripe_checkout_session_id: '', // Initialize new field
    },
  });

  // If editing, reset form with initialData
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        // Format date for input type="date"
        purchased_at: initialData.purchased_at ? new Date(initialData.purchased_at).toISOString().split('T')[0] : '',
        expiration_date: initialData.expiration_date ? new Date(initialData.expiration_date).toISOString().split('T')[0] : '',
        // Ensure nullable fields are undefined if null for Zod's optional()
        notes: initialData.notes || undefined,
        stripe_payment_link: initialData.stripe_payment_link || undefined,
        stripe_checkout_session_id: initialData.stripe_checkout_session_id || undefined, // Ensure this is passed
      });
    }
  }, [initialData, form]);

  const watchedType = form.watch('type');
  const watchedValue = form.watch('value');
  const watchedAmountRedeemed = form.watch('amount_redeemed');

  // Update remaining balance dynamically for 'open_credit' type
  useEffect(() => {
    if (watchedType === 'open_credit') {
      const calculatedRemaining = watchedValue - watchedAmountRedeemed;
      form.setValue('remaining_balance', Math.max(0, calculatedRemaining), { shouldDirty: true });
    } else {
      form.setValue('remaining_balance', 0, { shouldDirty: true }); // Not applicable for fixed/discount
    }
  }, [watchedType, watchedValue, watchedAmountRedeemed, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Gift Card Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 1-Hour Coaching Session"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                    <SelectValue placeholder="Select gift card type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                  <SelectItem value="fixed_session">Fixed Session</SelectItem>
                  <SelectItem value="open_credit">Open Credit</SelectItem>
                  <SelectItem value="discount">Discount Code</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Value (A$) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Redemption Code *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., GIFT12345"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Buyer/Recipient Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purchased_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Purchase Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Payment Status *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="redemption_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Redemption Status *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light focus-visible:ring-brand-primary">
                    <SelectValue placeholder="Select redemption status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                  <SelectItem value="unused">Unused</SelectItem>
                  <SelectItem value="partially_used">Partially Used</SelectItem>
                  <SelectItem value="redeemed">Redeemed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchedType === 'open_credit' && (
          <>
            <FormField
              control={form.control}
              name="amount_redeemed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-dark dark:text-brand-light">Amount Redeemed (A$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Remaining Balance (A$)</FormLabel>
              <Input
                value={form.watch('value') - form.watch('amount_redeemed')}
                readOnly
                className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light"
              />
            </FormItem>
          </>
        )}
        <FormField
          control={form.control}
          name="expiration_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Expiration Date (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Internal notes about the gift card."
                  rows={3}
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stripe_payment_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Stripe Payment Link (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://dashboard.stripe.com/payments/..."
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stripe_checkout_session_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-brand-dark dark:text-brand-light">Stripe Checkout Session ID (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="cs_live_..."
                  className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manual_redeemed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-brand-secondary/10 dark:bg-brand-dark/30">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-5 w-5 border-brand-primary text-brand-dark data-[state=checked]:bg-brand-primary data-[state=checked]:text-brand-light"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-brand-dark dark:text-brand-light">
                  Manually Redeemed (Check if applied outside of system)
                </FormLabel>
                <FormDescription className="text-brand-dark/70 dark:text-brand-light/70">
                  This indicates the gift card has been used, but not through an automated process.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              initialData ? 'Save Changes' : 'Create Gift Card'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GiftCardForm;