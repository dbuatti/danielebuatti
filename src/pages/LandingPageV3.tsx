"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Modular sections (keep these — they're well-structured)
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import EducationExpertiseSection from "@/components/pages/landing-page-v3/EducationExpertiseSection";
import WhyWorkWithMeSection from "@/components/pages/landing-page-v3/WhyWorkWithMeSection";
import EmbodiedApproachOverviewSection from "@/components/pages/landing-page-v3/EmbodiedApproachOverviewSection";
import WhoIWorkWithSection from "@/components/pages/landing-page-v3/WhoIWorkWithSection";
import TestimonialsSection from "@/components/pages/landing-page-v3/TestimonialsSection";
import CallToActionSection from "@/components/pages/landing-page-v3/CallToActionSection";
import ResonanceProgramCard from "@/components/ResonanceProgramCard";
import DynamicImage from "@/components/DynamicImage";

const LandingPageV3: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SeoStructuredData />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <HeroSection />

        {/* Education & Background */}
        <section id="education">
          <h2 className="text-3xl font-semibold mb-8">My Background</h2>
          <EducationExpertiseSection />
        </section>

        <Separator />

        {/* Why Work With Me */}
        <section id="why-work-with-me">
          <h2 className="text-3xl font-semibold mb-8">Why People Choose to Work With Me</h2>
          <WhyWorkWithMeSection />
        </section>

        <Separator />

        {/* Approach */}
        <section id="approach">
          <h2 className="text-3xl font-semibold mb-8">How I Work</h2>
          <EmbodiedApproachOverviewSection />
        </section>

        <Separator />

        {/* Who I Work With */}
        <section id="who-i-work-with">
          <h2 className="text-3xl font-semibold mb-8">Who I Work With</h2>
          <WhoIWorkWithSection />
        </section>

        <Separator />

        {/* Personal Photo & Bio Link */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-semibold mb-10">About Me</h2>
          <div className="max-w-md mx-auto">
            <DynamicImage
              src="/daniele simple.jpeg"
              alt="Daniele Buatti"
              className="w-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              width={500}
              height={500}
            />
            <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
              I'm Daniele Buatti. I help people connect more deeply with their body, voice, and performance through practical, grounded work.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-6">
              <Link to="/about">Read my full story</Link>
            </Button>
          </div>
        </section>

        <Separator />

        {/* Testimonials */}
        <section id="testimonials">
          <h2 className="text-3xl font-semibold mb-8 text-center">What Clients Say</h2>
          <TestimonialsSection />
        </section>

        <Separator />

        {/* Resonance Program */}
        <section className="py-8">
          <ResonanceProgramCard />
        </section>

        <Separator />

        {/* Other Work */}
        <section className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <h2 className="text-3xl font-semibold mb-6">Other Work</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            I also offer workshops, online courses, group programs, and community spaces.
          </p>
          <Button asChild size="lg" variant="default">
            <Link to="/projects-resources">See all offerings</Link>
          </Button>
        </section>

        <Separator />

        {/* Final CTA */}
        <section id="contact">
          <CallToActionSection />
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV3;