"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdditionalProgramBannerProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  bgColorClass?: string; // Background for the text content area
  textColorClass?: string;
  buttonVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  buttonBgClass?: string;
  buttonTextClass?: string;
  logoSrc?: string;
  className?: string;
  backgroundImageSrc?: string; // Full banner background image
}

const AdditionalProgramBanner: React.FC<AdditionalProgramBannerProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass,
  textColorClass = "text-brand-light",
  buttonVariant = "default",
  buttonBgClass = "bg-brand-primary hover:bg-brand-primary/90 text-brand-light", // Default to pink button
  buttonTextClass = "",
  logoSrc,
  className,
  backgroundImageSrc,
}) => {
  const contentElements = (
    <>
      {logoSrc && (
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand-magenta shadow-lg">
          <img
            src={logoSrc}
            alt={`${title} logo`}
            className="h-16 w-16 object-contain"
          />
        </div>
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
      <div className={cn("relative w-full min-h-[450px] overflow-hidden flex flex-col", className)}>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3">
          {/* Left Half (Image with gradient) - Visible on md and up, takes 2/3 width */}
          <div
            className="relative hidden md:block md:col-span-2 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundPosition: 'left center', backgroundSize: 'cover' }}
          >
            {/* Gradient overlay to blend into the right side */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-dark"></div>
          </div>

          {/* Right Half (Content with solid background) - Full width on mobile, 1/3 on md and up */}
          <div className={cn(
            "relative z-10 flex flex-col items-center justify-center p-8 text-center space-y-6 md:col-span-1",
            bgColorClass || "bg-brand-dark", // Solid background for text area
            textColorClass
          )}>
            {contentElements}
          </div>
        </div>
        {/* Bottom Pink Strip */}
        <div className="w-full h-8 bg-brand-magenta"></div>
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
        {contentElements}
      </div>
    );
  }
};

export default AdditionalProgramBanner;