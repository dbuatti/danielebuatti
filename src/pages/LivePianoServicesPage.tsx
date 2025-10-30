"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DynamicImage from '@/components/DynamicImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Piano, Mic, Users, Sparkles, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const LivePianoServicesPage: React.FC = () => {
  const pageTitle = "Live Piano Services";
  const subtitle = "Elevate Your Event with Professional Live Piano Music";

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>{pageTitle}</SectionHeading>
          {subtitle && <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70">{subtitle}</p>}
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>

        <section className="max-w-4xl mx-auto space-y-10">
          {/* Hero Image Section */}
          <section className="relative mt-8 mb-8 rounded-xl overflow-hidden shadow-lg border-4 border-brand-secondary">
            <DynamicImage
              src="/daniele-live-piano.jpeg"
              alt="Daniele Buatti playing live piano at an event"
              className="w-full h-96 md:h-[450px] object-cover object-[50%_30%]"
              width={800}
              height={533}
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>
          </section>

          {/* Overview Section */}
          <section className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6">
            <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              Add a touch of elegance and sophistication to your next event with professional live piano music. From intimate gatherings to grand celebrations, I provide bespoke musical experiences tailored to your specific needs and preferences.
            </p>
          </section>

          {/* Services Offered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Music className="h-7 w-7" /> Event Piano
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Weddings (ceremony, reception, cocktail hour)</li>
                <li>Corporate events & functions</li>
                <li>Private parties & celebrations</li>
                <li>Gala dinners & awards nights</li>
                <li>Background music for restaurants & hotels</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Sparkles className="h-7 w-7" /> Bespoke Musical Experiences
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Customise repertoire to match your event's theme</li> {/* Changed 'Customize' to 'Customise' */}
                <li>Collaboration with other musicians (vocalists, instrumentalists)</li>
                <li>Original compositions or arrangements upon request</li>
                <li>Music for specific moments (e.g., first dance, grand entrance)</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Piano className="h-7 w-7" /> Accompaniment Services
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Vocalists & instrumentalists for performances or auditions</li>
                <li>Choirs & ensembles</li>
                <li>AMEB exams (see dedicated AMEB Accompanying page)</li>
                <li>Rehearsal pianist</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Mic className="h-7 w-7" /> Vocalist & Pianist Duo
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Daniele as both vocalist and pianist for a captivating performance</li>
                <li>Ideal for intimate settings or feature performances</li>
                <li>Versatile repertoire across genres</li>
              </ul>
            </div>
          </div>

          {/* Why Choose Me Section */}
          <section className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6">
            <h3 className="flex items-center gap-3 text-3xl font-bold text-brand-primary justify-center">
              <Users className="h-8 w-8" /> Why Choose Daniele?
            </h3>
            <ul className="list-disc list-inside text-xl text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-3 pl-4">
              <li>Over 15 years of professional experience in live performance and music direction.</li>
              <li>Extensive repertoire spanning classical, jazz, contemporary, musical theatre, and pop.</li>
              <li>Professional-grade equipment (portable piano, sound system) if a venue piano is unavailable.</li>
              <li>Reliable, punctual, and dedicated to making your event a success.</li>
              <li>Personalised service from initial inquiry to the final note.</li> {/* Changed 'Personalized' to 'Personalised' */}
            </ul>
          </section>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-brand-dark dark:text-brand-light mb-6">
              Ready to add the perfect soundtrack to your event?
            </p>
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/live-piano-services/quote">
                Get a Quote
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LivePianoServicesPage;