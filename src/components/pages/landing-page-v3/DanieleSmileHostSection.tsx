import React from "react";
import DynamicImage from "@/components/DynamicImage";

const DanieleSmileHostSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto text-center py-12 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-xl shadow-lg">
      <DynamicImage
        src="/daniele-smile-host-bu.jpeg"
        alt="Daniele Buatti smiling and interacting with a host at Broadway Unplugged"
        className="w-full max-w-2xl h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-primary mx-auto transform -rotate-2 hover:rotate-0 transition-transform duration-500"
        width={800}
        height={533}
      />
      <p className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-4">
        Daniele Buatti interacting with a host at Broadway Unplugged.
      </p>
    </section>
  );
};

export default DanieleSmileHostSection;