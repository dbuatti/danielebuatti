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

// New compact horizontal card – shorter height, better readability, strong gradient
const HorizontalProgramCard: React.FC<{
  title: string;
  description: string;
  link: string;
  linkText: string;
  imageSrc: string;
}> = ({ title, description, link, linkText, imageSrc }) => {
  const isInternalLink = link.startsWith("/") || link.startsWith("#");

  return (
    <div className="group relative h-80 rounded-3xl overflow-hidden shadow-2xl cursor-pointer" onClick={() => window.open(link, isInternalLink ? "_self" : "_blank")}>
      {/* Image */}
      <DynamicImage
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        width={1200}
        height={600}
      />

      {/* Stronger, more consistent gradient – ensures readability on any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />

      {/* Compact content – less vertical space, more gradient coverage */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8 text-left">
        <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-2xl">
          {title}
        </h3>
        <p className="text-lg text-white/95 mb-6 max-w-xl drop-shadow-lg">
          {description}
        </p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-900 font-semibold text-lg px-10 py-6 rounded-full shadow-xl">
            {linkText}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Updated Piano Backings Card – whole card clickable, no text/button overlay
const PianoBackingsCard: React.FC = () => {
  return (
    <a
      href="https://pianobackingsbydaniele.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative h-80 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
    >
      <div className="absolute inset-0 bg-[#ff00b3]" />
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <DynamicImage
          src="/pianobackingslogo.png"
          alt="Piano Backing Tracks by Daniele"
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
          width={1200}
          height={600}
        />
      </div>
      {/* Optional subtle hover indicator */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </a>
  );
};

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

        {/* Expertise */}
        <section>
          <h2 className="text-4xl font-light text-center mb-12">My Expertise</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <Mic2 className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Voice & Piano</h3>
              <p className="text-gray-600 dark:text-gray-400">Technique, repertoire, theory, audition prep, and expressive performance.</p>
            </div>
            <div className="text-center space-y-6">
              <Leaf className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Body & Breath</h3>
              <p className="text-gray-600 dark:text-gray-400">Kinesiology and somatic work to release tension and support natural resonance.</p>
            </div>
            <div className="text-center space-y-6">
              <Megaphone className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Presence & Communication</h3>
              <p className="text-gray-600 dark:text-gray-400">Public speaking, on-camera work, and building calm, authentic presence.</p>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <DynamicImage src="/pinkcarpet.jpg" alt="Daniele Buatti" className="w-full rounded-3xl shadow-2xl" width={600} height={600} />
          <div className="space-y-6">
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
          <h2 className="text-4xl font-light text-center mb-12">Who I Work With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md text-center">
              <Mic2 className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Singers & Musicians</h3>
              <p className="text-gray-600 dark:text-gray-400">Technical skill and expressive freedom</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md text-center">
              <Megaphone className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Public Speakers</h3>
              <p className="text-gray-600 dark:text-gray-400">Confident and impactful communication</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md text-center">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Film & Streaming Performers</h3>
              <p className="text-gray-600 dark:text-gray-400">Nuanced presence on camera</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Committed Professionals</h3>
              <p className="text-gray-600 dark:text-gray-400">Sustainable long-term practice</p>
            </div>
          </div>
        </section>

        {/* Why Work With Me */}
        <section>
          <h2 className="text-4xl font-light text-center mb-12">Why Work With Me</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 dark:text-gray-400"><strong>Holistic expertise</strong> — voice, piano, presence, kinesiology, and mindset.</p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 dark:text-gray-400"><strong>Embodiment-based</strong> — build skill without tension or burnout.</p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 dark:text-gray-400"><strong>Results-focused</strong> — leave sessions more confident and capable.</p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 dark:text-gray-400"><strong>Creative freedom</strong> — technique meets artistry and authentic expression.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-4xl font-light text-center mb-12">Client Feedback</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md">
                <p className="text-lg italic mb-6 text-gray-700 dark:text-gray-300">"{t.quote}"</p>
                <p className="font-medium">— {t.author}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other Work & Resources */}
        <section>
          <h2 className="text-4xl font-light text-center mb-12">Other Work</h2>
          <div className="space-y-16">
            {/* Specialised Services */}
            <div>
              <h3 className="text-3xl font-medium text-center mb-12">Specialised Services</h3>
              <div className="space-y-12">
                <HorizontalProgramCard
                  title="Music Director & Pianist"
                  description="Music theatre direction, vocal coaching, and performance."
                  link="/music-director-pianist"
                  linkText="View profile"
                  imageSrc="/daniele-conducting.jpeg"
                />
                <HorizontalProgramCard
                  title="Live Piano Services"
                  description="Weddings, events, and private functions."
                  link="/live-piano-services"
                  linkText="Enquire"
                  imageSrc="/blacktie.avif"
                />
                <HorizontalProgramCard
                  title="AMEB Accompanying"
                  description="Exam day and rehearsal accompaniment."
                  link="/ameb-accompanying"
                  linkText="Book"
                  imageSrc="/ameb-placeholder.jpg"
                />
              </div>
            </div>

            {/* Digital & Community */}
            <div>
              <h3 className="text-3xl font-medium text-center mb-12">Digital Products & Community</h3>
              <div className="space-y-12">
                <HorizontalProgramCard
                  title="Buattiverse"
                  description="Sheet music and backing tracks"
                  link="https://buattiverse.gumroad.com/"
                  linkText="Visit store"
                  imageSrc="/sheetmusic.png"
                />
                <PianoBackingsCard />
                <HorizontalProgramCard
                  title="Resonance with Daniele: A Joyful Pop-Up Choir for All Voices"
                  description="Join a welcoming community to sing, connect, and shine, with no experience needed."
                  link="https://resonance-with-daniele.vercel.app"
                  linkText="Join Resonance Choir"
                  imageSrc="/conduct.jpeg"
                />
              </div>
            </div>
          </div>
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

export default LandingPageV4;