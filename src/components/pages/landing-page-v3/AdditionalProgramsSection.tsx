import React from "react";
import SectionHeading from "@/components/SectionHeading";
import AdditionalProgramBanner from "@/components/AdditionalProgramBanner";
import PillBanner from "@/components/PillBanner"; // Import the new component

const AdditionalProgramsSection: React.FC = () => {
  return (
    <section className="mt-12">
      <div className="container mx-auto px-4 mb-10">
        <SectionHeading>Explore More from Daniele</SectionHeading>
      </div>
      <div className="space-y-12"> {/* Changed to space-y-12 for better spacing */}
        <AdditionalProgramBanner
          title="Explore Buattiverse: Sheet Music & Backing Tracks"
          description="Your curated source for professional vocal transcriptions, SATB arrangements, and essential music resources."
          link="https://buattiverse.gumroad.com/"
          linkText="Visit Buattiverse Store"
          bgColorClass="bg-brand-dark" // Explicitly set dark background for text side
          textColorClass="text-brand-light"
          buttonBgClass="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
          logoSrc="/gumroad.png"
          className="rounded-none"
          backgroundImageSrc="/sheetmusic.png"
          bottomStripColorClass="bg-brand-magenta" // Pass the bottom strip color here
          titleInLeftColumn={false} // Default layout
        />

        <AdditionalProgramBanner
          title="Professional Piano Backing Tracks by Daniele for Musicals, Auditions & Performances" // Main title for right column
          description="High-quality, meticulously crafted tracks for singers and performers, streamlining your preparation."
          link="https://pianobackingsbydaniele.vercel.app"
          linkText="Discover Piano Backings"
          bgColorClass="bg-brand-magenta" // Reverted to pink background
          // Removed leftColumnTextColorClass as it's not needed when a logo is present
          // Removed leftColumnTitle and leftColumnSubtitle as the logo will replace them
          subtitleTextColorClass="text-brand-light" // Set to white for right column subtitle
          rightColumnTextColorClass="text-brand-light" // Set to white for description and button
          buttonBgClass="bg-black hover:bg-black/90 text-brand-light"
          logoSrc="/pianobackingslogo.png" // Corrected logo source
          className="rounded-none"
          bottomStripColorClass="bg-brand-magenta"
          titleInLeftColumn={true} // Title and logo in left column
        />

        <AdditionalProgramBanner
          title="Resonance with Daniele" // Main title for right column
          subtitle="A Joyful Pop-Up Choir for All Voices" // Subtitle for right column
          description="Join a welcoming community to sing, connect, and shine, with no experience needed."
          link="https://resonance-with-daniele.vercel.app"
          linkText="Join Resonance Choir"
          bgColorClass="bg-brand-blue"
          leftColumnTextColorClass="text-brand-light"
          leftColumnTitle="Resonance with Daniele" // Content for left column
          rightColumnTextColorClass="text-brand-light"
          buttonBgClass="bg-brand-dark hover:bg-brand-dark/90 text-brand-light"
          className="rounded-none"
          bottomStripColorClass="bg-brand-blue"
          titleInLeftColumn={true} // Title in left column
        />

        {/* New Pill Banner for Buattiverse */}
        <PillBanner
          title="Explore Buattiverse: Sheet Music & Backing Tracks"
          description="Your curated source for professional vocal transcriptions, SATB arrangements, and essential music resources."
          link="https://buattiverse.gumroad.com/"
          backgroundImageSrc="/sheetmusic.png"
          className="max-w-6xl" // Adjusted max-width
        />

        {/* NEW: Creative Exploration Pill Banner */}
        <PillBanner
          title="Ignite Your Creative Spark"
          description="Discover personalized coaching to unleash your passion for music, performance, and authentic self-expression."
          link="#contact" // Link to the contact section on the current page
          backgroundImageSrc="/danielepianolaugh.jpeg"
          className="max-w-6xl"
        />
      </div>
    </section>
  );
};

export default AdditionalProgramsSection;