"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft, Phone, Mail, Checkbox } from 'lucide-react';
import Footer from '@/components/Footer';
import { useTheme } from "next-themes";
import { toast } from 'sonner';
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

interface Quote {
  id: string;
  client_name: string;
  client_email: string;
  invoice_type: string;
  event_title?: string;
  event_date?: string;
  event_location?: string;
  prepared_by?: string;
  total_amount: number;
  details: any; // JSONB column
  accepted_at: string;
}

// Zod schema for Live Piano Services Quote acceptance
const livePianoFormSchema = z.object({
  clientName: z.string().min(2, { message: "Your full name is required." }),
  clientEmail: z.string().email({ message: "A valid email address is required." }),
  wantsExtraHour: z.boolean().default(false),
  wantsRehearsal: z.boolean().default(false),
});

// Zod schema for Erin Kennedy Quote acceptance
const erinKennedyFormSchema = z.object({
  clientName: z.string().min(2, { message: "Your full name is required." }),
  clientEmail: z.string().email({ message: "A valid email address is required." }),
  acceptQuote: z.boolean().refine(val => val === true, { message: "You must accept the quote to proceed." }),
});

const DynamicQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Form hooks for conditional rendering
  const livePianoForm = useForm<z.infer<typeof livePianoFormSchema>>({
    resolver: zodResolver(livePianoFormSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      wantsExtraHour: false,
      wantsRehearsal: false,
    },
  });

  const erinKennedyForm = useForm<z.infer<typeof erinKennedyFormSchema>>({
    resolver: zodResolver(erinKennedyFormSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      acceptQuote: false,
    },
  });

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) {
        setError("Quote ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        setError('Failed to load quote details. It might not exist or you do not have access.');
        setQuote(null);
      } else {
        setQuote(data as Quote);
        // Set default form values if quote data is available
        if (data.invoice_type === "Live Piano Services Quote") {
          livePianoForm.reset({
            clientName: data.client_name || '',
            clientEmail: data.client_email || '',
            wantsExtraHour: data.details?.selected_add_ons?.extraHour || false,
            wantsRehearsal: data.details?.selected_add_ons?.rehearsal || false,
          });
        } else if (data.invoice_type === "Erin Kennedy Quote") {
          erinKennedyForm.reset({
            clientName: data.client_name || '',
            clientEmail: data.client_email || '',
            acceptQuote: false, // Always start as false for acceptance
          });
        }
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [id]); // Depend on ID to refetch if URL changes

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <span className="sr-only">Loading quote...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light p-4">
        <h2 className="text-3xl font-bold mb-4">Error</h2>
        <p className="text-lg text-red-500 mb-6">{error}</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light p-4">
        <h2 className="text-3xl font-bold mb-4">Quote Not Found</h2>
        <p className="text-lg mb-6">The quote you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  // --- Live Piano Services Quote Specifics ---
  const livePianoProposalDetails = {
    client: quote.client_name,
    dateOfEvent: quote.event_date || "N/A",
    time: "6:00–9:00pm", // Hardcoded for this specific quote type
    location: quote.event_location || "N/A",
    preparedBy: quote.prepared_by || "Daniele Buatti",
  };
  const baseEngagementFee = 1200;
  const livePianoAddOns = {
    rehearsal: {
      name: "Pre-event rehearsal",
      cost: 700,
      description: "A 2-hour rehearsal session one week prior to the event, including travel.",
    },
    extraHour: {
      name: "Extended Performance Hour",
      cost: 350,
      description: "Extend the live performance by one hour (until 10:00pm).",
    },
  };
  const wantsExtraHour = livePianoForm.watch("wantsExtraHour");
  const wantsRehearsal = livePianoForm.watch("wantsRehearsal");
  const livePianoTotalAmount = baseEngagementFee + (wantsExtraHour ? livePianoAddOns.extraHour.cost : 0) + (wantsRehearsal ? livePianoAddOns.rehearsal.cost : 0);

  async function onSubmitLivePiano(values: z.infer<typeof livePianoFormSchema>) {
    const loadingToastId = toast.loading("Submitting your acceptance...");
    try {
      const { error } = await supabase.functions.invoke('submit-quote-acceptance', {
        body: {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          wantsExtraHour: values.wantsExtraHour,
          wantsRehearsal: values.wantsRehearsal,
          totalAmount: livePianoTotalAmount,
          proposalDetails: livePianoProposalDetails,
        },
      });
      if (error) throw error;
      toast.success("Quote accepted successfully!", { id: loadingToastId });
      livePianoForm.reset();
      // Optionally redirect to a confirmation page or update UI
    } catch (error) {
      console.error("Error submitting quote acceptance:", error);
      toast.error("Failed to submit quote acceptance.", { id: loadingToastId });
    }
  }

  // --- Erin Kennedy Quote Specifics ---
  const erinKennedyQuoteDetails = {
    client: quote.client_name,
    eventTitle: quote.event_title || "2025 Vocal Showcase",
    dateOfEvent: quote.event_date || "Sunday 23 November 2025",
    time: "2:30 PM – 6:00 PM",
    location: quote.event_location || "MC Showroom",
    preparedBy: quote.prepared_by || "Daniele Buatti",
    hourlyRate: 100,
    performanceHours: 3.5,
    showPreparationFee: 100,
    rehearsalBundleCost: 30, // Per student for 15 min
    depositPercentage: 50,
  };
  const erinKennedyOnSitePerformanceCost = erinKennedyQuoteDetails.performanceHours * erinKennedyQuoteDetails.hourlyRate;
  const erinKennedyTotalBaseInvoice = erinKennedyOnSitePerformanceCost + erinKennedyQuoteDetails.showPreparationFee;
  const erinKennedyRequiredDeposit = erinKennedyTotalBaseInvoice * (erinKennedyQuoteDetails.depositPercentage / 100);

  async function onSubmitErinKennedy(values: z.infer<typeof erinKennedyFormSchema>) {
    const loadingToastId = toast.loading("Submitting your quote acceptance...");
    try {
      const { error } = await supabase.functions.invoke('submit-erin-kennedy-quote', {
        body: {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          eventTitle: erinKennedyQuoteDetails.eventTitle,
          eventDate: erinKennedyQuoteDetails.dateOfEvent,
          eventLocation: erinKennedyQuoteDetails.location,
          preparedBy: erinKennedyQuoteDetails.preparedBy,
          onSitePerformanceCost: erinKennedyOnSitePerformanceCost,
          showPreparationFee: erinKennedyQuoteDetails.showPreparationFee,
          totalBaseInvoice: erinKennedyTotalBaseInvoice,
          rehearsalBundleCostPerStudent: erinKennedyQuoteDetails.rehearsalBundleCost,
        },
      });
      if (error) throw error;
      toast.success("Quote accepted successfully!", { id: loadingToastId });
      erinKennedyForm.reset();
      // Optionally redirect to a confirmation page or update UI
    } catch (error) {
      console.error("Error submitting quote acceptance:", error);
      toast.error("Failed to submit quote acceptance.", { id: loadingToastId });
    }
  }

  // --- Render Logic based on invoice_type ---
  const renderLivePianoQuote = () => (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light font-montserrat">
      <header className="bg-livePiano-darker py-5 px-6 md:px-12 shadow-lg relative z-10 border-b border-livePiano-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-livePiano-light hover:text-livePiano-primary transition-colors duration-200 px-0 py-0 h-auto">
            <Link to="/">
              <span className="flex items-center text-base md:text-lg font-semibold">
                <ArrowLeft className="h-5 w-5 mr-2" /> <span>Back to Home</span>
              </span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-16 md:h-20" width={80} height={80} />
            <h1 className="text-xl md:text-2xl font-montserrat font-light uppercase text-livePiano-light tracking-widest mt-2">
              Daniele Buatti
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <section className="relative mt-8 mb-8 rounded-xl overflow-hidden shadow-lg border-4 border-livePiano-primary">
          <DynamicImage
            src="/live-performance.jpeg"
            alt="Daniele Buatti performing live"
            className="w-full h-96 md:h-[450px] object-cover object-center"
            width={800}
            height={533}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-livePiano-darker/50 to-transparent"></div>
        </section>

        <section className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-libre-baskerville font-extrabold text-livePiano-primary mb-6 leading-none text-shadow-lg">
            Christmas Carols – Live Piano Quote
          </h2>
          <div className="text-xl text-livePiano-light/90 max-w-3xl mx-auto space-y-3 font-medium">
            <p>Prepared for: <strong className="text-livePiano-primary">{livePianoProposalDetails.client}</strong></p>
            <p>Date of Event: {livePianoProposalDetails.dateOfEvent}</p>
            <p>Time: {livePianoProposalDetails.time}</p>
            <p>Location: {livePianoProposalDetails.location}</p>
            <p>Prepared by: {livePianoProposalDetails.preparedBy}</p>
          </div>
          <Separator className="max-w-lg mx-auto bg-livePiano-primary h-1 mt-10" />
        </section>

        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center text-shadow-sm">Live Piano Engagement Fee</h3>
          <p className="text-xl text-livePiano-light/90 text-center max-w-3xl mx-auto">
            Your A${baseEngagementFee} fee secures a premium, seamless musical experience for your event. This includes all preparation and time on-site from 6:00pm to 9:00pm.
          </p>
          <div className="text-livePiano-light/80 space-y-4 max-w-3xl mx-auto">
            <h4 className="text-2xl font-semibold text-livePiano-primary text-center text-shadow-sm mb-4">Service Components</h4>
            <ul className="list-disc list-inside space-y-2 [&>li]:marker:text-livePiano-primary [&>li]:marker:text-xl">
              <li><strong>3-Hour Live Performance:</strong> Two 45-minute carol sets and beautiful background music between sets (if desired).</li>
              <li><strong>Collaboration on song selection</strong></li>
              <li><strong>Flexible Timing:</strong> Performance timing is flexible to dynamically respond to the needs of guests (the "on-call buffer").</li>
              <li><strong>All-Inclusive Logistics:</strong> Covers all sheet music preparation, travel, and setup required for the evening.</li>
            </ul>
          </div>
          <p className="text-3xl font-semibold text-livePiano-primary text-center text-shadow-sm mt-8">
            All-Inclusive Engagement Fee: <strong>A${baseEngagementFee}</strong>
          </p>
        </section>

        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center text-shadow-sm">Optional Add-Ons</h3>
          <p className="text-xl text-livePiano-light/90 text-center max-w-3xl mx-auto">
            These premium options are available to enhance the musical quality and duration of your evening.
          </p>
          <Form {...livePianoForm}>
            <form onSubmit={livePianoForm.handleSubmit(onSubmitLivePiano)} className="space-y-8 max-w-2xl mx-auto">
              <FormField
                control={livePianoForm.control}
                name="wantsRehearsal"
                render={({ field }) => (
                  <FormItem className={cn(
                    "flex flex-col space-y-0 rounded-md border border-livePiano-border/50 p-4 transition-all duration-200 cursor-pointer",
                    field.value ? "border-livePiano-primary shadow-lg bg-livePiano-background/30" : "hover:border-livePiano-primary hover:shadow-md"
                  )}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                      <div className="flex items-start space-x-3 mb-4 sm:mb-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="add-on-rehearsal"
                            className="h-6 w-6 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="add-on-rehearsal" className="text-xl font-bold text-livePiano-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {livePianoAddOns.rehearsal.name}
                          </FormLabel>
                          <FormDescription className="text-livePiano-light/70 text-base">
                            {livePianoAddOns.rehearsal.description}
                          </FormDescription>
                        </div>
                      </div>
                      <div className={cn(
                        "text-3xl font-bold sm:ml-auto",
                        field.value ? "text-livePiano-primary" : "text-livePiano-light/50"
                      )}>
                        A${livePianoAddOns.rehearsal.cost}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={livePianoForm.control}
                name="wantsExtraHour"
                render={({ field }) => (
                  <FormItem className={cn(
                    "flex flex-col space-y-0 rounded-md border border-livePiano-border/50 p-4 transition-all duration-200 cursor-pointer",
                    field.value ? "border-livePiano-primary shadow-lg bg-livePiano-background/30" : "hover:border-livePiano-primary hover:shadow-md"
                  )}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                      <div className="flex items-start space-x-3 mb-4 sm:mb-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="add-on-extra-hour"
                            className="h-6 w-6 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="add-on-extra-hour" className="text-xl font-bold text-livePiano-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {livePianoAddOns.extraHour.name}
                          </FormLabel>
                          <FormDescription className="text-livePiano-light/70 text-base">
                            {livePianoAddOns.extraHour.description}
                          </FormDescription>
                        </div>
                      </div>
                      <div className={cn(
                        "text-3xl font-bold sm:ml-auto",
                        field.value ? "text-livePiano-primary" : "text-livePiano-light/50"
                      )}>
                        A${livePianoAddOns.extraHour.cost}
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className="text-center mt-10 p-6 bg-livePiano-primary/10 rounded-lg border border-livePiano-primary/30 shadow-lg">
                <p className="text-2xl md:text-3xl font-bold text-livePiano-primary text-shadow-sm">
                  Total Estimated Cost: <span className="text-livePiano-light text-4xl md:text-5xl">A${livePianoTotalAmount}</span>
                </p>
              </div>

              <FormField
                control={livePianoForm.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-livePiano-light text-lg text-shadow-sm">Your Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Imme Kaschner"
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60 focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={livePianoForm.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-livePiano-light text-lg text-shadow-sm">Your Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., your@email.com"
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60 focus-visible:ring-2 focus-visible:ring-livePiano-primary focus-visible:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-xl text-livePiano-light/90 text-center font-semibold mt-8">
                I, <span className="text-livePiano-primary">{livePianoForm.watch("clientName") || "Your Name"}</span>, confirm my selection and booking for the event on {livePianoProposalDetails.dateOfEvent}.
              </p>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker text-xl py-7 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={livePianoForm.formState.isSubmitting || !livePianoForm.formState.isValid}
              >
                {livePianoForm.formState.isSubmitting ? "Submitting..." : "Submit Acceptance"}
              </Button>
            </form>
          </Form>
        </section>

        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center text-shadow-sm">Booking Information</h3>
          <ul className="list-disc list-inside text-lg text-livePiano-light/90 space-y-2">
            <li>A 50% deposit is required to formally secure your booking.</li>
            <li>The remaining balance is due 7 days prior to the event.</li>
          </ul>
        </section>
      </main>

      <footer
        className="relative py-16 text-center overflow-hidden"
        style={{ backgroundImage: `url(/bowtie.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <p className="text-livePiano-light text-2xl font-semibold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <a
              href="https://wa.me/61424174067"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-livePiano-primary transition-colors"
            >
              <Phone size={24} /> 0424 174 067
            </a>
            <a
              href="mailto:info@danielebuatti.com"
              className="flex items-center gap-2 hover:text-livePiano-primary transition-colors"
            >
              <Mail size={24} /> info@danielebuatti.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );

  const renderErinKennedyQuote = () => (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light flex flex-col">
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
            {erinKennedyQuoteDetails.eventTitle} – Live Piano Quote
          </h2>
          <div className="text-xl text-brand-dark/90 dark:text-brand-light/90 max-w-3xl mx-auto space-y-3 font-medium">
            <p>Prepared for: <strong className="text-brand-primary">{erinKennedyQuoteDetails.client}</strong></p>
            <p>Date of Event: {erinKennedyQuoteDetails.dateOfEvent}</p>
            <p>Time: {erinKennedyQuoteDetails.time}</p>
            <p>Location: {erinKennedyQuoteDetails.location}</p>
            <p>Prepared by: {erinKennedyQuoteDetails.preparedBy}</p>
          </div>
          <Separator className="max-w-lg mx-auto bg-brand-primary h-1 mt-10" />
        </section>

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
                    {erinKennedyQuoteDetails.performanceHours} hours of dedicated on-site presence, including arrival, setup, soundcheck, and performance ({erinKennedyQuoteDetails.time}).
                    <br />
                    <span className="text-sm text-brand-dark/70 dark:text-brand-light/70">Rate: A${erinKennedyQuoteDetails.hourlyRate}/hr</span>
                  </td>
                  <td className="p-3 border-b border-brand-secondary text-right text-brand-dark dark:text-brand-light">A${erinKennedyOnSitePerformanceCost}.00</td>
                </tr>
                <tr className="hover:bg-brand-secondary/10 transition-colors">
                  <td className="p-3 border-b border-brand-secondary font-semibold text-brand-primary">Production Coordination & Music Preparation</td>
                  <td className="p-3 border-b border-brand-secondary text-brand-dark/80 dark:text-brand-light/80">
                    A flat fee covering essential behind-the-scenes work: coordinating with all students, collecting and formatting sheet music, and preparing for a seamless production.
                  </td>
                  <td className="p-3 border-b border-brand-secondary text-right text-brand-dark dark:text-brand-light">A${erinKennedyQuoteDetails.showPreparationFee}.00</td>
                </tr>
                <tr className="bg-brand-primary/10 text-brand-dark dark:text-brand-light font-bold">
                  <td className="p-3 border-b border-brand-secondary">TOTAL BASE INVOICE</td>
                  <td className="p-3 border-b border-brand-secondary">(To be paid by Erin Kennedy)</td>
                  <td className="p-3 border-b border-brand-secondary text-right">A${erinKennedyTotalBaseInvoice}.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-lg border border-brand-secondary/30 space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center">Optional Rehearsal Support for Students</h3>
          <p className="text-xl text-brand-dark/90 dark:text-brand-light/90 text-center max-w-3xl mx-auto">
            To help students feel fully prepared and confident for their performance, Daniele offers dedicated rehearsal opportunities.
          </p>
          <div className="text-center">
            <p className="text-3xl font-semibold text-brand-primary">
              Base Investment per student: <span className="text-brand-dark dark:text-brand-light text-4xl">A${erinKennedyQuoteDetails.rehearsalBundleCost} for a 15-minute rehearsal</span>
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

        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-lg border border-brand-secondary/30 space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center">Important Booking Details</h3>
          <ul className="list-disc list-inside text-lg text-brand-dark/90 dark:text-brand-light/90 space-y-2">
            <li>Your final invoice for the base services to Erin Kennedy will be A${erinKennedyTotalBaseInvoice}.00.</li>
            <li><strong className="text-brand-primary">A non-refundable {erinKennedyQuoteDetails.depositPercentage}% deposit (A${erinKennedyRequiredDeposit}.00) is required immediately</strong> to formally secure the November 23rd date.</li>
            <li><strong className="text-brand-primary">Keyboard Provision:</strong> Daniele kindly requests that MC Showroom provides a fully weighted keyboard or piano on stage, ready for use by 2:30 PM.</li>
          </ul>
        </section>

        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-2xl border border-brand-primary/50 space-y-8">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center">Accept Your Quote</h3>
          <p className="text-xl text-brand-dark/90 dark:text-brand-light/90 text-center max-w-3xl mx-auto">
            Please fill out your details below to formally accept this quote.
          </p>

          <Form {...erinKennedyForm}>
            <form onSubmit={erinKennedyForm.handleSubmit(onSubmitErinKennedy)} className="space-y-6 max-w-xl mx-auto">
              <FormField
                control={erinKennedyForm.control}
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
                control={erinKennedyForm.control}
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
                control={erinKennedyForm.control}
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
                        I, <span className="text-brand-primary font-semibold">{erinKennedyForm.watch("clientName") || "Erin Kennedy"}</span>, accept this quote for the {erinKennedyQuoteDetails.eventTitle} on {erinKennedyQuoteDetails.dateOfEvent}.
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
                disabled={erinKennedyForm.formState.isSubmitting || !erinKennedyForm.formState.isValid}
              >
                {erinKennedyForm.formState.isSubmitting ? "Submitting..." : "Accept Quote & Proceed"}
              </Button>
            </form>
          </Form>
        </section>
      </main>

      <Footer />
    </div>
  );

  return (
    <>
      {quote.invoice_type === "Live Piano Services Quote" && renderLivePianoQuote()}
      {quote.invoice_type === "Erin Kennedy Quote" && renderErinKennedyQuote()}
      {/* Add more conditional renders for other quote types here */}
    </>
  );
};

export default DynamicQuotePage;