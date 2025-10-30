import React from "react";
import FeaturedProgramCard from "@/components/FeaturedProgramCard";
import ResonanceProgramCard from "@/components/ResonanceProgramCard";
import SectionHeading from "@/components/SectionHeading"; // Import SectionHeading

const AdditionalProgramsSection: React.FC = () => {
  return (
    <section className="py-12 space-y-12">
      {/* Subheading: Specialized Services */}
      <SectionHeading>Specialized Services</SectionHeading>
      <div className="space-y-12">
        {/* FeaturedProgramCard for Music Director & Pianist */}
        <FeaturedProgramCard
          title="Music Director & Pianist"
          description="Explore my extensive experience as a music director, vocal coach, pianist, and performer in music theatre."
          link="/music-director-pianist"
          linkText="View My MD/Pianist Profile" // Updated button text
          backgroundImageSrc="/daniele simple.jpeg"
          className="max-w-6xl"
          buttonBgClass="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
          overlayColorClass="bg-black/50"
          backgroundPosition="center"
          cardBgClass="bg-brand-light dark:bg-brand-dark-alt"
          cardTextClass="text-brand-dark dark:text-brand-light"
        />

        {/* FeaturedProgramCard for Live Piano Services */}
        <FeaturedProgramCard
          title="An Unforgettable Musical Experience"
          description="Elevate your wedding, corporate event, or private party with Daniele Buatti's live piano music. His versatile, refined performance spans classical, jazz, and pop, creating an unforgettable atmosphere for any occasion."
          link="/live-piano-services" 
          linkText="Enquire Now!"
          backgroundImageSrc="/blacktie.avif"
          className="max-w-6xl"
          buttonBgClass="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
          overlayColorClass="bg-black/50"
          backgroundPosition="center 40%"
        />

        {/* FeaturedProgramCard for AMEB Accompanying Services */}
        <FeaturedProgramCard
          title="AMEB Accompanying Services"
          description="Professional and supportive piano accompaniment for your AMEB exams, ensuring you feel confident and ready."
          link="/ameb-accompanying"
          linkText="Learn More"
          backgroundImageSrc="/Piano Keys_edited_edited.avif"
          className="max-w-6xl"
          buttonBgClass="bg-brand-dark hover:bg-brand-dark/90 text-brand-light"
          overlayColorClass="bg-black/60"
          backgroundPosition="center"
        />
      </div>

      {/* Subheading: Digital Products & Community */}
      <SectionHeading>Digital Products & Community</SectionHeading>
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

        {/* ResonanceProgramCard for Choir */}
        <ResonanceProgramCard className="max-w-6xl" />
      </div>
    </section>
  );
};

export default AdditionalProgramsSection;