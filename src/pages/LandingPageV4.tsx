"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Modular sections (keep as-is – they're good)
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import EducationExpertiseSection from "@/components/pages/landing-page-v3/EducationExpertiseSection";
import WhyWorkWithMeSection from "@/components/pages/landing-page-v3/WhyWorkWithMeSection";
import EmbodiedApproachOverviewSection from "@/components/pages/landing-page-v3/EmbodiedApproachOverviewSection";
import WhoIWorkWithSection from "@/components/pages/landing-page-v3/WhoIWorkWithSection";
import TestimonialsSection from "@/components/pages/landing-page-v3/TestimonialsSection";
import CallToActionSection from "@/components/pages/landing-page-v3/CallToActionSection";
import AdditionalProgramsSection from "@/components/pages/landing-page-v3/AdditionalProgramsSection";
import DynamicImage from "@/components/DynamicImage";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SeoStructuredData />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-32">
        {/* Hero – larger top padding for breathing room */}
        <HeroSection />

        <Separator className="border-gray-200 dark:border-gray-800" />

        <section id="what-i-do">
          <h2 className="text-4xl font-light text-center mb-12 text-gray-800 dark:text-gray-200">What I Do</h2>
          <EducationExpertiseSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-800" />

        <section id="approach">
          <h2 className="text-4xl font-light text-center mb-12 text-gray-800 dark:text-gray-200">My Approach</h2>
          <EmbodiedApproachOverviewSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-800" />

        <section id="who-i-work-with">
          <h2 className="text-4xl font-light text-center mb-12 text-gray-800 dark:text-gray-200">Who I Work With</h2>
          <WhoIWorkWithSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-800" />

        <section className="text-center py-12">
          <h2 className="text-4xl font-light mb-12 text-gray-800 dark:text-gray-200">About Me</h2>
          <div className="max-w-lg mx-auto space-y-8">
            <DynamicImage
              src="/daniele simple.jpeg"
              alt="Daniele Buatti"
              className="w-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800"
              width={600}
              height={600}
            />
            <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              I’m Daniele Buatti. I work with singers, musicians, speakers, and performers to help them feel more at ease in their body and voice.
            </p>
            <Button asChild variant="outline" size="lg" className="border-2">
              <Link to="/about">Read more about me</Link>
            </Button>
          </div>
        </section>

        <Separator className="border-gray-200 dark:border-gray-800" />

        <section id="testimonials">
          <h2 className="text-4xl font-light text-center mb-12 text-gray-800 dark:text-gray-200">Client Feedback</h2>
          <TestimonialsSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-800" />

        <section>
          <h2 className="text-4xl font-light text-center mb-12 text-gray-800 dark:text-gray-200">Other Work</h2>
          <AdditionalProgramsSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-800" />

        <section id="contact">
          <CallToActionSection />
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPage;