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
        {/* Hero */}
        <section className="mb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-light mb-8">Coaching Services</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            One-to-one work in voice, piano, performance, and embodiment.
          </p>
        </section>

        {/* Hero Image */}
        <div className="mb-24 -mx-6">
          <DynamicImage
            src="/danielecalmatpiano.jpeg"
            alt="Daniele Buatti playing piano"
            className="w-full h-[500px] object-cover object-top rounded-b-3xl shadow-2xl"
            width={1200}
            height={600}
          />
        </div>

        {/* What I Offer – Three Pillars */}
        <section className="mb-32">
          <h2 className="text-4xl font-light text-center mb-16">What I Offer</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Vocal & Instrumental */}
            <div className="text-center space-y-6">
              <Mic2 className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Voice & Piano</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Practical work on technique, repertoire, sight-reading, theory, audition preparation, and musical expression.
              </p>
            </div>

            {/* Embodiment */}
            <div className="text-center space-y-6">
              <Leaf className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Body & Breath</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Kinesiology, breath work, and somatic practices to release tension and connect body with voice.
              </p>
            </div>

            {/* Presence */}
            <div className="text-center space-y-6">
              <Megaphone className="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" />
              <h3 className="text-2xl font-medium">Presence & Communication</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Public speaking, on-camera work, acting, and building calm, clear presence in any setting.
              </p>
            </div>
          </div>
        </section>

        {/* Sessions & Pricing */}
        <section className="mb-32 py-16 bg-white dark:bg-gray-900 rounded-3xl">
          <h2 className="text-4xl font-light text-center mb-16">Sessions & Rates</h2>
          <div className="max-w-3xl mx-auto space-y-12">
            {/* Single Sessions */}
            <div className="text-center">
              <h3 className="text-2xl font-medium mb-8">Single Sessions</h3>
              <div className="grid md:grid-cols-4 gap-8 mb-12">
                <div className="space-y-2">
                  <p className="text-3xl font-light">30 min</p>
                  <p className="text-xl">£50</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-light">45 min</p>
                  <p className="text-xl">£75</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-light">60 min</p>
                  <p className="text-xl">£95</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-light">90 min</p>
                  <p className="text-xl">£140</p>
                </div>
              </div>
            </div>

            {/* Packages */}
            <div className="text-center">
              <h3 className="text-2xl font-medium mb-8">Packages (60-minute sessions)</h3>
              <div className="space-y-6 max-w-md mx-auto">
                <p className="text-xl">4 sessions – £360 (save £20)</p>
                <p className="text-xl">8 sessions – £700 (save £60)</p>
                <p className="text-lg text-gray-600 dark:text-gray-400">Custom packages available on request.</p>
              </div>
            </div>

            {/* Booking */}
            <div className="text-center">
              <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
                Sessions available in-person (Toorak, Melbourne) or online via Zoom.
              </p>
              <Button asChild size="lg" className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 text-lg px-12 py-7 rounded-full">
                <a
                  href="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:1:1%20Coaching:%20Voice,%20Piano%20%26%20Performance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="w-6 h-6 inline mr-3" />
                  Check availability & book
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Group Work */}
        <section className="mb-32 text-center">
          <Users className="w-16 h-16 mx-auto mb-8 text-gray-700 dark:text-gray-300" />
          <h2 className="text-4xl font-light mb-8">Group Workshops</h2>
          <p className="text-lg max-w-2xl mx-auto mb-10 text-gray-600 dark:text-gray-400">
            I also run occasional group sessions on presence, voice, and body work.
          </p>
          <Button asChild variant="outline" size="lg" className="border-2 text-lg px-10 py-6">
            <Link to="/projects-resources">See upcoming workshops</Link>
          </Button>
        </section>

        {/* Other Services Call-out */}
        <section className="py-16 bg-white dark:bg-gray-900 rounded-3xl text-center">
          <h2 className="text-4xl font-light mb-8">Other Services</h2>
          <p className="text-lg max-w-2xl mx-auto mb-10 text-gray-600 dark:text-gray-400">
            I also offer live piano performance, music direction, AMEB accompaniment, sheet music arrangements, and backing tracks.
          </p>
          <Button asChild size="lg" variant="outline" className="border-2 text-lg px-10 py-6">
            <Link to="/projects-resources">View all services</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CoachingPage;