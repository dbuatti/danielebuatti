"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import QuoteForm, { QuoteFormValues } from '@/components/admin/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import { createSlug } from '@/lib/utils'; // Assuming createSlug is available

const AdminQuoteBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateQuote = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    const toastId = showLoading('Creating new quote...');

    try {
      // Calculate total amount and deposit based on form values
      const totalAmount = values.baseServiceAmount + (values.addOns?.reduce((sum: number, addOn: { cost: number }) => sum + addOn.cost, 0) || 0);
      const requiredDeposit = totalAmount * (values.depositPercentage / 100);

      // Generate a base slug
      const baseSlug = createSlug(`${values.eventTitle}-${values.clientName}-${values.eventDate}`);
      let uniqueSlug = baseSlug;
      let counter = 0;

      // Ensure slug uniqueness
      while (true) {
        const { data: existingSlugs, error: slugCheckError } = await supabase
          .from('invoices')
          .select('slug')
          .eq('slug', uniqueSlug);

        if (slugCheckError) throw slugCheckError;

        if (existingSlugs && existingSlugs.length === 0) {
          break; // Slug is unique
        }

        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
      }

      // Prepare details for JSONB column
      const details = {
        baseService: {
          description: values.baseServiceDescription,
          amount: values.baseServiceAmount,
        },
        addOns: values.addOns,
        depositPercentage: values.depositPercentage,
        requiredDeposit: requiredDeposit,
        bankDetails: {
          bsb: values.bankBSB,
          acc: values.bankACC,
        },
        eventTime: values.eventTime,
        currencySymbol: values.currencySymbol, // NEW
        paymentTerms: values.paymentTerms,     // NEW
      };

      // Invoke the Edge Function to create the quote
      const { data, error } = await supabase.functions.invoke('create-quote', {
        body: {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          invoiceType: values.eventTitle, // Using eventTitle as invoice_type for now
          eventTitle: values.eventTitle,
          eventDate: values.eventDate,
          eventLocation: values.eventLocation,
          preparedBy: values.preparedBy,
          totalAmount: totalAmount,
          details: details,
          slug: uniqueSlug,
        },
      });

      if (error) {
        throw error;
      }

      showSuccess('Quote created successfully!', { id: toastId });
      // Redirect to the newly created quote's public page or admin details page
      if (data && data.slug) {
        navigate(`/quotes/${data.slug}`); // Redirect to public quote page
      } else {
        navigate('/admin/quotes'); // Fallback to admin quotes list
      }
    } catch (error: any) {
      console.error('Error creating quote:', error);
      showError(`Failed to create quote: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Create New Quote</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Use this form to generate a new client-facing quote page.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm onSubmit={handleCreateQuote} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuoteBuilderPage;