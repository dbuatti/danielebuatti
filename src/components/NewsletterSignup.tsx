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

const NewsletterSignup: React.FC = () => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-sm mx-auto">
        <div className="flex flex-col gap-4 w-full"> {/* Wrapper for name fields */}
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="First Name (Optional)"
                      {...field}
                      className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Last Name (Optional)"
                      {...field}
                      className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    placeholder="Your email address"
                    {...field}
                    className="bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light shadow-md"
          disabled={loading}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </Form>
  );
};

export default NewsletterSignup;