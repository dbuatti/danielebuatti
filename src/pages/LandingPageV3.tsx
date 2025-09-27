import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import InstagramStrip from "@/components/InstagramStrip"; // Import the new component

// Import new modular sections
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import AboutMeSection from "@/components/pages/landing-page-v3/AboutMeSection";
import EducationExpertiseSection from "@/components/pages/landing-page-v3/EducationExpertiseSection";
import GreenroomAwardsSection from "@/components/pages/landing-page-v3/GreenroomAwardsSection";
import WhoIWorkWithSection from "@/components/pages/landing-page-v3/WhoIWorkWithSection";
import DanieleSmileHostSection from "@/components/pages/landing-page-v3/DanieleSmileHostSection";
import EmbodiedApproachSection from "@/components/pages/landing-page-v3/EmbodiedApproachSection";
import DanieleCalmAtPianoSection from "@/components/pages/landing-page-v3/DanieleCalmAtPianoSection";
import TestimonialsSection from "@/components/pages/landing-page-v3/TestimonialsSection"; // Corrected import path
import SessionsAvailabilitySection from "@/components/pages/landing-page-v3/SessionsAvailabilitySection";
import WhyWorkWithMeSection from "@/components/pages/landing-page-v3/WhyWorkWithMeSection";
import TulipsSection from "@/components/pages/landing-page-v3/TulipsSection";
import CallToActionSection from "@/components/pages/landing-page-v3/CallToActionSection";
import AdditionalProgramsSection from "@/components/pages/landing-page-v3/AdditionalProgramsSection";
import FullBioSection from "@/components/pages/landing-page-v3/FullBioSection";

const LandingPageV3: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main>
        <HeroSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <AboutMeSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <EducationExpertiseSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <GreenroomAwardsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <WhoIWorkWithSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <DanieleSmileHostSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <EmbodiedApproachSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <DanieleCalmAtPianoSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <TestimonialsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <SessionsAvailabilitySection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <WhyWorkWithMeSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <TulipsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <FullBioSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <CallToActionSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary my-12" />
        <AdditionalProgramsSection />
      </main>
      <InstagramStrip /> {/* Added the Instagram strip here */}
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV3;