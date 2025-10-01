"use client";

import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client'; // Keep Supabase client import for invoking functions
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';

// Define the form schema using zod
const formSchema = z.object({
  clientName: z.string().min(2, { message: "Your full name is required." }),
  clientEmail: z.string().email({ message: "A valid email address is required." }),
  wantsExtraHour: z.boolean().default(false),
  wantsRehearsal: z.boolean().default(false),
});

const QuoteProposalPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const proposalDetails = {
    client: "Imme Kaschner",
    dateOfEvent: "Saturday 22 November 2025",
    time: "6:00–9:00pm",
    location: "Kew (Private Home)",
    preparedBy: "Daniele Buatti",
  };

  // Base hourly rate for performance and rehearsal
  const hourlyRate = 350; 

  // Base engagement fee is now all-inclusive
  const baseEngagementFee = 1200; 

  const addOns = {
    rehearsal: {
      name: "Pre-event rehearsal",
      cost: 700, // Fixed cost
      description: "A 2-hour rehearsal session one week prior to the event, including travel.",
    },
    extraHour: {
      name: "Extended Performance Hour",
      cost: 350, // Consistent with hourly rate
      description: "Extend the live performance by one hour (until 10:00pm).",
    },
  };

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      wantsExtraHour: false,
      wantsRehearsal: false,
    },
  });

  const wantsExtraHour = form.watch("wantsExtraHour");
  const wantsRehearsal = form.watch("wantsRehearsal");

  // Calculate total amount dynamically
  const totalAmount = useMemo(() => {
    let total = baseEngagementFee;
    if (wantsExtraHour) total += addOns.extraHour.cost;
    if (wantsRehearsal) {
      total += addOns.rehearsal.cost;
    }
    return total;
  }, [wantsExtraHour, wantsRehearsal]);

  // Calculate individual add-on costs for display
  const extraHourDisplayCost = wantsExtraHour ? addOns.extraHour.cost : 0;
  const rehearsalDisplayCost = wantsRehearsal ? addOns.rehearsal.cost : 0;

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToastId = toast.loading("Submitting your acceptance...");

    try {
      // Invoke the new Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('submit-quote-acceptance', {
        body: {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          wantsExtraHour: values.wantsExtraHour,
          wantsRehearsal: values.wantsRehearsal,
          totalAmount: totalAmount,
          proposalDetails: proposalDetails, // Pass proposal details to the function
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Quote accepted successfully!", {
        id: loadingToastId,
        description: "Thank you! Daniele will be in touch shortly to finalise details.",
      });
      form.reset();
      navigate('/live-piano-services/quote-confirmation');
    } catch (error) {
      console.error("Error submitting quote acceptance:", error);
      toast.error("Failed to submit quote acceptance.", {
        id: loadingToastId,
        description: "Please try again later.",
      });
    }
  }

  return (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light font-montserrat">
      {/* Header for Quote Proposal */}
      <header className="bg-livePiano-darker py-5 px-6 md:px-12 shadow-lg relative z-10 border-b border-livePiano-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-livePiano-light hover:text-livePiano-primary transition-colors duration-200 px-0 py-0 h-auto">
            <Link to="/">
              <span className="flex items-center text-base md:text-lg font-semibold">
                <ArrowLeft className="h-5 w-5 mr-2" /> <span>Back to Home</span>
              </span>
            </Link>
          </Button>
          <div className="flex items-center gap-2"> {/* Adjusted for better alignment */}
            <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-16 md:h-20" width={80} height={80} />
            <h1 className="text-xl md:text-2xl font-montserrat font-light uppercase text-livePiano-light tracking-widest mt-2">
              Daniele Buatti
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Hero Image Section */}
        <section className="relative mt-8 mb-8 rounded-xl overflow-hidden shadow-lg border-4 border-livePiano-primary">
          <DynamicImage
            src="/live-performance.jpeg"
            alt="Daniele Buatti performing live"
            className="w-full h-96 md:h-[450px] object-cover object-center"
            width={800}
            height={533}
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-livePiano-darker/50 to-transparent"></div>
        </section>

        <section className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-libre-baskerville font-extrabold text-livePiano-primary mb-6 leading-none text-shadow-lg">
            Christmas Carols – Live Piano Quote
          </h2>
          <div className="text-xl text-livePiano-light/90 max-w-3xl mx-auto space-y-3 font-medium">
            <p>Prepared for: <strong className="text-livePiano-primary">{proposalDetails.client}</strong></p>
            <p>Date of Event: {proposalDetails.dateOfEvent}</p>
            <p>Time: {proposalDetails.time}</p>
            <p>Location: {proposalDetails.location}</p>
            <p>Prepared by: {proposalDetails.preparedBy}</p>
          </div>
          <Separator className="max-w-lg mx-auto bg-livePiano-primary h-1 mt-10" />
        </section>

        {/* Live Piano Engagement Fee Section */}
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

        {/* Optional Add-Ons */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center text-shadow-sm">Optional Add-Ons</h3>
          <p className="text-xl text-livePiano-light/90 text-center max-w-3xl mx-auto">
            These premium options are available to enhance the musical quality and duration of your evening.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
              <FormField
                control={form.control}
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
                            {addOns.rehearsal.name}
                          </FormLabel>
                          <FormDescription className="text-livePiano-light/70 text-base">
                            {addOns.rehearsal.description}
                          </FormDescription>
                        </div>
                      </div>
                      <div className={cn(
                        "text-3xl font-bold sm:ml-auto",
                        field.value ? "text-livePiano-primary" : "text-livePiano-light/50"
                      )}>
                        A${rehearsalDisplayCost}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                            {addOns.extraHour.name}
                          </FormLabel>
                          <FormDescription className="text-livePiano-light/70 text-base">
                            {addOns.extraHour.description}
                          </FormDescription>
                        </div>
                      </div>
                      <div className={cn(
                        "text-3xl font-bold sm:ml-auto",
                        field.value ? "text-livePiano-primary" : "text-livePiano-light/50"
                      )}>
                        A${extraHourDisplayCost}
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className="text-center mt-10 p-6 bg-livePiano-primary/10 rounded-lg border border-livePiano-primary/30 shadow-lg">
                <p className="text-2xl md:text-3xl font-bold text-livePiano-primary text-shadow-sm">
                  Total Estimated Cost: <span className="text-livePiano-light text-4xl md:text-5xl">A${totalAmount}</span>
                </p>
              </div>

              {/* Client Acceptance Form Fields */}
              <FormField
                control={form.control}
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
                control={form.control}
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
                I, <span className="text-livePiano-primary">{form.watch("clientName") || "Your Name"}</span>, confirm my selection and booking for the event on {proposalDetails.dateOfEvent}.
              </p>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker text-xl py-7 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Acceptance"}
              </Button>
            </form>
          </Form>
        </section>

        {/* Booking Information */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center text-shadow-sm">Booking Information</h3>
          <ul className="list-disc list-inside text-lg text-livePiano-light/90 space-y-2">
            <li>A 50% deposit is required to formally secure your booking.</li>
            <li>The remaining balance is due 7 days prior to the event.</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteProposalPage;