"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator'; // Import Separator

interface BookingPageLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  subtitle?: string; // Added subtitle prop
}

const BookingPageLayout: React.FC<BookingPageLayoutProps> = ({ children, pageTitle, subtitle }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      {/* Header */}
      <header className="sticky top-0 bg-brand-dark py-4 px-6 md:px-12 shadow-md z-[999]"> {/* Changed relative to sticky top-0 and z-50 to z-[999] */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-brand-light hover:bg-brand-primary hover:text-brand-light">
            <Link to="/">
              <span className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
              </span>
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <DynamicImage src="/logo-pinkwhite.png" alt="Daniele Buatti Logo" className="h-10 w-auto" width={220} height={40} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-bold text-brand-primary">{pageTitle}</h1>
          {subtitle && <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70">{subtitle}</p>}
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookingPageLayout;