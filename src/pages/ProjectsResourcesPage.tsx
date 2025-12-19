"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import SeoMetadata from "@/components/SeoMetadata";
import DynamicImage from "@/components/DynamicImage";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mic2, Leaf, Megaphone, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CalEmbed from "@/components/CalEmbed";

// Testimonials
const testimonials = [
  { quote: "Daniele's clear, direct, and thoughtful communication is truly exceptional...", author: "Em", title: "Creative Collaborator" },
  { quote: "This program has been eye-opening; I've grown leaps and bounds as an artist...", author: "Ben", title: "Emerging Artist" },
  { quote: "Daniele has a wonderfully positive aura and a very friendly, engaging presence...", author: "Helge Hansmann", title: "Participant" },
  { quote: "Daniele is an awesome Music Director, guiding us with such thought and care...", author: "Joanne Duckworth & Anna Robinson", title: "Choir Members" },
  { quote: "The show was awesome! Daniele's energy and piano playing were amazing...", author: "Alex Glenk", title: "Audience Member" },
  { quote: "Daniele is an exceptional teacher, leader, and encourager...", author: "Experienced Educator", title: "Colleague" },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <SeoStructuredData />
      <SeoMetadata 
        title="Daniele Buatti - Pianist & Vocal Coach"
        description="Professional coaching in voice, piano, performance, and embodiment."
        url={`${window.location.origin}`}
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
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

        {/* Expertise, Approach, Who I Work With, Why Work With Me, Testimonials – unchanged */}
        {/* ... (keep all those sections exactly as in your current file) ... */}

        {/* Teaser to Projects Page */}
        <section className="text-center py-16">
          <h2 className="text-4xl font-light mb-8">Explore My Other Work</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Live performances, music direction, digital products, community choir, and more.
          </p>
          <Button asChild size="lg" className="text-lg px-12 py-7 rounded-full">
            <Link to="/projects">View all projects & services</Link>
          </Button>
        </section>

        {/* Contact */}
        <section className="py-16 bg-white dark:bg-gray-900 rounded-3xl text-center">
          <h2 className="text-4xl font-light mb-10">Get in Touch</h2>
          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPage;