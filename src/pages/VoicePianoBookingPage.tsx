"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import CalEmbed from "@/components/CalEmbed";
import { ArrowLink, PageHeader } from "@/components/editorial";
import { useRouteMeta } from "@/hooks/use-page-meta";
import { cn } from "@/lib/utils";

type Duration = "45" | "60";

const durationOptions: { value: Duration; label: string; calLink: string }[] = [
  { value: "45", label: "45 minutes", calLink: "danielebuatti/voice-and-piano-coaching-45" },
  { value: "60", label: "60 minutes", calLink: "danielebuatti/voice-and-piano-coaching-60" },
];

const VoicePianoBookingPage: React.FC = () => {
  useRouteMeta("/book-voice-piano");

  const [selectedDuration, setSelectedDuration] = useState<Duration>("45");
  const currentOption = durationOptions.find((o) => o.value === selectedDuration)!;

  return (
    <div>
      <PageHeader
        eyebrow="Book a lesson"
        title={
          <>
            Performance &amp; <em className="italic text-brand-primary">musicianship</em> sessions
          </>
        }
        lede="Choose a lesson length, then pick a time that suits you. No account needed."
        className="pb-10 lg:pb-12"
      >
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div role="tablist" aria-label="Lesson length" className="relative inline-flex rounded-full border border-border bg-card p-1 shadow-soft">
            {durationOptions.map((opt, idx) => {
              const active = selectedDuration === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`duration-tab-${opt.value}`}
                  role="tab"
                  tabIndex={active ? 0 : -1}
                  aria-selected={active}
                  aria-controls="lesson-calendar"
                  onClick={() => setSelectedDuration(opt.value)}
                  onKeyDown={(e) => {
                    let next: Duration | null = null;
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = durationOptions[(idx + 1) % durationOptions.length].value;
                    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = durationOptions[(idx - 1 + durationOptions.length) % durationOptions.length].value;
                    else if (e.key === "Home") next = durationOptions[0].value;
                    else if (e.key === "End") next = durationOptions[durationOptions.length - 1].value;
                    if (next) {
                      e.preventDefault();
                      setSelectedDuration(next);
                      document.getElementById(`duration-tab-${next}`)?.focus();
                    }
                  }}
                  className={cn(
                    "relative z-10 h-11 rounded-full px-6 text-sm font-medium transition-colors duration-300",
                    active ? "text-white" : "text-brand-dark/70 hover:text-brand-dark",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="duration-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-primary"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
          <ArrowLink to="/voice-piano-services">What a first lesson looks like</ArrowLink>
        </div>
      </PageHeader>

      <section className="container pb-24 lg:pb-32">
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4 text-sm leading-relaxed text-brand-dark/80">
          <Gift className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" aria-hidden="true" />
          <p>
            <strong className="font-medium text-brand-dark">Have a gift voucher?</strong> Pick your time below,
            then email{" "}
            <a
              href="mailto:info@danielebuatti.com?subject=Gift%20voucher%20booking"
              className="text-brand-primary underline underline-offset-4"
            >
              info@danielebuatti.com
            </a>{" "}
            with your voucher code and I'll apply it to the booking.
          </p>
        </div>

        <div
          id="lesson-calendar"
          role="region"
          aria-label="Booking calendar"
          className="rounded-3xl border border-border bg-card p-2 shadow-soft sm:p-4"
          key={selectedDuration}
        >
          <CalEmbed calLink={currentOption.calLink} layout="month_view" />
        </div>
      </section>
    </div>
  );
};

export default VoicePianoBookingPage;
