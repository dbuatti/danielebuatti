import React from "react";
import DynamicImage from "@/components/DynamicImage";
import SectionHeading from "@/components/SectionHeading";

const UnifiedAboutSection: React.FC = () => {
  return (
    <section id="about" className="max-w-7xl mx-auto py-12 space-y-10"> {/* Adjusted spacing */}
      <SectionHeading>About Me</SectionHeading>

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
        <div className="text-center md:text-left space-y-6"> {/* Adjusted spacing */}
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            I help performers and communicators connect body, breath, and voice so they can express themselves with freedom, authenticity, and ease. My work is about discovering a voice that feels grounded, resonant, and spacious — one that grows out of the whole body rather than being forced or strained.
          </p>
          <p className="text-xl font-semibold text-brand-primary">THOUGHT • INTENTION • BREATH • EXPRESSION</p>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            With over 12 years of experience as a Music Director, Pianist, Arranger, Vocal Coach, and Educator, I bring together professional music theatre expertise, vocal pedagogy, and somatic practices influenced by kinesiology and yoga. This integrated approach forms the foundation for my unique, embodied coaching.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UnifiedAboutSection;