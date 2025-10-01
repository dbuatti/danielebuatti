"use client";

import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the form schema using zod
const formSchema = z.object({
  clientName: z.string().min(2, { message: "Your full name is required." }),
  clientEmail: z.string().email({ message: "A valid email address is required." }),
  selectedPackage: z.enum(["option3", "option2"], { // Only options 3 and 2 now
    required_error: "Please select a package.",
  }),
  hasAddOn: z.boolean().default(false),
});

const QuoteProposalPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const proposalDetails = {
    client: "Imme Kaschner",
    dateOfEvent: "Saturday 22 November 2025",
    time: "6:00–9:00pm (or later for the Premium Option)",
    location: "Kew (Private Home)",
    preparedBy: "Daniele Buatti",
  };

  // Updated packages: Option 3 first, then Option 2. Option 1 removed.
  const packages = [
    { id: "option3", name: "The Ultimate Curated Celebration", focus: "Full Artistic Partnership & Rehearsal", contribution: 1350, image: "/quote-option-3.jpeg" },
    { id: "option2", name: "Seamless Festive Flow", focus: "Flexible 3-Hour Engagement & Atmosphere", contribution: 875, image: "/quote-option-2.jpeg" },
  ];

  const addOnPrice = 150;

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      selectedPackage: undefined,
      hasAddOn: false,
    },
  });

  const selectedPackageId = form.watch("selectedPackage");
  const hasAddOn = form.watch("hasAddOn");

  // Disable add-on if Option 3 is selected (as it's included)
  const isAddOnDisabled = selectedPackageId === "option3";

  // Reset add-on if Option 3 is selected
  useEffect(() => {
    if (isAddOnDisabled && hasAddOn) {
      form.setValue("hasAddOn", false);
    }
  }, [isAddOnDisabled, hasAddOn, form]);

  // Calculate total amount dynamically
  const totalAmount = useMemo(() => {
    const selectedPkg = packages.find(pkg => pkg.id === selectedPackageId);
    let total = selectedPkg ? selectedPkg.contribution : 0;
    if (hasAddOn && !isAddOnDisabled) {
      total += addOnPrice;
    }
    return total;
  }, [selectedPackageId, hasAddOn, isAddOnDisabled, packages]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToastId = toast.loading("Submitting your acceptance...");

    try {
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('quote_acceptances')
        .insert([
          {
            client_name: values.clientName,
            client_email: values.clientEmail,
            selected_package_id: values.selectedPackage,
            has_add_on: values.hasAddOn,
            total_amount: totalAmount, // Include the calculated total amount
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
          <Button asChild variant="ghost" className="text-livePiano-light hover:bg-livePiano-primary hover:text-livePiano-darker transition-colors duration-200">
            <Link to="/">
              <span className="flex items-center text-base md:text-lg font-semibold">
                <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
              </span>
            </Link>
          </Button>
          <div className="flex flex-col items-end">
            <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-16 md:h-20" width={80} height={80} />
            <h1 className="text-xl md:text-2xl font-montserrat font-light uppercase text-livePiano-light tracking-widest mt-2">
              Daniele Buatti
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        <section className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-libre-baskerville font-extrabold text-livePiano-primary mb-4 leading-tight text-shadow-sm">
            Your Bespoke Live Piano Quote for a Magical Christmas Carols Party
          </h2>
          <div className="text-xl text-livePiano-light/90 max-w-3xl mx-auto space-y-3 font-medium">
            <p>Prepared for: <strong className="text-livePiano-primary">{proposalDetails.client}</strong></p>
            <p>Date of Event: {proposalDetails.dateOfEvent}</p>
            <p>Time: {proposalDetails.time}</p>
            <p>Location: {proposalDetails.location}</p>
            <p>Prepared by: {proposalDetails.preparedBy}</p>
          </div>
        </section>

        {/* Package Options Anchor Table */}
        <section id="package-options" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
          <h3 className="text-3xl font-bold text-livePiano-light mb-8 text-center">🎄 Your Package Options</h3>
          <Table className="w-full text-livePiano-light rounded-lg overflow-hidden">
            <TableHeader className="bg-livePiano-primary/20">
              <TableRow className="border-livePiano-border/50">
                <TableHead className="text-livePiano-primary text-lg font-bold py-4 px-6">Package Name</TableHead><TableHead className="text-livePiano-primary text-lg font-bold py-4 px-6">Core Focus</TableHead><TableHead className="text-livePiano-primary text-lg font-bold py-4 px-6 text-right">Your Contribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="border-livePiano-border/50 hover:bg-livePiano-background/50 transition-colors duration-200">
                  <TableCell className="font-semibold text-livePiano-light py-4 px-6">
                    <a href={`#${pkg.id}`} className="hover:underline text-livePiano-primary transition-colors duration-200">{pkg.name}</a>
                  </TableCell><TableCell className="py-4 px-6">{pkg.focus}</TableCell><TableCell className="text-right font-bold text-livePiano-primary py-4 px-6">A${pkg.contribution}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Option 3: The Ultimate Curated Celebration */}
        <section id="option3" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-4xl font-bold text-livePiano-primary text-center text-shadow-sm">The Ultimate Curated Celebration</h3>
          <div className="relative h-72 md:h-[400px] flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-livePiano-border/50">
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(${packages[0].image})` }}
            ></div>
            <DynamicImage
              src={packages[0].image}
              alt="The Ultimate Curated Celebration"
              className="relative z-10 max-w-xl h-auto object-contain rounded-lg shadow-lg"
              width={800}
              height={400}
            />
          </div>
          <p className="text-3xl font-semibold text-livePiano-primary text-center text-shadow-sm">Your Contribution: A${packages[0].contribution}</p>
          <p className="text-lg text-livePiano-light/90 text-center max-w-2xl mx-auto">
            This is the most exquisite carols experience: fully curated, rehearsed, and expertly guided for maximum musical impact and complete peace of mind for you, the host.
          </p>
          <div className="text-livePiano-light/80 space-y-4 max-w-3xl mx-auto">
            <p className="text-xl font-semibold text-livePiano-primary">What's Included & The Value You Receive:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>**Private Rehearsal Session:** Dedicated 1.5 hours a week prior to the event (A$150 Value) to refine your group’s sound and prepare any singers.</li>
              <li>**Extended Coverage (6pm–10pm):** Guaranteed availability until the party concludes at 10pm—no watching the clock!</li>
              <li>**Personal Artistic Guidance & Collaboration:** Full collaboration on sheet music sourcing, set structure, and creation of a custom carols brochure.</li>
              <li>**Live Piano Performance:** Two 45-minute carol sets, beautiful background music, and spontaneous sing-alongs.</li>
            </ul>
          </div>
          <p className="text-lg italic text-livePiano-light/70 text-center mt-6 max-w-2xl mx-auto">
            Choose this option for a seamless, stress-free, and truly unforgettable musical evening with professional oversight from rehearsal through performance.
          </p>
        </section>

        {/* Option 2: Seamless Festive Flow */}
        <section id="option2" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-4xl font-bold text-livePiano-primary text-center text-shadow-sm">Seamless Festive Flow</h3>
          <div className="relative h-72 md:h-[400px] flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-livePiano-border/50">
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(${packages[1].image})` }}
            ></div>
            <DynamicImage
              src={packages[1].image}
              alt="Seamless Festive Flow"
              className="relative z-10 max-w-xl h-auto object-contain rounded-lg shadow-lg"
              width={800}
              height={400}
            />
          </div>
          <p className="text-3xl font-semibold text-livePiano-primary text-center text-shadow-sm">Your Contribution: A${packages[1].contribution}</p>
          <p className="text-lg text-livePiano-light/90 text-center max-w-2xl mx-auto">
            This flexible, high-value experience beautifully blends musical structure with adaptability, ensuring the perfect party atmosphere for your guests.
          </p>
          <div className="text-livePiano-light/80 space-y-4 max-w-3xl mx-auto">
            <p className="text-xl font-semibold text-livePiano-primary">What's Included & The Value You Receive:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>**Extended 3-Hour Engagement (6pm–9pm):** Ample time for guests to mingle and truly get into the festive mood.</li>
              <li>**On-Call Performance Buffer:** Music that seamlessly adapts to your party's flow, ready when your guests are.</li>
              <li>**Live Piano Performance:** Two 45-minute carol sets, plus delightful atmosphere music before, between, and after sets.</li>
              <li>**Custom Carols Brochure:** A beautifully prepared brochure based on your final song list.</li>
            </ul>
          </div>
          <p className="text-lg italic text-livePiano-light/70 text-center mt-6 max-w-2xl mx-auto">
            This is the ideal option for hosts who prioritize a seamless atmosphere and flexibility. It guarantees music adapts to your party's pace, eliminating the stress of rigid timing, and provides excellent value.
          </p>
        </section>

        {/* Optional Add-On Package */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center text-shadow-sm">Optional Add-On Package (For The Seamless Festive Flow only)</h3>
          <p className="text-3xl font-semibold text-livePiano-primary text-center text-shadow-sm">Private Rehearsal Session: A$150</p>
          <p className="text-lg text-livePiano-light/90 text-center max-w-2xl mx-auto">
            Add a dedicated 1.5-hour rehearsal session (one week prior) for the host and any other participants to fine-tune the music, ensuring maximum confidence and musical success on the night.
          </p>
        </section>

        {/* Client Acceptance Form */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-10">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center">Ready to bring the magic to your event?</h3>
          <p className="text-xl text-livePiano-light/90 text-center max-w-3xl mx-auto">
            Please select your preferred package below. A 50% deposit is required to formally secure your booking, with the remaining balance due 7 days prior to the event.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light text-lg">Your Full Name</FormLabel>
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
                  <FormItem>
                    <FormLabel className="text-livePiano-light text-lg">Your Email Address</FormLabel>
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

              <FormField
                control={form.control}
                name="selectedPackage"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-livePiano-light text-xl font-bold">Select Your Preferred Package:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-4"
                      >
                        {packages.map((pkg) => (
                          <FormItem key={pkg.id} className="flex items-center space-x-3">
                            <FormControl>
                              <RadioGroupItem value={pkg.id} id={`package-${pkg.id}`} className="h-6 w-6 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker" />
                            </FormControl>
                            <FormLabel htmlFor={`package-${pkg.id}`} className="text-xl font-medium text-livePiano-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {pkg.name} (A${pkg.contribution})
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasAddOn"
                render={({ field }) => (
                  <FormItem className={
                    `flex flex-row items-start space-x-3 space-y-0 rounded-md border border-livePiano-border/50 p-4 transition-opacity duration-200
                    ${isAddOnDisabled ? "opacity-50 cursor-not-allowed" : ""}`
                  }>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="add-on-checkbox"
                        disabled={isAddOnDisabled}
                        className="h-6 w-6 border-livePiano-primary data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="add-on-checkbox" className={
                        `text-xl font-medium text-livePiano-light leading-none
                        ${isAddOnDisabled ? "cursor-not-allowed" : "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}`
                      }>
                        Optional Add-On: Private Rehearsal Session (Add A${addOnPrice})
                      </FormLabel>
                      <FormDescription className="text-livePiano-light/70 text-base">
                        Add a dedicated 1.5-hour rehearsal session (one week prior) for the host and any other participants.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {selectedPackageId && (
                <div className="text-center mt-10 p-6 bg-livePiano-primary/10 rounded-lg border border-livePiano-primary/30 shadow-inner">
                  <p className="text-2xl md:text-3xl font-bold text-livePiano-primary text-shadow-sm">
                    Total Estimated Contribution: <span className="text-livePiano-light">A${totalAmount}</span>
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker text-xl py-7 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={form.formState.isSubmitting || !selectedPackageId}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Acceptance"}
              </Button>
            </form>
          </Form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteProposalPage;