"use client";

import React, { useEffect } from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';

const VoicePianoBookingPage: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.acuityscheduling.com/js/embed.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <BookingPageLayout pageTitle="Book Voice & Piano Sessions">
      <div className="max-w-7xl mx-auto"> {/* Changed to max-w-7xl and removed extra styling */}
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