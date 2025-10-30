"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import SeoStructuredData from "@/components/SeoStructuredData";
import { Card, CardContent } from "@/components/ui/card"; // Import Card and CardContent
import SectionHeading from "@/components/SectionHeading"; // Import SectionHeading

// Import new modular sections
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import UnifiedAboutSection from "@/components/pages/landing-page-v3/UnifiedAboutSection";
import EducationExpertiseSection from "@/components/pages/landing-page-v3/EducationExpertiseSection";
// Removed GreenroomAwardsSection import
import WhoIWorkWithSection from "@/components/pages/landing-page-v3/WhoIWorkWithSection";
// Removed DanieleSmileHostSection import
import EmbodiedApproachSection from "@/components/pages/landing-page-v3/EmbodiedApproachSection";
// Removed DanieleCalmAtPianoSection import
import TestimonialsSection from "@/components/pages/landing-page-v3/TestimonialsSection";
import SessionsAvailabilitySection from "@/components/pages/landing-page-v3/SessionsAvailabilitySection";
import WhyWorkWithMeSection from "@/components/pages/landing-page-v3/WhyWorkWithMeSection";
// Removed TulipsSection import
import CallToActionSection from "@/components/pages/landing-page-v3/CallToActionSection";
// import AdditionalProgramBanner from "@/components/AdditionalProgramBanner"; // This import is now truly not needed
import ResonanceProgramCard from "@/components/ResonanceProgramCard";
import DynamicImage from "@/components/DynamicImage"; // Import DynamicImage
import ImageCarouselSection from "@/components/pages/landing-page-v3/ImageCarouselSection"; // New import for carousel

const LandingPageV3: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <SeoStructuredData />
      <Navbar />
      <main className="mx-auto px-4">
        <HeroSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <EducationExpertiseSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <WhyWorkWithMeSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <UnifiedAboutSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <EmbodiedApproachSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <WhoIWorkWithSection id="who-i-work-with" /> {/* Added id for anchor linking */}
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <TestimonialsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <SessionsAvailabilitySection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        {/* Standalone image now wrapped in a Card with a SectionHeading */}
        <section className="max-w-6xl mx-auto text-center py-12 space-y-10">
          <SectionHeading>A Personal Glimpse</SectionHeading> {/* New SectionHeading */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col items-center">
            <DynamicImage
              src="/daniele simple.jpeg"
              alt="Daniele Buatti simple headshot"
              className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-primary mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500"
              width={600}
              height={600}
            />
            <CardContent className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-4 p-0">
              Daniele Buatti, dedicated to embodied performance and well-being.
            </CardContent>
          </Card>
        </section>
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        {/* Replaced individual image sections with the new carousel */}
        <ImageCarouselSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <ResonanceProgramCard className="my-12" />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary mt-12" />
        <CallToActionSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        {/* <InstagramFeedSection /> */} {/* Temporarily commented out */}
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV3;