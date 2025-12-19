"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import SeoMetadata from "@/components/SeoMetadata";
import DynamicImage from "@/components/DynamicImage";
import ContactForm from "@/components/ContactForm";
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

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
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

        {/* Expertise */}
        <section>
          <h2 className="text-4xl font-light text-center mb-10">My Expertise</h2>
          <div className="grid md:grid-cols-3 gap-10 justify-items-center">
            <div className="text-center space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg w-full max-w-sm">
              <Mic2 className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Voice & Piano</h3>
              <p className="text-gray-600 dark:text-gray-400">Technique, repertoire, theory, audition prep, and expressive performance.</p>
            </div>
            <div className="text-center space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg w-full max-w-sm">
              <Leaf className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Body & Breath</h3>
              <p className="text-gray-600 dark:text-gray-400">Kinesiology and somatic work to release tension and support natural resonance.</p>
            </div>
            <div className="text-center space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg w-full max-w-sm">
              <Megaphone className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Presence & Communication</h3>
              <p className="text-gray-600 dark:text-gray-400">Public speaking, on-camera work, and building calm, authentic presence.</p>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <DynamicImage src="/pinkcarpet.jpg" alt="Daniele Buatti" className="w-full rounded-3xl shadow-2xl order-2 md:order-1" width={600} height={600} />
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-4xl font-light">My Approach</h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              I help performers connect body, breath, and voice so they can express themselves with freedom and ease.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              With over 12 years as a music director, pianist, vocal coach, and educator, I combine music theatre expertise with kinesiology and somatic practices.
            </p>
            <Button asChild size="lg" variant="outline" className="border-2">
              <Link to="/coaching">Read more about my approach</Link>
            </Button>
          </div>
        </section>

        {/* Who I Work With */}
        <section>
          <h2 className="text-4xl font-light text-center mb-10">Who I Work With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg text-center w-full max-w-xs">
              <Mic2 className="w-14 h-14 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Singers & Musicians</h3>
              <p className="text-gray-600 dark:text-gray-400">Technical skill and expressive freedom</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg text-center w-full max-w-xs">
              <Megaphone className="w-14 h-14 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Public Speakers</h3>
              <p className="text-gray-600 dark:text-gray-400">Confident and impactful communication</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg text-center w-full max-w-xs">
              <Leaf className="w-14 h-14 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Film & Streaming Performers</h3>
              <p className="text-gray-600 dark:text-gray-400">Nuanced presence on camera</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg text-center w-full max-w-xs">
              <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Committed Professionals</h3>
              <p className="text-gray-600 dark:text-gray-400">Sustainable long-term practice</p>
            </div>
          </div>
        </section>

        {/* Why Work With Me */}
        <section>
          <h2 className="text-4xl font-light text-center mb-10">Why Work With Me</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto justify-items-center">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg flex items-start gap-5 w-full max-w-lg">
              <CheckCircle2 className="w-10 h-10 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Holistic expertise</strong> — voice, piano, presence, kinesiology, and mindset.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg flex items-start gap-5 w-full max-w-lg">
              <CheckCircle2 className="w-10 h-10 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Embodiment-based</strong> — build skill without tension or burnout.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg flex items-start gap-5 w-full max-w-lg">
              <CheckCircle2 className="w-10 h-10 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Results-focused</strong> — leave sessions more confident and capable.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg flex items-start gap-5 w-full max-w-lg">
              <CheckCircle2 className="w-10 h-10 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-700 dark:text-gray-300"><strong>Creative freedom</strong> — technique meets artistry and authentic expression.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-4xl font-light text-center mb-10">Client Feedback</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg w-full max-w-md">
                <p className="text-lg italic mb-6 text-gray-700 dark:text-gray-300">"{t.quote}"</p>
                <p className="font-medium">— {t.author}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Teaser to Projects & Resources Page */}
        <section className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl">
          <h2 className="text-4xl font-light mb-6">Explore My Other Work</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Live performances, music direction, digital products, community choir, and more.
          </p>
          <Button asChild size="lg" className="text-lg px-12 py-7 rounded-full">
            <Link to="/projects-resources">View Projects & Resources</Link>
          </Button>
        </section>

        {/* Contact – reduced top negative space */}
        <section className="pt-1 pb-20">  {/* Reduced top padding from py-16 → pt-8 */}
          <h2 className="text-4xl font-light text-center mb-6">Get in Touch</h2>  {/* Reduced mb-10 → mb-6 */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10">
            <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8 italic">
              For AMEB accompanying inquiries, please use the dedicated page for rates and booking.
            </p>
            <div className="text-center mb-12">
              <Button asChild size="lg" variant="outline" className="border-2 text-lg px-12 py-7">
                <Link to="/ameb-accompanying">View AMEB Rates & Book</Link>
              </Button>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV4;