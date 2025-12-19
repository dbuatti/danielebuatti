"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import DynamicImage from "@/components/DynamicImage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Keep your modular sections – they're excellent
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import EducationExpertiseSection from "@/components/pages/landing-page-v3/EducationExpertiseSection";
import EmbodiedApproachOverviewSection from "@/components/pages/landing-page-v3/EmbodiedApproachOverviewSection";
import WhoIWorkWithSection from "@/components/pages/landing-page-v3/WhoIWorkWithSection";
import TestimonialsSection from "@/components/pages/landing-page-v3/TestimonialsSection";
import CallToActionSection from "@/components/pages/landing-page-v3/CallToActionSection";
import AdditionalProgramsSection from "@/components/pages/landing-page-v3/AdditionalProgramsSection";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans">
      <SeoStructuredData />
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Full-bleed Hero for impact */}
        <div className="-mx-6 mb-20">
          <HeroSection />
        </div>

        {/* My Expertise */}
        <section className="py-20">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-16">My Expertise</h2>
          <EducationExpertiseSection />
        </section>

        {/* Approach – with subtle background for depth */}
        <section className="py-20 bg-white dark:bg-gray-900 rounded-3xl -mx-6 px-6">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-16">My Approach</h2>
          <EmbodiedApproachOverviewSection />
        </section>

        {/* Who I Work With */}
        <section className="py-20">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-16">Who I Work With</h2>
          <WhoIWorkWithSection />
        </section>

        {/* About Me – personal touch */}
        <section className="py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-16">About Me</h2>
          <div className="max-w-2xl mx-auto space-y-10">
            <DynamicImage
              src="/daniele simple.jpeg"
              alt="Daniele Buatti"
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              width={600}
              height={600}
            />
            <p className="text-xl leading-relaxed max-w-lg mx-auto">
              I’m Daniele Buatti, a pianist, music director, vocal coach, and performer based in Melbourne.
            </p>
            <Button asChild size="lg" variant="outline" className="border-2 text-lg px-10 py-6">
              <Link to="/about">More about me</Link>
            </Button>
          </div>
        </section>

        {/* Client Feedback */}
        <section className="py-20 bg-white dark:bg-gray-900 rounded-3xl -mx-6 px-6">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-16">Client Feedback</h2>
          <TestimonialsSection />
        </section>

        {/* Other Work */}
        <section className="py-20">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-16">Other Work</h2>
          <AdditionalProgramsSection />
        </section>

        {/* Contact */}
        <section className="py-20">
          <CallToActionSection />
        </section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPage;