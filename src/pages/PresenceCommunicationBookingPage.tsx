"use client";

import React from 'react';
import AcuityEmbed from '@/components/AcuityEmbed';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';

const PresenceCommunicationBookingPage: React.FC = () => {
  // Removed useEffect for scrolling, as ScrollToTop component now handles all scroll logic.

  const pageTitle = "Book Presence & Communication Sessions";
  const subtitle = "Master Your Stage, Screen, and Public Speaking Presence";

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
            These sessions are designed to help you cultivate confident, impactful communication and authentic stage presence. Whether you're preparing for public speaking, on-camera performance, or virtual presentations, we'll refine your delivery, manage nerves, and ensure your message resonates with your audience.
          </p>
          <AcuityEmbed
            src="https://app.acuityscheduling.com/schedule.php?owner=22925011" // General Acuity link for now
            title="Presence & Communication Booking"
          />
          <p className="text-sm text-center text-brand-dark/60 dark:text-brand-light/60 mt-4">
            *Please select the appropriate session type (e.g., "Public Speaking," "On-Camera Coaching") from the options above. If a specific category for "Presence & Communication" is created in Acuity, this link can be updated to target it directly.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PresenceCommunicationBookingPage;