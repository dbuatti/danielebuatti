"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import { Separator } from "@/components/ui/separator";
import AdditionalProgramBanner from "@/components/AdditionalProgramBanner";
import BackToTopButton from "@/components/BackToTopButton";

const ArchivePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>Archived Content</SectionHeading>
          <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70 max-w-3xl mx-auto">
            This page contains content that is currently not featured on the main site but may be brought back in the future.
          </p>
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>

        <section className="py-12 space-y-12">
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
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ArchivePage;