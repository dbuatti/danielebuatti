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
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const NewsletterSignup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const loadingToastId = toast.loading("Subscribing you to the newsletter...");

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: "Newsletter Subscriber", // Generic name for newsletter signups
            email: values.email,
            message: "Signed up for newsletter.",
            type: "newsletter", // New type to distinguish
          },
        ]);

      if (error) {
        throw error;
      }

      toast.success("You're subscribed!", {
        id: loadingToastId,
        description: "Check your inbox for a welcome message soon.",
      });
      form.reset();
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