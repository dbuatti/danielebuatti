"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DynamicImage from "@/components/DynamicImage";
import { CalendarDays } from "lucide-react";

interface AdditionalProgramBannerProps {
  title: React.ReactNode;
  description: React.ReactNode;
  link: string;
  linkText: string;
  bgColorClass?: string;
  textColorClass?: string;
  buttonBgClass?: string;
  buttonTextClass?: string;
  logoSrc?: string;
  className?: string;
  backgroundImageSrc?: string;
  backgroundPosition?: string;
  imageOverlayClass?: string;
  contentAlignment?: 'left' | 'center';
  titleClassName?: string;
  subtitle?: string;
  subtitleTextColorClass?: string;
}

const AdditionalProgramBanner: React.FC<AdditionalProgramBannerProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass = "bg-brand-dark",
  textColorClass = "text-brand-light",
  buttonBgClass = "bg-brand-primary hover:bg-brand-primary/90 text-brand-light",
  buttonTextClass = "",
  logoSrc,
  className,
  backgroundImageSrc,
  backgroundPosition = "center",
  imageOverlayClass = "bg-black/50",
  contentAlignment = "center",
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
      {description}
      <Button asChild size="lg" className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass, buttonTextClass)}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      </Button>
    </div>
  );

  const isLeftAlignedWithImage = contentAlignment === 'left' && backgroundImageSrc;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden min-h-[500px] md:min-h-[600px]",
        bgColorClass, // This will now be the solid background for the whole banner if isLeftAlignedWithImage is true
        className
      )}
      // Apply background image style only if not left-aligned with a separate image element
      style={!isLeftAlignedWithImage && backgroundImageSrc ? { backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: backgroundPosition } : {}}
    >
      {/* Overlay for full background images (when not left-aligned with image) */}
      {!isLeftAlignedWithImage && backgroundImageSrc && (
        <div className={cn("absolute inset-0", imageOverlayClass)}></div>
      )}

      {/* Content Wrapper */}
      <div className="relative z-10 flex-grow w-full py-12 px-4">
        {isLeftAlignedWithImage ? (
          // Two-column layout for content when left-aligned with image
          <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
            {/* Left column for text content */}
            <div className="flex flex-col justify-center max-w-3xl">
              {renderContent}
              {/* Availability info */}
              <div className="mt-6 flex items-center gap-2 text-brand-light/80">
                <CalendarDays className="h-5 w-5" />
                <span>MON - FRI Subject to availability</span>
              </div>
            </div>
            {/* Right column for the image */}
            <div className="relative hidden md:flex items-center justify-end">
              <img
                src={backgroundImageSrc}
                alt="Program background"
                className={cn(
                  "absolute inset-y-0 right-0 h-full object-cover",
                  "w-full", // Image takes up full width of its parent column (which is half the banner)
                  "object-right" // Crop from the right side of the image to show Daniele
                )}
              />
              {/* Gradient overlay on the left side of the image to blend with text */}
              <div className={cn(
                "absolute inset-y-0 left-0 w-full h-full", // Covers the entire right column
                `bg-gradient-to-r from-[var(--brand-dark)] to-transparent` // Blend from dark background to transparent over image
              )}></div>
            </div>
          </div>
        ) : (
          // Fallback for solid color or full background image (centered content)
          <div className="flex flex-col justify-center items-center text-center w-full max-w-7xl mx-auto">
            {renderContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalProgramBanner;