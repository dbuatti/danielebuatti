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
  const content = (
    <div className={cn("relative z-10 flex flex-col items-center justify-center p-8 text-center space-y-6 h-full", textColorClass)}>
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
    </div>
  );

  if (backgroundImageSrc) {
    return (
      <div className={cn("w-full grid grid-cols-1 md:grid-cols-2 min-h-[300px]", className)}>
        {/* Image Side (Left) - Hidden on mobile, visible on md and up */}
        <div
          className="relative hidden md:block bg-cover bg-center min-h-[300px]"
          style={{ backgroundImage: `url(${backgroundImageSrc})` }}
        >
          {/* No overlay needed here, as text is on the other side */}
        </div>

        {/* Content Side (Right) - Takes full width on mobile, half on md and up */}
        <div className={cn(
          "relative z-10 flex flex-col items-center justify-center p-8 text-center space-y-6 h-full",
          bgColorClass || "bg-brand-dark", // Default background for content side
          textColorClass
        )}>
          {content}
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
        {content}
      </div>
    );
  }
};

export default AdditionalProgramBanner;