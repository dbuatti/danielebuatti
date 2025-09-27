"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PillBannerProps {
  title: string;
  description: string;
  link: string;
  backgroundImageSrc: string;
  className?: string;
}

const PillBanner: React.FC<PillBannerProps> = ({
  title,
  description,
  link,
  backgroundImageSrc,
  className,
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative flex items-center justify-center text-center overflow-hidden",
        "w-full max-w-6xl mx-auto h-[180px] rounded-full", // Pill shape and fixed height
        "shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]",
        className
      )}
      style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Gradient Overlay - Made even darker for optimal text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-black/75"></div>

      {/* Content - Text color set to light for contrast, description size increased */}
      <div className="relative z-10 p-4 text-brand-light space-y-2">
        <h3 className="text-3xl font-extrabold leading-tight">{title}</h3>
        <p className="text-xl font-semibold max-w-md mx-auto">{description}</p>
      </div>
    </a>
  );
};

export default PillBanner;