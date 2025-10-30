import React from "react";
import SectionHeading from "@/components/SectionHeading";
import PhilosophyStatement from "@/components/PhilosophyStatement";
import { Link } from "react-router-dom"; // Import Link
import { Button } from "@/components/ui/button"; // Import Button

const EmbodiedApproachSection: React.FC = () => {
  return (
    <section id="approach" className="max-w-7xl mx-auto space-y-10 py-12">
      <SectionHeading>My Embodied Holistic Approach</SectionHeading>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
        All my teachings are informed by Buddhist and yogic philosophies, fostering a heart-centred, process-oriented journey focused on truth and transformation, not just the destination.
      </p>
      
      <PhilosophyStatement className="max-w-4xl mx-auto my-10" />

      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
        My unique approach integrates embodiment, mindset, and skill development to help you achieve authentic, confident expression without strain or burnout. I guide you to connect body, breath, and voice, fostering a deeper understanding of your own expressive patterns.
      </p>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
        Ready to dive deeper into how this approach can transform your performance and communication?
      </p>
      <div className="text-center">
        <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <Link to="/coaching#embodied-approach">
            Explore My Full Approach
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default EmbodiedApproachSection;