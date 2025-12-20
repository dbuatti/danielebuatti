"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicImage from "@/components/DynamicImage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mic2, Leaf, Megaphone, Calendar, ExternalLink } from "lucide-react"; // Import ExternalLink

const CoachingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero – calm, authoritative */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-light mb-8">Coaching</h1>
          <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-10 max-w-4xl mx-auto">
            Voice. Presence. Musical Authority.
          </p>
          <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            One-to-one work for performers, speakers, and creatives who want to communicate with clarity, depth, and ease — without forcing or over-efforting.
          </p>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            This work integrates voice, piano, body awareness, and somatic intelligence to support sustainable, embodied expression.
          </p>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-16">
            Not performance tricks. Not vocal hacks.<br />
            This is about alignment — musical, physical, and psychological.
          </p>
          <Button asChild size="lg" className="text-lg px-14 py-8 rounded-full shadow-xl bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
            <a
              href="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:1:1%20Coaching:%20Voice,%20Piano%20%26%20Performance"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="w-7 h-7 inline mr-4" />
              Check availability & book
            </a>
          </Button>
        </section>

        {/* Hero Image – refined crop, elegant */}
        <div className="mb-28 -mx-6">
          <DynamicImage
            src="/danielecalmatpiano.jpeg"
            alt="Daniele Buatti in flow at the piano"
            className="w-full h-[700px] object-cover shadow-2xl"
            style={{ objectPosition: "center 7%" }}  // fine-tuned for your head + piano
            width={1400}
            height={800}
          />
        </div>

        {/* The Work – calm, spacious, no bullets */}
        <section className="mb-32">
          <h2 className="text-4xl font-light text-center mb-20">The Work</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {/* Voice & Piano */}
            <div className="space-y-8 text-center">
              <Mic2 className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-3xl font-medium">Voice & Piano</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Refined, musical work grounded in real-world performance. Vocal technique that prioritises ease and resonance. Piano skills for singers and directors. Repertoire, interpretation, and stylistic clarity. Audition and performance preparation. Sight-reading, theory, and musical literacy.
              </p>
              <p className="text-lg italic text-gray-600 dark:text-gray-400">
                Always in service of expression — never mechanics for their own sake.
              </p>
            </div>

            {/* Body, Breath & Regulation */}
            <div className="space-y-8 text-center">
              <Leaf className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-3xl font-medium">Body, Breath & Regulation</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Where most vocal training stops — this work begins. Using kinesiology, breath work, and somatic practices to address unconscious holding patterns, performance stress, and disconnection between intention and sound.
              </p>
              <p className="text-lg italic text-gray-600 dark:text-gray-400">
                The aim is a voice that responds — not one that’s managed.
              </p>
              <Button asChild variant="link" className="text-lg p-0 h-auto text-brand-primary hover:text-brand-primary/80">
                <a href="https://resonance-kinesiology.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center mx-auto">
                  Book Pure Kinesiology Sessions <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>

            {/* Presence & Communication */}
            <div className="space-y-8 text-center">
              <Megaphone className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-3xl font-medium">Presence & Communication</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                For moments where clarity matters. Public speaking and presentations. On-camera confidence. Acting and text delivery. Leadership presence. Focused on nervous system regulation, clarity of intention, and grounded delivery.
              </p>
              <p className="text-lg italic text-gray-600 dark:text-gray-400">
                So you’re felt, not just heard.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Services – simple, elegant */}
        <section className="py-20 bg-white dark:bg-gray-900 rounded-3xl text-center">
          <h2 className="text-4xl font-light mb-10">Additional Musical Services</h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
            Alongside coaching, I work professionally as a pianist, music director, and arranger — including live performance, music direction, AMEB accompaniment, custom sheet music, and backing tracks.
          </p>
          <Button asChild size="lg" variant="outline" className="border-2 text-lg px-14 py-8 rounded-full">
            <Link to="/projects-resources">Explore all services</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CoachingPage;