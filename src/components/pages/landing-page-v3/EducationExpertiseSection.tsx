import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Leaf, Megaphone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "react-router-dom"; // Import Link

const EducationExpertiseSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-12 space-y-10">
      <SectionHeading>My Key Expertise</SectionHeading>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Category 1: Performance & Musicianship */}
        <Link to="/book-voice-piano" className="block"> {/* Link to booking page */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full">
            <CardHeader className="p-0 pb-4">
              <Music className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Performance & Musicianship</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3">
              <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                <li>Vocal Coaching (contemporary, classical, musical theatre)</li>
                <li>Piano & Keyboard Performance</li>
                <li>Music Direction & Conducting</li>
                <li>Score Preparation & Technology</li>
                <li>AMEB Accompanying</li>
              </ul>
            </CardContent>
          </Card>
        </Link>

        {/* Category 2: Embodiment & Somatic Work */}
        <Link to="/book-embodiment-somatic" className="block"> {/* Link to booking page */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full">
            <CardHeader className="p-0 pb-4">
              <Leaf className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Embodiment & Somatic Work</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3">
              <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                <li>Kinesiology</li>
                <li>Holistic Voice & Somatic Techniques (Breath-Body-Mind, Yoga, Mindfulness)</li>
                <li>Tension Release for vocal freedom</li>
                <li>Mind-Body Connection for natural resonance</li>
              </ul>
            </CardContent>
          </Card>
        </Link>

        {/* Category 3: Presence & Communication */}
        <Link to="/book-presence-communication" className="block"> {/* Link to booking page */}
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full">
            <CardHeader className="p-0 pb-4">
              <Megaphone className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Presence & Communication</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3">
              <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                <li>Public Speaking & Presentation</li>
                <li>Acting & Film Performance</li>
                <li>On-Camera & Streaming Presence</li>
              </ul>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
};

export default EducationExpertiseSection;