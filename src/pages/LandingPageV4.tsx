"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import SeoMetadata from "@/components/SeoMetadata";

const LandingPageV4: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <SeoStructuredData />
      <SeoMetadata 
        title="Landing Page V4 - New Design"
        description="A new landing page template for Daniele Buatti's services."
        url={`${window.location.origin}/landing-v4`}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20 min-h-[60vh] text-center">
        <h1 className="text-4xl font-bold text-brand-primary">Heljhhjkhjklo</h1>
        <p className="mt-4 text-lg text-brand-dark/80 dark:text-brand-light/80">
          This is an empty template ready for new content.
        </p>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPageV4;