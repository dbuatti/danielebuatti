"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAtHomeSource } from "@/hooks/use-at-home-source";

const OCCASIONS = [
  "Dinner parties",
  "Garden parties",
  "Milestone birthdays",
  "Engagements & weddings",
  "Christmas entertaining",
  "Other",
] as const;

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  eventDate: z.string().optional(),
  occasion: z.enum(OCCASIONS, {
    required_error: "Please choose an occasion.",
  }),
  guests: z.string().optional(),
  pianoAtHome: z.enum(["Yes", "No", "Not sure"]).optional(),
  message: z
    .string()
    .max(1000, { message: "Message must not be longer than 1000 characters." })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AtHomeEnquiryForm: React.FC = () => {
  const src = useAtHomeSource();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventDate: "",
      occasion: undefined,
      guests: "",
      pianoAtHome: undefined,
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const loadingToastId = toast.loading("Sending your enquiry...");

    const composed = [
      `Source: ${src}`,
      `Occasion: ${values.occasion}`,
      values.eventDate ? `Event date: ${values.eventDate}` : "",
      values.guests ? `Approximate guests: ${values.guests}` : "",
      values.pianoAtHome ? `Do you have a piano at home? ${values.pianoAtHome}` : "",
      values.phone ? `Phone: ${values.phone}` : "",
      values.message ? `Message: ${values.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      track("athome_enquiry_submit", { src, occasion: values.occasion });

      const { error } = await supabase.functions.invoke("submit-contact-message", {
        body: {
          name: values.name,
          email: values.email,
          message: composed,
        },
      });

      if (error) throw error;

      toast.success("Enquiry sent", {
        id: loadingToastId,
        description: "Thank you — I'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting athome enquiry:", error);
      toast.error("Failed to send enquiry", {
        id: loadingToastId,
        description: "Please try again later, or email info@danielebuatti.com.",
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "h-12 rounded-lg border-[#1F1C19]/20 bg-white text-[#1F1C19] placeholder:text-[#1F1C19]/40 focus-visible:ring-[#8A6900]/60";
  const labelClasses = "text-sm font-medium text-[#1F1C19]";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your name"
                    className={inputClasses}
                    autoComplete="name"
                    minLength={2}
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
                <FormLabel className={labelClasses}>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="your@email.com"
                    className={inputClasses}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Phone (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  placeholder="e.g. 0424 174 067"
                  className={inputClasses}
                  autoComplete="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Event date (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="DD/MM/YYYY or approximate"
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occasion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Occasion</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-12 w-full rounded-lg border border-[#1F1C19]/20 bg-white px-3 py-2 text-base text-[#1F1C19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6900]/60"
                >
                  <option value="" disabled>
                    Select an occasion
                  </option>
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Approximate guests (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="e.g. 20–30"
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pianoAtHome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Do you have a piano at home?</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {["Yes", "No", "Not sure"].map((v) => {
                    const selected = field.value === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => field.onChange(v)}
                        className={`min-h-[44px] rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                          selected
                            ? "bg-[#8A6900] text-white"
                            : "bg-white text-[#1F1C19] ring-1 ring-[#1F1C19]/20 hover:bg-[#F7F3EA]"
                        }`}
                        aria-pressed={selected}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Message (optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder="Any details you'd like to share..."
                  className="rounded-lg border-[#1F1C19]/20 bg-white text-[#1F1C19] placeholder:text-[#1F1C19]/40 focus-visible:ring-[#8A6900]/60"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="h-14 w-full rounded-full bg-[#D4A208] text-[#0B0B0B] text-base font-medium shadow-soft transition-all duration-300 hover:brightness-95 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#8A6900]/60 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Enquire"}
        </Button>
      </form>
    </Form>
  );
};

export default AtHomeEnquiryForm;
