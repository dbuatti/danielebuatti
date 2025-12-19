"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import SeoMetadata from "@/components/SeoMetadata";
import DynamicImage from "@/components/DynamicImage";
import { Link } from "react-router-dom";
import { Mic2, Leaf, Megaphone, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CalEmbed from "@/components/CalEmbed";
import { Button } from "@/components/ui/button";

// Testimonials
const testimonials = [
  { quote: "Daniele's clear, direct, and thoughtful communication is truly exceptional...", author: "Em", title: "Creative Collaborator" },
  { quote: "This program has been eye-opening; I've grown leaps and bounds as an artist...", author: "Ben", title: "Emerging Artist" },
  { quote: "Daniele has a wonderfully positive aura and a very friendly, engaging presence...", author: "Helge Hansmann", title: "Participant" },
  { quote: "Daniele is an awesome Music Director, guiding us with such thought and care...", author: "Joanne Duckworth & Anna Robinson", title: "Choir Members" },
  { quote: "The show was awesome! Daniele's energy and piano playing were amazing...", author: "Alex Glenk", title: "Audience Member" },
  { quote: "Daniele is an exceptional teacher, leader, and encourager...", author: "Experienced Educator", title: "Colleague" },
];

const LandingPageV4: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <SeoStructuredData />
      <SeoMetadata 
        title="Daniele Buatti - Pianist & Vocal Coach"
        description="Professional coaching in voice, piano, performance, and embodiment."
        url={`${window.location.origin}`}
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-light leading-tight">Daniele Buatti</h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300">
              Pianist • Vocal Coach • Music Director • Embodiment Practitioner
            </p>
            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400">
              I help singers, performers, and speakers connect body, breath, and voice for authentic and easeful expression.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-10 py-7 rounded-full">Book a discovery call</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh] p-0">
                <CalEmbed calLink="danielebuatti/30min" />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-center">
            <DynamicImage src="/headshot.jpeg" alt="Daniele Buatti" className="w-full max-w-lg rounded-3xl shadow-2xl" width={600} height={600} />
          </div>
        </section>

        {/* Expertise – softer cards */}
        <section className="mb-24">
          <h2 className="text-4xl font-light text-center mb-16">My Expertise</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
              <Mic2 className="w-16 h-16 mx-auto mb-6 text-gray-700 dark:text-gray-300 opacity-80" />
              <h3 className="text-2xl font-medium text-center mb-4">Voice & Piano</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Technique, repertoire, theory, audition prep, and expressive performance.
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
              <Leaf className="w-16 h-16 mx-auto mb-6 text-gray-700 dark:text-gray-300 opacity-80" />
              <h3 className="text-2xl font-medium text-center mb-4">Body & Breath</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Kinesiology and somatic work to release tension and support natural resonance.
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
              <Megaphone className="w-16 h-16 mx-auto mb-6 text-gray-700 dark:text-gray-300 opacity-80" />
              <h3 className="text-2xl font-medium text-center mb-4">Presence & Communication</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Public speaking, on-camera work, and building calm, authentic presence.
              </p>
            </div>
          </div>
        </section>

        {/* Approach – more organic flow */}
        <section className="grid md:grid-cols-2 gap-20 items-center mb-24">
          <DynamicImage src="/pinkcarpet.jpg" alt="Daniele Buatti" className="w-full rounded-3xl shadow-xl" width={600} height={600} />
          <div className="space-y-8">
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

        {/* Who I Work With – softer, less boxy */}
        <section className="mb-24">
          <h2 className="text-4xl font-light text-center mb-16">Who I Work With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 text-center">
              <Mic2 className="w-14 h-14 mx-auto mb-4 text-gray-700 dark:text-gray-300 opacity-80" />
              <h3 className="text-xl font-medium mb-2">Singers & Musicians</h3>
              <p className="text-gray-600 dark:text-gray-400">Technical skill and expressive freedom</p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 text-center">
              <Megaphone className="w-14 h-14 mx-auto mb-4 text-gray-700 dark:text-gray-300 opacity-80" />
              <h3 className="text-xl font-medium mb-2">Public Speakers</h3>
              <p className="text-gray-600 dark:text-gray-400">Confident and impactful communication</p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 text-center">
              <Leaf className="w-14 h-14 mx-auto mb-4 text-gray-700 dark:text-gray-300 opacity-80" />
              <h3 className="text-xl font-medium mb-2">Film & Streaming Performers</h3>
              <p className="text-gray-600 dark:text-gray-400">Nuanced presence on camera</p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 text-center">
              <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-gray-700 dark:text-gray-300 opacity-80" />
              <h3 className="text-xl font-medium mb-2">Committed Professionals</h3>
              <p className="text-gray-600 dark:text-gray-400">Sustainable long-term practice</p>
            </div>
          </div>
        </section>

        {/* Why Work With Me – softer cards */}
        <section className="mb-24">
          <h2 className="text-4xl font-light text-center mb-16">Why Work With Me</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 flex items-start gap-6">
              <CheckCircle2 className="w-10 h-10 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1 opacity-80" />
              <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Holistic expertise</strong> — voice, piano, presence, kinesiology, and mindset.</p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 flex items-start gap-6">
              <CheckCircle2 className="w-10 h-10 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1 opacity-80" />
              <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Embodiment-based</strong> — build skill without tension or burnout.</p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 flex items-start gap-6">
              <CheckCircle2 className="w-10 h-10 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1 opacity-80" />
              <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Results-focused</strong> — leave sessions more confident and capable.</p>
            </div>
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 flex items-start gap-6">
              <CheckCircle2 className="w-10 h-10 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1 opacity-80" />
              <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Creative freedom</strong> — technique meets artistry and authentic expression.</p>
            </div>
          </div>
        </section>

        {/* Testimonials – softer */}
        <section className="mb-24">
          <h2 className="text-4xl font-light text-center mb-16">Client Feedback</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
                <p className="text-lg italic mb-6 text-gray-700 dark:text-gray-300">"{t.quote}"</p>
                <p className="font-medium">— {t.author}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Teaser – softer card */}
        <section className="mb-24 text-center">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm py-16 px-10 rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
            <h2 className="text-4xl font-light mb-6">Explore My Other Work</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Live performances, music direction, digital products, community choir, and more.
            </p>
            <Button asChild size="lg" className="text-lg px-12 py-7 rounded-full">
              <Link to="/projects-resources">View Projects & Resources</Link>
            </Button>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="pb-20 text-center">
          <h2 className="text-4xl font-light text-center mb-10">Get in Touch</h2>
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50 p-10 max-w-xl mx-auto">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 italic">
              For general inquiries, performance bookings, or to discuss coaching, please visit the dedicated contact page.
            </p>
            <Button asChild size="lg" className="text-lg px-12 py-7 rounded-full">
              <Link to="/contact">Go to Contact Page</Link>
            </Button>
            <div className="mt-8">
              <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-4 italic">
                For AMEB accompanying inquiries, please use the dedicated page for rates and booking.
              </p>
              <Button asChild size="lg" variant="outline" className="border-2 text-lg px-12 py-7 rounded-full">
                <Link to="/ameb-accompanying">View AMEB Rates & Book</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV4;