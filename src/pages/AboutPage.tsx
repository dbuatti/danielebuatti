"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicImage from "@/components/DynamicImage";
import ImageCarouselSection from "@/components/pages/landing-page-v3/ImageCarouselSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Introduction */}
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-light mb-8">About Daniele Buatti</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            Pianist, music director, vocal coach, and embodiment practitioner based in Melbourne.
          </p>
        </section>

        {/* Photo + Short Bio */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="flex justify-center">
            <DynamicImage
              src="/daniele simple.jpeg"
              alt="Daniele Buatti"
              className="w-full max-w-md rounded-3xl shadow-2xl"
              width={600}
              height={600}
            />
          </div>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              I’ve spent over fifteen years working across music theatre and performance as a music director, pianist, arranger, vocal coach, and educator.
            </p>
            <p>
Alongside this, I trained in kinesiology and draw from yoga and somatic practices, allowing me to work with performers in a way that integrates body, breath, and voice — not as separate skills, but as a single, responsive system.
            </p>
            <p>
My work centres on reducing unnecessary tension, increasing awareness, and creating the conditions for authentic expression to emerge naturally — whether on stage, in the studio, or in everyday communication.
            </p>
          </div>
        </section>

        {/* My Approach */}
        <section className="mb-32">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">My Approach</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-center">
            <p>
              Everything I teach is built around four connected steps:
            </p>
            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div>
                <h3 className="text-2xl font-medium mb-4">Thought</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Becoming aware of mental patterns and habits that hold you back.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-medium mb-4">Intention</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Clarifying what you want to express and aligning your body with that purpose.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-medium mb-4">Breath</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Freeing and deepening breath to release tension and support sound.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-medium mb-4">Expression</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Letting your natural voice and presence emerge without force.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <Button asChild size="lg" variant="outline" className="border-2 text-lg px-10 py-6">
                <Link to="/coaching">More about my coaching</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Photo Moments */}
        <section className="mb-32">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">Moments from My Work</h2>
          <ImageCarouselSection />
        </section>

        {/* Simple CTA */}
        <section className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl">
          <h2 className="text-4xl md:text-5xl font-light mb-8">Get in Touch</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            If you’d like to talk about coaching, performance work, or anything else, feel free to reach out.
          </p>
          <Button asChild size="lg" className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 text-lg px-10 py-6 rounded-full">
            <Link to="/contact">Contact me</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;