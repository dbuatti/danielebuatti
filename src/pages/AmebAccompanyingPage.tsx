"use client";

import React from "react";
import { Check, MapPin, TramFront } from "lucide-react";
import DynamicImage from "@/components/DynamicImage";
import AmebBookingForm from "@/components/AmebBookingForm";
import { ArrowLink, PageHeader, SectionIntro } from "@/components/editorial";
import { primaryButton } from "@/lib/button-styles";
import { useRouteMeta } from "@/hooks/use-page-meta";

const examDay = [
  "I arrive 15–20 minutes early to set up",
  "Repertoire fully prepared in advance",
  "Clear communication about tempo and feel",
  "Calm, supportive presence throughout",
];

const rehearsals = [
  { length: "15 min", price: 30 },
  { length: "30 min", price: 50 },
  { length: "45 min", price: 75 },
];

const AmebAccompanyingPage: React.FC = () => {
  useRouteMeta("/ameb-accompanying");

  return (
    <div>
      <PageHeader
        eyebrow="Exams · All grades & instruments"
        title={
          <>
            AMEB <em className="italic text-brand-primary">Accompanying</em>
          </>
        }
        lede="I provide calm, reliable accompaniment for AMEB exams (all grades and instruments) and optional rehearsals beforehand. My goal is to help you feel prepared and supported on the day."
        actions={
          <>
            <a href="#book" className={primaryButton}>
              Book or enquire
            </a>
            <ArrowLink to="/contact">Ask a question</ArrowLink>
          </>
        }
      />

      <section className="container">
        <div className="overflow-hidden rounded-3xl shadow-lifted">
          <DynamicImage
            src="/danieleatkeyboard.jpeg"
            alt="Daniele Buatti at the keyboard"
            className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[500px]"
            width={1400}
            height={700}
            priority
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-24 lg:py-32">
        <SectionIntro eyebrow="Fees" title="Simple, clear pricing" />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          {/* Exam day */}
          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-brand-dark p-8 text-brand-light md:p-10">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 className="text-3xl font-light text-brand-light">Exam day</h3>
                <p className="whitespace-nowrap font-serif text-4xl font-light">
                  <span className="align-top text-lg">$</span>100
                  <span className="ml-1 font-sans text-sm text-brand-light/60">per exam</span>
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {examDay.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-brand-light/80">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[hsl(325_72%_72%)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="border-t border-white/15 pt-6 font-serif text-lg italic leading-relaxed text-brand-light/85">
              “Having a reliable accompanist who knows the music inside out makes a huge difference on exam day.”
            </p>
          </div>

          {/* Rehearsals */}
          <div className="flex flex-col justify-between gap-8 rounded-2xl border border-border bg-card p-8 md:p-10">
            <div>
              <h3 className="text-3xl font-light text-brand-dark">Rehearsal sessions</h3>
              <p className="mt-2 text-muted-foreground">Optional, and well worth it in the weeks before.</p>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {rehearsals.map((r) => (
                  <li key={r.length} className="flex items-baseline justify-between py-4">
                    <span className="text-lg text-brand-dark">{r.length}</span>
                    <span className="font-serif text-2xl font-light text-brand-dark">${r.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-primary" aria-hidden="true" /> Studio in Toorak, Melbourne
              </li>
              <li className="flex items-center gap-2">
                <TramFront className="h-4 w-4 text-brand-primary" aria-hidden="true" /> Trams 58 &amp; 16 · Free street parking
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="border-t border-border bg-card/60">
        <div className="container grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-32">
          <div>
            <SectionIntro eyebrow="Book" title="Book or enquire">
              Tell me about the exam and I’ll confirm availability.
            </SectionIntro>
            <p className="mt-8 border-l-2 border-brand-primary/60 pl-5 text-brand-dark/75">
              Please send sheet music at least two weeks before the exam so I can prepare properly.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 shadow-soft md:p-10">
            <AmebBookingForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AmebAccompanyingPage;
