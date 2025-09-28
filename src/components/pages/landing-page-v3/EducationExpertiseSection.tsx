import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Mic, Music, Leaf, Piano, Megaphone, Theater, Webcam, FileText } from "lucide-react";
import ExpertiseItemCard from "@/components/ExpertiseItemCard";

const EducationExpertiseSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-12 grid lg:grid-cols-2 gap-12"> {/* Adjusted grid to 2 columns */}
      <div className="lg:col-span-2 space-y-6"> {/* Removed lg:col-span-2 as it's now a 2-column grid */}
        <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary justify-center md:justify-start">
          <Award className="h-7 w-7" />
          My Key Expertise
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <ExpertiseItemCard icon={Mic} title="Vocal Coaching" description="Elevate your technique across contemporary, classical, and musical theatre genres." />
          <ExpertiseItemCard icon={Music} title="Music Direction & Conducting" description="Master the art of leading and inspiring musical ensembles." />
          <ExpertiseItemCard icon={Leaf} title="Holistic Voice & Somatic Techniques" description="Integrate Kinesiology, Breath-Body-Mind, Yoga, and Mindfulness for profound vocal freedom." />
          <ExpertiseItemCard icon={Piano} title="Piano & Keyboard Performance" description="Enhance your instrumental skills and musicality." />
          <ExpertiseItemCard icon={Megaphone} title="Public Speaking & Presentation Coaching" description="Cultivate confident, impactful communication." />
          <ExpertiseItemCard icon={Theater} title="Acting & Film Performance Coaching" description="Refine your presence for stage and screen." />
          <ExpertiseItemCard icon={Webcam} title="On-Camera & Streaming Presence" description="Develop authentic and engaging virtual communication." />
          <ExpertiseItemCard icon={FileText} title="Score Preparation & Technology Integration" description="Streamline your musical workflow with modern tools." />
        </div>
      </div>
    </section>
  );
};

export default EducationExpertiseSection;