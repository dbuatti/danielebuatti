import React from "react";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const WhyWorkWithMeSection: React.FC = () => {
  return (
    <section id="why-me" className="max-w-6xl mx-auto text-center space-y-10 py-12">
      <SectionHeading>Why Work With Me?</SectionHeading>
      <ul className="grid md:grid-cols-2 gap-6 text-left text-lg text-brand-dark/80 dark:text-brand-light/80">
        <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
          <div>
            <strong className="text-brand-primary">Holistic Expertise:</strong> Voice, piano, public speaking, acting, on-camera, performance coaching, kinesiology, mindset.
          </div>
        </li>
        <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
          <div>
            <strong className="text-brand-primary">Embodiment-Based:</strong> Build strength and skill without tension or burnout, rooted in Kinesiology, Yoga, and Somatic Therapy.
          </div>
        </li>
        <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
          <div>
            <strong className="text-brand-primary">Results-Oriented:</strong> Clients leave feeling more confident, expressive, and capable across all performance and communication domains.
          </div>
        </li>
        <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
          <div>
            <strong className="text-brand-primary">Creative Freedom:</strong> Integrates technique with improvisation, artistry, and authentic self-expression for any medium.
          </div>
        </li>
      </ul>
    </section>
  );
};

export default WhyWorkWithMeSection;