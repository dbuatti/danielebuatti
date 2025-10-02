import React from "react";
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import SectionHeading from "@/components/SectionHeading";
// Removed GraduationCap as it's moving with the education section

const UnifiedAboutSection: React.FC = () => {
  return (
    <section id="about" className="max-w-7xl mx-auto py-12 space-y-12">
      <SectionHeading>About Me</SectionHeading>

      {/* Initial Bio and Philosophy */}
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative flex justify-center md:justify-start">
          <DynamicImage
            src="/pinkcarpet.jpg"
            alt="Daniele Buatti professional headshot on pink carpet"
            className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-secondary transform -rotate-3 hover:rotate-0 transition-transform duration-500"
            width={400}
            height={500}
          />
          <div className="absolute -top-10 -right-10 bg-brand-primary/20 dark:bg-brand-primary/30 p-6 rounded-xl shadow-lg hidden md:block transform rotate-3">
            <p className="text-sm text-brand-dark dark:text-brand-light italic">"My therapeutic approach fosters authentic connection."</p>
          </div>
        </div>
        <div className="text-center md:text-left space-y-8">
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            I help performers and communicators connect body, breath, and voice, so they can express themselves with freedom, authenticity, and ease. Discover a voice that feels free, grounded, and authentic, and learn to connect breath, body, and sound for confident, impactful performances. My holistic approach integrates world-class musical training with deep body awareness and a powerful mindset, helping you achieve more without strain, stress, or burnout.
          </p>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-brand-primary">THOUGHT • INTENTION • BREATH • EXPRESSION</p>
            <p className="text-md text-brand-dark/70 dark:text-brand-light/70">
              I believe true expression arises when the thought to express is fully embodied. My therapeutic approach guides students to not only inform the characters they portray but also to gain a deeper understanding of their own mannerisms, expressions, and thoughts, fostering authentic connection and healing through self-awareness.
            </p>
          </div>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            With over 12 years of experience as a Music Director, Pianist, Arranger, Vocal Coach, and Educator, my background spans professional music theatre, vocal pedagogy, tertiary education, and holistic somatic practices. This extensive track record forms the foundation for my unique, high-quality, and embodied coaching, training versatile, industry-ready performers and communicators.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UnifiedAboutSection;