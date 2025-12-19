import React from "react";
import FeaturedProgramCard from "@/components/FeaturedProgramCard";
import ResonanceProgramCard from "@/components/ResonanceProgramCard";
import SectionHeading from "@/components/SectionHeading"; // Import SectionHeading

const AdditionalProgramsSection: React.FC = () => {
  return (
    <section className="py-8 space-y-8"> {/* Adjusted overall padding and spacing */}
      {/* Subheading: Specialised Services */}
      <SectionHeading className="mb-8">Specialised Services</SectionHeading> {/* Added margin-bottom */}
      <div className="space-y-8"> {/* Adjusted spacing between cards */}
        {/* FeaturedProgramCard for Music Director & Pianist */}
        <FeaturedProgramCard
          title="Music Director & Pianist"
          description="Easdsdadxplore my extensive experience as a music director, vocal coach, pianist, and performer in music theatre."
          link="/music-director-pianist"
          linkText="View Profile & Inquire" // Updated CTA
          backgroundImageSrc="/daniele-conducting.jpeg"
          className="max-w-6xl"
          buttonBgClass="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
          overlayColorClass="bg-black/20"
          backgroundPosition="center"
          cardBgClass="bg-brand-light dark:bg-brand-dark-alt"
          cardTextClass="text-brand-dark dark:text-brand-light"
        />

        {/* FeaturedProgramCard for Live Piano Services */}
        <FeaturedProgramCard
          title="Live Piano Services" // Updated card title
          description="Elevate your wedding, corporate event, or private party with Daniele Buatti's live piano music. His versatile, refined performance spans classical, jazz, and pop, creating an unforgettable atmosphere for any occasion."
          link="/live-piano-services"
          linkText="Enquire Now!" // Kept as is
          backgroundImageSrc="/blacktie.avif"
          className="max-w-6xl"
          buttonBgClass="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
          overlayColorClass="bg-black/20"
          backgroundPosition="center 20%" // Adjusted to be higher
        />

        {/* FeaturedProgramCard for AMEB Accompanying Services */}
        <FeaturedProgramCard
          title="AMEB Accompanying Services" // Kept as is
          description="Professional and supportive piano accompaniment for your AMEB exams, ensuring you feel confident and ready."
          link="/ameb-accompanying"
          linkText="View Rates & Book" // Updated CTA
          backgroundImageSrc="/ameb-placeholder.jpg"
          className="max-w-6xl"
          buttonBgClass="bg-brand-dark hover:bg-brand-dark/90 text-brand-light"
          overlayColorClass="bg-black/20"
          backgroundPosition="center"
        />
      </div>

      {/* New Subheading: Digital Products & Community */}
      <SectionHeading className="mt-12 mb-8">Digital Products & Community</SectionHeading> {/* Added top and bottom margin */}
      <div className="space-y-8"> {/* Adjusted spacing between cards */}
        {/* FeaturedProgramCard for Buattiverse */}
        <FeaturedProgramCard
          title="Buattiverse: Sheet Music & Backing Tracks"
          description="Your curated source for professional vocal transcriptions, SATB arrangements, and essential music resources."
          link="https://buattiverse.gumroad.com/"
          linkText="Visit Buattiverse Store"
          backgroundImageSrc="/sheetmusic.png"
          className="max-w-6xl"
          overlayColorClass="bg-black/20"
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