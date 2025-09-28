"use client";

import React, { useEffect } from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mic, Piano, Brain, Lightbulb } from 'lucide-react';

const VoicePianoServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BookingPageLayout pageTitle="Voice & Piano Coaching">
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
          Unlock your full vocal and musical potential with personalized 1:1 coaching. Whether you're a seasoned performer or just starting your journey, my holistic approach integrates technical mastery with body awareness and mindset strategies to help you achieve authentic, confident expression.
        </p>
        <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
          This work is deeply connected to overall well-being. By integrating body-voice practices and healing modalities, we can release physical tension, calm the nervous system, and clear mental blocks that might be hindering your vocal performance, confidence, and overall expressive freedom.
        </p>

        {/* Key Benefits Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                <Mic className="h-7 w-7" />
                Vocal Mastery
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
              Develop effortless breath control, expand your range, refine tone, and master various vocal styles (contemporary, classical, musical theatre). Includes audition preparation and repertoire building.
            </CardContent>
          </Card>
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                <Piano className="h-7 w-7" />
                Piano & Musicianship
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
              Enhance your instrumental skills, improve sight-reading, deepen your understanding of music theory, and develop expressive piano performance for accompaniment or solo work.
            </CardContent>
          </Card>
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                <Brain className="h-7 w-7" />
                Mindset & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
              Overcome performance anxiety, build unwavering confidence, and develop mental resilience for auditions, stage, or studio. Learn techniques to manage nerves and creative blocks.
            </CardContent>
          </Card>
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                <Lightbulb className="h-7 w-7" />
                Embodied Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
              Connect breath, body, and mind through somatic practices, Kinesiology, and Yoga principles. Release tension, improve posture, and find a deeper, more authentic connection to your artistry.
            </CardContent>
          </Card>
        </div>

        <p className="text-lg text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mt-8">
          Sessions are available in flexible 30, 45, 60, or 90-minute durations to perfectly fit your schedule and goals.
        </p>

        {/* Call to Action to Book */}
        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light hover:text-brand-dark text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"> {/* Added hover:text-brand-dark */}
            <Link to="/book-voice-piano">
              Book Your Voice & Piano Session
            </Link>
          </Button>
        </div>
      </div>
    </BookingPageLayout>
  );
};

export default VoicePianoServicesPage;