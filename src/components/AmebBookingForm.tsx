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
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();

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
      navigate('/ameb-accompanying'); // Changed to navigate back to AMEB Accompanying page
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
        <FormField
          control={form.control}
          name="studentParentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-livePiano-light">Student / Parent Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  {...field}
                  className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                />
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
              <FormLabel className="text-livePiano-light">Contact Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...field}
                  className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                />
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
                <FormLabel className="text-livePiano-light">Exam Date *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                  />
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
                <FormLabel className="text-livePiano-light">Exam Time *</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                  />
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
              <FormLabel className="text-livePiano-light">Exam Board & Grade *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., AMEB Grade 7"
                  {...field}
                  className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                />
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
              <FormLabel className="text-livePiano-light">Teacher Name (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Teacher's Name"
                  {...field}
                  className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                />
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
              <FormLabel className="text-livePiano-light">Service Required *</FormLabel>
              <div className="space-y-2">
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("Exam Day Accompanying Only")}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, "Exam Day Accompanying Only"])
                          : field.onChange(field.value?.filter((value) => value !== "Exam Day Accompanying Only"));
                      }}
                      className="h-5 w-5 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                    />
                  </FormControl>
                  <FormLabel className="text-livePiano-light font-normal">
                    Exam Day Accompanying Only
                  </FormLabel>
                </FormItem>
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("Rehearsal Only (specify duration: 15 / 30 / 45 min)")}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, "Rehearsal Only (specify duration: 15 / 30 / 45 min)"])
                          : field.onChange(field.value?.filter((value) => value !== "Rehearsal Only (specify duration: 15 / 30 / 45 min)"));
                      }}
                      className="h-5 w-5 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                    />
                  </FormControl>
                  <FormLabel className="text-livePiano-light font-normal">
                    Rehearsal Only (specify duration: 15 / 30 / 45 min)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("Both Exam Day & Rehearsal")}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, "Both Exam Day & Rehearsal"])
                          : field.onChange(field.value?.filter((value) => value !== "Both Exam Day & Rehearsal"));
                      }}
                      className="h-5 w-5 border-livePiano-primary text-livePiano-darker data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker"
                    />
                  </FormControl>
                  <FormLabel className="text-livePiano-light font-normal">
                    Both Exam Day & Rehearsal
                  </FormLabel>
                </FormItem>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker text-lg py-3 rounded-full"
          disabled={loading}
        >
          {loading ? 'Sending Inquiry...' : 'Book Now / Inquire'}
        </Button>
      </form>
    </Form>
  );
};

export default AmebBookingForm;