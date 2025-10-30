"use client";

import React from "react";
import DynamicImage from "@/components/DynamicImage";
import SectionHeading from "@/components/SectionHeading";
import PhilosophyStatement from "@/components/PhilosophyStatement"; // Import PhilosophyStatement
import { Button } from "@/components/ui/button"; // Import Button
import { Link } from "react-router-dom"; // Import Link

const EmbodiedApproachOverviewSection: React.FC = () => {
  return (
    <section id="about" className="max-w-7xl mx-auto py-12 space-y-10">
      <SectionHeading>My Embodied Holistic Approach</SectionHeading>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative flex justify-center md:justify-start">
          <DynamicImage
            src="/pinkcarpet.jpg"
            alt="Daniele Buatti professional headshot on pink carpet"
            className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-secondary transform -rotate-3 hover:rotate-0 transition-transform duration-500"
            width={400}
            height={500}
          />
        </div>
        <div className="text-center md:text-left space-y-6">
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            I help performers and communicators connect body, breath, and voice so they can express themselves with freedom, authenticity, and ease. My work is about discovering a voice that feels grounded, resonant, and spacious — one that grows out of the whole body rather than being forced or strained.
          </p>
          <p className="text-xl font-semibold text-brand-primary">THOUGHT • INTENTION • BREATH • EXPRESSION</p>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            With over 12 years of experience as a Music Director, Pianist, Arranger, Vocal Coach, and Educator, I bring together professional music theatre expertise, vocal pedagogy, and somatic practices influenced by kinesiology and yoga. This integrated approach forms the foundation for my unique, embodied coaching.
          </p>
          
          {/* PhilosophyStatement integrated directly into the text column */}
          <PhilosophyStatement className="my-10 max-w-full mx-auto" /> {/* Adjusted width for better fit */}

          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            All my teachings are informed by Buddhist and yogic philosophies, fostering a heart-centred, process-oriented journey focused on truth and transformation, not just the destination.
          </p>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            My unique approach integrates embodiment, mindset, and skill development to help you achieve authentic, confident expression without strain or burnout. I guide you to connect body, breath, and voice, fostering a deeper understanding of your own expressive patterns.
          </p>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            Ready to dive deeper into how this approach can transform your performance and communication?
          </p>
          <div className="text-center md:text-left">
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/coaching#embodied-approach">
                Explore My Full Approach
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmbodiedApproachOverviewSection;