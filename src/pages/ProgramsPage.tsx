"use client";

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';
import AdditionalProgramsSection from '@/components/pages/landing-page-v3/AdditionalProgramsSection';
import BackToTopButton from '@/components/BackToTopButton';

const ProgramsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>My Programs & Projects</SectionHeading>
          <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70 max-w-3xl mx-auto">
            Explore my diverse range of musical and educational ventures, from sheet music and backing tracks to community choirs and live performances.
          </p>
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>
        <AdditionalProgramsSection />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ProgramsPage;