import React from "react";
import SectionHeading from "@/components/SectionHeading";
import AdditionalProgramBanner from "@/components/AdditionalProgramBanner";

const AdditionalProgramsSection: React.FC = () => {
  return (
    <section className="mt-12">
      <div className="container mx-auto px-4 mb-10">
        <SectionHeading>Explore More from Daniele</SectionHeading>
      </div>
      <div className="space-y-0">
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
          title="Professional Piano Backing Tracks"
          description=""
          link="https://pianobackingsbydaniele.vercel.app"
          linkText="Discover Piano Backings"
          bgColorClass="bg-brand-dark" {/* Changed to dark blue for better contrast */}
          leftColumnTextColorClass="text-brand-light" {/* Changed to white */}
          rightColumnTextColorClass="text-brand-light" {/* Changed to white */}
          buttonBgClass="bg-black hover:bg-black/90 text-brand-light"
          logoSrc="https://pianobackingsbydaniele.vercel.app/pasted-image-2025-09-19T05-15-20-729Z.png" // Piano icon logo
          className="rounded-none"
          bottomStripColorClass="bg-brand-blue"
          titleInLeftColumn={true} // Title and logo in left column
        />

        <AdditionalProgramBanner
          title="Resonance Choir with Daniele"
          description="Join a vibrant community exploring voice, movement, and sound."
          link="https://resonance-with-daniele.vercel.app"
          linkText="Join Resonance Choir"
          bgColorClass="bg-brand-blue"
          leftColumnTextColorClass="text-brand-light"
          rightColumnTextColorClass="text-brand-light"
          buttonBgClass="bg-brand-light hover:bg-brand-light/90 text-brand-dark"
          className="rounded-none"
          bottomStripColorClass="bg-black"
          titleInLeftColumn={true} // Title in left column
        />
      </div>
    </section>
  );
};

export default AdditionalProgramsSection;