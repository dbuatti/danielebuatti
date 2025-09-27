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
}) => {
  return (
    <div className={cn("w-full py-16 px-4 text-center rounded-xl shadow-lg", bgColorClass, textColorClass)}>
      <div className="container mx-auto space-y-6">
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