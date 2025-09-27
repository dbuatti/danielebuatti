"use client";

import React from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';
import { useAcuityEmbedScript } from '@/hooks/use-acuity-embed-script'; // New import

const VoicePianoBookingPage: React.FC = () => {
  useAcuityEmbedScript(); // Use the new hook

  return (
    <BookingPageLayout pageTitle="Book Voice & Piano Sessions">
      <div className="max-w-7xl mx-auto">
        <iframe
          src="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:Voice%20%2B%20Piano"
          width="100%"
          height="800"
          frameBorder="0"
          allow="payment"
          title="Voice & Piano Booking"
          className="rounded-lg"
        ></iframe>
      </div>
    </BookingPageLayout>
  );
};

export default VoicePianoBookingPage;