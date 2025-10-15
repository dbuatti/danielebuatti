"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import Footer from '@/components/Footer'; // Re-using the main Footer for consistency
import { useTheme } from "next-themes"; // Import useTheme to get current theme

const ErinKennedyQuotePage: React.FC = () => {
  const { theme } = useTheme(); // Get the current theme

  const quoteDetails = {
    client: "Erin Kennedy",
    eventTitle: "2025 Vocal Showcase",
    dateOfEvent: "Saturday 23 November 2025",
    time: "2:00 PM – 6:00 PM", // Adjusted time to include setup
    location: "MC Showroom",
    preparedBy: "Daniele Buatti",
    hourlyRate: 100,
    performanceHours: 4, // 2:00 PM - 6:00 PM
    showPreparationFee: 100,
    rehearsalBundleCost: 75, // Per student
    depositPercentage: 50,
  };

  const onSitePerformanceCost = quoteDetails.performanceHours * quoteDetails.hourlyRate;
  const totalBaseInvoice = onSitePerformanceCost + quoteDetails.showPreparationFee;
  const requiredDeposit = totalBaseInvoice * (quoteDetails.depositPercentage / 100);

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

      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 space-y-12">
        <section className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-libre-baskerville font-extrabold text-brand-primary mb-6 leading-none text-shadow-lg">
            {quoteDetails.eventTitle} – Live Piano Quote
          </h2>
          <div className="text-xl text-brand-dark/90 dark:text-brand-light/90 max-w-3xl mx-auto space-y-3 font-medium">
            <p>Prepared for: <strong className="text-brand-primary">{quoteDetails.client}</strong></p>
            <p>Date of Event: {quoteDetails.dateOfEvent}</p>
            <p>Time: {quoteDetails.time}</p>
            <p>Location: {quoteDetails.location}</p>
            <p>Prepared by: {quoteDetails.preparedBy}</p>
          </div>
          <Separator className="max-w-lg mx-auto bg-brand-primary h-1 mt-10" />
        </section>

        {/* Quote Details Table */}
        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-2xl border border-brand-secondary/30 space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center text-shadow-sm">Quote Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary/20 text-brand-dark dark:text-brand-light">
                  <th className="p-3 border-b border-brand-secondary">Component</th>
                  <th className="p-3 border-b border-brand-secondary">Detail</th>
                  <th className="p-3 border-b border-brand-secondary text-right">Cost / Investment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-brand-secondary/10 transition-colors">
                  <td className="p-3 border-b border-brand-secondary font-semibold text-brand-primary">I. On-Site Performance Fee</td>
                  <td className="p-3 border-b border-brand-secondary">
                    {quoteDetails.performanceHours} Hours contracted time, covering arrival, setup, performance ({quoteDetails.time}).
                    <br />
                    <span className="text-sm text-brand-dark/70 dark:text-brand-light/70">Rate: A${quoteDetails.hourlyRate}/hr</span>
                  </td>
                  <td className="p-3 border-b border-brand-secondary text-right">A${onSitePerformanceCost}.00</td>
                </tr>
                <tr className="hover:bg-brand-secondary/10 transition-colors">
                  <td className="p-3 border-b border-brand-secondary font-semibold text-brand-primary">II. Show Preparation Fee</td>
                  <td className="p-3 border-b border-brand-secondary">
                    Mandatory flat fee to cover all music collection, printing, sequencing, and administrative coordination with the students and venue.
                  </td>
                  <td className="p-3 border-b border-brand-secondary text-right">A${quoteDetails.showPreparationFee}.00</td>
                </tr>
                <tr className="bg-brand-primary/10 text-brand-dark dark:text-brand-light font-bold">
                  <td className="p-3 border-b border-brand-secondary">TOTAL BASE INVOICE</td>
                  <td className="p-3 border-b border-brand-secondary">(To be paid by {quoteDetails.client})</td>
                  <td className="p-3 border-b border-brand-secondary text-right">A${totalBaseInvoice}.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Optional Rehearsal Bundle */}
        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-2xl border border-brand-secondary/30 space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center text-shadow-sm">III. Optional Rehearsal Bundle (Upsell)</h3>
          <p className="text-xl text-brand-dark/90 dark:text-brand-light/90 text-center max-w-3xl mx-auto">
            Offer a "Discounted Rehearsal Bundle" that students can pre-purchase to prepare for the showcase.
          </p>
          <div className="text-center">
            <p className="text-3xl font-semibold text-brand-primary text-shadow-sm">
              Cost per student: <span className="text-brand-dark dark:text-brand-light text-4xl">A${quoteDetails.rehearsalBundleCost}</span>
            </p>
            <p className="text-lg text-brand-dark/70 dark:text-brand-light/70 mt-2">
              (Suggested as a required purchase for students to book rehearsal time)
            </p>
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-brand-light dark:bg-brand-dark-alt p-8 rounded-xl shadow-2xl border border-brand-secondary/30 space-y-6">
          <h3 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center text-shadow-sm">Important Notes</h3>
          <ul className="list-disc list-inside text-lg text-brand-dark/90 dark:text-brand-light/90 space-y-2">
            <li>Your final invoice to {quoteDetails.client} will be a clean A${totalBaseInvoice}.00.</li>
            <li>A {quoteDetails.depositPercentage}% deposit (A${requiredDeposit}.00) is required immediately to formally secure the November 23rd date.</li>
            <li><strong className="text-brand-primary">Keyboard Requirement:</strong> MC Showroom to provide a tuned, weighted keyboard on stage prior to 2:00 PM.</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ErinKennedyQuotePage;