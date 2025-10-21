"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import Footer from '@/components/Footer';
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

// Define the form schema using zod
const formSchema = z.object({
  clientName: z.string().min(2, { message: "Your full name is required." }),
  clientEmail: z.string().email({ message: "A valid email address is required." }),
  acceptQuote: z.boolean().refine(val => val === true, { message: "You must accept the quote to proceed." }),
});

const ErinKennedyQuotePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const quoteDetails = {
    client: "Erin Kennedy",
    eventTitle: "2025 Vocal Showcase",
    dateOfEvent: "Saturday 23 November 2025",
    time: "2:30 PM – 6:00 PM",
    location: "MC Showroom",
    preparedBy: "Daniele Buatti",
    hourlyRate: 100,
    performanceHours: 3.5,
    showPreparationFee: 100,
    rehearsalBundleCost: 30, // Per student for 15 min
    depositPercentage: 50,
  };

  const onSitePerformanceCost = quoteDetails.performanceHours * quoteDetails.hourlyRate;
  const totalBaseInvoice = onSitePerformanceCost + quoteDetails.showPreparationFee;
  const requiredDeposit = totalBaseInvoice * (quoteDetails.depositPercentage / 100);

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      acceptQuote: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToastId = toast.loading("Submitting your quote acceptance...");

    try {
      const { data, error } = await supabase.functions.invoke('submit-erin-kennedy-quote', {
        body: {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          eventTitle: quoteDetails.eventTitle,
          eventDate: quoteDetails.dateOfEvent,
          eventLocation: quoteDetails.location,
          preparedBy: quoteDetails.preparedBy,
          onSitePerformanceCost: onSitePerformanceCost,
          showPreparationFee: quoteDetails.showPreparationFee,
          totalBaseInvoice: totalBaseInvoice,
          rehearsalBundleCostPerStudent: quoteDetails.rehearsalBundleCost,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Quote accepted successfully!", {
        id: loadingToastId,
        description: "Thank you! Daniele will be in touch shortly to finalize details.",
      });
      form.reset();
      navigate('/live-piano-services/quote-confirmation'); // Reusing existing confirmation page
    } catch (error) {
      console.error("Error submitting quote acceptance:", error);
      toast.error("Failed to submit quote acceptance.", {
        id: loadingToastId,
        description: "Please try again later.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light flex flex-col">
      {/* Header */}
      <header className="bg-brand-light dark:bg-brand-dark py-4 px-6 md:px-12 shadow-lg relative z-10 border-b border-brand-secondary/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-brand-dark dark:text-brand-light hover:text-brand-primary transition-colors duration-200 px-0 py-0 h-auto">
            <Link to="/">
              <span className="flex items-center text-base md:text-lg font-semibold">
                <ArrowLeft className="h-5 w-5 mr-2" /> <span>Back to Home</span>
              </span>
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <DynamicImage
              src={brandSymbolSrc}
              alt="Daniele Buatti Brand Symbol"
              className="h-8 w-auto"
              width={32}
              height={32}
            />
            <DynamicImage
              src={textLogoSrc}
              alt="Daniele Buatti Logo"
              className="h-12 w-auto"
              width={220}
              height={48}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 space-y-12">
        <section className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-extrabold text-brand-primary mb-6 leading-none">
            {quoteDetails.eventTitle} – Live Piano Quote
          </h2>
          <div className="text-xl text-brand-dark/90 dark:text-brand-light/90 max-w-3xl mx-auto space-y-3 font-medium">
            <p>Prepared for: <strong className="text-brand-primary">{quoteDetails.client}</strong></p>
            <p>Date of Event: {quoteDetails.dateOfEvent}</p>
            <p>Time: {quoteDetails.time}</p>
            <p>Location: {quoteDetails.location}</p>
            <p>Prepared by: {quoteDetails.preparedBy}</p>
          </div>
          <Separator className="max-w-lg mx-auto bg-brand-primary h-1 mt-10" />
        </section>

        {/* Quote Details Table */}
        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-lg border border-brand-secondary/30 space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center">Quote Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary/20 text-brand-dark dark:text-brand-light">
                  <th className="p-3 border-b border-brand-secondary">Service Component</th>
                  <th className="p-3 border-b border-brand-secondary">Details</th>
                  <th className="p-3 border-b border-brand-secondary text-right">Investment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-brand-secondary/10 transition-colors">
                  <td className="p-3 border-b border-brand-secondary font-semibold text-brand-primary">Performance & On-Site Engagement</td>
                  <td className="p-3 border-b border-brand-secondary text-brand-dark/80 dark:text-brand-light/80">
                    {quoteDetails.performanceHours} hours of dedicated on-site presence, including arrival, setup, soundcheck, and performance ({quoteDetails.time}).
                    <br />
                    <span className="text-sm text-brand-dark/70 dark:text-brand-light/70">Rate: A${quoteDetails.hourlyRate}/hr</span>
                  </td>
                  <td className="p-3 border-b border-brand-secondary text-right text-brand-dark dark:text-brand-light">A${onSitePerformanceCost}.00</td>
                </tr>
                <tr className="hover:bg-brand-secondary/10 transition-colors">
                  <td className="p-3 border-b border-brand-secondary font-semibold text-brand-primary">Production Coordination & Music Preparation</td>
                  <td className="p-3 border-b border-brand-secondary text-brand-dark/80 dark:text-brand-light/80">
                    A flat fee covering essential behind-the-scenes work: coordinating with all students, collecting and formatting sheet music, and preparing for a seamless production.
                  </td>
                  <td className="p-3 border-b border-brand-secondary text-right text-brand-dark dark:text-brand-light">A${quoteDetails.showPreparationFee}.00</td>
                </tr>
                <tr className="bg-brand-primary/10 text-brand-dark dark:text-brand-light font-bold">
                  <td className="p-3 border-b border-brand-secondary">TOTAL BASE INVOICE</td>
                  <td className="p-3 border-b border-brand-secondary">(To be paid by Erin Kennedy)</td>
                  <td className="p-3 border-b border-brand-secondary text-right">A${totalBaseInvoice}.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Optional Rehearsal Bundle */}
        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-lg border border-brand-secondary/30 space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center">Optional Rehearsal Support for Students</h3>
          <p className="text-xl text-brand-dark/90 dark:text-brand-light/90 text-center max-w-3xl mx-auto">
            To help students feel fully prepared and confident for their performance, Daniele offers dedicated rehearsal opportunities.
          </p>
          <div className="text-center">
            <p className="text-3xl font-semibold text-brand-primary">
              Base Investment per student: <span className="text-brand-dark dark:text-brand-light text-4xl">A${quoteDetails.rehearsalBundleCost} for a 15-minute rehearsal</span>
            </p>
            <p className="text-lg text-brand-dark/70 dark:text-brand-light/70 mt-2">
              Each 15-minute session is designed for a focused run-through of a student's piece, with time for essential touch-ups and feedback.
            </p>
            <p className="text-lg text-brand-dark/70 dark:text-brand-light/70 mt-2">
              Students can request longer rehearsal times:
              <ul className="list-disc list-inside text-left max-w-xs mx-auto mt-2">
                <li>30 minutes for A$50</li>
                <li>45 minutes for A$75</li>
              </ul>
            </p>
            <p className="text-lg text-brand-dark/70 dark:text-brand-light/70 mt-4">
              To ensure thorough preparation, Daniele kindly requests PDF sheet music for all songs and a complete song list at least two weeks prior to the event (or earlier, if possible).
            </p>
            <p className="text-lg text-brand-dark/70 dark:text-brand-light/70 mt-2">
              To facilitate efficient scheduling, please inform Daniele of the total number of students participating in the concert as soon as possible. Daniele will then work to schedule rehearsals in convenient, grouped time blocks.
            </p>
          </div>
        </section>

        {/* Key Details for Your Booking */}
        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-lg border border-brand-secondary/30 space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center">Important Booking Details</h3>
          <ul className="list-disc list-inside text-lg text-brand-dark/90 dark:text-brand-light/90 space-y-2">
            <li>Your final invoice for the base services to Erin Kennedy will be A${totalBaseInvoice}.00.</li>
            <li>A {quoteDetails.depositPercentage}% deposit (A${requiredDeposit}.00) is kindly requested immediately to formally secure the November 23rd date.</li>
            <li><strong className="text-brand-primary">Keyboard Provision:</strong> Daniele kindly requests that MC Showroom provides a fully weighted keyboard or piano on stage, ready for use by 2:30 PM.</li>
          </ul>
        </section>

        {/* Client Acceptance Form */}
        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-2xl border border-brand-primary/50 space-y-8">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center">Accept Your Quote</h3>
          <p className="text-xl text-brand-dark/90 dark:text-brand-light/90 text-center max-w-3xl mx-auto">
            Please fill out your details below to formally accept this quote.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-dark dark:text-brand-light">Your Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Erin Kennedy"
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
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-dark dark:text-brand-light">Your Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="erin@example.com"
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
                name="acceptQuote"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-brand-secondary p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="accept-quote"
                        className="h-5 w-5 border-brand-primary text-brand-dark data-[state=checked]:bg-brand-primary data-[state=checked]:text-brand-light"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="accept-quote" className="text-brand-dark dark:text-brand-light text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I, <span className="text-brand-primary font-semibold">{form.watch("clientName") || "Erin Kennedy"}</span>, accept this quote for the {quoteDetails.eventTitle} on {quoteDetails.dateOfEvent}.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-xl py-7 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Accept Quote & Proceed"}
              </Button>
            </form>
          </Form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ErinKennedyQuotePage;