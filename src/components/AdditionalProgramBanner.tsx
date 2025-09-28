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
      {/* Dynamic Overlay */}
      {backgroundImageSrc && (
        <div className={cn(
          "absolute inset-0",
          contentAlignment === 'left' ? "bg-gradient-to-r from-brand-dark/70 to-transparent" : imageOverlayClass // Use gradient for left alignment
        )}></div>
      )}

      {/* Content Wrapper - now full width, but uses grid for internal layout */}
      <div className={cn(
        "relative z-10 flex flex-grow w-full py-12", // Removed px-4 from here
        contentAlignmentClass
      )}>
        {backgroundImageSrc ? (
          // Two-column layout for content when backgroundImageSrc is present
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Removed max-w-7xl mx-auto here */}
            {/* Left column for text content */}
            <div className="flex flex-col justify-center px-4 md:col-span-1 max-w-3xl md:ml-0 md:mr-auto"> {/* Removed mx-auto */}
              {renderContent}
              {/* Availability info */}
              <div className="mt-6 flex items-center gap-2 text-brand-light/80">
                <CalendarDays className="h-5 w-5" />
                <span>MON - FRI Subject to availability</span>
              </div>
            </div>
            {/* Right column is empty, allowing background image to show */}
            <div className="hidden md:block md:col-span-1"></div>
          </div>
        ) : (
          // Fallback for solid color or no image, centered content
          <div className="flex flex-col justify-center items-center text-center w-full max-w-7xl mx-auto px-4">
            {renderContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalProgramBanner;