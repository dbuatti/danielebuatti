import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Mic, Music, Leaf, Piano, Megaphone, Theater, Webcam, FileText, Users, Brain, Volume2 } from "lucide-react"; // Added more icons for categories
import ExpertiseItemCard from "@/components/ExpertiseItemCard";
import SectionHeading from "@/components/SectionHeading"; // Import SectionHeading

const EducationExpertiseSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-12 space-y-10">
      <SectionHeading>My Key Expertise</SectionHeading> {/* Using SectionHeading */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Category 1: Performance & Musicianship */}
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <Music className="h-12 w-12 text-brand-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-brand-primary">Performance & Musicianship</CardTitle>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3">
            <p><strong>Vocal Coaching:</strong> Elevate your technique across contemporary, classical, and musical theatre genres.</p>
            <p><strong>Piano & Keyboard Performance:</strong> Enhance your instrumental skills and musicality.</p>
            <p><strong>Music Direction & Conducting:</strong> Master the art of leading and inspiring musical ensembles.</p>
            <p><strong>Score Preparation & Technology:</strong> Streamline your musical workflow with modern tools.</p>
          </CardContent>
        </Card>

        {/* Category 2: Embodiment & Somatic Work */}
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <Leaf className="h-12 w-12 text-brand-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-brand-primary">Embodiment & Somatic Work</CardTitle>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3">
            <p><strong>Holistic Voice & Somatic Techniques:</strong> Integrate Kinesiology, Breath-Body-Mind, Yoga, and Mindfulness for profound vocal freedom.</p>
            <p><strong>Tension Release:</strong> Learn to soften the body and free the breath for effortless control.</p>
            <p><strong>Mind-Body Connection:</strong> Cultivate a deeper awareness to support your voice and presence naturally.</p>
          </CardContent>
        </Card>

        {/* Category 3: Presence & Communication */}
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <Megaphone className="h-12 w-12 text-brand-primary mx-auto mb-4" />
          <CardTitle className="text-2xl text-brand-primary">Presence & Communication</CardTitle>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3">
            <p><strong>Public Speaking & Presentation:</strong> Cultivate confident, impactful communication and authentic stage presence.</p>
            <p><strong>Acting & Film Performance:</strong> Refine your presence for stage, screen, and auditions.</p>
            <p><strong>On-Camera & Streaming:</strong> Develop authentic and engaging virtual communication.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EducationExpertiseSection;