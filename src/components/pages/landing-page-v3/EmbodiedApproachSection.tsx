import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb, Volume2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import PhilosophyStatement from "@/components/PhilosophyStatement"; // Import the new component

const EmbodiedApproachSection: React.FC = () => {
  return (
    <section id="approach" className="max-w-7xl mx-auto space-y-10 py-12">
      <SectionHeading>My Embodied Holistic Approach</SectionHeading>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
        All my teachings are informed by Buddhist and yogic philosophies, fostering a heart-centred, process-oriented journey focused on truth and transformation, not just the destination.
      </p>
      
      <PhilosophyStatement className="max-w-4xl mx-auto my-10" /> {/* Integrate the new component here */}

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <Brain className="h-12 w-12 text-brand-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-brand-primary">1. Embodiment & Alignment</CardTitle>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            Rooted in Kinesiology, Yoga, and Somatic Therapy, we soften the body, lift posture, and free the breath so it supports your voice with ease. Cultivate a deeper connection between mind and body to unlock your natural vocal resonance.
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <Lightbulb className="h-12 w-12 text-brand-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-brand-primary">2. Mindset & Performance Coaching</CardTitle>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            Utilising Mindfulness and therapeutic techniques, we manage nerves, setbacks, and creative blocks. Build unwavering confidence in practice, on stage, or on camera, understanding your mind to overcome performance anxiety.
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-8 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <Volume2 className="h-12 w-12 text-brand-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-brand-primary">3. Integrated Skill Development</CardTitle>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            Voice, piano, public speaking, acting, on-camera presence—tailored to your goals. Coaching is practical, creative, and always aligned with your unique vision, helping you refine repertoire and improve musicianship.
          </CardContent>
        </Card>
      </div>
      <p className="text-center text-xl italic text-brand-dark/70 dark:text-brand-light/70 mt-8">
        “Daniele doesn’t just teach technique—he teaches how to inhabit your artistry and presence fully.”
      </p>
    </section>
  );
};

export default EmbodiedApproachSection;