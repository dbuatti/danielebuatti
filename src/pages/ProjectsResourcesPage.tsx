"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import AdditionalProgramsSection from '@/components/pages/landing-page-v3/AdditionalProgramsSection';
import BackToTopButton from '@/components/BackToTopButton';
// Removed unused imports: Card, CardContent, DynamicImage, Button, Link

const ProjectsResourcesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-6">
          <SectionHeading>My Projects & Resources</SectionHeading>
          <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70 max-w-3xl mx-auto">
            Explore my diverse range of musical and educational ventures, from specialized services and products to community initiatives.
          </p>
          {/* Removed redundant Separator here */}
        </div>

        <section>
          <AdditionalProgramsSection />
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ProjectsResourcesPage;