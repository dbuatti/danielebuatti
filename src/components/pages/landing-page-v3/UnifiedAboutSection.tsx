import React from "react";
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import SectionHeading from "@/components/SectionHeading";
import { GraduationCap } from "lucide-react"; // Import GraduationCap icon

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
      </div>

      {/* Full Story and Education */}
      <div className="max-w-4xl mx-auto text-center space-y-8 pt-12">
        <DynamicImage
          src="/daniele simple.jpeg"
          alt="Daniele Buatti simple headshot"
          className="w-64 h-64 rounded-full object-cover mx-auto mb-8 shadow-lg border-4 border-brand-secondary"
          width={256}
          height={256}
        />
        <div className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-6 text-left px-4">
          <p>
            I am a versatile music theatre practitioner with extensive experience as a vocal coach, pianist, music director, and performer. With a career spanning over a decade, I have collaborated on a wide range of productions, from large-scale musicals to intimate workshops, including Paw Patrol Live, Beetlejuice, Heathers, A Chorus Line, Shrek, Legally Blonde, Mary Poppins, and Madiba the Musical at Melbourne’s Comedy Theatre.
          </p>
          <p>
            My approach blends technical expertise with a deep understanding of embodiment, performance psychology, and improvisation, helping performers find freedom, resonance, and authenticity in their voice. I am also known for my innovative work in educational and charitable theatre programs, mentoring emerging artists and facilitating workshops that integrate movement, sound, and emotional awareness.
          </p>
          <p>
            As a pianist and music director, I bring a nuanced, collaborative energy to every production, tailoring musical direction to support both performers and the narrative. My teaching and coaching practice focuses on helping artists unlock their potential, manage performance stress, and develop a sustainable, expressive relationship with their craft.
          </p>
          <p>
            Passionate about the transformative power of music and theatre, I continue to inspire performers of all ages and levels, combining artistry, empathy, and technical skill to create performances that are both compelling and heartfelt.
          </p>

          {/* Education & Certifications - Integrated as narrative */}
          <div className="pt-8 space-y-4">
            <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary justify-center md:justify-start">
              <GraduationCap className="h-7 w-7" />
              My Education & Certifications
            </h3>
            <p>
              I completed a Bachelor of Music at the Australian Institute of Music (2014-2016), where I focused on Arranging, Composition, Orchestration, and Piano. Furthering my commitment to holistic development, I also earned a Diploma of Kinesiology, specialising in mind-body integration for performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedAboutSection;