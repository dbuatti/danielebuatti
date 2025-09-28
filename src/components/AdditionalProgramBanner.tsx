"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DynamicImage from "@/components/DynamicImage";
import { CalendarDays } from "lucide-react"; // For the availability icon

interface AdditionalProgramBannerProps {
  title: React.ReactNode;
  description: React.ReactNode; // Changed to React.ReactNode
  link: string;
  linkText: string;
  bgColorClass?: string;
  textColorClass?: string;
  buttonBgClass?: string;
  buttonTextClass?: string;
  logoSrc?: string;
  className?: string;
  backgroundImageSrc?: string;
  backgroundPosition?: string; // Added for background image positioning
  imageOverlayClass?: string; // New prop for image overlay
  contentAlignment?: 'left' | 'center'; // New prop for content alignment
  titleClassName?: string;
  subtitle?: string;
  subtitleTextColorClass?: string;
}

const AdditionalProgramBanner: React.FC<AdditionalProgramBannerProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass = "bg-brand-dark", // Default to dark blue
  textColorClass = "text-brand-light",
  buttonBgClass = "bg-brand-primary hover:bg-brand-primary/90 text-brand-light",
  buttonTextClass = "",
  logoSrc,
  className,
  backgroundImageSrc,
  backgroundPosition = "center", // Default background position
  imageOverlayClass = "bg-black/50", // Default overlay
  contentAlignment = "center", // Default content alignment
  titleClassName,
  subtitle,
  subtitleTextColorClass,
}) => {
  const renderContent = (
    <div className={cn("space-y-4", textColorClass)}>
      {logoSrc && (
        <DynamicImage
          src={logoSrc}
          alt={`${typeof title === 'string' ? title : 'Program'} logo`}
          className="h-20 object-contain mb-4"
          width={80}
          height={80}
        />
      )}
      <h3 className={cn("text-4xl font-bold leading-tight", titleClassName)}>{title}</h3>
      {subtitle && <p className={cn("text-xl", subtitleTextColorClass)}>{subtitle}</p>}
      {description} {/* Render description as React.ReactNode */}
      <Button asChild size="lg" className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass, buttonTextClass)}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      </Button>
    </div>
  );

  const contentAlignmentClass = contentAlignment === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <div
      className={cn(
        "relative w-full flex flex-col overflow-hidden min-h-[500px] md:min-h-[600px]", // Added min-height
        bgColorClass,
        className
      )}
      style={backgroundImageSrc ? { backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: backgroundPosition } : {}}
    >
      {backgroundImageSrc && <div className={cn("absolute inset-0", imageOverlayClass)}></div>}

      <div className={cn(
        "relative z-10 flex flex-grow",
        contentAlignmentClass, // Apply content alignment here
        "container mx-auto px-4 py-12" // Ensure content is within container
      )}>
        {backgroundImageSrc ? (
          // Two-column layout when backgroundImageSrc is present
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Left column for text content */}
            <div className="flex flex-col justify-center">
              {renderContent}
              {/* Availability info */}
              <div className="mt-6 flex items-center gap-2 text-brand-light/80">
                <CalendarDays className="h-5 w-5" />
                <span>MON - FRI Subject to availability</span>
              </div>
            </div>
            {/* Right column is implicitly the background image, so this div is empty */}
            <div className="hidden md:block"></div>
          </div>
        ) : (
          // Fallback for solid color or no image, centered content
          <div className="flex flex-col justify-center items-center text-center w-full">
            {renderContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalProgramBanner;