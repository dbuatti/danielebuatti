"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Modular sections
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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SeoStructuredData />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">
        {/* Hero */}
        <HeroSection />

        <Separator className="border-gray-200 dark:border-gray-700" />

        {/* What I Do */}
        <section id="what-i-do">
          <h2 className="text-3xl font-semibold mb-10 text-center">What I Do</h2>
          <EducationExpertiseSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-700" />

        {/* My Approach */}
        <section id="approach">
          <h2 className="text-3xl font-semibold mb-10 text-center">My Approach</h2>
          <EmbodiedApproachOverviewSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-700" />

        {/* Who I Work With */}
        <section id="who-i-work-with">
          <h2 className="text-3xl font-semibold mb-10 text-center">Who I Work With</h2>
          <WhoIWorkWithSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-700" />

        {/* About Me */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-10">About Me</h2>
          <div className="max-w-md mx-auto space-y-6">
            <DynamicImage
              src="/daniele simple.jpeg"
              alt="Daniele Buatti"
              className="w-full rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              width={500}
              height={500}
            />
            <p className="text-lg text-gray-700 dark:text-gray-300">
              I’m Daniele Buatti. I work with singers, musicians, speakers, and performers to help them feel more at ease in their body and voice.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Read more about me</Link>
            </Button>
          </div>
        </section>

        <Separator className="border-gray-200 dark:border-gray-700" />

        {/* Client Feedback */}
        <section id="testimonials">
          <h2 className="text-3xl font-semibold mb-10 text-center">Client Feedback</h2>
          <TestimonialsSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-700" />

        {/* Other Work & Services */}
        <section>
          <h2 className="text-3xl font-semibold mb-10 text-center">Other Work</h2>
          <AdditionalProgramsSection />
        </section>

        <Separator className="border-gray-200 dark:border-gray-700" />

        {/* Contact */}
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