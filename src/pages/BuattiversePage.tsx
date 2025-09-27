"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import GumroadFollowForm from "@/components/GumroadFollowForm";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BackToTopButton from "@/components/BackToTopButton";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

const BuattiversePage: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 py-16 space-y-16">
        <section className="max-w-6xl mx-auto text-center space-y-10 py-16">
          <SectionHeading className="flex items-center justify-center gap-3">
            <Music className="h-8 w-8" />
            Explore Buattiverse: Sheet Music & Backing Tracks
          </SectionHeading>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
            Welcome to Buattiverse — your curated source for professional vocal transcriptions, SATB arrangements, and essential music resources tailored for performers, educators, and creatives. Whether you're looking for detailed backing vocal arrangements or resources to bring your ensemble to life, you're in the right place to elevate your musical projects.
          </p>
          <GumroadFollowForm />
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="https://buattiverse.gumroad.com/" target="_blank" rel="noopener noreferrer">
                Visit Buattiverse Store
              </a>
            </Button>
          </div>
          <p className="text-md text-brand-dark/70 dark:text-brand-light/70 mt-4">
            Have a custom request or question? Get in touch: <a href="mailto:info@danielebuatti.com" className="underline hover:text-brand-primary">info@danielebuatti.com</a>
          </p>
        </section>
        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default BuattiversePage;