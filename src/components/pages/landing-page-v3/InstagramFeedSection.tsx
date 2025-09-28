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
            src="//lightwidget.com/widgets/e214f05b7fd45da9924dbf95ff0f259d.html"
            scrolling="no"
            allowTransparency={true}
            className="lightwidget-widget"
            style={{ width: '100%', border: 0, overflow: 'hidden', height: '500px' }} // Added a default height
            title="Instagram Feed"
          ></iframe>
        </div>
        <p className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-4">
          Follow @lightwidget on Instagram for a chance to win a free upgrade for your widget!
        </p>
      </div>
    </section>
  );
};

export default InstagramFeedSection;