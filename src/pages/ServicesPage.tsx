"use client";

import React, { useEffect } from 'react';
import BookingPageLayout from '@/components/BookingPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mic, HeartHandshake } from 'lucide-react';
import DynamicImage from '@/components/DynamicImage'; // Import DynamicImage

const ServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BookingPageLayout pageTitle="My Services">
      <div className="max-w-4xl mx-auto space-y-8"> {/* Reduced space-y from 10 to 8 */}
        {/* Hero Image Section */}
        <section className="mb-8"> {/* Reduced mb from 12 to 8 */}
          <DynamicImage
            src="/danielecalmatpiano.jpeg"
            alt="Daniele Buatti playing piano with eyes closed, deeply in the moment"
            className="w-full h-80 md:h-96 object-cover rounded-xl shadow-lg border-4 border-brand-secondary" // Adjusted height
            width={800}
            height={533}
          />
        </section>

        <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mb-6"> {/* Removed font-libre-baskerville */}
          Welcome! I’m Daniele Buatti, a vocal coach and musician passionate about helping artists connect deeply with their voice and body. My holistic approach recognizes that true expression and well-being are deeply intertwined. Whether you're looking for private coaching, vocal technique, or body-mind integration sessions, you’ll find a space here to explore, grow, and refine your artistry through an embodied connection.
        </p>
        <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed mb-8"> {/* Removed font-libre-baskerville */}
          Bookings are available for vocal coaching, kinesiology sessions, and body-voice work. Choose a session that suits your needs, and let’s create something wonderful together, fostering both your artistic and personal growth.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Voice & Piano Coaching Card */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                <Mic className="h-7 w-7" />
                Voice & Piano Coaching
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 flex-grow space-y-4">
              <p>
                Unlock your full vocal and musical potential with personalised 1:1 coaching. My holistic approach integrates technical mastery with body awareness and mindset strategies to help you achieve authentic, confident expression. We'll explore how physical and emotional freedom directly enhances your vocal performance.
              </p>
              <p>
                Sessions are available in flexible 30, 45, 60, or 90-minute durations to perfectly fit your schedule and goals.
              </p>
            </CardContent>
            <div className="mt-6 text-center">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Link to="/book-voice-piano">
                  Book Voice & Piano
                </Link>
              </Button>
            </div>
          </Card>

          {/* Healing & Body-Voice Integration Card */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-brand-primary">
                <HeartHandshake className="h-7 w-7" />
                Healing & Body-Voice Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 flex-grow space-y-4">
              <p>
                Explore deep body-mind integration through Kinesiology, energy balancing, and sound healing. These sessions are designed to restore balance, ease stress and tension, and release unhelpful patterns, fostering a profound connection between your inner self and your expressive voice. This work directly supports greater freedom and authenticity in all forms of communication and performance.
              </p>
              <p>
                Options include Kinesiology & Energy Balancing, Community Kinesiology, Kinesiology + Voice Integration, and Sound Healing / Piano Sound Bath.
              </p>
            </CardContent>
            <div className="mt-6 text-center">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Link to="/book-healing">
                  Book Healing Session
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </BookingPageLayout>
  );
};

export default ServicesPage;