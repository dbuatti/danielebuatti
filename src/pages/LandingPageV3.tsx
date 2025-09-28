import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import SeoStructuredData from "@/components/SeoStructuredData";

// Import new modular sections
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import UnifiedAboutSection from "@/components/pages/landing-page-v3/UnifiedAboutSection"; // New import
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
// import InstagramFeedSection from "@/components/pages/landing-page-v3/InstagramFeedSection"; // Temporarily removed
import AdditionalProgramBanner from "@/components/AdditionalProgramBanner";

const LandingPageV3: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <SeoStructuredData />
      <Navbar />
      <main className="mx-auto px-4">
        <HeroSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <UnifiedAboutSection /> {/* Using the new unified section */}
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <EducationExpertiseSection /> {/* This will be updated in a later step to only contain expertise */}
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
        <AdditionalProgramsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        {/* <InstagramFeedSection /> */} {/* Temporarily commented out */}
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV3;