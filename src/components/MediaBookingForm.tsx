"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Booking enquiry form for /media.
 *
 * Submits through the same Supabase Edge Function as the site-wide contact
 * form (submit-contact-message → contact_messages table → email trigger),
 * so enquiries land in the same inbox with no extra setup. The structured
 * fields are folded into the message body for the email.
 * ------------------------------------------------------------------------- */

const EVENT_TYPES = [
  "Wedding",
  "Corporate event or function",
  "Venue or restaurant residency",
  "Private party",
  "Music theatre / music direction",
  "Other",
];

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().max(40, "That's too long.").optional(),
  organisation: z.string().max(120, "That's too long.").optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  message: z
    .string()
    .min(10, "Please add a few details (at least 10 characters).")
    .max(1500, "Please keep it under 1500 characters."),
});

type FormValues = z.infer<typeof schema>;

const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-[#8A6900]";
const fieldCls =
  "w-full rounded-xl border border-[#1F1C19]/15 bg-white px-4 py-3 text-[#1F1C19] outline-none transition-colors placeholder:text-[#1F1C19]/35 focus:border-[#D4A208] focus:ring-2 focus:ring-[#D4A208]/30";
const errCls = "mt-1.5 text-xs text-red-600";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className={errCls}>{message}</p> : null;

const MediaBookingForm = () => {
  const [sent, setSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organisation: "",
      eventType: "",
      eventDate: "",
      message: "",
    },
  });

  const { errors } = form.formState;

  async function onSubmit(values: FormValues) {
    const details = [
      values.eventType && `Event type: ${values.eventType}`,
      values.eventDate && `Preferred date: ${values.eventDate}`,
      values.organisation && `Organisation / venue: ${values.organisation}`,
      values.phone && `Phone: ${values.phone}`,
    ].filter(Boolean) as string[];

    const message = [...details, values.message].filter(Boolean).join("\n\n");

    const loadingToastId = toast.loading("Sending your enquiry…");
    try {
      const { error } = await supabase.functions.invoke("submit-contact-message", {
        body: { name: values.name, email: values.email, message },
      });
      if (error) throw error;

      toast.success("Enquiry sent!", {
        id: loadingToastId,
        description: "Thanks — I'll be in touch shortly.",
      });
      form.reset();
      setSent(true);
    } catch (error) {
      console.error("Booking enquiry failed:", error);
      toast.error("Couldn't send your enquiry.", {
        id: loadingToastId,
        description: "Please try again, or email info@danielebuatti.com.",
      });
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 py-6">
        <CheckCircle2 className="h-10 w-10 text-[#D4A208]" aria-hidden="true" />
        <h3 className="text-xl font-medium text-[#1F1C19]">Enquiry sent</h3>
        <p className="text-sm leading-relaxed text-[#1F1C19]/70">
          Thanks for getting in touch — I'll reply as soon as I can. If it's urgent, call{" "}
          <a href="tel:0424174067" className="text-[#8A6900] underline underline-offset-4">
            0424 174 067
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-[#8A6900] underline underline-offset-4 transition-colors hover:text-[#1F1C19]"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <h3 className="text-xl font-medium text-[#1F1C19]">Booking enquiry</h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bf-name" className={labelCls}>
            Name
          </label>
          <input id="bf-name" type="text" autoComplete="name" placeholder="Your name" className={cn(fieldCls, errors.name && "border-red-500")} {...form.register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="bf-email" className={labelCls}>
            Email
          </label>
          <input id="bf-email" type="email" autoComplete="email" placeholder="you@example.com" className={cn(fieldCls, errors.email && "border-red-500")} {...form.register("email")} />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <label htmlFor="bf-organisation" className={labelCls}>
            Organisation / venue <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="bf-organisation" type="text" autoComplete="organization" placeholder="Venue, company or event" className={fieldCls} {...form.register("organisation")} />
          <FieldError message={errors.organisation?.message} />
        </div>

        <div>
          <label htmlFor="bf-phone" className={labelCls}>
            Phone <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="bf-phone" type="tel" autoComplete="tel" placeholder="Best number to reach you" className={cn(fieldCls, errors.phone && "border-red-500")} {...form.register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <label htmlFor="bf-event-type" className={labelCls}>
            Type of event
          </label>
          <select id="bf-event-type" className={cn(fieldCls, "appearance-none bg-white")} defaultValue="" {...form.register("eventType")}>
            <option value="">Select…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bf-event-date" className={labelCls}>
            Date <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="bf-event-date" type="date" className={fieldCls} {...form.register("eventDate")} />
        </div>
      </div>

      <div>
        <label htmlFor="bf-message" className={labelCls}>
          Details
        </label>
        <textarea
          id="bf-message"
          rows={5}
          placeholder="Tell me about the event — date, venue, timings, and anything else that helps."
          className={cn(fieldCls, "resize-none", errors.message && "border-red-500")}
          {...form.register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4A208] px-6 py-3.5 text-sm font-medium text-[#0B0B0B] transition-all hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send enquiry
          </>
        )}
      </button>
    </form>
  );
};

export default MediaBookingForm;
