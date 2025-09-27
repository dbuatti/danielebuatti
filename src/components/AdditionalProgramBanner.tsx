"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdditionalProgramBannerProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  bgColorClass?: string;
  textColorClass?: string;
  buttonVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  buttonBgClass?: string;
  buttonTextClass?: string;
  logoSrc?: string;
  className?: string;
  backgroundImageSrc?: string; // New prop for background image
}

const AdditionalProgramBanner: React.FC<AdditionalProgramBannerProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass,
  textColorClass = "text-brand-light", // Default to light for contrast
  buttonVariant = "default",
  buttonBgClass = "bg-brand-light hover:bg-brand-light/90 text-brand-dark",
  buttonTextClass = "",
  logoSrc,
  className,
  backgroundImageSrc, // Destructure new prop
}) => {
  const backgroundStyle = backgroundImageSrc
    ? { backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div
      className={cn(
        "relative w-full py-16 overflow-hidden flex items-end", // flex items-end pushes content to bottom
        bgColorClass && !backgroundImageSrc ? bgColorClass : "", // Apply bgColorClass only if no image
        className
      )}
      style={backgroundStyle}
    >
      {/* Gradient Overlay */}
      {backgroundImageSrc && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      )}

      {/* Content */}
      <div className={cn("relative z-10 container mx-auto px-4 text-center space-y-6", textColorClass)}>
        {logoSrc && ( // Logo is now part of the bottom-aligned content
          <img
            src={logoSrc}
            alt={`${title} logo`}
            className="mx-auto h-20 object-contain mb-4" // Added mb-4 for spacing
          />
        )}
        <h3 className="text-4xl font-bold">{title}</h3>
        <p className="text-lg max-w-3xl mx-auto">{description}</p>
        <Button asChild size="lg" variant={buttonVariant} className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass, buttonTextClass)}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            {linkText}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default AdditionalProgramBanner;