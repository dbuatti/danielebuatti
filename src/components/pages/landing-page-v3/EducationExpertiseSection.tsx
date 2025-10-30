"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Leaf, Megaphone } from "lucide-react"; // Removed CheckCircle2
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
              <CardTitle className="text-2xl text-brand-primary">Vocal & Instrumental Mastery</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <p>
                Develop effortless breath control, expand your range, refine tone, and master various vocal styles. Enhance your instrumental skills, improve sight-reading, and develop expressive piano performance.
              </p>
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
              <CardTitle className="text-2xl text-brand-primary">Embodiment & Somatic Healing</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <p>
                Explore deep body-mind integration through Kinesiology, energy balancing, and sound healing. Restore balance, ease stress and tension, and release unhelpful patterns for greater freedom.
              </p>
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
              <CardTitle className="text-2xl text-brand-primary">Presence and Communication</CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
              <p>
                Refine your impact in any setting, focusing on public speaking, on-camera performance, and acting. Learn to command attention, articulate clearly, and connect authentically with your audience.
              </p>
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