import React from "react";
import SectionHeading from "@/components/SectionHeading";
import DynamicImage from "@/components/DynamicImage"; // Import DynamicImage

const FullBioSection: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto text-center space-y-8 py-16">
      <SectionHeading>Daniele Buatti: Full Biography</SectionHeading>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed text-left">
        <DynamicImage
          src="/daniele simple.jpeg"
          alt="Daniele Buatti simple headshot"
          className="w-40 h-40 rounded-full object-cover flex-shrink-0 shadow-lg border-4 border-brand-secondary"
          width={160} // Explicit width for DynamicImage
          height={160} // Explicit height for DynamicImage
        />
        <div className="space-y-6">
          <p>
            Daniele Buatti is a versatile music theatre practitioner with extensive experience as a vocal coach, pianist, music director, and performer. With a career spanning over a decade, Daniele has collaborated on a wide range of productions, from large-scale musicals to intimate workshops, including Paw Patrol Live, Beetlejuice, Heathers, A Chorus Line, Shrek, Legally Blonde, Mary Poppins, and Madiba the Musical at Melbourne’s Comedy Theatre.
          </p>
          <p>
            Daniele’s approach blends technical expertise with a deep understanding of embodiment, performance psychology, and improvisation, helping performers find freedom, resonance, and authenticity in their voice. They are also known for their innovative work in educational and charitable theatre programs, mentoring emerging artists and facilitating workshops that integrate movement, sound, and emotional awareness.
          </p>
          <p>
            As a pianist and music director, Daniele brings a nuanced, collaborative energy to every production, tailoring musical direction to support both performers and the narrative. Their teaching and coaching practice focuses on helping artists unlock their potential, manage performance stress, and develop a sustainable, expressive relationship with their craft.
          </p>
          <p>
            Passionate about the transformative power of music and theatre, Daniele continues to inspire performers of all ages and levels, combining artistry, empathy, and technical skill to create performances that are both compelling and heartfelt.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FullBioSection;