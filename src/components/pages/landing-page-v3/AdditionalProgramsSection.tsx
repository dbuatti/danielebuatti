import React from "react";
import SectionHeading from "@/components/SectionHeading";
import AdditionalProgramBanner from "@/components/AdditionalProgramBanner";
import PillBanner from "@/components/PillBanner";
import FeaturedProgramCard from "@/components/FeaturedProgramCard";

const AdditionalProgramsSection: React.FC = () => {
  return (
    <section className="mt-12">
      <div className="container mx-auto px-4 mb-10">
        <SectionHeading>Explore More from Daniele</SectionHeading>
      </div>
      <div className="space-y-12">
        {/* FeaturedProgramCard for Buattiverse */}
        <FeaturedProgramCard
          title="Buattiverse: Sheet Music & Backing Tracks"
          description="Your curated source for professional vocal transcriptions, SATB arrangements, and essential music resources."
          link="https://buattiverse.gumroad.com/"
          linkText="Visit Buattiverse Store"
          backgroundImageSrc="/sheetmusic.png"
          className="max-w-6xl"
        />

        {/* FeaturedProgramCard for Piano Backings */}
        <FeaturedProgramCard
          title="Professional Piano Backing Tracks"
          description="High-quality, meticulously crafted tracks for singers and performers, streamlining your preparation."
          link="https://pianobackingsbydaniele.vercel.app"
          linkText="Discover Piano Backings"
          backgroundImageSrc="/pianobackingslogo.png"
          className="max-w-6xl"
          buttonBgClass="bg-brand-dark hover:bg-brand-dark/90 text-brand-light"
          overlayColorClass="bg-brand-magenta/30" // Applied the updated brand-magenta overlay
        />

        {/* FeaturedProgramCard for Resonance with Daniele */}
        <FeaturedProgramCard
          title="Resonance with Daniele: A Joyful Pop-Up Choir for All Voices"
          description="Join a welcoming community to sing, connect, and shine, with no experience needed."
          link="https://resonance-with-daniele.vercel.app"
          linkText="Join Resonance Choir"
          backgroundImageSrc="/blue-pink-ontrans.png"
          className="max-w-6xl"
          buttonBgClass="bg-brand-light hover:bg-brand-light/90 text-brand-dark"
        />

        {/* Creative Exploration Pill Banner */}
        <PillBanner
          title="Ignite Your Creative Spark"
          description="Discover personalized coaching to unleash your passion for music, performance, and authentic self-expression."
          link="#contact"
          backgroundImageSrc="/danielepianolaugh.jpeg"
          className="max-w-6xl"
        />
      </div>
    </section>
  );
};

export default AdditionalProgramsSection;