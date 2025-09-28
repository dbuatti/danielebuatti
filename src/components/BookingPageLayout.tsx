"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer'; // Import Footer

interface BookingPageLayoutProps {
  children: React.ReactNode;
}

const BookingPageLayout: React.FC<BookingPageLayoutProps> = ({ children }) => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      {/* Header */}
      <header className="bg-brand-dark py-4 px-6 md:px-12 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-brand-light hover:bg-brand-primary hover:text-brand-light"> {/* Updated hover styles */}
            <Link to="/">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
            </Link>
          </Button>
          <div className="flex items-center">
            <DynamicImage src="/logo-pinkwhite.png" alt="Daniele Buatti Logo" className="h-12 w-auto" width={220} height={48} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12"> {/* Changed py-8 to py-12 */}
        {children}
      </main>

      {/* Footer - Reusing the existing Footer component */}
      <Footer />
    </div>
  );
};

export default BookingPageLayout;