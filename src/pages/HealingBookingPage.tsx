"use client";

import React from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';
import AcuityEmbed from '@/components/AcuityEmbed'; // Updated import

const HealingBookingPage: React.FC = () => {
  return (
    <BookingPageLayout pageTitle="Book Healing & Body-Voice Integration">
      <div className="max-w-7xl mx-auto">
        <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mb-8">
          These sessions are designed to restore balance, ease stress and tension, and release unhelpful patterns, fostering a profound connection between your inner self and your expressive voice. By addressing the root causes of physical and emotional blocks, we unlock greater freedom and authenticity in all forms of communication and performance.
        </p>
        <AcuityEmbed
          src="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:Healing%20%2B%20Body-Voice%20Integration"
          title="Healing & Body-Voice Integration Booking"
        />
      </div>
    </BookingPageLayout>
  );
};

export default HealingBookingPage;