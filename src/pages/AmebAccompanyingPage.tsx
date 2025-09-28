"use client";

import React, { useEffect } from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Piano, FileText, CalendarDays, Download } from 'lucide-react'; // Added Download icon
import DynamicImage from '@/components/DynamicImage'; // Import DynamicImage
import SectionHeading from '@/components/SectionHeading'; // Import SectionHeading

const AmebAccompanyingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pdfLink = "https://file.notion.so/f/f/8d90b4b2-f024-421e-b020-5d3e63481a43/17cf3257-f164-4512-a83a-c821cd02331f/_AMEB_Accompanying_Services_(1).pdf?table=block&id=1e6aad21-cd09-80a4-92d1-cccae46378c&spaceId=8d90b4b2-f024-421e-b020-5d3e63481a43&expirationTimestamp=1759046400000&signature=_0-ZXF1yZ6Z9HvBvPD_A9ctdpUtZZeFs7JizMuTMenc&downloadName=%F0%9F%8E%B9+AMEB+Accompanying+Services+%281%29.pdf";

  return (
    <BookingPageLayout pageTitle="AMEB Accompanying Services">
      <div className="max-w-4xl mx-auto space-y-10">
        <SectionHeading className="mb-4">
          AMEB Accompanying Services
        </SectionHeading>
        <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70 text-center mt-2">
          Professional & Supportive Piano Accompaniment for Your Exams
        </p>

        {/* Hero Image Section */}
        <section className="relative mt-8 mb-8 rounded-xl overflow-hidden shadow-lg border-4 border-brand-secondary">
          <DynamicImage
            src="/danieleatkeyboard.jpeg"
            alt="Daniele Buatti playing keyboard"
            className="w-full h-96 md:h-[450px] object-cover object-center"
            width={800}
            height={533}
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>
        </section>

        <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
          As a dedicated accompanist, I offer my services for AMEB exams, providing a professional and supportive environment for your exam. I offer a supportive attitude whilst ensuring the student feels grounded and supported when taking their exam.
        </p>

        {/* Download PDF Button */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <a href={pdfLink} target="_blank" rel="noopener noreferrer" download>
              <Download className="h-5 w-5 mr-2" /> Download Service Details (PDF)
            </a>
          </Button>
        </div>

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
            <ul className="list-disc list-inside space-y-2">
              <li>I will arrive <strong className="text-brand-primary">15 minutes</strong> before the exam start time to warm up with the student, ensuring they feel comfortable and ready.</li>
              <li>The <strong className="text-brand-primary">exam music</strong> will be prepared, and I’ll accompany the student throughout their performance.</li>
            </ul>
          </CardContent>
        </Card>

        {/* What I Need From You */}
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
              <FileText className="h-7 w-7" />
              What do I need from you?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            <p>All sheet music sent as a PDF.</p>
          </CardContent>
        </Card>

        {/* Rehearsals */}
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
              <CalendarDays className="h-7 w-7" />
              Rehearsals (Separate from Exam Day)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
            <p className="text-xl font-semibold">Rate: My standard coaching rates apply for rehearsals.</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-brand-primary">30 minutes</strong>: A$50</li>
              <li><strong className="text-brand-primary">45 minutes</strong>: A$75</li>
              <li><strong className="text-brand-primary">1 hour</strong>: A$95</li>
            </ul>
            <p>Rehearsals can be booked at my location at <strong className="text-brand-primary">685 Toorak Road, Toorak</strong>.</p>
            <Button asChild size="lg" className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
                Book Rehearsal Online
              </a>
            </Button>
          </CardContent>
        </Card>

        <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mt-8">
          If you would like to discuss rehearsal times or have any other questions, feel free to reach out via the contact form on the <Link to="/" className="text-brand-primary hover:underline">home page</Link>.
        </p>
      </div>
    </BookingPageLayout>
  );
};

export default AmebAccompanyingPage;