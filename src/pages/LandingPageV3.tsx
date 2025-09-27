import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

// Import new modular sections
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import AboutMeSection from "@/components/pages/landing-page-v3/AboutMeSection";
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
import AdditionalProgramsSection from "@/components/pages/landing-page-v3/AdditionalProgramsSection";
import FullBioSection from "@/components/pages/landing-page-v3/FullBioSection";

const LandingPageV3: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 space-y-12">
        <HeroSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <AboutMeSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <EducationExpertiseSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <GreenroomAwardsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <WhoIWorkWithSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <DanieleSmileHostSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <EmbodiedApproachSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <DanieleCalmAtPianoSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <TestimonialsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <SessionsAvailabilitySection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <WhyWorkWithMeSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <TulipsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <FullBioSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <AdditionalProgramsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" /> {/* Added separator before the moved CallToActionSection */}
        <CallToActionSection />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV3;