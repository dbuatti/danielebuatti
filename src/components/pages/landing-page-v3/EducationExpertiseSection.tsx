import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Leaf, Megaphone, CheckCircle2 } from "lucide-react"; // Import CheckCircle2
import SectionHeading from "@/components/SectionHeading";
import { Link } from "react-router-dom";

const EducationExpertiseSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-12 space-y-10">
      <SectionHeading>My Key Expertise</SectionHeading>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Category 1: Performance & Musicianship */}
        <Link to="/coaching" className="block">
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
            <CardHeader className="p-0 pb-4">
              <Music className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Vocal & Instrumental Mastery</CardTitle> {/* Punchier title */}
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <ul className="space-y-2 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Vocal Coaching (contemporary, classical, musical theatre)</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Piano & Keyboard Performance</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Score Preparation & Technology</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Audition Cut Playthrough</span></li>
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
        <Link to="/coaching" className="block">
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
            <CardHeader className="p-0 pb-4">
              <Leaf className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Embodiment & Somatic Healing</CardTitle> {/* Punchier title */}
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <p className="font-bold text-brand-primary text-lg mb-2">Kinesiology & Body-Mind Integration</p> {/* Elevated Kinesiology */}
              <ul className="space-y-2 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Holistic Voice & Somatic Techniques (Breath-Body-Mind, Yoga, Mindfulness)</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Tension Release for vocal freedom</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Mind-Body Connection for natural resonance</span></li>
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
        <Link to="/coaching" className="block">
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
            <CardHeader className="p-0 pb-4">
              <Megaphone className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-brand-primary">Dynamic Presence & Communication</CardTitle> {/* Punchier title */}
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <ul className="space-y-2 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Public Speaking & Presentation</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>Acting & Film Performance</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" /><span>On-Camera & Streaming Presence</span></li>
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