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

  const packages = [
    { id: "option3", name: "Option 3: Curated Celebration", focus: "Full Artistic Partnership & Rehearsal", investment: "A$1,400" },
    { id: "option2", name: "Option 2: Festive Flow", focus: "Flexible 3-Hour Engagement & Atmosphere", investment: "A$950" },
    { id: "option1", name: "Option 1: Carols Highlight", focus: "Compact, Focused Performance", investment: "A$500" },
  ];

  return (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light font-montserrat">
      {/* Header for Quote Proposal */}
      <header className="bg-livePiano-darker py-4 px-6 md:px-12 shadow-md relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="text-livePiano-light hover:bg-livePiano-primary hover:text-livePiano-light">
            <Link to="/">
              <span className="flex items-center">
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

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <section className="text-center space-y-4">
          <h2 className="text-5xl font-libre-baskerville font-bold text-livePiano-primary mb-4 leading-tight">
            Christmas Carols – Private Party Quote Proposal
          </h2>
          <div className="text-lg text-livePiano-light/90 max-w-3xl mx-auto space-y-2">
            <p><strong>Prepared for:</strong> {proposalDetails.client}</p>
            <p><strong>Date of Event:</strong> {proposalDetails.dateOfEvent}</p>
            <p><strong>Time:</strong> {proposalDetails.time}</p>
            <p><strong>Location:</strong> {proposalDetails.location}</p>
            <p><strong>Prepared by:</strong> {proposalDetails.preparedBy}</p>
          </div>
        </section>

        {/* Package Options Anchor Table */}
        <section id="package-options" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center">🎄 Package Options</h3>
          <Table className="w-full text-livePiano-light">
            <TableHeader>
              <TableRow className="border-livePiano-border/50">
                <TableHead className="text-livePiano-primary text-lg">Package Name</TableHead>
                <TableHead className="text-livePiano-primary text-lg">Core Focus</TableHead>
                <TableHead className="text-livePiano-primary text-lg text-right">Investment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="border-livePiano-border/50 hover:bg-livePiano-background/50 transition-colors">
                  <TableCell className="font-semibold text-livePiano-light">
                    <a href={`#${pkg.id}`} className="hover:underline text-livePiano-primary">{pkg.name}</a>
                  </TableCell>
                  <TableCell>{pkg.focus}</TableCell>
                  <TableCell className="text-right font-bold">{pkg.investment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Option 1 */}
        <section id="option1" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-4xl font-bold text-livePiano-light text-center">Option 1 – Carols Highlight (Essential)</h3>
          <div className="relative h-64 md:h-96 flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-livePiano-border/50">
            {/* Blurred Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(/quote-option-1.png)` }}
            ></div>
            {/* Main Image */}
            <DynamicImage
              src="/quote-option-1.png"
              alt="Option 1: Carols Highlight"
              className="relative z-10 max-w-xl h-auto object-contain rounded-lg shadow-lg"
              width={800}
              height={400}
            />
          </div>
          <p className="text-2xl font-semibold text-livePiano-primary text-center">Investment: A$500</p>
          <p className="text-lg text-livePiano-light/90 text-center">
            A focused, festive performance for hosts seeking simplicity and a clear, time-bound musical segment.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-livePiano-light/80">
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-2">Inclusions</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>2-Hour Engagement (6pm–8pm).</li>
                <li>Live Piano</li>
                <li>Accompaniment</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-2">Value Provided</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Clear, focused time commitment.</li>
                <li>2 × 45-minute carol sets.</li>
                <li>Support for both choristers and non-choristers alike.</li>
              </ul>
            </div>
          </div>
          <p className="text-lg italic text-livePiano-light/70 text-center mt-4">
            Why choose this option? Perfect for a straightforward, uplifting musical highlight without requiring extra planning.
          </p>
        </section>

        {/* Option 2 */}
        <section id="option2" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-4xl font-bold text-livePiano-light text-center">Option 2 – Festive Flow (Standard)</h3>
          <div className="relative h-64 md:h-96 flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-livePiano-border/50">
            {/* Blurred Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(/quote-option-2.jpeg)` }}
            ></div>
            {/* Main Image */}
            <DynamicImage
              src="/quote-option-2.jpeg"
              alt="Option 2: Festive Flow"
              className="relative z-10 max-w-xl h-auto object-contain rounded-lg shadow-lg"
              width={800}
              height={400}
            />
          </div>
          <p className="text-2xl font-semibold text-livePiano-primary text-center">Investment: A$950</p>
          <p className="text-lg text-livePiano-light/90 text-center">
            A flexible, high-value option that blends musical structure with adaptability for the best party atmosphere.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-livePiano-light/80">
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-2">Inclusions</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Extended 3-Hour Engagement (6pm–9pm).</li>
                <li>On-Call Performance Buffer</li>
                <li>Live Piano</li>
                <li>Carols Brochure</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-2">Value Provided</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Ample buffer time for guests to mingle and get into the mood.</li>
                <li>Seamlessly adapts to the party's flow, ensuring music starts when guests are ready to sing.</li>
                <li>2 × 45-minute carol sets, plus atmosphere music before/between/after sets.</li>
                <li>Prepared based on your final song list.</li>
              </ul>
            </div>
          </div>
          <p className="text-lg italic text-livePiano-light/70 text-center mt-4">
            Why choose this option? This is the ideal option for hosts who prioritize seamless atmosphere and flexibility. It guarantees music adapts to your party's pace, eliminating the stress of rigid timing.
          </p>
        </section>

        {/* Option 3 */}
        <section id="option3" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-4xl font-bold text-livePiano-light text-center">Option 3 – Curated Celebration (Premium)</h3>
          <div className="relative h-64 md:h-96 flex items-center justify-center rounded-lg overflow-hidden mb-4 border border-livePiano-border/50">
            {/* Blurred Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(/quote-option-3.jpeg)` }}
            ></div>
            {/* Main Image */}
            <DynamicImage
              src="/quote-option-3.jpeg"
              alt="Option 3: Curated Celebration"
              className="relative z-10 max-w-xl h-auto object-contain rounded-lg shadow-lg"
              width={800}
              height={400}
            />
          </div>
          <p className="text-2xl font-semibold text-livePiano-primary text-center">Investment: A$1,400</p>
          <p className="text-lg text-livePiano-light/90 text-center">
            The ultimate carols experience: fully curated, rehearsed, and guided for maximum musical impact and host peace of mind.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-livePiano-light/80">
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-2">Inclusions</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Private Rehearsal Session</li>
                <li>Full Evening Coverage (6pm–late).</li>
                <li>Artistic Guidance</li>
                <li>Live Piano</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-livePiano-primary mb-2">Value Provided</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Dedicated time to refine your group’s sound and prepare singers.</li>
                <li>Availability until the end of the party—no watching the clock.</li>
                <li>Full collaboration on sheet music sourcing, set structure, and creation of a custom carols brochure.</li>
                <li>2 × 45-minute carol sets, background music, and spontaneous sing-alongs.</li>
              </ul>
            </div>
          </div>
          <p className="text-lg italic text-livePiano-light/70 text-center mt-4">
            Why choose this option? You receive a seamless, stress-free, and unforgettable musical evening with professional oversight from rehearsal through performance.
          </p>
        </section>

        {/* Additional Notes & Client Acceptance */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center">📌 Additional Notes & Next Steps</h3>
          <div className="text-lg text-livePiano-light/90 space-y-4">
            <p>All packages include preparation, performance, and equipment (keyboard if required).</p>
            <p>Referral via Loclan and Dan Walker (Melbourne Lawyers Choir) is noted.</p>
          </div>

          <div className="pt-8 space-y-6">
            <h4 className="2xl font-bold text-livePiano-primary text-center">Client Acceptance</h4>
            <p className="text-lg text-livePiano-light/90 text-center">
              Please select your preferred package below.
              A 50% deposit is required to formally secure the booking. The remaining balance is due 7 days prior to the event.
            </p>
            <p className="text-lg text-livePiano-light/90 text-center">
              I, {proposalDetails.client}, confirm my selection and booking for the event on {proposalDetails.dateOfEvent}.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-6 mt-8">
              {packages.map((pkg) => (
                <div key={`accept-${pkg.id}`} className="flex items-center space-x-2">
                  <Checkbox id={`accept-${pkg.id}`} className="border-livePiano-primary data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-light" />
                  <label
                    htmlFor={`accept-${pkg.id}`}
                    className="text-lg font-medium text-livePiano-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {pkg.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-6 text-livePiano-light/90">
              <div className="flex flex-col items-center">
                <p className="text-lg mb-2">Signature:</p>
                <div className="w-full max-w-md h-px bg-livePiano-border/70"></div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg mb-2">Date:</p>
                <div className="w-full max-w-md h-px bg-livePiano-border/70"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteProposalPage;