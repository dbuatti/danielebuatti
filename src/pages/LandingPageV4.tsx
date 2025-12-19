// pages/LandingPage.tsx  (or Home.tsx, Index.tsx – whatever your route is)

"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import DynamicImage from "@/components/DynamicImage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
// Keep only truly reusable small components (Navbar, Footer, etc.)
// Everything else goes inline below

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-32">
        {/* 1. Hero */}
        <section>{/* hero content */}</section>

        {/* 2. Expertise */}
        <section>{/* three pillars grid */}</section>

        {/* 3. Approach */}
        <section>{/* text + image */}</section>

        {/* 4. Who I Work With */}
        <section>{/* four cards */}</section>

        {/* 5. About Me */}
        <section>{/* photo + short bio */}</section>

        {/* 6. Testimonials */}
        <section>{/* carousel or grid */}</section>

        {/* 7. Other Work */}
        <section>{/* AdditionalProgramsSection cards inline or as small sub-components if you want */}</section>

        {/* 8. Contact */}
        <section>{/* form or CTA */}</section>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPage;