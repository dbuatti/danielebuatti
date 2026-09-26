import React from "react";
import { Leaf } from "lucide-react";
import PracticeCard from "@/components/PracticeCard";

const KinesiologyBanner: React.FC<{ className?: string }> = ({ className }) => (
  <PracticeCard
    className={className}
    icon={Leaf}
    eyebrow="Resonance Kinesiology"
    title={<>Somatic support &amp; <em className="italic">nervous system</em> regulation</>}
    description="Professional kinesiology combined with somatic modalities to help you return to your body's innate intelligence."
    href="https://kinesiology.danielebuatti.com/"
    cta="Explore kinesiology"
  />
);

export default KinesiologyBanner;
