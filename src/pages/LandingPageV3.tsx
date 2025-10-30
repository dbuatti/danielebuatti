"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button"; // Import Button
import { Link } from "react-router-dom"; // Import Link

// Import new modular sections
import HeroSection from "@/components/pages/landing-page-v3/HeroSection";
import UnifiedAboutSection from "@/components/pages/landing-page-v3/UnifiedAboutSection";
import EducationExpertiseSection from "@/components/pages/landing-page-v3/EducationExpertiseSection";
import WhoIWorkWithSection from "@/components/pages/landing-page-v3/WhoIWorkWithSection";
import EmbodiedApproachSection from "@/components/pages/landing-page-v3/EmbodiedApproachSection";
import TestimonialsSection from "@/components/pages/landing-page-v3/TestimonialsSection";
import SessionsAvailabilitySection from "@/components/pages/landing-page-v3/SessionsAvailabilitySection";
import WhyWorkWithMeSection from "@/components/pages/landing-page-v3/WhyWorkWithMeSection";
import CallToActionSection from "@/components/pages/landing-page-v3/CallToActionSection";
import ResonanceProgramCard from "@/components/ResonanceProgramCard";
import DynamicImage from "@/components/DynamicImage";
import ImageCarouselSection from "@/components/pages/landing-page-v3/ImageCarouselSection";

const LandingPageV3: React.FC = () => {

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
        <WhoIWorkWithSection id="who-i-work-with" />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <TestimonialsSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <SessionsAvailabilitySection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <section className="max-w-6xl mx-auto text-center py-12 space-y-10">
          <SectionHeading>A Personal Glimpse</SectionHeading>
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
        <ImageCarouselSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
        <ResonanceProgramCard className="my-12" />
        {/* New call-out for Projects & Resources */}
        <div className="bg-brand-blue/10 dark:bg-brand-blue/20 p-8 rounded-xl shadow-lg text-center space-y-4 mt-12 max-w-6xl mx-auto">
          <p className="text-xl font-semibold text-brand-dark dark:text-brand-light">
            Explore all specialized services, digital products, and community initiatives.
          </p>
          <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/projects-resources">
              View All Projects & Resources
            </Link>
          </Button>
        </div>
        <Separator className="max-w-3xl mx-auto bg-brand-secondary mt-12" />
        <CallToActionSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV3;