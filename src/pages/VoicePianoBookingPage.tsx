"use client";

import React from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';
import AcuityEmbed from '@/components/AcuityEmbed'; // Updated import

const VoicePianoBookingPage: React.FC = () => {
  return (
    <BookingPageLayout pageTitle="Book Voice & Piano Sessions">
      <div className="max-w-7xl mx-auto">
        <AcuityEmbed
          src="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:Voice%20%2B%20Piano"
          title="Voice & Piano Booking"
        />
      </div>
    </BookingPageLayout>
  );
};

export default VoicePianoBookingPage;