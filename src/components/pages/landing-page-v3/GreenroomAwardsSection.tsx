import React from "react";
import DynamicImage from "@/components/DynamicImage";

const GreenroomAwardsSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto text-center py-12 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-xl shadow-lg">
      <DynamicImage
        src="/greenroom.jpeg"
        alt="Daniele Buatti at the Greenroom Awards"
        className="w-full max-w-xl h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-primary mx-auto transform scale-105 hover:scale-100 transition-transform duration-500"
        width={600}
        height={800}
      />
      <p className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-4">
        Daniele Buatti, part of the Greenroom Award Music Theatre panel.
      </p>
    </section>
  );
};

export default GreenroomAwardsSection;