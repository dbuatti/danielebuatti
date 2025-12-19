"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicImage from "@/components/DynamicImage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mic2, Leaf, Megaphone, Users, Calendar } from "lucide-react";

const CoachingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero – calm, authoritative, full image */}
        <section className="mb-24 text-center">
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
          <Button asChild size="lg" className="text-lg px-14 py-8 rounded-full shadow-xl">
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

<div className="mb-24 -mx-6">
  <DynamicImage
    src="/danielecalmatpiano.jpeg"
    alt="Daniele Buatti in flow at the piano"
    className="w-full h-[650px] object-cover shadow-3xl"
    style={{ objectPosition: "center 45%" }}  // change 35% to 40%, 45%, etc.
    width={1400}
    height={800}
  />
</div>

        {/* The Work – elevated, no bullet lists */}
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

        {/* Sessions & Rates – premium, calm */}
        <section className="mb-32 py-20 bg-white dark:bg-gray-900 rounded-3xl">
          <h2 className="text-4xl font-light text-center mb-16">Sessions & Rates</h2>
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Single Sessions */}
            <div>
              <h3 className="text-2xl font-medium text-center mb-10">One-to-One Sessions</h3>
              <div className="grid md:grid-cols-4 gap-10 text-center">
                <div className="space-y-3">
                  <p className="text-3xl font-light">30 min</p>
                  <p className="text-2xl font-semibold">$90</p>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-light">45 min</p>
                  <p className="text-2xl font-semibold">$130</p>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-light">60 min</p>
                  <p className="text-2xl font-semibold">$170</p>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-light">90 min</p>
                  <p className="text-2xl font-semibold">$250</p>
                </div>
              </div>
            </div>

            {/* Packages */}
            <div className="text-center">
              <h3 className="text-2xl font-medium mb-8">Packages (60-minute sessions)</h3>
              <div className="space-y-4 max-w-md mx-auto text-xl">
                <p>4 sessions — $640</p>
                <p>8 sessions — $1,240</p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">Custom packages available for ongoing or integrated work.</p>
              </div>
            </div>

            {/* Booking CTA */}
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                Sessions available in person (Toorak, Melbourne) or online via Zoom.
              </p>
              <Button asChild size="lg" className="text-lg px-14 py-8 rounded-full shadow-2xl">
                <a
                  href="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:1:1%20Coaching:%20Voice,%20Piano%20%26%20Performance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="w-7 h-7 inline mr-4" />
                  Check availability & book
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Group Workshops – intentional */}
        <section className="mb-32 text-center">
          <Users className="w-16 h-16 mx-auto mb-8 text-gray-700 dark:text-gray-300" />
          <h2 className="text-4xl font-light mb-8">Group Workshops</h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Throughout the year, I offer small-group workshops exploring voice, presence, and embodied performance.<br />
            These sessions are exploratory, practical, and designed for people who want depth — not quick fixes.
          </p>
          <Button asChild size="lg" variant="outline" className="border-2 text-lg px-12 py-7">
            <Link to="/projects-resources">View upcoming workshops</Link>
          </Button>
        </section>

        {/* Additional Services */}
        <section className="py-20 bg-white dark:bg-gray-900 rounded-3xl text-center">
          <h2 className="text-4xl font-light mb-8">Additional Musical Services</h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Alongside coaching, I work professionally as a pianist, music director, and arranger.<br />
            This includes live piano performance, music direction, AMEB accompaniment, custom sheet music, and backing tracks.
          </p>
          <Button asChild size="lg" variant="outline" className="border-2 text-lg px-12 py-7">
            <Link to="/projects-resources">View all services</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CoachingPage;