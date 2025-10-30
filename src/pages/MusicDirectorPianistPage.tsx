"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DynamicImage from '@/components/DynamicImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Music, Users, Lightbulb, Mic, Piano } from 'lucide-react';
import { Link } from 'react-router-dom';

const MusicDirectorPianistPage: React.FC = () => {
  const pageTitle = "Music Director & Pianist";
  const subtitle = "Expert Musical Leadership for Your Production";

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
              src="/daniele-md.jpeg"
              alt="Daniele Buatti conducting an orchestra"
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
              With extensive experience in musical theatre, opera, and contemporary ensembles, I offer comprehensive music direction and piano services to bring your production to life. From initial concept to opening night, I provide expert guidance, meticulous preparation, and inspiring leadership.
            </p>
          </section>

          {/* Key Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Music className="h-7 w-7" /> Music Direction
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Score analysis & interpretation</li>
                <li>Audition & casting support</li>
                <li>Rehearsal planning & execution</li>
                <li>Orchestral/ensemble conducting</li>
                <li>Vocal coaching for cast members</li>
                <li>Collaboration with creative team</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Piano className="h-7 w-7" /> Rehearsal & Performance Pianist
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Rehearsal pianist for musicals, operas, and concerts</li>
                <li>Performance pianist for live shows</li>
                <li>Sight-reading & quick learning of complex scores</li>
                <li>Adaptability to various musical styles</li>
                <li>Support for vocalists and instrumentalists</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Lightbulb className="h-7 w-7" /> Arranging & Orchestration
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Customise arrangements for specific instrumentation</li> {/* Changed 'Customize' to 'Customise' */}
                <li>Orchestration for various ensemble sizes</li>
                <li>Transcribing & adapting existing works</li>
                <li>Score preparation using Sibelius/Finale</li>
              </ul>
            </div>

            <div className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
                <Mic className="h-7 w-7" /> Vocal Coaching for Productions
              </h3>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Individual and group vocal sessions for cast</li>
                <li>Focus on vocal health, technique, and characterisation</li>
                <li>Harmonise and blend ensemble vocals</li> {/* Changed 'Harmonize' to 'Harmonise' */}
                <li>Troubleshooting vocal challenges</li>
              </ul>
            </div>
          </div>

          {/* Why Choose Me Section */}
          <section className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6">
            <h3 className="flex items-center gap-3 text-3xl font-bold text-brand-primary justify-center">
              <Users className="h-8 w-8" /> Why Choose Daniele?
            </h3>
            <ul className="list-disc list-inside text-xl text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-3 pl-4">
              <li>Over 15 years of professional experience in musical theatre and live performance.</li>
              <li>A collaborative and supportive approach to bring out the best in your team.</li>
              <li>Meticulous attention to detail in all aspects of musical preparation.</li>
              <li>Ability to work effectively with diverse casts and creative teams.</li>
              <li>A passion for storytelling through music.</li>
            </ul>
          </section>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-brand-dark dark:text-brand-light mb-6">
              Ready to elevate your production with expert musical leadership?
            </p>
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/contact">
                Inquire About Music Direction
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MusicDirectorPianistPage;