import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";

const CallToActionSection: React.FC = () => {
  return (
    <section id="contact" className="text-center max-w-7xl mx-auto space-y-8 py-16 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-xl shadow-lg">
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
      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 text-brand-dark/80 dark:text-brand-light/80">
        <a href="mailto:info@danielebuatti.com" className="flex items-center gap-2 hover:text-brand-primary transition-colors text-lg">
          <Mail className="h-6 w-6" /> info@danielebuatti.com
        </a>
        <a href="https://wa.me/61424174067" className="flex items-center gap-2 hover:text-brand-primary transition-colors text-lg">
          <Phone className="h-6 w-6" /> +61 424 174 067
        </a>
      </div>
    </section>
  );
};

export default CallToActionSection;