"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';

interface ResonanceProgramCardProps {
  className?: string;
}

const ResonanceProgramCard: React.FC<ResonanceProgramCardProps> = ({ className }) => {
  const title = "Resonance with Daniele: A Joyful Pop-Up Choir for All Voices";
  const description = "Join a welcoming community to sing, connect, and shine, with no experience needed.";
  const link = "https://resonance-with-daniele.vercel.app";
  const linkText = "Join Resonance Choir";
  const backgroundImageSrc = "/conduct.jpeg";
  const buttonBgClass = "bg-brand-light hover:bg-brand-light/90 text-brand-dark";

  return (
    <div
      className={cn(
        "relative w-full max-w-6xl mx-auto h-[300px] rounded-xl overflow-hidden",
        "flex items-center justify-center text-center",
        "shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.01]",
        className
      )}
      style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: 'cover', backgroundPosition: "center" }}
    >
      {/* Overlay for background images */}
      <div className={cn("absolute inset-0 bg-black/30")}></div>

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
          <Button asChild size="lg" className={cn("text-lg px-8 py-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105", buttonBgClass)}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResonanceProgramCard;