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
  backgroundImageSrc?: string;
}

const AdditionalProgramBanner: React.FC<AdditionalProgramBannerProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass,
  textColorClass = "text-brand-light",
  buttonVariant = "default",
  buttonBgClass = "bg-brand-light hover:bg-brand-light/90 text-brand-dark",
  buttonTextClass = "",
  logoSrc,
  className,
  backgroundImageSrc,
}) => {
  const contentElements = (
    <>
      {logoSrc && (
        <img
          src={logoSrc}
          alt={`${title} logo`}
          className="mx-auto h-20 object-contain mb-4"
        />
      )}
      <h3 className="text-4xl font-bold">{title}</h3>
      <p className="text-lg max-w-3xl mx-auto">{description}</p>
      <Button asChild size="lg" variant={buttonVariant} className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass, buttonTextClass)}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      </Button>
    </>
  );

  if (backgroundImageSrc) {
    return (
      <div
        className={cn(
          "relative w-full min-h-[400px] overflow-hidden flex items-center justify-center", // Added min-h and flex for centering
          className
        )}
        style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Subtle full-width gradient overlay for overall image darkening */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent/20 to-black/50"></div>

        {/* Content container with its own background, positioned on the right */}
        <div className={cn(
          "relative z-10 w-full md:absolute md:right-0 md:w-1/2 h-full flex flex-col items-center justify-center p-8 text-center space-y-6",
          bgColorClass || "bg-brand-dark", // Solid background for text area
          textColorClass
        )}>
          {contentElements}
        </div>
      </div>
    );
  } else {
    // Single column layout if no background image
    return (
      <div
        className={cn(
          "relative w-full py-16 overflow-hidden flex items-center justify-center",
          bgColorClass || "bg-brand-dark", // Apply bgColorClass to the whole banner
          className
        )}
      >
        <div className={cn("relative z-10 flex flex-col items-center justify-center p-8 text-center space-y-6 h-full", textColorClass)}>
          {contentElements}
        </div>
      </div>
    );
  }
};

export default AdditionalProgramBanner;