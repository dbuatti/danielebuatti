"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import SeoMetadata from "@/components/SeoMetadata";
import DynamicImage from "@/components/DynamicImage";
import { Link } from "react-router-dom";
import { 
  Mic2, 
  Leaf, 
  Megaphone, 
  CheckCircle2, 
  Mail, 
  Star, 
  Music, 
  Quote, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CalEmbed from "@/components/CalEmbed";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from "@/components/ui/carousel";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

const testimonials = [
  { quote: "Daniele's clear, direct, and thoughtful communication is truly exceptional...", author: "Em", title: "Creative Collaborator" },
  { quote: "This program has been eye-opening; I've grown leaps and bounds as an artist...", author: "Ben", title: "Emerging Artist" },
  { quote: "Daniele has a wonderfully positive aura and a very friendly, engaging presence...", author: "Helge Hansmann", title: "Participant" },
  { quote: "Daniele is an awesome Music Director, guiding us with such thought and care...", author: "Joanne Duckworth & Anna Robinson", title: "Choir Members" },
  { quote: "The show was awesome! Daniele's energy and piano playing were amazing...", author: "Alex Glenk", title: "Audience Member" },
  { quote: "Daniele is an exceptional teacher, leader, and encourager...", author: "Experienced Educator", title: "Colleague" },
];

const LandingPageV4: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 relative">
      <SeoStructuredData />
      <SeoMetadata 
        title="Daniele Buatti - Pianist & Vocal Coach"
        description="Professional coaching in voice, piano, performance, and embodiment."
        url={`${window.location.origin}`}
      />
      <Navbar />

      {/* Floating Enquiry Button for Mobile */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <Button asChild size="icon" className="h-14 w-14 rounded-full shadow-2xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
          <Link to="/contact">
            <Mail className="h-6 w-6" />
          </Link>
        </Button>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-light leading-tight text-gray-900 dark:text-white">Daniele Buatti</h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 font-light text-left">
              Pianist • Vocal Coach • Music Director • Embodiment Practitioner
            </p>
            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400 text-left">
              I help singers, performers, and speakers connect body, breath, and voice for authentic and easeful expression.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="text-lg px-8 py-7 rounded-full">Book a discovery call</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[90vh] p-0">
                  <CalEmbed calLink="danielebuatti/30min" />
                </DialogContent>
              </Dialog>
              
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-7 rounded-full border-2">
                <Link to="/contact">Make an Enquiry</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <DynamicImage src="/headshot.jpeg" alt="Daniele Buatti" className="w-full max-w-lg rounded-3xl shadow-2xl" width={600} height={600} />
          </div>
        </section>

        {/* Expertise Section */}
        <section className="mb-24">
          <h2 className="text-4xl font-light text-center mb-16">My Expertise</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
              <Mic2 className="w-16 h-16 mx-auto mb-6 text-gray-400 dark:text-gray-600" />
              <h3 className="text-2xl font-medium mb-4">Voice & Piano</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Technique, repertoire, theory, audition prep, and expressive performance.
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
              <Leaf className="w-16 h-16 mx-auto mb-6 text-gray-400 dark:text-gray-600" />
              <h3 className="text-2xl font-medium mb-4">Body & Breath</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Kinesiology and somatic work to release tension and support natural resonance.
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
              <Megaphone className="w-16 h-16 mx-auto mb-6 text-gray-400 dark:text-gray-600" />
              <h3 className="text-2xl font-medium mb-4">Presence & Communication</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Public speaking, on-camera work, and building calm, authentic presence.
              </p>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="grid md:grid-cols-2 gap-20 items-center mb-24">
          <DynamicImage src="/pinkcarpet.jpg" alt="Daniele Buatti" className="w-full rounded-3xl shadow-xl" width={600} height={600} />
          <div className="space-y-8 text-left">
            <h2 className="text-4xl font-light">My Approach</h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              I help performers connect body, breath, and voice so they can express themselves with freedom and ease.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              With over 12 years as a music director, pianist, vocal coach, and educator, I combine music theatre expertise with kinesiology and somatic practices.
            </p>
            <Button asChild size="lg" variant="outline" className="border-2 rounded-full">
              <Link to="/coaching">Read more about my approach</Link>
            </Button>
          </div>
        </section>

        {/* Who I Work With Section */}
        <section className="mb-24">
          <h2 className="text-4xl font-light text-center mb-16 text-gray-900 dark:text-white">Who I Work With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: Mic2, label: "Singers & Musicians", desc: "Technical skill and expressive freedom" },
              { icon: Megaphone, label: "Public Speakers", desc: "Confident and impactful communication" },
              { icon: Leaf, label: "Film & Streaming", desc: "Nuanced presence on camera" },
              { icon: CheckCircle2, label: "Professionals", desc: "Sustainable long-term practice" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <h3 className="text-xl font-medium mb-2">{item.label}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Work With Me Section */}
        <section className="mb-24 max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">Why Work With Me</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Holistic expertise — voice, piano, presence, kinesiology, and mindset.",
              "Embodiment-based — build skill without tension or burnout.",
              "Results-focused — leave sessions more confident and capable.",
              "Creative freedom — technique meets artistry and authentic expression."
            ].map((text, idx) => (
              <div key={idx} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-gray-400 flex-shrink-0" />
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-snug text-left">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial Carousel */}
        <section className="mb-24 relative">
          <div className="flex items-end justify-between mb-12 px-2 text-left">
            <div>
              <h2 className="text-4xl font-light">Client Feedback</h2>
              <p className="text-gray-500 mt-2">Stories from the studio and stage</p>
            </div>
            <div className="hidden md:flex gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => api?.scrollPrev()}
                className="rounded-full border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => api?.scrollNext()}
                className="rounded-full border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="relative pb-12">
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[WheelGesturesPlugin()]}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((t, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3 h-full">
                    <div className="group h-full flex flex-col justify-between bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-10 rounded-[2rem] border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500">
                      <div className="text-left">
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Quote className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                          "{t.quote}"
                        </p>
                      </div>
                      <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">{t.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{t.title}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="flex justify-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`transition-all duration-500 rounded-full ${
                  current === i ? "w-8 h-1.5 bg-gray-400 dark:bg-gray-500" : "w-1.5 h-1.5 bg-gray-200 dark:bg-gray-800"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Signature Service Portal - The Definitive Conclusion */}
        <section className="mb-12 px-4">
          <Link to="/live-piano-services" className="group block relative overflow-hidden rounded-[2.5rem] bg-black shadow-2xl transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-[url('/blacktie.avif')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            
            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-2 text-yellow-500/80 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs uppercase tracking-[0.3em] font-medium text-yellow-500/80">Signature Service</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                  Live Piano <span className="italic font-serif text-yellow-500/90">&</span> Vocals
                </h2>
                <p className="text-gray-400 text-lg font-light leading-relaxed">
                  Sophisticated musical curation for private soirées and high-tier events. 
                  An intimate black-tie experience available by private enquiry.
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full border border-yellow-500/30 flex items-center justify-center group-hover:border-yellow-500 group-hover:bg-yellow-500/10 transition-all duration-500">
                   <Music className="w-8 h-8 text-yellow-500" />
                </div>
                <span className="text-yellow-500 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Enter Gallery
                </span>
              </div>
            </div>
          </Link>
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV4;