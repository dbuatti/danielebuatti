"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowLeft } from 'lucide-react'; // Added ArrowLeft for consistency
import { useTheme } from "next-themes"; // Import useTheme to get current theme

const QuoteConfirmationPage: React.FC = () => {
  const { theme } = useTheme(); // Get the current theme

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light flex flex-col">
      {/* Header */}
      <header className="bg-brand-light dark:bg-brand-dark py-4 px-6 md:px-12 shadow-lg relative z-10 border-b border-brand-secondary/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-brand-dark dark:text-brand-light hover:text-brand-primary transition-colors duration-200 px-0 py-0 h-auto">
            <Link to="/">
              <span className="flex items-center text-base md:text-lg font-semibold">
                <ArrowLeft className="h-5 w-5 mr-2" /> <span>Back to Home</span>
              </span>
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <DynamicImage
              src={brandSymbolSrc}
              alt="Daniele Buatti Brand Symbol"
              className="h-8 w-auto"
              width={32}
              height={32}
            />
            <DynamicImage
              src={textLogoSrc}
              alt="Daniele Buatti Logo"
              className="h-12 w-auto"
              width={220}
              height={48}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center bg-brand-light dark:bg-brand-dark-alt p-10 md:p-16 rounded-xl shadow-2xl border border-brand-primary/50 space-y-8">
          <CheckCircle2 className="h-24 w-24 text-brand-primary mx-auto animate-bounce" />
          <h2 className="text-5xl font-extrabold text-brand-primary leading-tight"> {/* Removed font-libre-baskerville and text-shadow-sm */}
            Thank You for Your Acceptance!
          </h2>
          <p className="text-xl text-brand-dark/90 dark:text-brand-light/90 max-w-2xl mx-auto">
            Your quote acceptance has been successfully submitted. Daniele is thrilled to bring the magic to your event!
          </p>
          <p className="text-xl text-brand-dark/90 dark:text-brand-light/90 max-w-2xl mx-auto font-semibold">
            Daniele will be in touch very shortly to finalize all the details and confirm your booking.
          </p>
          <Button asChild size="lg" className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteConfirmationPage;