"use client";

import React from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';
import AcuityEmbed from '@/components/AcuityEmbed'; // Updated import

const HealingBookingPage: React.FC = () => {
  return (
    <BookingPageLayout pageTitle="Book Healing & Body-Voice Integration">
      <div className="max-w-7xl mx-auto">
        <AcuityEmbed
          src="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:Healing%20%2B%20Body-Voice%20Integration"
          title="Healing & Body-Voice Integration Booking"
        />
      </div>
    </BookingPageLayout>
  );
};

export default HealingBookingPage;