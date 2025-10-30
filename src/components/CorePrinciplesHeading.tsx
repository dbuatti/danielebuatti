import React from "react";
import { cn } from "@/lib/utils";

interface CorePrinciplesHeadingProps {
  className?: string;
}

const CorePrinciplesHeading: React.FC<CorePrinciplesHeadingProps> = ({ className }) => {
  return (
    <div className={cn("text-center", className)}>
      <h2 className="text-4xl md:text-5xl font-extrabold text-brand-primary leading-tight">
        My Core Principles:
      </h2>
      <p className="text-4xl md:text-5xl font-extrabold text-brand-primary leading-tight mt-2">
        THOUGHT • INTENTION • BREATH • EXPRESSION
      </p>
    </div>
  );
};

export default CorePrinciplesHeading;