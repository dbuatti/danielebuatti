import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Leaf, Megaphone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "react-router-dom";

const EducationExpertiseSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-12 space-y-10">
      <SectionHeading>My Key Expertise</SectionHeading>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Category 1: Performance & Musicianship */}
        <Link to="/services" className="block">
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
            <CardHeader className="p-0 pb-4">
              <Music className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Performance & Musicianship</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                <li>Vocal Coaching (contemporary, classical, musical theatre)</li>
                <li>Piano & Keyboard Performance</li>
                <li>Music Direction & Conducting</li>
                <li>Score Preparation & Technology</li>
                <li>AMEB Accompanying</li>
                <li>Audition Cut Playthrough</li>
              </ul>
            </CardContent>
            <div className="mt-6">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
                Learn More
              </Button>
            </div>
          </Card>
        </Link>

        {/* Category 2: Embodiment & Somatic Work */}
        <Link to="/services" className="block">
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
            <CardHeader className="p-0 pb-4">
              <Leaf className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Embodiment & Somatic Work</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                <li>Kinesiology</li>
                <li>Holistic Voice & Somatic Techniques (Breath-Body-Mind, Yoga, Mindfulness)</li>
                <li>Tension Release for vocal freedom</li>
                <li>Mind-Body Connection for natural resonance</li>
              </ul>
            </CardContent>
            <div className="mt-6">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
                Learn More
              </Button>
            </div>
          </Card>
        </Link>

        {/* Category 3: Presence & Communication */}
        <Link to="/services" className="block">
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
            <CardHeader className="p-0 pb-4">
              <Megaphone className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Presence & Communication</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                <li>Public Speaking & Presentation</li>
                <li>Acting & Film Performance</li>
                <li>On-Camera & Streaming Presence</li>
              </ul>
            </CardContent>
            <div className="mt-6">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
                Learn More
              </Button>
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
};

export default EducationExpertiseSection;