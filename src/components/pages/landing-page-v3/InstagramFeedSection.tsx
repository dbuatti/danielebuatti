import React from "react";
import SectionHeading from "@/components/SectionHeading";

const InstagramFeedSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto text-center space-y-10 py-12">
      <SectionHeading>My Latest on Instagram</SectionHeading>
      <div className="bg-brand-light dark:bg-brand-dark p-8 rounded-xl shadow-lg border border-brand-secondary text-brand-dark dark:text-brand-light">
        {/* LightWidget Instagram embed code */}
        <div className="w-full h-auto">
          <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
          <iframe
            src="https://cdn.lightwidget.com/widgets/ef00b287060550de8b982e15a8e4f15a.html"
            scrolling="no"
            allowTransparency={true}
            className="lightwidget-widget"
            style={{ width: '100%', border: 0, overflow: 'hidden' }}
            title="Instagram Feed"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeedSection;