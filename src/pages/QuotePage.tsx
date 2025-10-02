"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft, Phone, Mail } from 'lucide-react'; // Removed Download icon as it's no longer needed
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have a Checkbox component

const QuotePage: React.FC = () => {
  // Removed useEffect for scrolling, as ScrollToTop component now handles all scroll logic.

  // Removed handleExportToSheets function as it's no longer used.

  return (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light font-montserrat">
      {/* Header */}
      <header className="bg-livePiano-darker py-4 px-6 md:px-12 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light px-4 py-2 text-sm">
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
        {/* Quote Proposal Header */}
        <section className="text-center space-y-4">
          <h2 className="text-5xl font-libre-baskerville font-bold text-livePiano-primary leading-tight">
            Christmas Carols – Private Party Quote Proposal
          </h2>
          <p className="text-xl text-livePiano-light/90">Prepared for: <strong className="text-livePiano-primary">Imme Kaschner</strong></p>
          <p className="text-lg text-livePiano-light/80">Date of Event: Saturday 22 November 2025</p>
          <p className="text-lg text-livePiano-light/80">Time: 6:00–9:00pm (or later for the Premium Option)</p>
          <p className="text-lg text-livePiano-light/80">Location: Kew (Private Home)</p>
          <p className="text-lg text-livePiano-light/80">Prepared by: Daniele Buatti</p>
          <Separator className="max-w-md mx-auto bg-livePiano-border/50 mt-8" />
        </section>

        {/* Package Options Anchor Table */}
        <section id="package-options" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center">🎄 Package Options</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-livePiano-primary/20 text-livePiano-light">
                  <th className="p-3 border-b border-livePiano-border">Package Name</th>
                  <th className="p-3 border-b border-livePiano-border">Core Focus</th>
                  <th className="p-3 border-b border-livePiano-border">Investment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-livePiano-background/50 transition-colors">
                  <td className="p-3 border-b border-livePiano-border"><a href="#option3" className="text-livePiano-primary hover:underline">Option 3: Curated Celebration</a></td>
                  <td className="p-3 border-b border-livePiano-border">Full Artistic Partnership & Rehearsal</td>
                  <td className="p-3 border-b border-livePiano-border">A$1,400</td>
                </tr>
                <tr className="hover:bg-livePiano-background/50 transition-colors">
                  <td className="p-3 border-b border-livePiano-border"><a href="#option2" className="text-livePiano-primary hover:underline">Option 2: Festive Flow</a></td>
                  <td className="p-3 border-b border-livePiano-border">Flexible 3-Hour Engagement & Atmosphere</td>
                  <td className="p-3 border-b border-livePiano-border">A$950</td>
                </tr>
                <tr className="hover:bg-livePiano-background/50 transition-colors">
                  <td className="p-3 border-b border-livePiano-border"><a href="#option1" className="text-livePiano-primary hover:underline">Option 1: Carols Highlight</a></td>
                  <td className="p-3 border-b border-livePiano-border">Compact, Focused Performance</td>
                  <td className="p-3 border-b border-livePiano-border">A$500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Option 1 */}
        <section id="option1" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-4xl font-bold text-livePiano-primary text-center">Option 1 – Carols Highlight (Essential)</h3>
          <DynamicImage src="/placeholder.svg" alt="Carols Highlight" className="w-full h-64 object-cover rounded-lg mb-4 border border-livePiano-border/50" />
          <p className="text-3xl font-bold text-livePiano-light text-center">Investment: A$500</p>
          <p className="text-lg text-livePiano-light/80 text-center">
            A focused, festive performance for hosts seeking simplicity and a clear, time-bound musical segment.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-livePiano-light/90">
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
          <p className="text-md italic text-livePiano-light/70 text-center">
            Why choose this option? Perfect for a straightforward, uplifting musical highlight without requiring extra planning.
          </p>
        </section>

        {/* Option 2 */}
        <section id="option2" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-4xl font-bold text-livePiano-primary text-center">Option 2 – Festive Flow (Standard)</h3>
          <DynamicImage src="/placeholder.svg" alt="Festive Flow" className="w-full h-64 object-cover rounded-lg mb-4 border border-livePiano-border/50" />
          <p className="text-3xl font-bold text-livePiano-light text-center">Investment: A$950</p>
          <p className="text-lg text-livePiano-light/80 text-center">
            A flexible, high-value option that blends musical structure with adaptability for the best party atmosphere.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-livePiano-light/90">
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
          <p className="text-md italic text-livePiano-light/70 text-center">
            Why choose this option? This is the ideal option for hosts who prioritize seamless atmosphere and flexibility. It guarantees music adapts to your party's pace, eliminating the stress of rigid timing.
          </p>
        </section>

        {/* Option 3 */}
        <section id="option3" className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-4xl font-bold text-livePiano-primary text-center">Option 3 – Curated Celebration (Premium)</h3>
          <DynamicImage src="/placeholder.svg" alt="Curated Celebration" className="w-full h-64 object-cover rounded-lg mb-4 border border-livePiano-border/50" />
          <p className="text-3xl font-bold text-livePiano-light text-center">Investment: A$1,400</p>
          <p className="text-lg text-livePiano-light/80 text-center">
            The ultimate carols experience: fully curated, rehearsed, and guided for maximum musical impact and host peace of mind.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-livePiano-light/90">
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
          <p className="text-md italic text-livePiano-light/70 text-center">
            Why choose this option? You receive a seamless, stress-free, and unforgettable musical evening with professional oversight from rehearsal through performance.
          </p>
        </section>

        {/* Additional Notes & Next Steps */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-3xl font-bold text-livePiano-light text-center">📌 Additional Notes & Next Steps</h3>
          <ul className="list-disc list-inside text-lg text-livePiano-light/90 space-y-2">
            <li>All packages include preparation, performance, and equipment (keyboard if required).</li>
            <li>Referral via Loclan and Dan Walker (Melbourne Lawyers Choir) is noted.</li>
          </ul>
        </section>

        {/* Client Acceptance */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-8">
          <h3 className="text-3xl font-bold text-livePiano-light text-center">Client Acceptance</h3>
          <p className="text-lg text-livePiano-light/90 text-center">
            Please select your preferred package below. A 50% deposit is required to formally secure the booking. The remaining balance is due 7 days prior to the event.
          </p>
          <p className="text-lg text-livePiano-light/90 text-center">
            I, Imme Kaschner, confirm my selection and booking for the event on 22 November 2025.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-xl text-livePiano-light font-semibold">
            <div className="flex items-center space-x-2">
              <Checkbox id="option3-checkbox" className="border-livePiano-primary data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker" />
              <label htmlFor="option3-checkbox">Option 3: Curated Celebration</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="option2-checkbox" className="border-livePiano-primary data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker" />
              <label htmlFor="option2-checkbox">Option 2: Festive Flow</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="option1-checkbox" className="border-livePiano-primary data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker" />
              <label htmlFor="option1-checkbox">Option 1: Carols Highlight</label>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <label htmlFor="signature" className="text-lg text-livePiano-light/90">Signature:</label>
              <div className="flex-grow border-b-2 border-livePiano-border/70 h-8 w-full md:w-auto max-w-md"></div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <label htmlFor="date" className="text-lg text-livePiano-light/90">Date:</label>
              <div className="flex-grow border-b-2 border-livePiano-border/70 h-8 w-full md:w-auto max-w-md"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (using the Live Piano Services footer style) */}
      <footer
        className="relative py-16 text-center overflow-hidden"
        style={{ backgroundImage: `url(/bowtie.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* Overlay for readability */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <p className="text-livePiano-light text-2xl font-semibold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <a
              href="https://wa.me/61424174067"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-livePiano-primary transition-colors"
            >
              <Phone size={24} /> 0424 174 067
            </a>
            <a
              href="mailto:info@danielebuatti.com"
              className="flex items-center gap-2 hover:text-livePiano-primary transition-colors"
            >
              <Mail size={24} /> info@danielebuatti.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuotePage;