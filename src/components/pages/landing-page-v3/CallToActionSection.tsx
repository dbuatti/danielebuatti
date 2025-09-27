import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";

const CallToActionSection: React.FC = () => {
  return (
    <section id="contact" className="text-center max-w-7xl mx-auto space-y-8 py-12 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-xl shadow-lg"> {/* Changed from py-16 to py-12 */}
      <SectionHeading>Ready to Transform Your Artistry & Presence?</SectionHeading>
      <p className="text-xl text-brand-dark/80 dark:text-brand-light/80 max-w-3xl mx-auto">
        Let’s chat about your goals and find the best coaching path for you. Take the first step towards unlocking your full potential. Your journey to embodied performance starts here.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <a href="https://danielebuatti.as.me" target="_blank" rel="noopener noreferrer">
            Book Online
          </a>
        </Button>
      </div>
      <div className="mt-8 p-8 bg-brand-light dark:bg-brand-dark rounded-xl shadow-lg max-w-lg mx-auto border border-brand-secondary">
        <ContactForm />
      </div>
      {/* Removed the duplicate contact information here */}
    </section>
  );
};

export default CallToActionSection;