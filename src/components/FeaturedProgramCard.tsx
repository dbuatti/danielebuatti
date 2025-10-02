"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom'; // Import Link for internal navigation

interface FeaturedProgramCardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  // Either backgroundImageSrc (for full background images)
  // OR backgroundColorClass + logoSrc (for solid color background with a logo)
  backgroundImageSrc?: string;
  backgroundColorClass?: string; // New prop for solid background color
  logoSrc?: string; // New prop for logo image when using solid background
  className?: string;
  buttonBgClass?: string;
  buttonTextClass?: string;
  overlayColorClass?: string; // Still useful for background images
  backgroundPosition?: string; // New prop for background-position
  cardBgClass?: string; // NEW: Prop for inner card background
  cardTextClass?: string; // NEW: Prop for inner card text
}

const FeaturedProgramCard: React.FC<FeaturedProgramCardProps> = ({
  title,
  description,
  link,
  linkText,
  backgroundImageSrc,
  backgroundColorClass, // New
  logoSrc, // New
  className,
  buttonBgClass = "bg-brand-primary hover:bg-brand-primary/90 text-brand-light",
  buttonTextClass = "",
  overlayColorClass = "bg-black/30", // Default to black overlay
  backgroundPosition = "center", // Default to center
  cardBgClass = "bg-brand-dark/80 dark:bg-brand-dark/90", // Default inner card background
  cardTextClass = "text-brand-light", // Default inner card text
}) => {
  const hasBackgroundImage = !!backgroundImageSrc;
  const hasSolidBackgroundWithLogo = !!backgroundColorClass && !!logoSrc;

  // Determine if the link is internal or external
  const isInternalLink = link.startsWith('/') || link.startsWith('#');

  return (
    <div
      className={cn(
        "relative w-full max-w-6xl mx-auto h-[300px] rounded-xl overflow-hidden",
        "flex items-center justify-center text-center",
        "shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.01]",
        hasSolidBackgroundWithLogo ? backgroundColorClass : "", // Apply solid background if present
        className
      )}
      style={hasBackgroundImage ? { backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: backgroundPosition } : {}}
    >
      {/* Overlay for background images */}
      {hasBackgroundImage && <div className={cn("absolute inset-0", overlayColorClass)}></div>}

      {/* Logo for solid backgrounds, positioned behind the content card */}
      {hasSolidBackgroundWithLogo && logoSrc && (
        <img
          src={logoSrc}
          alt={`${title} logo`}
          className="absolute inset-0 w-full h-full object-contain z-0" // Position logo behind content
        />
      )}

      {/* Content Card */}
      <Card className={cn("relative z-10 p-6 md:p-8 max-w-md mx-auto border-brand-secondary shadow-lg", cardBgClass, cardTextClass)}>
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-3xl font-extrabold leading-tight text-shadow-sm">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <p className="text-lg text-shadow-sm">
            {description}
          </p>
          <Button asChild size="lg" className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass, buttonTextClass)}>
            {isInternalLink ? (
              <Link to={link}>
                {linkText}
              </Link>
            ) : (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {linkText}
              </a>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProgramCard;