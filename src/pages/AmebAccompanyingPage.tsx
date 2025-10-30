"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Piano, CalendarDays, MapPin } from 'lucide-react'; // Removed FileText
import DynamicImage from '@/components/DynamicImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';
import AmebBookingForm from '@/components/AmebBookingForm'; // Import the new booking form

const AmebAccompanyingPage: React.FC = () => {
  const pageTitle = "AMEB Accompanying Services";
  const subtitle = "Professional & Supportive Piano Accompaniment for Your Exams";

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main id="ameb-top" className="container mx-auto px-4 pt-12 pb-12"> {/* Added id="ameb-top" */}
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>{pageTitle}</SectionHeading>
          {subtitle && <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70">{subtitle}</p>}
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Hero Image Section */}
          <section className="relative mt-8 mb-8 rounded-xl overflow-hidden shadow-lg border-4 border-brand-secondary">
            <DynamicImage
              src="/danieleatkeyboard.jpeg"
              alt="Daniele Buatti playing keyboard"
              className="w-full h-96 md:h-[450px] object-cover object-[50%_70%]"
              width={800}
              height={533}
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>
          </section>

          {/* Overview */}
          <section className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6">
            <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              Support for AMEB students requiring a professional accompanist for both exam day and preparation rehearsals. All services are designed to ensure students feel calm, confident, and musically aligned with their accompanist on the day.
            </p>
          </section>

          {/* Exam Day Accompanying */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                <Piano className="h-7 w-7" />
                Exam Day Accompanying
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
              <p className="text-xl font-semibold">Rate: A$100 per exam</p>
              <p>
                I will arrive <strong className="text-brand-primary">15 minutes</strong> prior to your exam to ensure readiness and setup. Your exam repertoire will be fully prepared in advance, and all music will be rehearsed as discussed prior to the date.
              </p>
            </CardContent>
          </Card>

          {/* Rehearsals */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                <CalendarDays className="h-7 w-7" />
                Rehearsals
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
              <p>
                Rehearsals provide the opportunity to refine ensemble balance, tempo, and musical interpretation ahead of your AMEB exam. Sessions take place at my studio in Toorak, ideally within two weeks of the exam.
              </p>
              <h4 className="text-xl font-semibold text-brand-primary">Available durations and rates:</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>15 minutes – A$30</li>
                <li>30 minutes – A$50</li>
                <li>45 minutes – A$75</li>
              </ul>
              <h4 className="text-xl font-semibold text-brand-primary flex items-center gap-2">
                <MapPin className="h-6 w-6" /> Rehearsal Location:
              </h4>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li><strong>Studio:</strong> Toorak</li>
                <li><strong>Public Transport:</strong> Tram routes 16 and 58</li>
                <li><strong>Parking:</strong> Free parking on Glenferrie Road</li>
              </ul>
              <p className="text-lg font-semibold text-brand-primary mt-4">Booking Note:</p>
              <p>
                To ensure adequate preparation, please confirm all AMEB bookings and provide sheet music at least two weeks prior to the exam date.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section with Booking Form */}
          <section id="ameb-booking-form" className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6">
            <h3 className="text-3xl font-bold text-brand-primary text-center">Book Now / Inquire</h3>
            <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              Fill out the form below to book your AMEB accompanying services or to make an inquiry.
            </p>
            <AmebBookingForm />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AmebAccompanyingPage;