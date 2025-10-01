"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';

const QuoteConfirmationPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light font-montserrat flex flex-col">
      {/* Header */}
      <header className="bg-livePiano-darker py-5 px-6 md:px-12 shadow-lg relative z-10 border-b border-livePiano-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-livePiano-light hover:bg-livePiano-primary hover:text-livePiano-darker transition-colors duration-200">
            <Link to="/">
              <span className="flex items-center text-base md:text-lg font-semibold">
                Back to Home
              </span>
            </Link>
          </Button>
          <div className="flex flex-col items-end">
            <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-16 md:h-20" width={80} height={80} />
            <h1 className="text-xl md:text-2xl font-montserrat font-light uppercase text-livePiano-light tracking-widest mt-2">
              Daniele Buatti
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center bg-livePiano-darker p-10 md:p-16 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <CheckCircle2 className="h-24 w-24 text-livePiano-primary mx-auto animate-bounce" />
          <h2 className="text-5xl font-libre-baskerville font-extrabold text-livePiano-primary leading-tight text-shadow-sm">
            Thank You for Your Acceptance!
          </h2>
          <p className="text-xl text-livePiano-light/90 max-w-2xl mx-auto">
            Your quote acceptance has been successfully submitted. I'm thrilled to bring the magic to your event!
          </p>
          <p className="text-xl text-livePiano-light/90 max-w-2xl mx-auto font-semibold">
            I will be in touch very shortly to finalize all the details and confirm your booking.
          </p>
          <Button asChild size="lg" className="mt-8 bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteConfirmationPage;