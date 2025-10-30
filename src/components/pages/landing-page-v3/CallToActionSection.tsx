import React from "react";
import ContactForm from "@/components/ContactForm"; // Keep import for now, but it won't be rendered
import SectionHeading from "@/components/SectionHeading";

const CallToActionSection: React.FC = () => {
  // Removed handleBookOnlineClick as the button is being replaced by the form

  return (
    <section id="contact" className="text-center max-w-7xl mx-auto space-y-8 py-12 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-xl shadow-lg">
      <SectionHeading>Ready to Transform Your Artistry & Presence?</SectionHeading>
      <p className="text-xl text-brand-dark/80 dark:text-brand-light/80 max-w-3xl mx-auto">
        Let’s chat about your goals and find the best coaching path for you. Take the first step towards unlocking your full potential. Your journey to embodied performance starts here.
      </p>
      {/* The ContactForm is now rendered directly here */}
      <ContactForm />
      {/* The main ContactForm is now removed from this section. 
          A newsletter signup is available in the footer, and direct contact info is also there. */}
    </section>
  );
};

export default CallToActionSection;