import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Lightbulb, Camera, HeartHandshake } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const WhoIWorkWithSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto text-center space-y-10 py-12">
      <SectionHeading>Who I Work With</SectionHeading>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
              <Mic className="h-6 w-6 drop-shadow-sm" /> {/* Added drop-shadow-sm */}
              Singers & Aspiring Musicians
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            Achieve technical mastery, expressive freedom, and integrated musical skill to truly shine.
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
              <Lightbulb className="h-6 w-6 drop-shadow-sm" /> {/* Added drop-shadow-sm */}
              Dynamic Public Speakers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            Cultivate confident, impactful communication and authentic stage presence that captivates your audience.
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
              <Camera className="h-6 w-6 drop-shadow-sm" /> {/* Added drop-shadow-sm */}
              Film & Streaming Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            Refine performances for film, stage, auditions, and streaming platforms with nuanced presence and authenticity.
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
              <HeartHandshake className="h-6 w-6 drop-shadow-sm" /> {/* Added drop-shadow-sm */}
              Committed Professionals
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            Dedicated to a sustainable, long-term practice that protects their body, voice, and mental well-being, preventing burnout.
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhoIWorkWithSection;