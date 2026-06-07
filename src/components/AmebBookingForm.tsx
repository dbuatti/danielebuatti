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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from 'lucide-react'; // Import CheckCircle2 for the confirmation message

const formSchema = z.object({
  studentParentName: z.string().min(2, { message: "Student/Parent Name is required." }),
  contactEmail: z.string().email({ message: "Please enter a valid email address." }),
  examDate: z.string().min(1, { message: "Exam Date is required." }),
  examTime: z.string().min(1, { message: "Exam Time is required." }),
  examBoardGrade: z.string().min(1, { message: "Exam Board & Grade is required." }),
  teacherName: z.string().optional(),
  serviceRequired: z.array(z.string()).min(1, { message: "Please select at least one service." }),
});

const AmebBookingForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for in-page confirmation

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentParentName: "",
      contactEmail: "",
      examDate: "",
      examTime: "",
      examBoardGrade: "",
      teacherName: "",
      serviceRequired: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const loadingToastId = toast.loading("Sending your AMEB booking inquiry...");

    try {
      const { error } = await supabase.functions.invoke('send-ameb-booking-email', {
        body: values,
      });

      if (error) {
        throw error;
      }

      toast.success("AMEB booking inquiry sent!", {
        id: loadingToastId,
        description: "Daniele will review your request and get back to you shortly.",
      });
      form.reset();
      setIsSubmitted(true); // Set submitted state to true
    } catch (error) {
      console.error("Error submitting AMEB booking form:", error);
      toast.error("Failed to send booking inquiry.", {
        id: loadingToastId,
        description: "Please try again later or contact directly via email.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6 p-8 bg-gray-900 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-700 max-w-lg mx-auto">
        <CheckCircle2 className="h-24 w-24 text-brand-primary mx-auto animate-bounce" />
        <h3 className="text-4xl font-bold text-white">Booking Confirmed!</h3>
        <p className="text-xl text-white/90">
          Thank you for your AMEB accompanying inquiry. Daniele will review your request and get back to you shortly to finalize the details.
        </p>
        <Button
          type="button"
          size="lg"
          className="mt-6 bg-brand-primary hover:bg-brand-primary/90 text-white text-lg py-3 rounded-full"
          onClick={() => {
            setIsSubmitted(false);
            form.reset();
          }}
        >
          Book Another Inquiry
        </Button>
      </div>
    );
  }

  const inputClass = "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500";
  const labelClass = "text-gray-800 dark:text-gray-200";
  const checkboxClass = "h-5 w-5 border-gray-400 dark:border-gray-500 text-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
        <FormField
          control={form.control}
          name="studentParentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Student / Parent Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Contact Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="examDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Exam Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="examTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Exam Time *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="examBoardGrade"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Exam Board & Grade *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AMEB Grade 7" {...field} className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Teacher Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your Teacher's Name" {...field} className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceRequired"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className={labelClass}>Service Required *</FormLabel>
              <div className="space-y-2">
                {["Exam Day Accompanying Only", "Rehearsal Only (specify duration: 15 / 30 / 45 min)", "Both Exam Day & Rehearsal"].map((service) => (
                  <FormItem key={service} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(service)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, service])
                            : field.onChange(field.value?.filter((v) => v !== service));
                        }}
                        className={checkboxClass}
                      />
                    </FormControl>
                    <FormLabel className={`${labelClass} font-normal`}>{service}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-lg py-3 rounded-full"
          disabled={loading}
        >
          {loading ? 'Sending Inquiry...' : 'Book Now / Inquire'}
        </Button>
      </form>
    </Form>
  );
};

export default AmebBookingForm;