"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import SeoStructuredData from "@/components/SeoStructuredData";

// Import new modular sections
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import UnifiedAboutSection from "@/components/pages/landing-page-v3/UnifiedAboutSection";
import EducationExpertiseSection from "@/components/pages/landing-page-v3/EducationExpertiseSection";
import GreenroomAwardsSection from "@/components/pages/landing-page-v3/GreenroomAwardsSection";
import WhoIWorkWithSection from "@/components/pages/landing-page-v3/WhoIWorkWithSection";
import DanieleSmileHostSection from "@/components/pages/landing-page-v3/DanieleSmileHostSection";
import EmbodiedApproachSection from "@/components/pages/landing-page-v3/EmbodiedApproachSection";
import DanieleCalmAtPianoSection from "@/components/pages/landing-page-v3/DanieleCalmAtPianoSection";
import TestimonialsSection from "@/components/pages/landing-page-v3/TestimonialsSection";
import SessionsAvailabilitySection from "@/components/pages/landing-page-v3/SessionsAvailabilitySection";
import WhyWorkWithMeSection from "@/components/pages/landing-page-v3/WhyWorkWithMeSection";
import TulipsSection from "@/components/pages/landing-page-v3/TulipsSection";
import CallToActionSection from "@/components/pages/landing-page-v3/CallToActionSection";
import AdditionalProgramBanner from "@/components/AdditionalProgramBanner";
import ResonanceProgramCard from "@/components/ResonanceProgramCard";
import DynamicImage from "@/components/DynamicImage"; // Import DynamicImage

const LandingPageV3: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <SeoStructuredData />
      <Navbar />
      <main className="mx-auto px-4">
        <HeroSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <EducationExpertiseSection /> {/* Moved here */}
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <UnifiedAboutSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <EmbodiedApproachSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <WhoIWorkWithSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <TestimonialsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <SessionsAvailabilitySection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        {/* Re-adding the daniele simple.jpeg image here as a standalone section */}
        <section className="max-w-6xl mx-auto text-center py-12">
          <DynamicImage
            src="/daniele simple.jpeg"
            alt="Daniele Buatti simple headshot"
            className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-primary mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500"
            width={600}
            height={600}
          />
          <p className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-4">
            Daniele Buatti, dedicated to embodied performance and well-being.
          </p>
        </section>
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <GreenroomAwardsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <DanieleSmileHostSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <DanieleCalmAtPianoSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <ResonanceProgramCard className="my-12" />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <AdditionalProgramBanner
          title={<span className="text-brand-primary">AUDITION CUT PLAYTHROUGH</span>}
          subtitle="Live run through of your audition cut"
          description={
            <ul className="list-disc list-inside space-y-2 text-lg text-brand-light">
              <li>15 minute online drop-in</li>
              <li>Run your 16–32 bar cut with an experienced audition pianist</li>
              <li>Live playthrough + practical feedback</li>
              <li>Perfect for auditions & self-tapes</li>
              <li>Upload your clear PDF when booking</li>
            </ul>
          }
          link="https://danielebuatti.as.me/audition-cut-playthrough-15"
          linkText="Book a Playthrough"
          bgColorClass="bg-brand-dark"
          textColorClass="text-brand-light"
          buttonBgClass="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
          titleClassName="text-5xl md:text-6xl font-extrabold uppercase"
          backgroundImageSrc="/danielepianolaugh.jpeg"
          backgroundPosition="80% center"
        />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary mt-12" />
        <WhyWorkWithMeSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <TulipsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
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