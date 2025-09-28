"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer'; // Import Footer

interface BookingPageLayoutProps {
  children: React.ReactNode;
  pageTitle: string; // Added pageTitle prop
}

const BookingPageLayout: React.FC<BookingPageLayoutProps> = ({ children, pageTitle }) => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      {/* Header */}
      <header className="bg-brand-dark py-4 px-6 md:px-12 shadow-md"> {/* Adjusted py-4 for more vertical space */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-brand-light hover:bg-brand-primary hover:text-brand-light">
            <Link to="/">
              <span className="flex items-center"> {/* Added flex for icon-text alignment */}
                <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
              </span>
            </Link>
          </Button>
          <div className="flex items-center gap-4"> {/* Used gap-4 for spacing */}
            <h1 className="text-2xl md:text-3xl font-bold text-brand-light">{pageTitle}</h1> {/* Display pageTitle */}
            <DynamicImage src="/logo-pinkwhite.png" alt="Daniele Buatti Logo" className="h-10 w-auto" width={220} height={40} /> {/* Reduced logo height to h-10 */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-12 pb-12"> {/* Adjusted pt-12 for more space from header */}
        {children}
      </main>

      {/* Footer - Reusing the existing Footer component */}
      <Footer />
    </div>
  );
};

export default BookingPageLayout;