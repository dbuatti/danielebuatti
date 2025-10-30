"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import { Separator } from "@/components/ui/separator";
import PhilosophyStatement from "@/components/PhilosophyStatement";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb, Volume2 } from 'lucide-react';
import ImageCarouselSection from "@/components/pages/landing-page-v3/ImageCarouselSection"; // Import ImageCarouselSection
// import DynamicImage from "@/components/DynamicImage"; // Removed

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>About Daniele Buatti</SectionHeading>
          <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70 max-w-3xl mx-auto">
            Discover Daniele's journey, philosophy, and the integrated approach that defines his coaching.
          </p>
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>

        {/* Detailed Embodied Approach Section (Moved from CoachingPage) */}
        <section id="embodied-approach" className="max-w-4xl mx-auto space-y-10 py-12">
          <SectionHeading>My Embodied Holistic Approach</SectionHeading>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
            All my teachings are informed by Buddhist and yogic philosophies, fostering a heart-centred, process-oriented journey focused on truth and transformation, not just the destination.
          </p>
          
          <PhilosophyStatement className="max-w-4xl mx-auto my-10" />

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4">
              <CardHeader className="p-0 pb-4">
                <Brain className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
                <CardTitle className="text-2xl text-brand-primary">1. Embodiment & Alignment</CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Rooted in Kinesiology, Yoga, and Somatic Therapy, we soften the body, lift posture, and free the breath so it supports your voice with ease. Cultivate a deeper connection between mind and body to unlock your natural vocal resonance.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4">
              <CardHeader className="p-0 pb-4">
                <Lightbulb className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
                <CardTitle className="text-2xl text-brand-primary">2. Mindset & Performance Coaching</CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Utilising Mindfulness and therapeutic techniques, we manage nerves, setbacks, and creative blocks. Build unwavering confidence in practice, on stage, or on camera, understanding your mind to overcome performance anxiety.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4">
              <CardHeader className="p-0 pb-4">
                <Volume2 className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
                <CardTitle className="text-2xl text-brand-primary">3. Integrated Skill Development</CardTitle>
                </CardHeader>
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

        {/* Daniele's Moments (Image Carousel Section - Moved from LandingPageV3) */}
        <ImageCarouselSection />
        <Separator className="max-w-3xl mx-auto bg-brand-secondary mt-12" />

        {/* Placeholder for full bio text if needed */}
        <section className="max-w-4xl mx-auto space-y-6 py-12">
          <SectionHeading>Daniele's Story</SectionHeading>
          <div className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-4">
            <p>
              With over 12 years of experience as a Music Director, Pianist, Arranger, Vocal Coach, and Educator, Daniele Buatti brings together professional music theatre expertise, vocal pedagogy, and somatic practices influenced by kinesiology and yoga. This integrated approach forms the foundation for his unique, embodied coaching — training versatile, resilient, and expressive performers and communicators.
            </p>
            <p>
              Daniele's journey began with a deep passion for music and performance, leading him to a Bachelor of Music at the Australian Institute of Music. His career has spanned a wide range of productions, from large-scale musicals to intimate workshops, where he has collaborated with artists to unlock their full potential.
            </p>
            <p>
              Beyond the stage, Daniele's commitment to holistic development led him to pursue a Diploma of Kinesiology, specializing in mind-body integration for performance and well-being. This unique blend of artistic and therapeutic knowledge allows him to guide students not only in technical mastery but also in fostering authentic connection and healing through self-awareness.
            </p>
            <p>
              He believes expression truly happens when the thought arises to express, and his therapeutic approach helps students gain a deeper understanding of their own mannerisms, expressions, and thoughts. Daniele is passionate about the transformative power of music and theatre, inspiring performers of all ages and levels to combine artistry, empathy, and technical skill to create performances that are both compelling and heartfelt.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;