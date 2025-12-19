"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mic, Leaf, Megaphone, Users, DollarSign } from 'lucide-react';
import DynamicImage from '@/components/DynamicImage';
import Navbar from '@/components/Navbar'; // Import Navbar
import Footer from '@/components/Footer'; // Import Footer
import SectionHeading from '@/components/SectionHeading'; // Import SectionHeading
import { Separator } from '@/components/ui/separator'; // Import Separator

const CoachingPage: React.FC = () => {
  // Removed useEffect for scrolling, as ScrollToTop component now handles all scroll logic.

  const pageTitle = "My Coaching Services";
  const subtitle = "Your Three-Pillar Journey to Performance Freedom.";

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar /> {/* Add Navbar */}
      <main className="container mx-auto px-4 pt-8 pb-8">
        <div className="text-center space-y-4 mb-8">
          <SectionHeading>{pageTitle}</SectionHeading>
          {subtitle && <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70">{subtitle}</p>}
          {/* Removed Separator here */}
        </div>

        <section className="max-w-4xl mx-auto space-y-8">
          {/* Hero Image Section */}
          <section className="relative mt-4 mb-4 rounded-xl overflow-hidden shadow-lg border-4 border-brand-secondary">
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

          {/* Consolidated Philosophy Section */}
          <section id="embodied-approach" className="bg-brand-secondary/10 dark:bg-brand-dark-alt/30 p-8 rounded-xl shadow-inner space-y-6 text-center">
            <h3 className="text-3xl font-bold text-brand-primary text-center">The Holistic Difference</h3>
            <ul className="list-disc list-inside text-xl text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-3 text-left">
              <li>Unlock your full vocal and musical potential with personalised 1:1 coaching, integrating technical mastery with body awareness and mindset strategies for authentic, confident expression.</li>
              <li>This work is deeply connected to overall well-being. By integrating body-voice practices and healing modalities, we can release physical tension, calm the nervous system, and clear mental blocks that might be hindering your vocal performance, confidence, and overall expressive freedom.</li>
            </ul>
            <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 max-w-3xl mx-auto">
              My unique approach integrates embodiment, mindset, and skill development to help you achieve authentic, confident expression without strain or burnout. I guide you to connect body, breath, and voice, fostering a deeper understanding of your own expressive patterns.
            </p>
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/about#embodied-approach">
                Explore My Full Approach
              </Link>
            </Button>
          </section>
          {/* Removed Separator here */}

          {/* Reintroduced: Why Work With Me? */}
          <div className="py-8">
            <WhyWorkWithMeSection />
          </div>
          {/* Removed Separator here */}

          {/* Reintroduced: Who I Work With */}
          <div className="py-8">
            <WhoIWorkWithSection />
          </div>
          {/* Removed Separator here */}

          {/* Coaching Pillars Section */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-brand-primary text-center">My Key Expertise</h2>
            <Separator className="max-w-xs mx-auto bg-brand-secondary" />

            {/* Performance & Musicianship Category */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-3xl text-brand-primary">
                  <Mic className="h-8 w-8" />
                  Vocal & Instrumental Mastery
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
                <p className="text-lg">
                  Develop effortless breath control, expand your range, refine tone, and master various vocal styles (contemporary, classical, musical theatre). Enhance your instrumental skills, improve sight-reading, deepen your understanding of music theory, and develop expressive piano performance for musicianship and solo repertoire. This includes composition, songwriting, and score preparation with music technology. Includes audition preparation and repertoire building.
                </p>
                <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                  <li>Vocal Coaching</li>
                  <li>Piano & Keyboard</li>
                </ul>
              </CardContent>
            </Card>

            {/* Embodiment & Somatic Work Category - Enhanced description */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-3xl text-brand-primary">
                  <Leaf className="h-8 w-8" />
                  Embodiment & Somatic Healing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
                <p className="text-lg">
                  Explore deep body-mind integration through <strong className="text-brand-primary">Kinesiology</strong>, energy balancing, and sound healing. These sessions are designed to restore balance, ease stress and tension, and release unhelpful patterns, fostering a profound connection between your inner self and your expressive voice. This work directly supports greater freedom and authenticity in all forms of communication and performance.
                </p>
                <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                  <li>Kinesiology & Body-Mind Integration</li>
                  <li>Breath–Body–Mind, Yoga, Mindfulness</li>
                  <li>Tension Release for a healthier body, heart, and mind</li>
                  <li>Mind–Body Connection for natural resonance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Presence & Communication Category */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-3xl text-brand-primary">
                  <Megaphone className="h-8 w-8" />
                  Presence and Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
                <p className="text-lg">
                  Refine your impact in any setting. These sessions focus on public speaking, on-camera performance, acting, and streaming presence. Learn to command attention, articulate clearly, and connect authentically with your audience, whether live or virtual. Develop techniques to manage nerves, enhance vocal projection, and embody confidence for powerful and memorable communication.
                </p>
                <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2 pl-4">
                  <li>Cultivating authentic presence and grounded awareness</li>
                  <li>Integrating voice, body, and energy for impactful delivery</li>
                  <li>Building emotional intelligence and conscious communication</li>
                  <li>Expressing with clarity, confidence, and resonance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Workshops & Group Coaching Card */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 rounded-xl space-y-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-3xl text-brand-primary">
                  <Users className="h-8 w-8" />
                  Workshops & Group Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
                <p className="text-lg">
                  Join specialised group sessions for public speaking and on-camera presence, or explore the "Body Voice Sound Workshop" for movement, improvisation, and sound exploration. These collaborative environments offer unique opportunities for growth and connection.
                </p>
                <div className="mt-6 text-center">
                  <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
                    <Link to="/projects-resources">
                      View Upcoming Workshop Dates
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Removed Separator here */}

          {/* NEW: Pricing & Packages Section (Moved up) */}
          <section id="pricing" className="max-w-4xl mx-auto space-y-6 py-8">
            <SectionHeading>Pricing & Packages</SectionHeading>
            <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
              Invest in your growth with flexible coaching options designed to fit your needs. All sessions are tailored to your individual goals and can be conducted remotely via Zoom or in-person at my studio in Toorak, Melbourne.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <CardHeader className="p-0 pb-4">
                  <DollarSign className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
                  <CardTitle className="text-2xl text-brand-primary">Single Coaching Sessions</CardTitle>
                </CardHeader>
                <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
                  <p className="text-lg font-semibold">Flexible durations for focused work:</p>
                  <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                    <li>30-minute session: £50</li>
                    <li>45-minute session: £75</li>
                    <li>60-minute session: £95</li>
                    <li>90-minute session: £140</li>
                  </ul>
                  <p className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-2">
                    Perfect for technical deep dives, repertoire building, and communication skills.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <CardHeader className="p-0 pb-4">
                  <Users className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
                  <CardTitle className="text-2xl text-brand-primary">Package Deals (Based on 60-Minute Rate)</CardTitle>
                </CardHeader>
                <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
                  <p className="text-lg font-semibold">Commit to deeper transformation and save:</p>
                  <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                    <li>4 x 60-minute sessions: £360 (Save £20)</li>
                    <li>8 x 60-minute sessions: £700 (Save £60)</li>
                    <li>Custom packages available upon request.</li>
                  </ul>
                  <p className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-2">
                    Ideal for long-term development and consistent progress.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-6">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <a href="https://app.acuityscheduling.com/schedule.php?owner=22925011&appointmentType=category:1:1%20Coaching:%20Voice,%20Piano%20%26%20Performance" target="_blank" rel="noopener noreferrer">
                  View Detailed Availability & Book
                </a>
              </Button>
            </div>
          </section>
          {/* Removed Separator here */}

          {/* NEW: Call-out to Projects & Resources */}
          <div className="bg-brand-blue/10 dark:bg-brand-blue/20 p-6 rounded-xl shadow-lg text-center space-y-4 my-8">
            <p className="text-xl font-semibold text-brand-dark dark:text-brand-light">
              Looking for AMEB accompaniment, live piano services, or to hire a Music Director?
            </p>
            <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/projects-resources">
                Explore Projects & Resources
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CoachingPage;