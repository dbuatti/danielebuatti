"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Import new modular sections
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import EmbodiedApproachOverviewSection from "@/components/pages/landing-page-v3/EmbodiedApproachOverviewSection";
import EducationExpertiseSection from "@/components/pages/landing-page-v3/EducationExpertiseSection";
import WhoIWorkWithSection from "@/components/pages/landing-page-v3/WhoIWorkWithSection";
import TestimonialsSection from "@/components/pages/landing-page-v3/TestimonialsSection";
import WhyWorkWithMeSection from "@/components/pages/landing-page-v3/WhyWorkWithMeSection";
import CallToActionSection from "@/components/pages/landing-page-v3/CallToActionSection";
import ResonanceProgramCard from "@/components/ResonanceProgramCard";
import DynamicImage from "@/components/DynamicImage";

const LandingPageV3: React.FC = () => {

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <SeoStructuredData />
      <Navbar />
      <main className="mx-auto px-4">
        <HeroSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
        <EducationExpertiseSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
        <WhyWorkWithMeSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
        <EmbodiedApproachOverviewSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
        <WhoIWorkWithSection id="who-i-work-with" />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
        {/* Moved 'A Personal Glimpse' here */}
        <section className="max-w-6xl mx-auto text-center py-8 space-y-10">
          <SectionHeading>A Personal Glimpse</SectionHeading>
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col items-center">
            <DynamicImage
              src="/daniele simple.jpeg"
              alt="Daniele Buatti simple headshot"
              className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-primary mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500"
              width={600}
              height={600}
            />
            <CardContent className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-4 p-0 space-y-4">
              <p>Daniele Buatti, dedicated to embodied performance and well-being.</p>
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Link to="/about">
                  View Full Bio
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
        <TestimonialsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
        <ResonanceProgramCard className="my-8" />
        {/* Simplified Projects & Resources call-out */}
        <div className="bg-brand-blue/10 dark:bg-brand-blue/20 p-6 rounded-xl shadow-lg text-center space-y-4 mt-8 max-w-6xl mx-auto">
          <p className="text-xl font-semibold text-brand-dark dark:text-brand-light">
            Explore all specialized services, digital products, and community initiatives.
          </p>
          <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/projects-resources">
              View All Projects & Resources
            </Link>
          </Button>
        </div>
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
        <CallToActionSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-8" />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV3;