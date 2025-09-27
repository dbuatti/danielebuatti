import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Award, Mic, Music, Leaf, Piano, Megaphone, Theater, Webcam, FileText } from "lucide-react";
import ExpertiseItemCard from "@/components/ExpertiseItemCard";

const EducationExpertiseSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-16 grid lg:grid-cols-3 gap-12">
      <Card className="lg:col-span-1 bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary hover:shadow-xl hover:scale-[1.01] transition-all duration-300 p-8">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="flex items-center gap-4 text-2xl text-brand-primary">
            <GraduationCap className="h-7 w-7" />
            Education & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
          <div>
            <p className="font-semibold text-lg">Bachelor of Music</p>
            <p>Australian Institute of Music (2014-2016)</p>
            <p className="text-sm mt-1">Units in Arranging, Composition, Orchestration, and Piano.</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Diploma of Kinesiology</p>
            <p>Specialising in mind-body integration for performance.</p>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
          <Award className="h-7 w-7" />
          Key Expertise
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