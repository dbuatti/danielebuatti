import React from "react";
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import SectionHeading from "@/components/SectionHeading";

const AboutMeSection: React.FC = () => {
  return (
    <section id="about" className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto py-16">
      <div className="relative flex justify-center md:justify-start">
        <DynamicImage
          src="/pinkcarpet.jpg"
          alt="Daniele Buatti professional headshot on pink carpet"
          className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-secondary transform -rotate-3 hover:rotate-0 transition-transform duration-500"
          width={400}
          height={500}
        />
        <div className="absolute -top-10 -right-10 bg-brand-primary/20 dark:bg-brand-primary/30 p-6 rounded-xl shadow-lg hidden md:block transform rotate-3">
          <p className="text-sm text-brand-light italic">"My therapeutic approach fosters authentic connection."</p>
        </div>
      </div>
      <div className="text-center md:text-left space-y-8">
        <SectionHeading className="md:text-left">About Daniele Buatti</SectionHeading>
        <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
          For over 12 years, I've been a Music Director, Pianist, Arranger, Vocal Coach, and Educator. I offer a unique blend of artistic leadership and evidence-based methods, training versatile, industry-ready performers and communicators. My experience spans professional music theatre, vocal pedagogy, tertiary education, and holistic somatic practices. My focus is on high-quality, embodied coaching and innovative performance curricula, helping artists express themselves through a holistic approach that connects breath, body, and mind for truly embodied performance.
        </p>
        <div className="space-y-2">
          <p className="text-xl font-semibold text-brand-primary">THOUGHT • INTENTION • BREATH • EXPRESSION</p>
          <p className="text-md text-brand-dark/70 dark:text-brand-light/70">
            I believe expression truly happens when the thought arises to express. My therapeutic approach helps students not only inform the characters they portray but also gain a deeper understanding of their own mannerisms, expressions, and thoughts, fostering authentic connection.
          </p>
        </div>
        <Button size="lg" className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <a href="https://rxresu.me/daniele.buatti/daniele-buatti-md" target="_blank" rel="noopener noreferrer">
            View CV
          </a>
        </Button>
      </div>
    </section>
  );
};

export default AboutMeSection;