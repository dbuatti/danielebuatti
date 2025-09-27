import React from "react";
import DynamicImage from "@/components/DynamicImage";

const TulipsSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto text-center py-8 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-xl shadow-lg">
      <DynamicImage
        src="/tulips.jpeg"
        alt="Daniele Buatti smiling with tulips in a garden"
        className="w-full max-w-2xl h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-primary mx-auto transform scale-105 hover:scale-100 transition-transform duration-500"
        width={800}
        height={533}
      />
      <p className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-4">
        Daniele Buatti enjoying a moment in a garden with tulips.
      </p>
    </section>
  );
};

export default TulipsSection;