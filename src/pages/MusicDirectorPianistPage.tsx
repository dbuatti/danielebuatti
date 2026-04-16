"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { GraduationCap, ArrowLeft, Music, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const MusicDirectorPianistPage: React.FC = () => {
  const cvLink = "https://rxresu.me/daniele.buatti/daniele-buatti-md";
  const imageSrc = "/daniele simple.jpeg";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16">
          <SectionHeading>Music Director & Pianist</SectionHeading>
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Collaborative musical leadership for stage, studio, and performance development.
          </p>
        </div>

        {/* Main Content - Cardless Layout */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          {/* Left Column: Image & Quick Actions */}
          <div className="space-y-8">
            <div className="relative">
              <DynamicImage
                src={imageSrc}
                alt="Daniele Buatti"
                className="w-full h-auto rounded-[2.5rem] shadow-2xl object-cover border-4 border-white dark:border-gray-800"
                width={400}
                height={400}
              />
              <div className="absolute -bottom-4 -right-4 bg-brand-primary p-4 rounded-2xl shadow-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <Button asChild size="lg" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-lg py-7 rounded-full shadow-xl transition-all hover:scale-[1.02]">
                <a href={cvLink} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-5 w-5" /> View Full CV
                </a>
              </Button>
              <p className="text-center text-sm text-gray-500 italic">
                Available for music direction, piano performance, and vocal coaching.
              </p>
            </div>
          </div>

          {/* Right Column: Bio & Education */}
          <div className="space-y-10">
            <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <p className="text-2xl font-light text-gray-900 dark:text-white leading-snug">
                I'm a music theatre practitioner based in Melbourne, with over a decade of experience as a music director, pianist, vocal coach, and performer.
              </p>
              <p>
                My work spans large-scale productions and intimate workshops. Credits include <span className="font-semibold text-brand-primary">Paw Patrol Live, Beetlejuice, Heathers, A Chorus Line, Shrek, Legally Blonde, Mary Poppins</span>, and <span className="font-semibold text-brand-primary">Madiba the Musical</span> at Melbourne's Comedy Theatre.
              </p>
              <p>
                As a music director and pianist, I bring a collaborative, detail-oriented approach to every production — supporting performers, serving the narrative, and building a musical environment where the whole cast can do their best work.
              </p>
              <p>
                As a vocal coach, I work with performers at all levels to develop technical skill, expressive range, and confidence under pressure. My coaching draws on vocal pedagogy, performance psychology, and body-voice integration informed by my <span className="italic">Diploma of Kinesiology</span> — helping singers address not just technique, but the physical and psychological patterns that shape how they perform.
              </p>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-800" />

            {/* Education & Training Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                <GraduationCap className="h-7 w-7 text-brand-primary" />
                Education & Training
              </h3>
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white">Bachelor of Music</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Australian Institute of Music (2014–2016) — majoring in Arranging, Composition, Orchestration, and Piano.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white">Diploma of Kinesiology</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Specialising in mind-body integration, which underpins my approach to performance coaching and artist development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-24 pt-12 border-t border-gray-200 dark:border-gray-800">
          <Button asChild variant="ghost" className="text-gray-500 hover:text-brand-primary transition-colors rounded-full px-8">
            <Link to="/projects-resources">
              <span className="flex items-center text-lg font-medium">
                <ArrowLeft className="h-5 w-5 mr-2" /> Back to Projects & Services
              </span>
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicDirectorPianistPage;