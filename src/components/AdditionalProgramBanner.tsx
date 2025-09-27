"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdditionalProgramBannerProps {
  title: React.ReactNode; // Main title for the right column
  description: string;
  link: string;
  linkText: string;
  bgColorClass?: string; // Background for the text content area
  leftColumnTextColorClass?: string; // Text color for the left column when titleInLeftColumn is true
  rightColumnTextColorClass?: string; // Text color for the right column when titleInLeftColumn is true
  textColorClass?: string; // Default text color for all content when titleInLeftColumn is false
  buttonVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  buttonBgClass?: string;
  buttonTextClass?: string;
  logoSrc?: string; // Logo for the right column (mobile) or default layout
  className?: string;
  backgroundImageSrc?: string; // Full banner background image
  bottomStripColorClass?: string;
  // New prop to indicate if the main title should be in the left 2/3 column
  titleInLeftColumn?: boolean;
  subtitle?: string; // Subtitle for the right column
  subtitleTextColorClass?: string; // New prop for subtitle text color
  // NEW PROPS for content specifically in the left column when titleInLeftColumn is true
  leftColumnTitle?: React.ReactNode;
  leftColumnSubtitle?: string;
}

const AdditionalProgramBanner: React.FC<AdditionalProgramBannerProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass,
  leftColumnTextColorClass,
  rightColumnTextColorClass,
  textColorClass = "text-brand-light", // Default for non-split layout
  buttonVariant = "default",
  buttonBgClass = "bg-brand-primary hover:bg-brand-primary/90 text-brand-light",
  buttonTextClass = "",
  logoSrc,
  className,
  backgroundImageSrc,
  bottomStripColorClass,
  titleInLeftColumn = false,
  subtitle, // Destructure new prop
  subtitleTextColorClass, // Destructure new prop
  leftColumnTitle, // New prop
  leftColumnSubtitle, // New prop
}) => {
  const buttonElement = (
    <Button asChild size="lg" variant={buttonVariant} className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass, buttonTextClass)}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        {linkText}
      </a>
    </Button>
  );

  // Determine font class for the main title (right column)
  const isMainTitleResonance = typeof title === 'string' && title.includes("Resonance with Daniele");
  const mainTitleFontClass = isMainTitleResonance ? "font-display" : "";

  // Determine font class for the left column title
  const isLeftColumnResonance = typeof leftColumnTitle === 'string' && leftColumnTitle?.includes("Resonance with Daniele");
  const leftColumnTitleFontClass = isLeftColumnResonance ? "font-display" : "";

  // Reusable content block for the main text and button area
  const contentBlock = (
    <div className="space-y-2">
      {logoSrc && (
        <img
          src={logoSrc}
          alt={`${typeof title === 'string' ? title : 'Program'} logo`}
          className="h-20 object-contain mb-4" // Removed mx-auto
        />
      )}
      <h3 className={cn("text-4xl font-bold leading-tight", mainTitleFontClass)}>{title}</h3>
      {subtitle && <p className={cn("text-xl", subtitleTextColorClass)}>{subtitle}</p>}
      <p className="text-lg max-w-3xl">{description}</p> {/* Removed mx-auto */}
      {buttonElement}
    </div>
  );

  // Base classes for the content area, adjusted for left alignment when in right column
  const baseContentClasses = "relative z-10 flex flex-col justify-center p-8 space-y-6 h-full"; // Removed items-center and text-center

  return (
    <div className={cn("relative w-full flex flex-col overflow-hidden", className)}>
      {titleInLeftColumn ? (
        // Case 1: Title in left column (split layout)
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 h-[280px]">
          {/* Left 2/3 column */}
          <div className={cn(
            "relative z-10 hidden md:flex flex-col items-center justify-center p-8 text-center space-y-4 md:col-span-2 h-full",
            bgColorClass || "bg-brand-dark",
            leftColumnTextColorClass || textColorClass
          )}>
            {logoSrc && !leftColumnTitle && !leftColumnSubtitle ? ( // Only show logo if no custom left column text
              <img
                src={logoSrc}
                alt={`${typeof leftColumnTitle === 'string' ? leftColumnTitle : typeof title === 'string' ? title : 'Program'} logo`}
                className="mx-auto h-20 object-contain mb-2"
              />
            ) : (
              <>
                {leftColumnTitle && (
                  <h3 className={cn("text-4xl font-bold leading-tight", leftColumnTitleFontClass)}>{leftColumnTitle}</h3>
                )}
                {leftColumnSubtitle && (
                  <p className={cn("text-xl", subtitleTextColorClass)}>{leftColumnSubtitle}</p>
                )}
              </>
            )}
          </div>
          {/* Right 1/3 column (main content) */}
          <div className={cn(
            baseContentClasses,
            "md:col-span-1", // Confine to 1/3 width on md+
            bgColorClass || "bg-brand-dark",
            rightColumnTextColorClass || textColorClass,
            "items-start text-left" // Added for left alignment in right column
          )}>
            {contentBlock}
          </div>
        </div>
      ) : backgroundImageSrc ? (
        // Case 2: Image background (split layout)
        <div
          className={cn("flex-grow grid grid-cols-1 md:grid-cols-3 h-[280px]", bgColorClass)} // bgColorClass for the whole grid if needed
          style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundPosition: 'left center', backgroundSize: 'cover' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-dark md:col-span-2"></div>
          <div className={cn(
            baseContentClasses,
            "md:col-span-1", // Confine to 1/3 width on md+
            textColorClass, // Text color for content on image background
            "items-start text-left" // Added for left alignment in right column
          )}>
            {contentBlock}
          </div>
        </div>
      ) : (
        // Case 3: Full-width solid color banner (default for Piano Backings, Resonance)
        <div className={cn(
          baseContentClasses,
          "flex-grow", // Take full width
          bgColorClass || "bg-brand-dark",
          textColorClass,
          "items-center text-center" // Default to center for full-width solid banners
        )}>
          {contentBlock}
        </div>
      )}
      {/* Bottom Strip - Apply to all banners if present */}
      {bottomStripColorClass && <div className={cn("w-full h-8 flex-shrink-0", bottomStripColorClass)}></div>}
    </div>
  );
};

export default AdditionalProgramBanner;