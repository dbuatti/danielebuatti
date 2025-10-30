"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DynamicImage from '@/components/DynamicImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Mic, Piano, BookOpen, Lightbulb, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const VoicePianoServicesPage: React.FC = () => {
  const pageTitle = "Voice & Piano Coaching";
  const subtitle = "Unlock Your Full Vocal and Instrumental Potential";

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
              src="/daniele-singing.jpeg"
              alt="Daniele Buatti singing with passion"
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
              Whether you're a beginner or an experienced performer, my voice and piano coaching services are designed to help you develop a strong foundation, expand your artistic expression, and achieve your musical goals. I offer a holistic approach that integrates technical mastery with emotional connection and performance presence.
            </p>
          </section>

          {/* Key Areas of Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Mic className="h-7 w-7" /> Vocal Coaching
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Breath control & support</li>
                <li>Vocal range expansion & flexibility</li>
                <li>Tone production & resonance</li>
                <li>Stylistic versatility (contemporary, classical, musical theatre)</li>
                <li>Audition preparation & repertoire building</li>
                <li>Performance anxiety management</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Piano className="h-7 w-7" /> Piano & Keyboard Performance
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Technique & dexterity</li>
                <li>Sight-reading & ear training</li>
                <li>Music theory & harmony</li>
                <li>Repertoire development (solo & accompaniment)</li>
                <li>Improvisation & creative expression</li>
                <li>Performance preparation</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <BookOpen className="h-7 w-7" /> Music Direction & Conducting
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Score analysis & interpretation</li>
                <li>Rehearsal techniques & ensemble leadership</li>
                <li>Baton technique & expressive conducting</li>
                <li>Communication with musicians & performers</li>
                <li>Production planning & management</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Lightbulb className="h-7 w-7" /> Score Preparation & Technology
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Music notation software (Sibelius, Finale)</li>
                <li>Arranging & orchestration</li>
                <li>Transcribing & editing scores</li>
                <li>Digital audio workstations (DAW) basics</li>
                <li>Customise arrangements for specific needs</li> {/* Changed 'Customize' to 'Customise' */}
              </ul>
            </div>
          </div>

          {/* Who Benefits Section */}
          <section className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6">
            <h3 className="flex items-center gap-3 text-3xl font-bold text-brand-primary justify-center">
              <Users className="h-8 w-8" /> Who Benefits?
            </h3>
            <ul className="list-disc list-inside text-xl text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-3 pl-4">
              <li>Aspiring singers and instrumentalists looking to build a solid foundation.</li>
              <li>Experienced performers seeking to refine their technique and expand their repertoire.</li>
              <li>Students preparing for auditions, exams (AMEB, VCE), or performances.</li>
              <li>Music educators and directors looking to enhance their skills.</li>
              <li>Anyone passionate about music who wants to deepen their understanding and expression.</li>
            </ul>
          </section>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-brand-dark dark:text-brand-light mb-6">
              Ready to elevate your musical journey?
            </p>
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/book-voice-piano">
                Book a Voice & Piano Session
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VoicePianoServicesPage;