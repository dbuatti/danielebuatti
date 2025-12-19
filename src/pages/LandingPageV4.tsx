"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import SeoMetadata from "@/components/SeoMetadata";
import DynamicImage from "@/components/DynamicImage";
import { Link } from "react-router-dom";
import { Mic2, Leaf, Megaphone, CheckCircle2, Mail, Star, Music } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CalEmbed from "@/components/CalEmbed";
import { Button } from "@/components/ui/button";

// ... (Testimonials constant remains the same)

const LandingPageV4: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 relative">
      <SeoStructuredData />
      <SeoMetadata 
        title="Daniele Buatti - Pianist & Vocal Coach"
        description="Professional coaching in voice, piano, performance, and embodiment."
        url={`${window.location.origin}`}
      />
      <Navbar />

      {/* Floating Enquiry Button */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <Button asChild size="icon" className="h-14 w-14 rounded-full shadow-2xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
          <Link to="/contact">
            <Mail className="h-6 w-6" />
          </Link>
        </Button>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* ... Hero, Expertise, Approach, Who I Work With, Why Work With Me, Testimonials ... */}

        {/* NEW: Premium "Black Label" Portal */}
        <section className="mb-24 px-4">
          <Link to="/live-piano-services" className="group block relative overflow-hidden rounded-[2rem] bg-black shadow-2xl transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-[url('/blacktie.avif')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            
            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-2 text-yellow-500/80 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs uppercase tracking-[0.3em] font-medium">Signature Service</span>
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
                <div className="w-20 h-20 rounded-full border border-yellow-500/30 flex items-center justify-center group-hover:border-yellow-500 transition-colors duration-500">
                   <Music className="w-8 h-8 text-yellow-500" />
                </div>
                <span className="text-yellow-500 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Enter Gallery
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Teaser - Final CTA Section */}
        <section className="mb-32 text-center">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm py-20 px-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
            <h2 className="text-4xl font-light mb-6">Explore My Other Work</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Music direction, digital products, community choir, and creative resources.
            </p>
            <Button asChild size="lg" className="text-lg px-12 py-7 rounded-full">
              <Link to="/projects-resources">View Projects & Resources</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV4;