"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import AdditionalProgramsSection from "@/components/pages/landing-page-v3/AdditionalProgramsSection";

const ProjectsResourcesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Page Header */}
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-light mb-6">Projects & Resources</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            A look at my other work — live performance, music products, acfsafsafcompaniment, and community projects.
          </p>
        </header>

        {/* Main Content */}
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