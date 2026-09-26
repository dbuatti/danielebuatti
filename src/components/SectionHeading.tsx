import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  // Small uppercase label above the heading.
  eyebrow?: string;
  // Render as the page's <h1> instead of an <h2>.
  as?: "h1" | "h2";
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ children, className, eyebrow, as: Tag = "h2" }) => {
  return (
    <div className={cn("text-center", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag className="text-4xl md:text-5xl font-light leading-[1.1] text-brand-dark dark:text-brand-light">{children}</Tag>
      <span className="mx-auto mt-6 block h-px w-12 bg-brand-primary" aria-hidden="true" />
    </div>
  );
};

export default SectionHeading;
