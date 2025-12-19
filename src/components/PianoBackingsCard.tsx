"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { cn } from "@/lib/utils";

interface PianoBackingsCardProps {
  className?: string;
}

const PianoBackingsCard: React.FC<PianoBackingsCardProps> = ({ className }) => {
  return (
    <div className={cn("relative h-96 rounded-3xl overflow-hidden shadow-2xl bg-[#ff00b3] flex flex-col justify-between p-10", className)}>
      {/* Large centered logo – visible but subtle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <DynamicImage
          src="/pianobackingslogo.png"
          alt="Piano Backing Tracks"
          className="max-w-full max-h-full object-contain opacity-70"
          width={1000}
          height={500}
        />
      </div>

      {/* Content – bottom aligned, high contrast */}
      <div className="relative z-10">
        {/* Empty top space for logo visibility */}
      </div>

      <div className="relative z-10 space-y-6">
        <h3 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl leading-tight">
          Piano Backing Tracks
        </h3>
        <p className="text-xl md:text-2xl text-white/95 drop-shadow-lg max-w-lg">
          Professional tracks for singers
        </p>
        <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-[#ff00b3] font-semibold text-lg px-12 py-7 rounded-full shadow-2xl">
          <a href="https://pianobackingsbydaniele.vercel.app" target="_blank" rel="noopener noreferrer">
            Explore
          </a>
        </Button>
      </div>
    </div>
  );
};

export default PianoBackingsCard;