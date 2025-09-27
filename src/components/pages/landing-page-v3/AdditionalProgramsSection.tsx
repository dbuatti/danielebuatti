import React from "react";
import SectionHeading from "@/components/SectionHeading";
import AdditionalProgramBanner from "@/components/AdditionalProgramBanner";
import PillBanner from "@/components/PillBanner";
import FeaturedProgramCard from "@/components/FeaturedProgramCard";

const AdditionalProgramsSection: React.FC = () => {
  return (
    <section className="mt-12 pb-16"> {/* Added pb-16 here */}
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
          backgroundColorClass="bg-brand-magenta"
          logoSrc="/pianobackingslogo.png"
          className="max-w-6xl"
          buttonBgClass="bg-brand-dark hover:bg-brand-dark/90 text-brand-light"
        />

        {/* FeaturedProgramCard for Resonance with Daniele */}
        <FeaturedProgramCard
          title="Resonance with Daniele: A Joyful Pop-Up Choir for All Voices"
          description="Join a welcoming community to sing, connect, and shine, with no experience needed."
          link="https://resonance-with-daniele.vercel.app"
          linkText="Join Resonance Choir"
          backgroundImageSrc="/conduct.jpeg"
          className="max-w-6xl"
          buttonBgClass="bg-brand-light hover:bg-brand-light/90 text-brand-dark"
        />

        {/* NEW: FeaturedProgramCard for Live Piano Services */}
        <FeaturedProgramCard
          title="An Unforgettable Musical Experience"
          description="Indulge in the elegance of live piano music and elevate your wedding, corporate event, or private party to new heights with the incomparable talent of Daniele Buatti. Daniele's versatile, refined performance creates an unforgettable atmosphere, with a repertoire spanning classical, jazz, and pop genres."
          // Linking to contact section for inquiries
          link="#contact"
          linkText="Enquire Now!"
          backgroundImageSrc="/piano-landingpageV2_edited.jpg"
          className="max-w-6xl"
          buttonBgClass="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
          overlayColorClass="bg-black/50" // Slightly darker overlay for better text contrast
        />
      </div>
    </section>
  );
};

export default AdditionalProgramsSection;