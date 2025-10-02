"use client";

import React, { useEffect } from 'react';
import AcuityEmbed from '@/components/AcuityEmbed';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';

const EmbodimentSomaticBookingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageTitle = "Book Embodiment & Somatic Work Sessions";
  const subtitle = "Restore Balance, Ease Tension, and Unlock Authentic Expression";

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>{pageTitle}</SectionHeading>
          {subtitle && <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70">{subtitle}</p>}
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mb-8">
            These sessions are designed to restore balance, ease stress and tension, and release unhelpful patterns, fostering a profound connection between your inner self and your expressive voice. By addressing the root causes of physical and emotional blocks, we unlock greater freedom and authenticity in all forms of communication and performance.
          </p>
          <AcuityEmbed
            src="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:Healing%20%2B%20Body-Voice%20Integration" // Keep original Acuity category for now, user can update if Acuity category name changes
            title="Embodiment & Somatic Work Booking"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmbodimentSomaticBookingPage;