import React from "react";
import SectionHeading from "@/components/SectionHeading";

const InstagramFeedSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto text-center space-y-10 py-12">
      <SectionHeading>My Latest on Instagram</SectionHeading>
      <div className="bg-brand-light dark:bg-brand-dark p-8 rounded-xl shadow-lg border border-brand-secondary text-brand-dark dark:text-brand-light">
        <p className="text-lg mb-4">
          To display your Instagram feed here, you'll need to use a third-party service that provides an embeddable widget.
          Due to Instagram's API restrictions, directly fetching and displaying your feed without a backend or specific API setup is not straightforward.
        </p>
        <p className="mb-4">
          Popular services like <a href="https://lightwidget.com/" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">LightWidget</a> or <a href="https://snapwidget.com/" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">SnapWidget</a> can generate a simple HTML snippet (usually an `&lt;iframe&gt;` or `&lt;script&gt;` tag) that you can paste directly below this message.
        </p>
        <p className="font-semibold">
          Once you have your embed code, replace this placeholder text with it.
        </p>
        {/* Placeholder for the Instagram embed code */}
        <div className="mt-8 p-4 border-2 border-dashed border-brand-secondary rounded-md text-brand-dark/70 dark:text-brand-light/70 italic">
          &lt;!-- Paste your Instagram embed code here --&gt;
        </div>
      </div>
    </section>
  );
};

export default InstagramFeedSection;