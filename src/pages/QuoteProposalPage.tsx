"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft, Download } from 'lucide-react';
import Footer from '@/components/Footer'; // Using the main footer for consistency

const QuoteProposalPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const proposalDetails = {
    client: "Imme Kaschner",
    dateOfEvent: "Saturday 22 November 2025",
    time: "6:00–9:00pm (or later for the Premium Option)",
    location: "Kew (Private Home)",
    preparedBy: "Daniele Buatti",
  };

  // Reordered packages to be 1, 2, 3
  const packages = [
    { id: "option1", name: "Option 1: The Festive Spark", focus: "Compact, Focused Performance", contribution: "A$500" },
    { id: "option2", name: "Option 2: Seamless Festive Flow", focus: "Flexible 3-Hour Engagement & Atmosphere", contribution: "A$950" },
    { id: "option3", name: "Option 3: The Ultimate Curated Celebration", focus: "Full Artistic Partnership & Rehearsal", contribution: "A$1,400" },
  ];

  return (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light font-montserrat">
      {/* Header for Quote Proposal */}
      <header className="bg-livePiano-darker py-5 px-6 md:px-12 shadow-lg relative z-10 border-b border-livePiano-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-livePiano-light hover:bg-livePiano-primary hover:text-livePiano-darker transition-colors duration-200">
            <Link to="/">
              <span className="flex items-center text-base md:text-lg font-semibold">
                <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
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

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-20"> {/* Increased vertical spacing */}
        <section className="text-center space-y-6"> {/* Increased vertical spacing */}
          <h2 className="text-5xl md:text-6xl font-libre-baskerville font-extrabold text-livePiano-primary mb-4 leading-tight text-shadow-sm">
            Your Bespoke Live Piano Quote for a Magical Christmas Carols Party
          </h2>
          <div className="text-xl text-livePiano-light/90 max-w-3xl mx-auto space-y-3 font-medium"> {/* Increased font size and weight */}
            <p>Prepared for: <strong className="text-livePiano-primary">{proposalDetails.client}</strong></p>
            <p>Date of Event: {proposalDetails.dateOfEvent}</p>
            <p>Time: {proposalDetails.time}</p>
            <p>Location: {proposalDetails.location}</p>
            <p>Prepared by: {proposalDetails.preparedBy}</p>
          </div>
        </section>

        {/* Package Options Anchor Table */}
        <section id="package-options" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
          <h3 className="text-3xl font-bold text-livePiano-light mb-8 text-center">🎄 Your Package Options</h3>
          <Table className="w-full text-livePiano-light rounded-lg overflow-hidden"> {/* Added rounded-lg and overflow-hidden */}
            <TableHeader className="bg-livePiano-primary/20"> {/* Subtle background for header */}
              <TableRow className="border-livePiano-border/50">
                <TableHead className="text-livePiano-primary text-lg font-bold py-4 px-6">Package Name</TableHead> {/* Increased padding */}
                <TableHead className="text-livePiano-primary text-lg font-bold py-4 px-6">Core Focus</TableHead>
                <TableHead className="text-livePiano-primary text-lg font-bold py-4 px-6 text-right">Your Contribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="border-livePiano-border/50 hover:bg-livePiano-background/50 transition-colors duration-200">
                  <TableCell className="font-semibold text-livePiano-light py-4 px-6">
                    <a href={`#${pkg.id}`} className="hover:underline text-livePiano-primary transition-colors duration-200">{pkg.name}</a>
                  </TableCell>
                  <TableCell className="py-4 px-6">{pkg.focus}</TableCell>
                  <TableCell className="text-right font-bold text-livePiano-primary py-4 px-6">{pkg.contribution}</TableCell> {/* Highlight contribution */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Option 1 */}
        <section id="option1" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8"> {/* Increased vertical spacing */}
          <h3 className="text-4xl font-bold text-livePiano-primary text-center text-shadow-sm">Option 1 – The Festive Spark</h3>
          <div className="relative h-72 md:h-[400px] flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-livePiano-border/50"> {/* Increased height */}
            {/* Blurred Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(/quote-option-1.png)` }}
            ></div>
            {/* Main Image */}
            <DynamicImage
              src="/quote-option-1.png"
              alt="Option 1: The Festive Spark"
              className="relative z-10 max-w-xl h-auto object-contain rounded-lg shadow-lg"
              width={800}
              height={400}
            />
          </div>
          <p className="text-3xl font-semibold text-livePiano-primary text-center text-shadow-sm">Your Contribution: A$500</p>
          <p className="text-lg text-livePiano-light/90 text-center max-w-2xl mx-auto">
            A delightful, focused performance for hosts who desire a clear, time-bound musical highlight to set a joyful tone.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-livePiano-light/80"> {/* Increased gap */}
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-3">What's Included:</h4> {/* Increased margin */}
              <ul className="list-disc list-inside space-y-2"> {/* Increased spacing */}
                <li>2-Hour Engagement (6pm–8pm).</li>
                <li>Live Piano Performance</li>
                <li>Supportive Accompaniment</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-3">The Value You Receive:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>A clear, focused musical segment for your event.</li>
                <li>Two 45-minute carol sets, perfectly timed for your gathering.</li>
                <li>Harmonious support for both seasoned singers and those just joining in.</li>
              </ul>
            </div>
          </div>
          <p className="text-lg italic text-livePiano-light/70 text-center mt-6 max-w-2xl mx-auto"> {/* Increased margin */}
            Why this option? It's perfect for a straightforward, uplifting musical moment without requiring extensive planning.
          </p>
        </section>

        {/* Option 2 */}
        <section id="option2" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-4xl font-bold text-livePiano-light text-center text-shadow-sm">Option 2 – Seamless Festive Flow</h3>
          <div className="relative h-72 md:h-[400px] flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-livePiano-border/50">
            {/* Blurred Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(/quote-option-2.jpeg)` }}
            ></div>
            {/* Main Image */}
            <DynamicImage
              src="/quote-option-2.jpeg"
              alt="Option 2: Seamless Festive Flow"
              className="relative z-10 max-w-xl h-auto object-contain rounded-lg shadow-lg"
              width={800}
              height={400}
            />
          </div>
          <p className="text-3xl font-semibold text-livePiano-primary text-center text-shadow-sm">Your Contribution: A$950</p>
          <p className="text-lg text-livePiano-light/90 text-center max-w-2xl mx-auto">
            A flexible, high-value experience that beautifully blends musical structure with adaptability, ensuring the perfect party atmosphere.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-livePiano-light/80">
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-3">What's Included:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Extended 3-Hour Engagement (6pm–9pm).</li>
                <li>On-Call Performance Buffer</li>
                <li>Live Piano Performance</li>
                <li>Custom Carols Brochure</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-3">The Value You Receive:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Ample time for guests to mingle and truly get into the festive mood.</li>
                <li>Music that seamlessly adapts to your party's flow, ready when your guests are.</li>
                <li>Two 45-minute carol sets, plus delightful atmosphere music before, between, and after sets.</li>
                <li>A beautifully prepared brochure based on your final song list.</li>
              </ul>
            </div>
          </div>
          <p className="text-lg italic text-livePiano-light/70 text-center mt-6 max-w-2xl mx-auto">
            Why this option? It's ideal for hosts who prioritize a seamless atmosphere and flexibility. It guarantees music adapts to your party's pace, eliminating the stress of rigid timing.
          </p>
        </section>

        {/* Option 3 */}
        <section id="option3" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-4xl font-bold text-livePiano-light text-center text-shadow-sm">Option 3 – The Ultimate Curated Celebration</h3>
          <div className="relative h-72 md:h-[400px] flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-livePiano-border/50">
            {/* Blurred Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(/quote-option-3.jpeg)` }}
            ></div>
            {/* Main Image */}
            <DynamicImage
              src="/quote-option-3.jpeg"
              alt="Option 3: The Ultimate Curated Celebration"
              className="relative z-10 max-w-xl h-auto object-contain rounded-lg shadow-lg"
              width={800}
              height={400}
            />
          </div>
          <p className="text-3xl font-semibold text-livePiano-primary text-center text-shadow-sm">Your Contribution: A$1,400</p>
          <p className="text-lg text-livePiano-light/90 text-center max-w-2xl mx-auto">
            The most exquisite carols experience: fully curated, rehearsed, and expertly guided for maximum musical impact and complete peace of mind for you, the host.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-livePiano-light/80">
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-3">What's Included:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Private Rehearsal Session</li>
                <li>Full Evening Coverage (6pm–late).</li>
                <li>Personal Artistic Guidance</li>
                <li>Live Piano Performance</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-3">The Value You Receive:</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Dedicated time to refine your group’s sound and prepare any singers.</li>
                <li>Availability until the very end of your party—no watching the clock!</li>
                <li>Full collaboration on sheet music sourcing, set structure, and creation of a custom carols brochure.</li>
                <li>Two 45-minute carol sets, beautiful background music, and spontaneous sing-alongs.</li>
              </ul>
            </div>
          </div>
          <p className="text-lg italic text-livePiano-light/70 text-center mt-6 max-w-2xl mx-auto">
            Why this option? You'll enjoy a seamless, stress-free, and truly unforgettable musical evening with professional oversight from rehearsal through performance.
          </p>
        </section>

        {/* Client Acceptance */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-10"> {/* Increased vertical spacing */}
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center">Ready to bring the magic to your event?</h3>
          <p className="text-xl text-livePiano-light/90 text-center max-w-3xl mx-auto">
            Please select your preferred package below. A 50% deposit is required to formally secure your booking, with the remaining balance due 7 days prior to the event.
          </p>
          <p className="text-xl text-livePiano-light/90 text-center max-w-3xl mx-auto font-semibold">
            I, {proposalDetails.client}, confirm my selection and booking for the event on {proposalDetails.dateOfEvent}.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 mt-8"> {/* Increased gap */}
            {packages.map((pkg) => (
              <div key={`accept-${pkg.id}`} className="flex items-center space-x-3"> {/* Increased space-x */}
                <Checkbox id={`accept-${pkg.id}`} className="h-6 w-6 border-livePiano-primary data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker" /> {/* Increased checkbox size */}
                <label
                  htmlFor={`accept-${pkg.id}`}
                  className="text-xl font-medium text-livePiano-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {pkg.name}
                </label>
              </div>
            ))}
          </div>

          {/* Signature and Date fields removed here */}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteProposalPage;