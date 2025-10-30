"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DynamicImage from '@/components/DynamicImage';
import { Separator } from '@/components/ui/separator';
import { Mic, Piano, Leaf, Megaphone, ArrowRight } from 'lucide-react';

const LandingPageV3: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-12 pb-12">
        {/* Hero Section */}
        <section className="relative text-center py-16 md:py-24 rounded-xl overflow-hidden shadow-2xl border-4 border-brand-secondary mb-12">
          <DynamicImage
            src="/daniele-hero-v3.jpeg"
            alt="Daniele Buatti performing with passion"
            className="absolute inset-0 w-full h-full object-cover object-[50%_30%] brightness-75"
            width={1920}
            height={1080}
          />
          <div className="relative z-10 text-brand-light max-w-3xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              Unleash Your Authentic Voice
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md font-medium">
              Holistic coaching for singers, speakers, and performers to connect deeply with their craft and audience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-darker text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Link to="/services">
                  Explore Services <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-brand-light text-brand-light hover:bg-brand-light/20 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
                  Book a Session
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="text-center py-12 max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold text-brand-primary">About Daniele Buatti</h2>
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
          <p className="text-lg leading-relaxed text-brand-dark/80 dark:text-brand-light/80">
            Daniele Buatti is a highly sought-after vocal coach, pianist, music director, and somatic practitioner with over 15 years of experience. He specialises in helping individuals find their authentic voice, both on and off stage, through a unique blend of technical mastery, emotional intelligence, and holistic well-being.
          </p>
          <Button asChild variant="link" className="text-brand-primary hover:underline text-lg">
            <Link to="/about">Learn More About Daniele</Link>
          </Button>
        </section>

        {/* Expertise Section */}
        <section className="py-12">
          <h2 className="text-4xl font-bold text-brand-primary text-center mb-8">My Expertise</h2>
          <Separator className="max-w-xs mx-auto bg-brand-secondary mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-brand-light dark:bg-brand-dark-alt p-6 rounded-xl shadow-lg border border-brand-secondary/50 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <Mic className="h-12 w-12 text-brand-primary mx-auto" />
              <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light">Vocal Coaching</h3>
              <p className="text-brand-dark/80 dark:text-brand-light/80">
                Develop breath control, expand your range, and refine your tone for any genre.
              </p>
              <Button asChild variant="link" className="text-brand-primary hover:underline">
                <Link to="/voice-piano-services">Discover Vocal Coaching</Link>
              </Button>
            </div>
            <div className="bg-brand-light dark:bg-brand-dark-alt p-6 rounded-xl shadow-lg border border-brand-secondary/50 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <Piano className="h-12 w-12 text-brand-primary mx-auto" />
              <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light">Piano & Musicianship</h3>
              <p className="text-brand-dark/80 dark:text-brand-light/80">
                Enhance instrumental skills, music theory, and expressive performance.
              </p>
              <Button asChild variant="link" className="text-brand-primary hover:underline">
                <Link to="/voice-piano-services">Explore Piano Coaching</Link>
              </Button>
            </div>
            <div className="bg-brand-light dark:bg-brand-dark-alt p-6 rounded-xl shadow-lg border border-brand-secondary/50 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <Leaf className="h-12 w-12 text-brand-primary mx-auto" />
              <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light">Embodiment & Somatic Work</h3>
              <p className="text-brand-dark/80 dark:text-brand-light/80">
                Integrate mind and body for greater freedom and authentic expression.
              </p>
              <Button asChild variant="link" className="text-brand-primary hover:underline">
                <Link to="/book-embodiment-somatic">Learn About Somatic Work</Link>
              </Button>
            </div>
            <div className="bg-brand-light dark:bg-brand-dark-alt p-6 rounded-xl shadow-lg border border-brand-secondary/50 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <Megaphone className="h-12 w-12 text-brand-primary mx-auto" />
              <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light">Presence & Communication</h3>
              <p className="text-brand-dark/80 dark:text-brand-light/80">
                Refine your impact in public speaking, acting, and on-camera performance.
              </p>
              <Button asChild variant="link" className="text-brand-primary hover:underline">
                <Link to="/book-presence-communication">Boost Your Presence</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-12 bg-brand-secondary/10 dark:bg-brand-dark-alt/30 rounded-xl shadow-inner mb-12">
          <h2 className="text-4xl font-bold text-brand-primary text-center mb-8">What Clients Say</h2>
          <Separator className="max-w-xs mx-auto bg-brand-secondary mb-10" />
          <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
            <p className="text-xl italic leading-relaxed text-brand-dark/80 dark:text-brand-light/80">
              "Daniele's holistic approach transformed my performance. I not only improved my vocal technique but also gained immense confidence and a deeper connection to my artistry. He truly helps you realise your full potential."
            </p> {/* Changed 'realize' to 'realise' */}
            <p className="font-semibold text-brand-primary text-lg">— Sarah L., Professional Singer</p>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-12 bg-brand-primary/10 dark:bg-brand-dark-alt/50 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold text-brand-primary mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl leading-relaxed text-brand-dark/80 dark:text-brand-light/80 mb-8">
            Whether you're looking to refine your craft, overcome performance anxiety, or simply explore your creative potential, Daniele is here to guide you.
          </p>
          <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-darker text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
              Book a Free Consultation
            </a>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPageV3;