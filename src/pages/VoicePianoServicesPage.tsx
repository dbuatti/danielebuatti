"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mic, Piano, Brain, Lightbulb } from 'lucide-react';
import DynamicImage from '@/components/DynamicImage';
import Navbar from '@/components/Navbar'; // Import Navbar
import Footer from '@/components/Footer'; // Import Footer
import SectionHeading from '@/components/SectionHeading'; // Import SectionHeading
import { Separator } from '@/components/ui/separator'; // Import Separator

const VoicePianoServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageTitle = "Performance & Musicianship Coaching"; // Changed from "Voice & Piano Coaching"
  const subtitle = "Unlock Your Full Vocal & Musical Potential";

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar /> {/* Add Navbar */}
      <main className="container mx-auto px-4 pt-12 pb-12"> {/* Adjust padding */}
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>{pageTitle}</SectionHeading>
          {subtitle && <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70">{subtitle}</p>}
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Hero Image Section */}
          <section className="relative mt-8 mb-8 rounded-xl overflow-hidden shadow-lg border-4 border-brand-secondary">
            <DynamicImage
              src="/danielepianolaugh.jpeg"
              alt="Daniele Buatti laughing while playing piano"
              className="w-full h-96 md:h-[450px] object-cover object-center"
              width={800}
              height={533}
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>
          </section>

          {/* Introduction Text Section with subtle background */}
          <section className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6">
            <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              Unlock your full vocal and musical potential with personalized 1:1 coaching. Whether you're a seasoned performer or just starting your journey, my holistic approach integrates technical mastery with body awareness and mindset strategies to help you achieve authentic, confident expression.
            </p>
            <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              This work is deeply connected to overall well-being. By integrating body-voice practices and healing modalities, we can release physical tension, calm the nervous system, and clear mental blocks that might be hindering your vocal performance, confidence, and overall expressive freedom.
            </p>
          </section>

          {/* Key Benefits Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] hover:border-brand-primary transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                  <Mic className="h-7 w-7" />
                  Vocal Mastery
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 flex-grow space-y-4">
                <p>
                  Develop effortless breath control, expand your range, refine tone, and master various vocal styles (contemporary, classical, musical theatre). Includes audition preparation and repertoire building.
                </p>
                <p>
                  Sessions are available in flexible 30, 45, 60, or 90-minute durations to perfectly fit your schedule and goals.
                </p>
              </CardContent>
            </Card>

            {/* Healing & Body-Voice Integration Card */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] hover:border-brand-primary transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                  <Piano className="h-7 w-7" />
                  Piano & Musicianship
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 flex-grow space-y-4">
                <p>
                  Enhance your instrumental skills, improve sight-reading, deepen your understanding of music theory, and develop expressive piano performance for accompaniment or solo work.
                </p>
                <p>
                  Sessions are available in flexible 30, 45, 60, or 90-minute durations to perfectly fit your schedule and goals.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] hover:border-brand-primary transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                  <Brain className="h-7 w-7" />
                  Mindset & Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 flex-grow">
                Overcome performance anxiety, build unwavering confidence, and develop mental resilience for auditions, stage, or studio. Learn techniques to manage nerves and creative blocks.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] hover:border-brand-primary transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                  <Lightbulb className="h-7 w-7" />
                  Embodied Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 flex-grow">
                Connect breath, body, and mind through somatic practices, Kinesiology, and Yoga principles. Release tension, improve posture, and find a deeper, more authentic connection to your artistry.
              </CardContent>
            </Card>
          </div>

          <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mt-8">
            Sessions are available in flexible 30, 45, 60, or 90-minute durations to perfectly fit your schedule and goals.
          </p>

          {/* Call to Action to Book */}
          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/book-voice-piano">
                Book Your Performance & Musicianship Session
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default VoicePianoServicesPage;