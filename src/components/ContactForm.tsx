"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useSearchParams } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(1000, {
    message: "Message must not be longer than 1000 characters.",
  }),
});

const ContactForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: searchParams.get("message") || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToastId = toast.loading("Sending your message...");

    try {
      // Invoke the Edge Function for secure submission
      const { error } = await supabase.functions.invoke('submit-contact-message', {
        body: values,
      });

      if (error) throw error;

      toast.success("Message sent!", {
        id: loadingToastId,
        description: "Thank you — I'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message.", {
        id: loadingToastId,
        description: "Please try again later or email directly.",
      });
    }
  }
  
  // Consistent with the rest of the site: paper inputs with a clear focus ring.
  const inputClasses =
    "bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-brand-primary";
  const labelClasses = "text-brand-dark dark:text-brand-light";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  autoComplete="name"
                  {...field}
                  className={`h-12 text-base ${inputClasses}`}
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
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  inputMode="email"
                  {...field}
                  className={`h-12 text-base ${inputClasses}`}
                />
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
              <FormLabel className={labelClasses}>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How can I help?"
                  {...field}
                  rows={6}
                  spellCheck
                  className={`resize-none text-base ${inputClasses}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full py-7 text-lg font-medium shadow-lifted transition-all duration-300 hover:scale-105 bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
          disabled={form.formState.isSubmitting}
          aria-busy={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;