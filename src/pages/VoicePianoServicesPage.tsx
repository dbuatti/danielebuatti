"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CalEmbed from "@/components/CalEmbed";
import SeoStructuredData from "@/components/SeoStructuredData";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ArrowRight, Mic, Piano, Theater, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Duration = "45" | "60";
const durationOptions: { value: Duration; label: string; calLink: string }[] = [
  { value: "45", label: "45 minutes", calLink: "danielebuatti/voice-and-piano-coaching-45" },
  { value: "60", label: "60 minutes", calLink: "danielebuatti/voice-and-piano-coaching-60" },
];

const pageNav = [
  { label: "Lessons", href: "#lessons" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "Book", href: "#book" },
];

const selfSelectCards = [
  {
    icon: Theater,
    title: "Prepping something.",
    body: "Audition, exam, opening night. Repertoire chosen for you rather than off a list. We work the song as an acting problem first, because intention is usually what frees the note. Technique that holds when your heart rate is up.",
  },
  {
    icon: Sparkles,
    title: "In a show right now.",
    body: "Track mapping, belt stamina, and keeping the voice alive across a run. If you're several shows deep and something has started gripping, that's fixable.",
  },
  {
    icon: Mic,
    title: "Coming back to singing.",
    body: "Adults, no performance agenda, nothing to catch up on. Unhurried work on breath, resonance, and the voice you grew up with.",
  },
  {
    icon: Piano,
    title: "Piano.",
    body: "Absolute beginners through to musicians who need keys for the room they're standing in front of: music directors, singers, teachers. Reading, chords, and how to practise so it actually sticks.",
  },
];

const approachCards = [
  {
    title: "Ground before sound.",
    body: "We start with how you're standing and how breath is arriving. Most of the vocal problems I see are downstream of something the body is doing.",
  },
  {
    title: "We build the imagery together.",
    body: "The picture that makes your voice move is yours, not one I read in a book. It goes into your notes and we use it again the following week.",
  },
  {
    title: "Written notes after every lesson.",
    body: "What we found, what changed, what to practise, emailed the same day. Nobody remembers what I said on a Tuesday.",
  },
];

const faqItems = [
  { q: "Do I need to be any good already?", a: "No. I teach complete beginners and people currently in professional productions." },
  { q: "Can I book one-off sessions before an audition?", a: "Yes. No term commitment." },
  { q: "Do you teach children?", a: "Yes, from school age." },
  { q: "What if music theatre isn't my thing?", a: "Fine. Repertoire is chosen around you, not around a genre." },
];

const BookButton = ({ className = "", children = "Book a lesson" }: { className?: string; children?: React.ReactNode }) => (
  <Button asChild size="lg" className={cn("h-14 px-8 text-base font-bold rounded-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light gap-2 shadow-lg transition-transform hover:scale-105", className)}>
    <a href="#book">
      {children} <ArrowRight className="h-4 w-4" />
    </a>
  </Button>
);

const VoicePianoServicesPage: React.FC = () => {
  const [duration, setDuration] = useState<Duration>("60");
  const currentOption = durationOptions.find((o) => o.value === duration)!;

  usePageMeta(
    "Singing and Piano Lessons Toorak, Melbourne | Daniele Buatti",
    "Singing and piano lessons in Toorak, Melbourne, and online with vocal coach and music theatre music director Daniele Buatti. Audition coaching, repertoire, and technique that holds up on stage.",
  );

  return (
    <div className="min-h-screen bg-[#FBF7F1] dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <SeoStructuredData />

      {/* Page-local nav for this page's own sections, distinct from the site nav above it */}
      <div className="border-b border-brand-secondary bg-brand-light dark:bg-brand-dark">
        <nav className="container mx-auto px-4 flex items-center justify-center gap-6 h-11 text-sm font-medium">
          {pageNav.map((item) => (
            <a key={item.href} href={item.href} className="text-brand-dark/70 dark:text-brand-light/70 hover:text-brand-primary transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <main>
        {/* Hero */}
        <section id="lessons" className="container mx-auto px-4 pt-16 pb-12 max-w-3xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
            I train voices from the body up.
          </h1>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Voice and piano lessons in Toorak, Melbourne, and online. Most singing teaching works on the sound. I work one level down, on the conditions the sound comes from: how you're standing, how breath arrives, and what you actually want to say when you open your mouth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <BookButton />
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-2 border-brand-secondary text-brand-dark dark:text-brand-light hover:text-brand-dark dark:hover:text-brand-light hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50">
              <a href="#approach">What a first lesson looks like</a>
            </Button>
          </div>
          <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">
            No audition, no term commitment. The first lesson is a full assessment.
          </p>
        </section>

        <div className="max-w-4xl mx-auto px-4 mb-4">
          <DynamicImage
            src="/danielepianolaugh.jpeg"
            alt="Daniele Buatti at the piano mid-performance"
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            width={1400}
            height={800}
          />
        </div>

        {/* Credit strip */}
        <div className="border-y border-brand-secondary bg-[#F3ECE1] dark:bg-brand-dark-alt/30 py-3">
          <p className="text-center text-xs md:text-sm text-brand-dark/70 dark:text-brand-light/70 px-4">
            Twelve years in Melbourne music theatre as music director, répétiteur and vocal coach. <span className="font-semibold">Wicked. The Bodyguard. Into the Woods</span> at the VCA.
          </p>
        </div>

        {/* Where you're at */}
        <section className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="grid sm:grid-cols-2 gap-6">
            {selfSelectCards.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:border-brand-primary/40 transition-all duration-300">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center gap-2.5 text-brand-primary">
                    <Icon className="h-5 w-5" />
                    <h3 className="font-display text-xl font-bold text-brand-dark dark:text-brand-light">{title}</h3>
                  </div>
                  <p className="text-sm text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How the work goes */}
        <section id="approach" className="bg-[#F3ECE1] dark:bg-brand-dark-alt/30 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-display text-3xl font-bold text-center mb-10">How the work goes</h2>
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {approachCards.map(({ title, body }) => (
                <div key={title} className="text-center">
                  <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-base font-medium max-w-xl mx-auto mb-8">
              Voices often reorganise inside a single session. They consolidate over weeks. I'll tell you which one is happening.
            </p>
            <div className="flex justify-center">
              <BookButton />
            </div>
          </div>
        </section>

        {/* The other half of the work */}
        <section className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <p className="text-base text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mb-4">
            I'm also a kinesiologist and run a separate practice, Resonance Kinesiology. That's why this work starts in the body. If what's in the way turns out to be nervous system rather than technique, I'll say so, and there's somewhere to take it. You never have to go near that side to have singing lessons with me.
          </p>
          <a
            href="https://kinesiology.danielebuatti.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"
          >
            Explore Resonance Kinesiology <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </section>

        {/* Practical */}
        <section className="bg-[#F3ECE1] dark:bg-brand-dark-alt/30 py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-center mb-8">Practical</h2>
            <ul className="space-y-2.5 text-center text-sm text-brand-dark/80 dark:text-brand-light/80">
              <li>685 Toorak Road, Toorak. Online available.</li>
              <li>45 or 60 minute lessons.</li>
              <li className="font-semibold text-brand-dark dark:text-brand-light">From $75 a lesson.</li>
              <li>Voice and piano, from school age to professional.</li>
            </ul>
          </div>
        </section>

        {/* About */}
        <section id="about" className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <DynamicImage
              src="/headshot.jpeg"
              alt="Daniele Buatti"
              className="w-28 h-28 rounded-full object-cover mb-6 shadow-lg"
              width={112}
              height={112}
            />
            <h2 className="font-display text-3xl font-bold mb-6">About</h2>
            <p className="text-base text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mb-4">
              Hi, I'm Daniele. I'm a pianist, vocal coach and music director based in Melbourne. Twelve years in music theatre, plus school and community productions most years.
            </p>
            <p className="text-base text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mb-4">
              What I care about most is the moment a song stops being an exercise and starts being something you actually mean. That's rarely a technique problem, it's usually an intention one, and it's the part I find most rewarding to work on.
            </p>
            <p className="text-base text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              I'm also a kinesiologist, which is why the work starts in the body rather than the throat. Both sides run the same way: a real assessment before anything else, sessions that build on what actually happened last time, and no generic scripts.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-center mb-8">Questions</h2>
          <Accordion type="single" collapsible>
            {faqItems.map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-sm font-semibold">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Book — inline Cal.com embed */}
        <section id="book" className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-center mb-2">Book a lesson</h2>
          <p className="text-center text-sm text-brand-dark/60 dark:text-brand-light/60 mb-8">
            Pick a time, no account needed. From $75 a lesson.
          </p>
          <div className="flex justify-center gap-3 mb-8">
            {durationOptions.map((opt) => (
              <Button
                key={opt.value}
                onClick={() => setDuration(opt.value)}
                variant={duration === opt.value ? "default" : "outline"}
                className={duration === opt.value ? "bg-brand-primary text-brand-light" : "border-brand-primary text-brand-primary"}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="h-[850px] md:h-[900px]" key={duration}>
            <CalEmbed calLink={currentOption.calLink} layout="month_view" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default VoicePianoServicesPage;
