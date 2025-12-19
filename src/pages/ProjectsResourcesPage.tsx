"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoStructuredData from "@/components/SeoStructuredData";
import SeoMetadata from "@/components/SeoMetadata";
import DynamicImage from "@/components/DynamicImage";

// Horizontal card – same as landing page
const HorizontalProgramCard: React.FC<{
  title: string;
  description: string;
  link: string;
  imageSrc: string;
}> = ({ title, description, link, imageSrc }) => {
  const isInternalLink = link.startsWith("/") || link.startsWith("#");

  return (
    <div
      className="group relative h-80 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
      onClick={() => window.open(link, isInternalLink ? "_self" : "_blank")}
      tabIndex={0}
      role="link"
      aria-label={`Go to ${title}`}
    >
      <DynamicImage
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        width={1200}
        height={600}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
      <div className="relative z-10 h-full flex flex-col justify-end p-10 text-left">
        <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-2xl">
          {title}
        </h3>
        <p className="text-lg text-white/95 drop-shadow-lg">
          {description}
        </p>
      </div>
      <div className="absolute inset-0 ring-4 ring-white/0 group-hover:ring-white/30 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

// Piano Backings Card
const PianoBackingsCard: React.FC = () => {
  return (
    <div
      className="group relative h-80 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
      onClick={() => window.open("https://pianobackingsbydaniele.vercel.app", "_blank")}
      tabIndex={0}
      role="link"
      aria-label="Go to Piano Backing Tracks"
    >
      <div className="absolute inset-0 bg-[#ff00b3]" />
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <DynamicImage
          src="/pianobackingslogo.png"
          alt="Piano Backing Tracks"
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
          width={1200}
          height={600}
        />
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <SeoStructuredData />
      <SeoMetadata 
        title="Projects & Services - Daniele Buatti"
        description="Live performances, music direction, digital products, and community initiatives."
        url={`${window.location.origin}/projects`}
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-light mb-6">Projects & Services</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            Explore my work beyond one-to-one coaching — from live performance and music direction to digital resources and community singing.
          </p>
        </header>

        <div className="space-y-20">
          {/* Specialised Services */}
          <section>
            <h2 className="text-4xl font-light text-center mb-12">Specialised Services</h2>
            <div className="space-y-12">
              <HorizontalProgramCard
                title="Music Director & Pianist"
                description="Music theatre direction, vocal coaching, and performance."
                link="/music-director-pianist"
                imageSrc="/daniele-conducting.jpeg"
              />
              <HorizontalProgramCard
                title="Live Piano Services"
                description="Weddings, events, and private functions."
                link="/live-piano-services"
                imageSrc="/blacktie.avif"
              />
              <HorizontalProgramCard
                title="AMEB Accompanying"
                description="Exam day and rehearsal accompaniment."
                link="/ameb-accompanying"
                imageSrc="/ameb-placeholder.jpg"
              />
            </div>
          </section>

          {/* Digital & Community */}
          <section>
            <h2 className="text-4xl font-light text-center mb-12">Digital Products & Community</h2>
            <div className="space-y-12">
              <HorizontalProgramCard
                title="Buattiverse"
                description="Sheet music and backing tracks"
                link="https://buattiverse.gumroad.com/"
                imageSrc="/sheetmusic.png"
              />
              <PianoBackingsCard />
              <HorizontalProgramCard
                title="Resonance with Daniele: A Joyful Pop-Up Choir for All Voices"
                description="Join a welcoming community to sing, connect, and shine, with no experience needed."
                link="https://resonance-with-daniele.vercel.app"
                imageSrc="/conduct.jpeg"
              />
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ProjectsPage;