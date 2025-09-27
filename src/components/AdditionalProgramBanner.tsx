"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdditionalProgramBannerProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  bgColorClass: string;
  textColorClass?: string;
  buttonVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  buttonBgClass?: string;
  buttonTextClass?: string;
  logoSrc?: string;
  className?: string;
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
}) => {
  return (
    <div className={cn("w-full py-16 text-center", bgColorClass, textColorClass, className)}>
      <div className="container mx-auto px-4 space-y-6"> {/* Added container and px-4 here */}
        {logoSrc && (
          <img
            src={logoSrc}
            alt={`${title} logo`}
            className="mx-auto mb-4 h-20 object-contain"
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
    </div>
  );
};

export default AdditionalProgramBanner;