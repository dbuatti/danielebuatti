"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ImageCarouselSection from "@/components/pages/landing-page-v3/ImageCarouselSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DynamicImage from "@/components/DynamicImage";
import CorePrinciplesHeading from "@/components/CorePrinciplesHeading"; // Import new component

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 pt-6 pb-6">
        <div className="text-center space-y-4 mb-6">
          <SectionHeading>About Daniele Buatti</SectionHeading>
          <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70 max-w-3xl mx-auto">
            Discover Daniele's journey, philosophy, and the integrated approach that defines his coaching.
          </p>
          {/* Removed Separator here */}
        </div>

        {/* Introduction with Integrated Image */}
        <section className="max-w-4xl mx-auto py-4 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <DynamicImage
              src="/daniele simple.jpeg"
              alt="Daniele Buatti"
              className="rounded-full shadow-xl border-4 border-brand-primary w-48 h-48 object-cover"
              width={192}
              height={192}
            />
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="text-2xl font-bold text-brand-primary mb-4">Dedicated to Embodied Performance and Well-being</h2>
            <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
              With over 12 years of experience as a Music Director, Pianist, Arranger, Vocal Coach, and Educator, 
              Daniele Buatti brings together professional music theatre expertise with somatic practices to train 
              versatile, resilient, and expressive performers.
            </p>
          </div>
        </section>
        {/* Removed Separator here */}

        {/* 1. Daniele's Story: Experience & Credibility */}
        <section id="daniele-story" className="max-w-4xl mx-auto space-y-6 py-8">
          <SectionHeading>Daniele Buatti: Musician, Coach, and Embodiment Practitioner</SectionHeading>
          <div className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-4">
            <p>
              Daniele's journey began with a deep passion for music and performance, leading him to a Bachelor of Music at the Australian Institute of Music. His career has spanned a wide range of productions, from large-scale musicals to intimate workshops, where he has collaborated with artists to unlock their full potential.
            </p>
            <p>
              Beyond the stage, Daniele's commitment to holistic development led him to pursue a Diploma of Kinesiology, specialising in mind-body integration for performance and well-being. This unique blend of artistic and therapeutic knowledge allows him to guide students not only in technical mastery but also in fostering authentic connection and healing through self-awareness.
            </p>
            <p>
              He believes expression truly happens when the thought arises to express, and his therapeutic approach helps students gain a deeper understanding of their own mannerisms, expressions, and thoughts. Daniele is passionate about the transformative power of music and theatre, inspiring performers of all ages and levels to combine artistry, empathy, and technical skill to create performances that are both compelling and heartfelt.
            </p>
          </div>
        </section>
        {/* Removed Separator here */}

        {/* 2. My Embodied Holistic Approach (Narrative text only) */}
        <section id="embodied-approach-narrative" className="max-w-4xl mx-auto space-y-10 py-8">
          <SectionHeading>My Embodied Holistic Approach</SectionHeading>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
            All my teachings are informed by Buddhist and yogic philosophies, fostering a heart-centred, process-oriented journey focused on truth and transformation, not just the destination.
          </p>
          <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            I help performers and communicators connect body, breath, and voice so they can express themselves with freedom, authenticity, and ease. My work is about discovering a voice that feels grounded, resonant, and spacious — one that grows out of the whole body rather than being forced or strained.
          </p>
          <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            With over 12 years of experience as a Music Director, Pianist, Arranger, Vocal Coach, and Educator, I bring together professional music theatre expertise, vocal pedagogy, and somatic practices influenced by kinesiology and yoga. This integrated approach forms the foundation for my unique, embodied coaching.
          </p>
          <p className="text-xl text-center text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            Ready to dive deeper into how this approach can transform your performance and communication?
          </p>
          <div className="text-center">
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link to="/coaching">
                Explore My Full Approach
              </Link>
            </Button>
          </div>
        </section>
        {/* Removed Separator here */}

        {/* 3. The Guiding Principles: THOUGHT • INTENTION • BREATH • EXPRESSION */}
        <section id="guiding-principles" className="max-w-4xl mx-auto space-y-10 py-8">
          <CorePrinciplesHeading />
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
            My coaching is built upon a simple yet powerful framework that integrates the mind, body, and voice to unlock true expressive freedom. This process ensures your performance is authentic, grounded, and sustainable.
          </p>
          <div className="text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-4 pl-4">
            <p>
              <strong className="text-brand-primary">THOUGHT:</strong> We address the mental blocks and patterned behaviours that hinder your freedom. This involves conscious intention-setting and cultivating the self-awareness necessary for growth.
            </p>
            <p>
              <strong className="text-brand-primary">INTENTION:</strong> We clarify your artistic purpose and desired outcome for every performance and interaction. When your physical body aligns with your intention, your expression becomes effortlessly powerful.
            </p>
            <p>
              <strong className="text-brand-primary">BREATH:</strong> We establish the physical foundation for sound. By deepening and freeing your breath, we release physical tension, calm the nervous system, and create the space for a resonant, authentic voice to emerge.
            </p>
            <p>
              <strong className="text-brand-primary">EXPRESSION:</strong> This is the culmination of the process—your authentic voice in action. It is the moment when technique, body, and intention integrate, allowing you to connect confidently and compellingly with your audience.
            </p>
          </div>
        </section>
        {/* Removed Separator here */}

        {/* 4. Daniele's Moments (Image Gallery) */}
        <div className="py-8">
          <ImageCarouselSection />
        </div>
        {/* Removed Separator here */}
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;