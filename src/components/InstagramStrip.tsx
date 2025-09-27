"use client";

import React from "react";
import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstagramStripProps {
  className?: string;
}

const InstagramStrip: React.FC<InstagramStripProps> = ({ className }) => {
  return (
    <a
      href="https://instagram.com/daniele.buatti"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "w-full bg-brand-primary text-brand-light py-6 flex items-center justify-center gap-4",
        "hover:bg-brand-primary/90 transition-colors duration-300",
        className
      )}
      aria-label="Follow Daniele Buatti on Instagram"
    >
      <Instagram className="h-8 w-8" />
      <span className="text-2xl font-semibold font-montserrat">@daniele.buatti</span>
    </a>
  );
};

export default InstagramStrip;