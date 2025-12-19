"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import DynamicImage from "@/components/DynamicImage";
import ContactForm from "@/components/ContactForm";
import ResonanceProgramCard from "@/components/ResonanceProgramCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mic2, Leaf, Megaphone, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CalEmbed from "@/components/CalEmbed";

// Testimonials data (moved inline)
const testimonials = [
  {
    quote: "Daniele's clear, direct, and thoughtful communication is truly exceptional. I deeply appreciate the concise clarity and transparency, which makes working together an absolute pleasure.",
    author: "Em",
    title: "Creative Collaborator",
  },
  {
    quote: "This program has been eye-opening; I've grown leaps and bounds as an artist. Daniele's dedication to championing the arts and supporting emerging talent is incredible.",
    author: "Ben",
    title: "Emerging Artist",
  },
  {
    quote: "Daniele has a wonderfully positive aura and a very friendly, engaging presence. His thoughtful organization and willingness to step in as a host are truly appreciated.",
    author: "Helge Hansmann",
    title: "Participant",
  },
  {
    quote: "Daniele is an awesome Music Director, guiding us with such thought and care. His positive energy makes every session a joy.",
    author: "Joanne Duckworth & Anna Robinson",
    title: "Choir Members",
  },
  {
    quote: "The show was awesome! Daniele's energy and piano playing were amazing, truly had me grooving along.",
    author: "Alex Glenk",
    title: "Audience Member",
  },
  {
    quote: "Daniele is an exceptional teacher, leader, and encourager. His infectious enthusiasm and clear communication make every session delightful.",
    author: "Experienced Educator",
    title: "Colleague",
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <SeoStructuredData />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-32">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-light leading-tight">
              Daniele Buatti
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300">
              Pianist • Vocal Coach • Music Director • Embodiment Practitioner
            </p>
            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400">
              I help singers, performers, and speakers connect body, breath, and voice for authentic and easeful expression.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-10 py-7 rounded-full">
                  Book a discovery call
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh] p-0">
                <CalEmbed calLink="danielebuatti/30min" />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-center">
            <DynamicImage
              src="/headshot.jpeg"
              alt="Daniele Buatti"
              className="w-full max-w-lg rounded-3xl shadow-2xl"
              width={600}
              height={600}
            />
          </div>
        </section>

        {/* Expertise */}
        <section>
          <h2 className="text-4xl font-light text-center mb-16">My Expertise</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <Mic2 className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Voice & Piano</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Technique, repertoire, theory, audition prep, and expressive performance.
              </p>
            </div>
            <div className="text-center space-y-6">
              <Leaf className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Body & Breath</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kinesiology and somatic work to release tension and support natural resonance.
              </p>
            </div>
            <div className="text-center space-y-6">
              <Megaphone className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Presence & Communication</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Public speaking, on-camera work, and building calm, authentic presence.
              </p>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <DynamicImage
            src="/pinkcarpet.jpg"
            alt="Daniele Buatti"
            className="w-full rounded-3xl shadow-2xl"
            width={600}
            height={600}
          />
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
          <h2 className="text-4xl font-light text-center mb-16">Who I Work With</h2>
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
          <h2 className="text-4xl font-light text-center mb-16">Why Work With Me</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                <strong>Holistic expertise</strong> — voice, piano, presence, kinesiology, and mindset.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                <strong>Embodiment-based</strong> — build skill without tension or burnout.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                <strong>Results-focused</strong> — leave sessions more confident and capable.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                <strong>Creative freedom</strong> — technique meets artistry and authentic expression.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-4xl font-light text-center mb-16">Client Feedback</h2>
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
          <h2 className="text-4xl font-light text-center mb-16">Other Work</h2>
          <div className="space-y-16">
            {/* Specialised Services */}
            <div>
              <h3 className="text-3xl font-medium text-center mb-12">Specialised Services</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
                  <DynamicImage src="/daniele-conducting.jpeg" alt="Music Director" className="w-full h-64 object-cover" />
                  <div className="p-6 text-center">
                    <h4 className="text-xl font-medium mb-2">Music Director & Pianist</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Music theatre direction, vocal coaching, and performance.
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/music-director-pianist">View profile</Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
                  <DynamicImage src="/blacktie.avif" alt="Live Piano" className="w-full h-64 object-cover" />
                  <div className="p-6 text-center">
                    <h4 className="text-xl font-medium mb-2">Live Piano Services</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Weddings, events, and private functions.
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/live-piano-services">Enquire</Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
                  <DynamicImage src="/ameb-placeholder.jpg" alt="AMEB" className="w-full h-64 object-cover" />
                  <div className="p-6 text-center">
                    <h4 className="text-xl font-medium mb-2">AMEB Accompanying</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Exam day and rehearsal accompaniment.
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/ameb-accompanying">Book</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Digital & Community */}
            <div>
              <h3 className="text-3xl font-medium text-center mb-12">Digital Products & Community</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
                  <DynamicImage src="/sheetmusic.png" alt="Buattiverse" className="w-full h-64 object-cover" />
                  <div className="p-6 text-center">
                    <h4 className="text-xl font-medium mb-2">Buattiverse</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Sheet music and backing tracks
                    </p>
                    <Button asChild variant="outline">
                      <a href="https://buattiverse.gumroad.com/" target="_blank" rel="noopener">
                        Visit store
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
                  <DynamicImage src="/pianobackingslogo.png" alt="Piano Backings" className="w-full h-64 object-cover object-top" />
                  <div className="p-6 text-center">
                    <h4 className="text-xl font-medium mb-2">Piano Backing Tracks</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Professional tracks for singers
                    </p>
                    <Button asChild variant="outline">
                      <a href="https://pianobackingsbydaniele.vercel.app" target="_blank" rel="noopener">
                        Explore
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 flex flex-col justify-between">
                  <div>
                    <ResonanceProgramCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 bg-white dark:bg-gray-900 rounded-3xl text-center">
          <h2 className="text-4xl font-light mb-12">Get in Touch</h2>
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