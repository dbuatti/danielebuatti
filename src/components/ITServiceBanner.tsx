import React from "react";
import { Shield } from "lucide-react";
import PracticeCard from "@/components/PracticeCard";

const ITServiceBanner: React.FC<{ className?: string }> = ({ className }) => (
  <PracticeCard
    className={className}
    icon={Shield}
    eyebrow="Digital architecture"
    title={<>Systems operator for <em className="italic">high-stakes</em> environments</>}
    description="Calm, secure and reliable digital systems for professionals who need their technology to work every time."
    href="https://db-it.vercel.app/"
    cta="Explore IT services"
  />
);

export default ITServiceBanner;
