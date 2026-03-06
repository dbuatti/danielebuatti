"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KinesiologyBannerProps {
  className?: string;
}

const KinesiologyBanner: React.FC<KinesiologyBannerProps> = ({ className }) => {
  return (
    <section 
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] bg-[#1a1c3d] border border-purple-500/10 shadow-2xl",
        className
      )}
    >
      {/* Ethereal Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c3d] via-[#2d1b4d] to-[#1a1c3d]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-6 max-w-2xl text-left">
          <div className="flex items-center gap-3 text-purple-300 mb-2">
            <Leaf className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.4em] font-semibold">Resonance Kinesiology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-white leading-tight font-serif italic">
            Somatic Support & <span className="text-purple-300">Nervous System</span> Regulation
          </h2>
          <p className="text-gray-300 text-xl font-light leading-relaxed">
            Integrating professional kinesiology with somatic modalities to help you return to your body's innate intelligence.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 shrink-0">
          <Button 
            asChild
            size="lg"
            className="bg-[#4a3f6b] hover:bg-[#5a4f7b] text-white font-medium px-10 py-8 rounded-full shadow-xl shadow-purple-900/20 transition-all hover:scale-105 border border-purple-400/20"
          >
            <a href="https://resonance-kinesiology.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-lg">
              Explore Kinesiology <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
          <span className="text-purple-300/50 text-xs uppercase tracking-widest font-medium">
            resonance-kinesiology.vercel.app
          </span>
        </div>
      </div>
      
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")' }} 
      />
    </section>
  );
};

export default KinesiologyBanner;