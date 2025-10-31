import React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ children, className }) => {
  return (
    <div className={cn("text-center space-y-4", className)}>
      <h2 className="text-4xl font-bold text-brand-primary">{children}</h2>
      {/* Keep this separator to anchor the main heading */}
      <Separator className="max-w-xs mx-auto bg-brand-secondary" />
    </div>
  );
};

export default SectionHeading;