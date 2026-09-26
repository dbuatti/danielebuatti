"use client";

import React, { useState, useEffect } from "react";
import SeoStructuredData from "@/components/SeoStructuredData";
import DynamicImage from "@/components/DynamicImage";
import ITServiceBanner from "@/components/ITServiceBanner";
import KinesiologyBanner from "@/components/KinesiologyBanner";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Mail, Music, ShoppingBag, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CalEmbed from "@/components/CalEmbed";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { serviceLinks } from "@/constants/navigation";
import { testimonials } from "@/constants/testimonials";
import { cn } from "@/lib/utils";
import { useRouteMeta } from "@/hooks/use-page-meta";

const expertise = [
  { title: "Voice & Piano", text: "Technique, repertoire, theory, audition prep, and expressive performance." },
  { title: "Body & Breath", text: "Kinesiology and somatic work to release tension and support natural resonance." },
  { title: "Presence & Communication", text: "Public speaking, on-camera work, and building calm, authentic presence." },
];

const audiences = [
  { label: "Singers & Musicians", desc: "Technical skill and expressive freedom" },
  { label: "Public Speakers", desc: "Confident and impactful communication" },
  { label: "Film & Streaming", desc: "Nuanced presence on camera" },
  { label: "Professionals", desc: "Sustainable long-term practice" },
];

const reasons = [
  { title: "Holistic expertise", text: "Voice, piano, presence, kinesiology, and mindset." },
  { title: "Embodiment-based", text: "Build skill without tension or burnout." },
  { title: "Results-focused", text: "Leave sessions more confident and capable." },
  { title: "Creative freedom", text: "Technique meets artistry and authentic expression." },
];

const SectionIntro = ({ eyebrow, title, children, className }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; className?: string }) => (
  <div className={cn("max-w-2xl", className)}>
    <p className="eyebrow">{eyebrow}</p>
    <h2 className="mt-4 text-4xl md:text-5xl font-light leading-[1.08] text-brand-dark">{title}</h2>
    {children && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{children}</p>}
  </div>
);

const LandingPageV4: React.FC = () => {
  useRouteMeta("/");

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    setCount(api.scrollSnapList().length);
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative">
      <SeoStructuredData />

      {/* Floating enquiry button on mobile */}
      <Link
        to="/contact"
        aria-label="Make an enquiry"
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-dark text-brand-light shadow-lifted md:hidden"
      >
        <Mail className="h-6 w-6" />
      </Link>

      {/* 1. HERO */}
      <section className="container grid items-center gap-12 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pb-28">
        <div>
          <p className="eyebrow">Melbourne &middot; Studio &amp; stage</p>
          <h1 className="mt-5 text-[52px] leading-[0.98] sm:text-7xl lg:text-[88px] font-light text-brand-dark">
            Daniele <em className="italic text-brand-primary">Buatti</em>
          </h1>
          <p className="mt-6 text-base md:text-lg font-medium text-brand-dark/80">
            Pianist &middot; Vocal Coach &middot; Music Director &middot; Embodiment Practitioner
          </p>
          <p className="mt-5 max-w-xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            I help singers, performers, and speakers connect body, breath, and voice for authentic and easeful expression.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="h-14 rounded-full bg-brand-primary px-8 text-base text-white shadow-soft hover:bg-brand-primary/90">
                  Book a discovery call
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh] p-0">
                <DialogTitle className="sr-only">Book a discovery call</DialogTitle>
                <CalEmbed calLink="danielebuatti/30min" />
              </DialogContent>
            </Dialog>
            <Link to="/contact" className="group inline-flex items-center gap-2 text-base font-medium text-brand-dark">
              Make an enquiry
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mr-5">
          <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 h-full w-full rounded-2xl bg-secondary" aria-hidden="true" />
          <DynamicImage
            src="/headshot.jpeg"
            alt="Daniele Buatti"
            className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-lifted"
            width={600}
            height={750}
            priority
          />
        </div>
      </section>

      {/* 2. EXPERTISE */}
      <section className="border-y border-border bg-card/60">
        <div className="container py-20 lg:py-28">
          <SectionIntro eyebrow="Voice · Body · Presence" title="My expertise" />
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {expertise.map((item, i) => (
              <li key={item.title} className="border-t border-brand-dark/15 pt-6">
                <span className="font-serif text-sm text-brand-primary">0{i + 1}</span>
                <h3 className="mt-3 text-2xl font-light text-brand-dark">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. WAYS TO WORK TOGETHER */}
      <section className="container py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionIntro eyebrow="Work with me" title="Ways to work together" />
          <Link to="/book-voice-piano" className="group inline-flex items-center gap-2 font-medium text-brand-dark">
            Check lesson availability
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {serviceLinks.map((s) => (
            <li key={s.href} className="bg-card">
              <Link to={s.href} className="group flex h-full flex-col gap-6 p-7 transition-colors hover:bg-secondary/60">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-brand-dark/70 transition-colors group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-brand-dark/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-normal text-brand-dark">{s.name}</h3>
                  <p className="mt-1.5 text-[15px] text-muted-foreground">{s.description}</p>
                </div>
              </Link>
            </li>
          ))}
          <li className="bg-brand-dark sm:col-span-2 lg:col-span-1">
            <Link to="/contact" className="group flex h-full flex-col justify-between gap-6 p-7 text-brand-light">
              <p className="eyebrow text-[hsl(325_72%_72%)]">Not sure where to start?</p>
              <div>
                <h3 className="text-xl font-normal text-brand-light">Tell me what you're working on</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-[15px] text-brand-light/80 group-hover:text-brand-light transition-colors">
                  Get in touch <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </section>

      {/* 4. CLIENT FEEDBACK */}
      <section className="bg-brand-dark text-brand-light">
        <div className="container py-20 lg:py-28">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-[hsl(325_72%_72%)]">Client feedback</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-light text-brand-light">Stories from the studio and stage</h2>
            </div>
            <div className="hidden md:flex gap-2">
              <Button variant="outline" size="icon" onClick={() => api?.scrollPrev()} aria-label="Previous testimonial" className="h-11 w-11 rounded-full border-white/20 bg-transparent text-brand-light hover:bg-white/10 hover:text-brand-light">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => api?.scrollNext()} aria-label="Next testimonial" className="h-11 w-11 rounded-full border-white/20 bg-transparent text-brand-light hover:bg-white/10 hover:text-brand-light">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Carousel opts={{ align: "start", loop: true }} plugins={[WheelGesturesPlugin()]} setApi={setApi} className="mt-12 w-full">
            <CarouselContent className="-ml-5 items-stretch">
              {testimonials.map((t) => (
                <CarouselItem key={t.author} className="flex pl-5 md:basis-1/2 lg:basis-1/3">
                  <figure className="flex w-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-8 md:p-9">
                    <blockquote>
                      <span className="block font-serif text-5xl leading-none text-brand-primary" aria-hidden="true">&ldquo;</span>
                      <p className="mt-2 font-serif text-xl font-light italic leading-relaxed text-brand-light/90">{t.quote}</p>
                    </blockquote>
                    <figcaption className="mt-8 border-t border-white/10 pt-5">
                      <p className="font-medium text-brand-light">{t.author}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-brand-light/50">{t.title}</p>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  current === i ? "w-8 bg-brand-primary" : "w-1.5 bg-white/25 hover:bg-white/40",
                )}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={current === i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. APPROACH */}
      <section className="container grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <DynamicImage
          src="/pinkcarpet.jpg"
          alt="Daniele Buatti on the red carpet"
          className="aspect-[4/5] w-full rounded-2xl object-cover object-top shadow-lifted"
          width={600}
          height={750}
        />
        <div>
          <SectionIntro eyebrow="Why work with me" title="My approach" />
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>I help performers connect body, breath, and voice so they can express themselves with freedom and ease.</p>
            <p>
              With over 12 years as a music director, pianist, vocal coach, and educator, I combine music theatre expertise with
              kinesiology and somatic practices.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.title} className="border-l-2 border-brand-primary/60 pl-4">
                <dt className="font-medium text-brand-dark">{r.title}</dt>
                <dd className="mt-1 text-[15px] text-muted-foreground">{r.text}</dd>
              </div>
            ))}
          </dl>

          <Link to="/coaching" className="group mt-10 inline-flex items-center gap-2 font-medium text-brand-dark">
            Read more about my approach
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 6. WHO I WORK WITH */}
      <section className="border-y border-border bg-secondary/50">
        <div className="container py-16 lg:py-20">
          <p className="eyebrow text-center">Who I work with</p>
          <ul className="mt-10 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {audiences.map((a) => (
              <li key={a.label} className="px-4 text-center">
                <p className="font-serif text-xl md:text-2xl font-light text-brand-dark">{a.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. FEATURES: live piano + store */}
      <section className="container grid gap-6 py-20 lg:grid-cols-[1.35fr_1fr] lg:py-28">
        <Link
          to="/live-piano-services"
          className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl bg-black p-8 md:p-12 text-white"
        >
          <div className="absolute inset-0 bg-[url('/blacktie.avif')] bg-cover bg-center opacity-50 grayscale transition-all duration-1000 ease-out-expo group-hover:scale-105 group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
          <div className="relative">
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.25em]">Signature service</span>
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-light leading-tight text-white">
              Live Piano <em className="italic text-yellow-500">&amp;</em> Vocals
            </h2>
            <p className="mt-4 max-w-md text-lg font-light leading-relaxed text-white/70">
              Sophisticated musical curation for private soirées and high-tier events. An intimate black-tie experience available by private enquiry.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-yellow-500">
              Enter the gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        <Link
          to="/store"
          className="group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12 transition-shadow duration-500 hover:shadow-lifted"
        >
          <div className="absolute inset-0 bg-[url('/sheetmusic.png')] bg-cover bg-center opacity-[0.06] transition-transform duration-1000 ease-out-expo group-hover:scale-105" />
          <div className="relative flex items-center gap-2 text-brand-primary">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.22em]">Digital store</span>
          </div>
          <div className="relative">
            <Music className="h-9 w-9 text-brand-primary" aria-hidden="true" />
            <h2 className="mt-5 text-4xl font-light leading-tight text-brand-dark">
              Professional <em className="italic">sheet music</em>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Piano arrangements and vocal scores, as instant digital downloads for performers and educators.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 font-medium text-brand-dark group-hover:text-brand-primary transition-colors">
              Browse the store <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* 8. OTHER PRACTICES */}
      <section className="container pb-24 lg:pb-32">
        <SectionIntro eyebrow="Beyond the studio" title="Other practices" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <KinesiologyBanner />
          <ITServiceBanner />
        </div>
      </section>
    </div>
  );
};

export default LandingPageV4;
