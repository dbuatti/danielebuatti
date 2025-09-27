"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdditionalProgramBannerProps {
  title: string; // Main title for the right column
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
  leftColumnTitle?: string;
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
  const isMainTitleResonance = title.includes("Resonance with Daniele");
  const mainTitleFontClass = isMainTitleResonance ? "font-display" : "";

  // Determine font class for the left column title
  const isLeftColumnResonance = leftColumnTitle?.includes("Resonance with Daniele");
  const leftColumnTitleFontClass = isLeftColumnResonance ? "font-display" : "";

  return (
    <div className={cn("relative w-full flex flex-col overflow-hidden", className)}>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 h-[450px]">
        {titleInLeftColumn ? (
          <>
            {/* Left Half (Custom Content) - Visible on md and up, takes 2/3 width */}
            <div className={cn(
              "relative z-10 hidden md:flex flex-col items-center justify-center p-8 text-center space-y-4 md:col-span-2 h-full",
              bgColorClass || "bg-brand-dark",
              leftColumnTextColorClass || textColorClass
            )}>
              {/* Display leftColumnTitle and leftColumnSubtitle if provided */}
              {leftColumnTitle && (
                <h3 className={cn("text-4xl font-bold leading-tight", leftColumnTitleFontClass)}>{leftColumnTitle}</h3>
              )}
              {leftColumnSubtitle && (
                <p className={cn("text-xl", subtitleTextColorClass)}>{leftColumnSubtitle}</p>
              )}
            </div>

            {/* Right Half (Main Title, Subtitle, Description and Button) - Full width on mobile, 1/3 on md and up */}
            <div className={cn(
              "relative z-10 flex flex-col items-center justify-center p-8 text-center space-y-6 md:col-span-1 h-full",
              bgColorClass || "bg-brand-dark",
              rightColumnTextColorClass || textColorClass
            )}>
              <div className="space-y-2">
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt={`${title} logo`}
                    className="mx-auto h-16 object-contain md:hidden" // Only show logo on mobile in right column
                  />
                )}
                {/* Main title and subtitle for the right column */}
                <h3 className={cn("text-4xl font-bold leading-tight", mainTitleFontClass)} style={{ color: rightColumnTextColorClass ? undefined : 'inherit' }}>
                  {title}
                </h3>
                {subtitle && <p className={cn("text-xl", subtitleTextColorClass)}>{subtitle}</p>}
              </div>
              <p className="text-lg max-w-3xl mx-auto">{description}</p>
              {buttonElement}
            </div>
          </>
        ) : (
          <>
            {/* Default Layout: Left 2/3 is image/solid, Right 1/3 is all content */}
            {backgroundImageSrc ? (
              <div
                className="relative hidden md:block md:col-span-2 bg-cover bg-center h-full"
                style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundPosition: 'left center', backgroundSize: 'cover' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-dark"></div>
              </div>
            ) : (
              <div className={cn("hidden md:block md:col-span-2 h-full", bgColorClass || "bg-brand-dark")}></div>
            )}

            <div className={cn(
              "relative z-10 flex flex-col items-center justify-center p-8 text-center space-y-6 md:col-span-1 h-full",
              bgColorClass || "bg-brand-dark",
              textColorClass
            )}>
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt={`${title} logo`}
                  className="mx-auto h-20 object-contain mb-4"
                />
              )}
              <h3 className={cn("text-4xl font-bold", mainTitleFontClass)}>{title}</h3>
              <p className="text-lg max-w-3xl mx-auto">{description}</p>
              {buttonElement}
            </div>
          </>
        )}
      </div>
      {/* Bottom Strip - Apply to all banners if present */}
      {bottomStripColorClass && <div className={cn("w-full h-8 flex-shrink-0", bottomStripColorClass)}></div>}
    </div>
  );
};

export default AdditionalProgramBanner;