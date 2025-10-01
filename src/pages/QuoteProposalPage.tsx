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
import * as z from "zod"; // Corrected import statement
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from "@/components/ui/separator";

// Define the form schema using zod
const formSchema = z.object({
  clientName: z.string().min(2, { message: "Your full name is required." }),
  clientEmail: z.string().email({ message: "A valid email address is required." }),
  wantsExtraHour: z.boolean().default(false),
  wantsRehearsal: z.boolean().default(false),
  rehearsalHours: z.coerce.number().optional(), // Use z.coerce.number() for select value
  wantsSongSheets: z.boolean().default(false),
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

  const hourlyRate = 350;

  const baseService = {
    hours: 3,
    cost: hourlyRate * 3, // 3 hours performance
    description: "3 hours of live piano performance, including carol sing-alongs (two 45-min sets) and background music between sets. I will provide a printed song list.",
  };

  const addOns = {
    extraHour: {
      name: "Extra hour (to 10pm)",
      cost: hourlyRate, // 1 extra hour
      description: "Extend the performance by one hour.",
    },
    rehearsalHourlyRate: hourlyRate, // For dynamic calculation
    rehearsalTravelCost: hourlyRate, // Fixed cost for travel if rehearsal is chosen (1 hour equivalent)
    songSheets: {
      name: "Custom printed song sheets",
      cost: 150,
      description: "Custom designed and printed song sheets for your guests.",
    },
  };

  const rehearsalDurationOptions = [
    { value: 1, label: "1 hour" },
    { value: 1.5, label: "1.5 hours" },
    { value: 2, label: "2 hours" },
    { value: 2.5, label: "2.5 hours" },
    { value: 3, label: "3 hours" },
  ];

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      wantsExtraHour: false,
      wantsRehearsal: false,
      rehearsalHours: 1.5, // Default to 1.5 hours if rehearsal is selected
      wantsSongSheets: false,
    },
  });

  const wantsExtraHour = form.watch("wantsExtraHour");
  const wantsRehearsal = form.watch("wantsRehearsal");
  const rehearsalHours = form.watch("rehearsalHours");
  const wantsSongSheets = form.watch("wantsSongSheets");

  // Calculate total amount dynamically
  const totalAmount = useMemo(() => {
    let total = baseService.cost;
    if (wantsExtraHour) total += addOns.extraHour.cost;
    if (wantsRehearsal && rehearsalHours) {
      total += (rehearsalHours * addOns.rehearsalHourlyRate) + addOns.rehearsalTravelCost;
    }
    if (wantsSongSheets) total += addOns.songSheets.cost;
    return total;
  }, [wantsExtraHour, wantsRehearsal, rehearsalHours, wantsSongSheets]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToastId = toast.loading("Submitting your acceptance...");

    try {
      const selectedAddOnsList: string[] = [];
      if (values.wantsExtraHour) selectedAddOnsList.push(addOns.extraHour.name);
      if (values.wantsRehearsal && values.rehearsalHours) {
        selectedAddOnsList.push(`Pre-event rehearsal (${values.rehearsalHours} hours + Travel)`);
      }
      if (values.wantsSongSheets) selectedAddOnsList.push(addOns.songSheets.name);

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('quote_acceptances')
        .insert([
          {
            client_name: values.clientName,
            client_email: values.clientEmail,
            selected_package_id: "Base Performance", // Indicating the base service
            has_add_on: selectedAddOnsList.length > 0, // True if any add-on is selected
            selected_add_ons: selectedAddOnsList.join(', '), // Store selected add-ons
            total_amount: totalAmount,
            event_date: proposalDetails.dateOfEvent,
            event_location: proposalDetails.location,
            quote_title: "Christmas Carols – Private Party Quote Proposal",
            quote_prepared_by: proposalDetails.preparedBy,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      toast.success("Quote accepted successfully!", {
        id: loadingToastId,
        description: "Thank you! Daniele will be in touch shortly to finalize details.",
      });

      form.reset();
      navigate('/live-piano-services/quote-confirmation');

    } catch (error) {
      console.error("Error submitting quote acceptance:", error);
      toast.error("Failed to submit quote acceptance.", {
        id: loadingToastId,
        description: "Please try again later or contact Daniele directly.",
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
          <div className="flex items-center gap-2">
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
            src="/live-performance.jpeg" // Updated image source
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
            Christmas Carols – Live Piano
          </h2>
          <div className="text-xl text-livePiano-light/90 max-w-3xl mx-auto space-y-3 font-medium">
            <p>Event: <strong className="text-livePiano-primary">{proposalDetails.dateOfEvent}</strong></p>
            <p>Time: {proposalDetails.time}</p>
            <p>Location: {proposalDetails.location}</p>
            <p>Prepared for: <strong className="text-livePiano-primary">{proposalDetails.client}</strong></p>
            <p>Prepared by: {proposalDetails.preparedBy}</p>
          </div>
          <Separator className="max-w-lg mx-auto bg-livePiano-primary h-1 mt-10" />
        </section>

        {/* Service Description */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center text-shadow-sm">Service: Live Piano Performance</h3>
          <p className="text-xl text-livePiano-light/90 text-center max-w-3xl mx-auto">
            I will provide {baseService.hours} hours of live piano performance for your event.
          </p>
          <div className="text-livePiano-light/80 space-y-4 max-w-3xl mx-auto">
            <ul className="list-disc list-inside space-y-2 [&>li]:marker:text-livePiano-primary [&>li]:marker:text-xl">
              <li>Carol sing-alongs (two 45-minute sets)</li>
              <li>Background music between sets</li>
              <li>I will provide a printed song list</li>
            </ul>
          </div>
          <p className="text-3xl font-semibold text-livePiano-primary text-center text-shadow-sm mt-8">
            Cost: <strong>A${baseService.cost}</strong>
          </p>
          <p className="text-lg text-livePiano-light/70 text-center">
            My hourly rate is A${hourlyRate}/hour.
          </p>
        </section>

        {/* Optional Add-Ons */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center text-shadow-sm">Optional Add-Ons</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
              <FormField
                control={form.control}
                name="wantsExtraHour"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-livePiano-border/50 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="add-on-extra-hour"
                        className="h-6 w-6 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="add-on-extra-hour" className="text-xl font-bold text-livePiano-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-livePiano-primary transition-colors duration-200">
                        {addOns.extraHour.name} (Add A${addOns.extraHour.cost})
                      </FormLabel>
                      <FormDescription className="text-livePiano-light/70 text-base">
                        {addOns.extraHour.description}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wantsRehearsal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-livePiano-border/50 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // If unchecking, reset rehearsal hours to default or null
                          if (!checked) {
                            form.setValue("rehearsalHours", undefined);
                          } else {
                            form.setValue("rehearsalHours", 1.5); // Set default when checked
                          }
                        }}
                        id="add-on-rehearsal"
                        className="h-6 w-6 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="add-on-rehearsal" className="text-xl font-bold text-livePiano-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-livePiano-primary transition-colors duration-200">
                        Pre-event rehearsal + Travel (A${(rehearsalHours || 0) * addOns.rehearsalHourlyRate + addOns.rehearsalTravelCost})
                      </FormLabel>
                      <FormDescription className="text-livePiano-light/70 text-base">
                        A dedicated rehearsal session one week prior to the event, plus travel time.
                      </FormDescription>
                      {wantsRehearsal && (
                        <FormField
                          control={form.control}
                          name="rehearsalHours"
                          render={({ field: rehearsalField }) => (
                            <FormItem className="mt-4">
                              <FormLabel className="text-livePiano-light text-base">Select Rehearsal Duration:</FormLabel>
                              <Select
                                onValueChange={(value) => rehearsalField.onChange(parseFloat(value))}
                                defaultValue={rehearsalField.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full bg-livePiano-background border-livePiano-border/50 text-livePiano-light focus-visible:ring-livePiano-primary">
                                    <SelectValue placeholder="Select hours" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="z-50 bg-livePiano-darker border-livePiano-border">
                                  {rehearsalDurationOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value.toString()} className="text-livePiano-light focus:bg-livePiano-primary focus:text-livePiano-darker">
                                      {option.label} (A${option.value * addOns.rehearsalHourlyRate})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wantsSongSheets"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-livePiano-border/50 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="add-on-song-sheets"
                        className="h-6 w-6 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="add-on-song-sheets" className="text-xl font-bold text-livePiano-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-livePiano-primary transition-colors duration-200">
                        {addOns.songSheets.name} (Add A${addOns.songSheets.cost})
                      </FormLabel>
                      <FormDescription className="text-livePiano-light/70 text-base">
                        {addOns.songSheets.description}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="text-center mt-10 p-6 bg-livePiano-primary/10 rounded-lg border border-livePiano-primary/30 shadow-lg">
                <p className="text-2xl md:text-3xl font-bold text-livePiano-primary text-shadow-sm">
                  Total Estimated Cost: <span className="text-livePiano-light">A${totalAmount}</span>
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
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60 focus-visible:ring-livePiano-primary"
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
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60 focus-visible:ring-livePiano-primary"
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