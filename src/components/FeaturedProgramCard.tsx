"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeaturedProgramCardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  backgroundImageSrc: string;
  className?: string;
  buttonBgClass?: string;
  buttonTextClass?: string;
}

const FeaturedProgramCard: React.FC<FeaturedProgramCardProps> = ({
  title,
  description,
  link,
  linkText,
  backgroundImageSrc,
  className,
  buttonBgClass = "bg-brand-primary hover:bg-brand-primary/90 text-brand-light",
  buttonTextClass = "",
}) => {
  return (
    <div
      className={cn(
        "relative w-full max-w-6xl mx-auto h-[300px] rounded-xl overflow-hidden",
        "flex items-center justify-center text-center",
        "shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.01]",
        className
      )}
      style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Subtle Overlay for background image */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content Card */}
      <Card className="relative z-10 bg-brand-dark/80 dark:bg-brand-dark/90 text-brand-light p-6 md:p-8 max-w-md mx-auto border-brand-secondary shadow-lg">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-3xl font-extrabold leading-tight text-shadow-sm">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <p className="text-lg text-brand-light/90 text-shadow-sm">
            {description}
          </p>
          <Button asChild size="lg" className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass, buttonTextClass)}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProgramCard;