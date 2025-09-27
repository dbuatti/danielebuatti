"use client";

import React from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';
import { useAcuityEmbedScript } from '@/hooks/use-acuity-embed-script'; // New import

const HealingBookingPage: React.FC = () => {
  useAcuityEmbedScript(); // Use the new hook

  return (
    <BookingPageLayout pageTitle="Book Healing & Body-Voice Integration">
      <div className="max-w-7xl mx-auto">
        <iframe
          src="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:Healing%20%26%20Body-Voice%20Integration"
          width="100%"
          height="800"
          frameBorder="0"
          allow="payment"
          title="Healing & Body-Voice Integration Booking"
          className="rounded-lg"
        ></iframe>
      </div>
    </BookingPageLayout>
  );
};

export default HealingBookingPage;