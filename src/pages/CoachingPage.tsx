"use client";

import React from 'react';
import { Card } from '@/components/ui/card'; // Only import Card, as sub-components are not directly used
import { Button } from '@/components/ui/button';
// Removed unused Link import:
// import { Link } from 'react-router-dom';
import { Mic, Leaf, Megaphone } from 'lucide-react';
import DynamicImage from '@/components/DynamicImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';

const CoachingPage: React.FC = () => {
  const pageTitle = "My Coaching Services";
  const subtitle = "Holistic Coaching for Your Voice, Body, and Performance";

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
              src="/danielecalmatpiano.jpeg"
              alt="Daniele Buatti playing piano with eyes closed, deeply in the moment"
              className="w-full h-96 md:h-[450px] object-cover object-[5%_20%]"
              width={800}
              height={533}
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>
          </section>

          {/* Overview Section */}
          <section className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6">
            <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              Unlock your full vocal and musical potential with personalized 1:1 coaching. Whether you're a seasoned performer or just starting your journey, my holistic approach integrates technical mastery with body awareness and mindset strategies to help you achieve authentic, confident expression.
            </p>
            <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              This work is deeply connected to overall well-being. By integrating body-voice practices and healing modalities, we can release physical tension, calm the nervous system, and clear mental blocks that might be hindering your vocal performance, confidence, and overall expressive freedom.
            </p>
          </section>

          {/* Coaching Pillars Section */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-brand-primary text-center">My Key Expertise</h2>
            <Separator className="max-w-xs mx-auto bg-brand-secondary" />

            {/* Performance & Musicianship Category */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 rounded-xl space-y-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-3xl font-bold text-brand-primary">
                <Mic className="h-8 w-8" /> Performance & Musicianship
              </h3>
              <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
                Develop effortless breath control, expand your range, refine tone, and master various vocal styles (contemporary, classical, musical theatre). Enhance your instrumental skills, improve sight-reading, deepen your understanding of music theory, and develop expressive piano performance for accompaniment or solo work. Includes audition preparation and repertoire building.
              </p>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Vocal Coaching (contemporary, classical, musical theatre)</li>
                <li>Piano & Keyboard Performance</li>
                <li>Music Direction & Conducting</li>
                <li>Score Preparation & Technology</li>
                <li>Audition Cut Playthrough</li>
              </ul>
            </Card>

            {/* Embodiment & Somatic Work Category */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 rounded-xl space-y-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-3xl font-bold text-brand-primary">
                <Leaf className="h-8 w-8" /> Embodiment & Somatic Work
              </h3>
              <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
                Explore deep body-mind integration through Kinesiology, energy balancing, and sound healing. These sessions are designed to restore balance, ease stress and tension, and release unhelpful patterns, fostering a profound connection between your inner self and your expressive voice. This work directly supports greater freedom and authenticity in all forms of communication and performance.
              </p>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Kinesiology</li>
                <li>Holistic Voice & Somatic Techniques (Breath-Body-Mind, Yoga, Mindfulness)</li>
                <li>Tension Release for vocal freedom</li>
                <li>Mind-Body Connection for natural resonance</li>
              </ul>
            </Card>

            {/* Presence & Communication Category */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 rounded-xl space-y-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-3xl font-bold text-brand-primary">
                <Megaphone className="h-8 w-8" /> Presence & Communication
              </h3>
              <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
                Refine your impact in any setting. These sessions focus on public speaking, on-camera performance, acting, and streaming presence. Learn to command attention, articulate clearly, and connect authentically with your audience, whether live or virtual. Develop techniques to manage nerves, enhance vocal projection, and embody confidence for powerful and memorable communication.
              </p>
              <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                <li>Public Speaking & Presentation</li>
                <li>Acting & Film Performance</li>
                <li>On-Camera & Streaming Presence</li>
              </ul>
            </Card>
          </div>

          {/* Call to Action to Book (Centralized) */}
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-brand-dark dark:text-brand-light mb-6">
              Ready to unlock your full potential?
            </p>
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
                Book a Session Now
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CoachingPage;