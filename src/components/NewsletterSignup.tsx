"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  firstName: z.string().optional(), // Added first name
  lastName: z.string().optional(),  // Added last name
});

interface NewsletterSignupProps {
  // "dark" styles the fields for the navy footer.
  variant?: "light" | "dark";
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ variant = "light" }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "", // Set default value
      lastName: "",  // Set default value
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const loadingToastId = toast.loading("Subscribing you to the newsletter...");

    try {
      // Invoke the new Supabase Edge Function to add to Mailchimp
      const { data, error } = await supabase.functions.invoke('add-mailchimp-subscriber', {
        body: {
          email: values.email,
          firstName: values.firstName, // Pass first name
          lastName: values.lastName,   // Pass last name
        },
      });

      if (error) {
        throw error;
      }

      // Check for specific messages from the edge function
      if (data && data.message === 'Email is already subscribed.') {
        toast.info("You're already subscribed!", {
          id: loadingToastId,
          description: "No need to sign up again.",
        });
      } else {
        toast.success("You're subscribed!", {
          id: loadingToastId,
          description: "Check your inbox for a welcome message soon.",
        });
      }
      form.reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Failed to subscribe.", {
        id: loadingToastId,
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    variant === "dark"
      ? "h-11 rounded-full border-white/15 bg-white/5 px-5 text-brand-light placeholder:text-brand-light/45 focus-visible:ring-brand-primary focus-visible:ring-offset-0"
      : "h-11 rounded-full border-border bg-card px-5 text-brand-dark placeholder:text-muted-foreground focus-visible:ring-brand-primary";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First name" aria-label="First name (optional)" autoComplete="given-name" {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last name" aria-label="Last name (optional)" autoComplete="family-name" {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input type="email" placeholder="Email address" aria-label="Email address" autoComplete="email" {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="h-11 rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90"
            disabled={loading}
          >
            {loading ? "Subscribing…" : "Subscribe"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewsletterSignup;
