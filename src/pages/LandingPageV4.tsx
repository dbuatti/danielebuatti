"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import SeoMetadata from "@/components/SeoMetadata";
import DynamicImage from "@/components/DynamicImage";
import { Link } from "react-router-dom";
import { Mic2, Leaf, Megaphone, CheckCircle2, Mail, Star, Music, Quote, ChevronLeft, ChevronRight } from "lucide-react";
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

      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <Button asChild size="icon" className="h-14 w-14 rounded-full shadow-2xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
          <Link to="/contact"><Mail className="h-6 w-6" /></Link>
        </Button>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* ... Hero, Expertise, Approach, Who I Work With, Why Work With Me sections stay the same ... */}
        
        {/* Updated Hero, Expertise, Approach sections go here as per your previous code */}

        {/* TESTIMONIAL CAROUSEL - Design Spruce up */}
        <section className="mb-24 relative">
          <div className="flex items-end justify-between mb-12 px-2">
            <div>
              <h2 className="text-4xl font-light">Client Feedback</h2>
              <p className="text-gray-500 mt-2">Stories from the studio and stage</p>
            </div>
            {/* Desktop Navigation Arrows */}
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

          <div className="relative pb-12"> {/* Added padding bottom to prevent shadow clipping */}
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[WheelGesturesPlugin()]}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((t, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3 h-full">
                    <div className="group h-full flex flex-col justify-between bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-10 rounded-[2rem] border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-500">
                      <div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Quote className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                          "{t.quote}"
                        </p>
                      </div>
                      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="font-semibold text-gray-900 dark:text-white">{t.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{t.title}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Progress Indicators */}
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

        {/* ... Signature Service and Projects Teaser remain the same ... */}

      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV4;