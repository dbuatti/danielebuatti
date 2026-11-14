"use client";

import React from "react";
import { Check, Clock, FileText, Video } from "lucide-react";
import CalEmbed from "@/components/CalEmbed";
import { ArrowLink, PageHeader, SectionIntro } from "@/components/editorial";
import { primaryButton } from "@/lib/button-styles";
import { useRouteMeta } from "@/hooks/use-page-meta";

export const AUDITION_CUT_CAL_LINK = "danielebuatti/audition-cut-playthrough";

const steps = [
  {
    icon: Clock,
    title: "Book a 15-minute slot",
    body: "Same-day and last-minute bookings are welcome. Pick a time below.",
  },
  {
    icon: FileText,
    title: "Send a clear PDF of your cut",
    body: "Your 16 or 32 bars, marked the way you'd hand it to the audition pianist. Email it when you book.",
  },
  {
    icon: Video,
    title: "Sing it with me, online",
    body: "I play your cut live, as the pianist in the room would. You get practical notes, then we run it again.",
  },
];

const goodFor = [
  "The day before (or the morning of) an audition",
  "Self-tapes, so you know how the cut feels with a real pianist",
  "Checking your markings, tempo and intro actually work",
  "Students who already have a voice teacher and want an extra pair of ears",
];

const AuditionCutPlaythroughPage: React.FC = () => {
  useRouteMeta("/audition-cut-playthrough");

  return (
    <div>
      <PageHeader
        eyebrow="Online · 15 minutes · $30"
        title={
          <>
            Audition Cut <em className="italic text-brand-primary">Playthrough</em>
          </>
        }
        lede="A quick online drop-in: run your 16–32 bar audition cut with an experienced audition pianist, hear exactly how it will sound in the room, and fix anything that trips you up before it counts."
        actions={
          <>
            <a href="#book" className={primaryButton}>
              Book a playthrough
            </a>
            <ArrowLink to="/book-voice-piano">Need longer? Book a full lesson</ArrowLink>
          </>
        }
      />

      <section className="container py-20 lg:py-28">
        <SectionIntro eyebrow="How it works" title="Fifteen focused minutes" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-7">
              <Icon className="h-6 w-6 text-brand-primary" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-light text-brand-dark">{title}</h3>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl bg-brand-dark p-8 text-brand-light md:p-10">
            <h3 className="text-3xl font-light text-brand-light">Good for</h3>
            <ul className="mt-8 space-y-3">
              {goodFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-brand-light/80">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[hsl(325_72%_72%)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-8 rounded-2xl border border-border bg-card p-8 md:p-10">
            <div>
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="text-3xl font-light text-brand-dark">Drop-in</h3>
                <p className="whitespace-nowrap font-serif text-4xl font-light text-brand-dark">
                  <span className="align-top text-lg">$</span>30
                  <span className="ml-1 font-sans text-sm text-muted-foreground">15 min</span>
                </p>
              </div>
              <p className="mt-4 text-muted-foreground">
                Online video call — the link is in your confirmation email. You'll get a Stripe link to pay after booking.
              </p>
            </div>
            <p className="border-t border-border pt-6 text-sm text-muted-foreground">
              Want to go deeper on the cut itself: choosing, cutting and marking your music?{" "}
              <a
                href="https://www.theauditionguidebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline underline-offset-4"
              >
                The Audition Guidebook
              </a>{" "}
              is my online course. Need a track to practise with?{" "}
              <a
                href="https://pianobackings.danielebuatti.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline underline-offset-4"
              >
                Piano Backings by Daniele
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="book" className="border-t border-border bg-card/60">
        <div className="container py-20 lg:py-28">
          <SectionIntro eyebrow="Book" title="Pick a time">
            After booking, email your PDF to{" "}
            <a href="mailto:info@danielebuatti.com?subject=Audition%20cut%20playthrough" className="text-brand-primary underline underline-offset-4">
              info@danielebuatti.com
            </a>
            .
          </SectionIntro>
          <div className="mt-10 rounded-3xl border border-border bg-card p-2 shadow-soft sm:p-4">
            <CalEmbed calLink={AUDITION_CUT_CAL_LINK} layout="month_view" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuditionCutPlaythroughPage;
