"use client";

import React from 'react';
import AcuityEmbed from '@/components/AcuityEmbed';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';

const VoicePianoBookingPage: React.FC = () => {
  // Removed useEffect for scrolling, as ScrollToTop component now handles all scroll logic.

  const pageTitle = "Book Performance & Musicianship Sessions"; // Changed from "Book Voice & Piano Sessions"
  const subtitle = "Unlock Your Full Vocal & Musical Potential";

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
          <AcuityEmbed
            src="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:Voice%20%2B%20Piano" // Keeping original Acuity category name for now
            title="Performance & Musicianship Booking" // Changed from "Voice & Piano Booking"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VoicePianoBookingPage;