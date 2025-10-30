"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';
import AdditionalProgramsSection from '@/components/pages/landing-page-v3/AdditionalProgramsSection';
import BackToTopButton from '@/components/BackToTopButton';
import { Card, CardContent } from '@/components/ui/card'; // Import Card and CardContent
import DynamicImage from '@/components/DynamicImage'; // Import DynamicImage
import { Button } from '@/components/ui/button'; // Import Button
import { Link } from 'react-router-dom'; // Import Link

const ProjectsResourcesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>My Projects & Resources</SectionHeading>
          <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70 max-w-3xl mx-auto">
            Explore my diverse range of musical and educational ventures, from specialized services and products to community initiatives.
          </p>
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>

        <section className="py-12 space-y-12">
          {/* Music Director & Pianist Section - Integrated as a card */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 max-w-6xl mx-auto">
            <div className="lg:w-1/3 flex-shrink-0 flex justify-center">
              <DynamicImage
                src="/daniele simple.jpeg"
                alt="Daniele Buatti simple headshot"
                className="w-full max-w-sm h-auto rounded-xl shadow-lg object-cover border-4 border-brand-primary"
                width={400}
                height={400}
              />
            </div>
            <div className="lg:w-2/3 text-center lg:text-left space-y-6">
              <h3 className="text-4xl font-bold text-brand-primary">Music Director & Pianist</h3>
              <CardContent className="p-0 text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-4">
                <p>
                  I am a versatile music theatre practitioner with extensive experience as a vocal coach, pianist, music director, and performer. With a career spanning over a decade, I have collaborated on a wide range of productions, from large-scale musicals to intimate workshops. My approach blends technical expertise with a deep understanding of embodiment, performance psychology, and improvisation, helping performers find freedom, resonance, and authenticity in their voice.
                </p>
                <p>
                  As a pianist and music director, I bring a nuanced, collaborative energy to every production, tailoring musical direction to support both performers and the narrative. My teaching and coaching practice focuses on helping artists unlock their potential, manage performance stress, and develop a sustainable, expressive relationship with their craft.
                </p>
              </CardContent>
              <Button asChild size="lg" className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Link to="/music-director-pianist">
                  View My MD/Pianist Profile
                </Link>
              </Button>
            </div>
          </Card>

          {/* Other Programs Section (already contains FeaturedProgramCards for other projects) */}
          <AdditionalProgramsSection />
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ProjectsResourcesPage;