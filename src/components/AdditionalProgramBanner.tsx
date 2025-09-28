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
  imageOverlayClass?: string; // This will now define the gradient overlay
  titleClassName?: string;
  subtitle?: string;
  subtitleTextColorClass?: string;
}

const AdditionalProgramBanner: React.FC<AdditionalProgramBannerProps> = ({
  title,
  description,
  link,
  linkText,
  bgColorClass = "bg-brand-dark", // Base background color for the banner
  textColorClass = "text-brand-light",
  buttonBgClass = "bg-brand-primary hover:bg-brand-primary/90 text-brand-light hover:text-brand-dark", // Added hover:text-brand-dark
  buttonTextClass = "",
  logoSrc,
  className,
  backgroundImageSrc,
  backgroundPosition = "center right", // Default to show Daniele on the right
  imageOverlayClass = "bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent", // Adjusted gradient for better contrast
  titleClassName,
  subtitle,
  subtitleTextColorClass,
}) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-16 md:py-20 lg:py-24", // Reduced vertical padding
        "min-h-[400px] md:min-h-[500px] lg:min-h-[600px]", // Reduced minimum height
        bgColorClass, // Base background color
        className
      )}
      style={backgroundImageSrc ? { backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: backgroundPosition } : {}}
    >
      {/* Gradient Overlay */}
      <div className={cn("absolute inset-0", imageOverlayClass)}></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-full flex items-center">
        <div className={cn("max-w-md lg:max-w-xl space-y-6 text-left", textColorClass)}>
          {logoSrc && (
            <DynamicImage
              src={logoSrc}
              alt={`${typeof title === 'string' ? title : 'Program'} logo`}
              className="h-20 object-contain mb-4"
              width={80}
              height={80}
            />
          )}
          <h3 className={cn("text-5xl md:text-6xl font-extrabold leading-tight text-shadow-sm", titleClassName)}>
            {title}
          </h3>
          {subtitle && <p className={cn("text-xl md:text-2xl font-semibold text-shadow-sm", subtitleTextColorClass)}>{subtitle}</p>}
          <div className="text-lg md:text-xl leading-relaxed font-medium text-shadow-sm">
            {description}
          </div>
          <Button asChild size="lg" className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass, buttonTextClass)}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          </Button>
          <div className="mt-6 flex items-center gap-2 text-brand-light/80 text-sm md:text-base text-shadow-sm">
            <CalendarDays className="h-5 w-5" />
            <span>MON - FRI Subject to availability</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalProgramBanner;