"use client";

import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mic, Leaf, Megaphone, Users, Brain, Lightbulb, Volume2 } from 'lucide-react';
import DynamicImage from '@/components/DynamicImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';
import PhilosophyStatement from '@/components/PhilosophyStatement';
import WhyWorkWithMeSection from '@/components/pages/landing-page-v3/WhyWorkWithMeSection'; // Import
import WhoIWorkWithSection from '@/components/pages/landing-page-v3/WhoIWorkWithSection'; // Import
import SessionsFormatsAvailabilitySection from '@/components/SessionsFormatsAvailabilitySection'; // Import new component

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

          {/* Reintroduced: Why Work With Me? */}
          <WhyWorkWithMeSection />
          <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

          {/* Reintroduced: Who I Work With */}
          <WhoIWorkWithSection />
          <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

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

            {/* Workshops & Group Coaching Card */}
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 rounded-xl space-y-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="flex items-center gap-3 text-3xl font-bold text-brand-primary">
                <Users className="h-8 w-8" /> Workshops & Group Coaching
              </h3>
              <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
                Join specialized group sessions for public speaking and on-camera presence, or explore the "Body Voice Sound Workshop" for movement, improvisation, and sound exploration. These collaborative environments offer unique opportunities for growth and connection.
              </p>
              <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
                Check the <Link to="/projects-resources" className="text-brand-primary hover:underline font-semibold">Projects & Resources page</Link> for upcoming workshop dates and details.
              </p>
            </Card>
          </div>

          {/* CTA 1: After expertise boxes */}
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
          <Separator className="max-w-3xl mx-auto bg-brand-secondary mt-12" />

          {/* Detailed Embodied Approach Section */}
          <section id="embodied-approach" className="max-w-4xl mx-auto space-y-10 py-12">
            <SectionHeading>My Embodied Holistic Approach</SectionHeading>
            <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
              All my teachings are informed by Buddhist and yogic philosophies, fostering a heart-centred, process-oriented journey focused on truth and transformation, not just the destination.
            </p>
            
            <PhilosophyStatement className="max-w-4xl mx-auto my-10" />

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <Brain className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
                <CardTitle className="text-2xl text-brand-primary">1. Embodiment & Alignment</CardTitle>
                <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                  Rooted in Kinesiology, Yoga, and Somatic Therapy, we soften the body, lift posture, and free the breath so it supports your voice with ease. Cultivate a deeper connection between mind and body to unlock your natural vocal resonance.
                </CardContent>
              </Card>
              <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <Lightbulb className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
                <CardTitle className="text-2xl text-brand-primary">2. Mindset & Performance Coaching</CardTitle>
                <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                  Utilising Mindfulness and therapeutic techniques, we manage nerves, setbacks, and creative blocks. Build unwavering confidence in practice, on stage, or on camera, understanding your mind to overcome performance anxiety.
                </CardContent>
              </Card>
              <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <Volume2 className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
                <CardTitle className="text-2xl text-brand-primary">3. Integrated Skill Development</CardTitle>
                <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                  Voice, piano, public speaking, acting, on-camera presence—tailored to your goals. Coaching is practical, creative, and always aligned with your unique vision, helping you refine repertoire and improve musicianship.
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-xl italic text-brand-dark/70 dark:text-brand-light/70 mt-8">
              “Daniele doesn’t just teach technique—he teaches how to inhabit your artistry and presence fully.”
            </p>
          </section>
          <Separator className="max-w-3xl mx-auto bg-brand-secondary mt-12" />

          {/* New Section: Session Formats & Availability */}
          <SessionsFormatsAvailabilitySection />

          {/* NEW: Call-out to Projects & Resources */}
          <div className="bg-brand-blue/10 dark:bg-brand-blue/20 p-8 rounded-xl shadow-lg text-center space-y-4 mt-12">
            <p className="text-xl font-semibold text-brand-dark dark:text-brand-light">
              Looking for AMEB accompaniment, live piano services, or to hire a Music Director?
            </p>
            <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/projects-resources">
                Explore Projects & Resources
              </Link>
            </Button>
          </div>

          {/* CTA 2: At the bottom of the page */}
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-brand-dark dark:text-brand-light mb-6">
              Ready to take the next step in your artistic journey?
            </p>
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
                Book Your Discovery Session
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