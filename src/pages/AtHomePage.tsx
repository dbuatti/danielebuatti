"use client";

import React, { useEffect } from "react";
import { track } from "@vercel/analytics";
import { useAtHomeSource } from "@/hooks/use-at-home-source";
import AtHomeVideo from "@/components/athome/AtHomeVideo";
import Testimonials from "@/components/athome/Testimonials";
import AtHomeEnquiryForm from "@/components/athome/AtHomeEnquiryForm";

/* ---------------------------------------------------------------------------
 * /athome palette (matches the printed A6 flyer)
 *   black      #0B0B0B   hero + primary button text
 *   ivory      #F7F3EA   lower sections
 *   gold       #D4A208   rules, labels, primary button (only on dark)
 *   charcoal   #1F1C19   body text on ivory
 *   gold ink   #8A6900   small gold text on ivory
 *
 * Note: the flyer's gold-on-ivory #8F6D00 measures 4.35:1 against #F7F3EA —
 * just under WCAG AA (4.5:1) for body text — so it is nudged a hair darker to
 * #8A6900 (4.62:1). Change the gold-ink classes back to #8F6D00 if exact
 * flyer fidelity matters more than AA.
 * ------------------------------------------------------------------------- */

const AtHomePage: React.FC = () => {
  const src = useAtHomeSource();

  useEffect(() => {
    track("athome_view", { src });
  }, [src]);

  return (
    <div className="overflow-x-hidden bg-[#F7F3EA] text-[#1F1C19] selection:bg-[#D4A208]/30">
      {/* Hero (dark) */}
      <section className="bg-[#0B0B0B] text-[#F7F3EA]">
        <div className="container max-w-4xl py-16 md:py-28">
          <div className="flex flex-col items-start gap-6 md:gap-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#D4A208]">
              DANIELE BUATTI
            </p>
            <h1 className="text-4xl font-serif font-light leading-[1.08] tracking-tight text-[#F7F3EA] sm:text-5xl md:text-6xl lg:text-7xl">
              Live piano, <em className="italic">at home.</em>
            </h1>
            <p className="text-base text-[#F7F3EA]/80 sm:text-lg">
              Pianist &amp; Vocalist · Toorak
            </p>
            <div className="h-px w-24 bg-[#D4A208]" aria-hidden="true" />
            <a
              href="#enquire"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#D4A208] px-8 text-base font-medium text-[#0B0B0B] shadow-soft transition-all duration-300 hover:brightness-95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6900]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]"
            >
              Enquire
            </a>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="bg-[#F7F3EA] py-12 md:py-20">
        <div className="container max-w-4xl">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.3em] text-[#8A6900]">
            A minute of live piano
          </p>
          <AtHomeVideo />
        </div>
      </section>

      {/* Occasions */}
      <section className="bg-[#F7F3EA] pb-14 md:pb-20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-serif font-light leading-tight text-[#1F1C19] md:text-4xl">
            For evenings worth remembering.
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Dinner parties",
              "Garden parties",
              "Milestone birthdays",
              "Engagements & weddings",
              "Christmas entertaining",
            ].map((item) => (
              <li key={item} className="border-t border-[#1F1C19]/10 pt-4 text-lg text-[#1F1C19] md:text-xl">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Block */}
      <section className="bg-[#F7F3EA] pb-14 md:pb-20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-serif font-light leading-tight text-[#1F1C19] md:text-4xl">
            Your piano, finally played.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-[#1F1C19]/90 md:text-lg">
            <p>No piano at home? I can bring one.</p>
            <p>
              Solo piano, or piano and voice. Twelve years in Melbourne music theatre, including <em className="italic">Wicked</em> and <em className="italic">The Bodyguard</em>.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials (slots empty by design) */}
      <Testimonials />

      {/* Enquiry Form */}
      <section id="enquire" className="scroll-mt-28 bg-[#F7F3EA] pb-14 md:pb-20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-light leading-tight text-[#1F1C19] md:text-4xl">
              Enquire
            </h2>
            <p className="mt-4 text-base text-[#1F1C19]/80">
              Tell me about your event and I’ll get back to you as soon as I can.
            </p>
          </div>
          <AtHomeEnquiryForm />
          <div className="mt-6 flex flex-col gap-2 text-sm text-[#1F1C19]/80">
            <a href="tel:+61424174067" className="min-h-[44px] inline-flex items-center text-[#8A6900] underline-offset-4 hover:underline">
              Prefer to call? 0424 174 067
            </a>
            <a href="mailto:info@danielebuatti.com" className="min-h-[44px] inline-flex items-center text-[#8A6900] underline-offset-4 hover:underline">
              info@danielebuatti.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer line */}
      <section className="bg-[#F7F3EA] pb-12 md:pb-16">
        <div className="container max-w-3xl text-center">
          <div className="mx-auto mb-6 h-px w-24 bg-[#D4A208]/60" aria-hidden="true" />
          <p className="text-sm uppercase tracking-[0.3em] text-[#8A6900]">
            Now booking summer.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AtHomePage;
