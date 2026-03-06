"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ITServiceBannerProps {
  className?: string;
}

const ITServiceBanner: React.FC<ITServiceBannerProps> = ({ className }) => {
  return (
    <section 
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-[#050505] border border-white/5 shadow-2xl",
        className
      )}
    >
      {/* Subtle Blue Glow Background */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />

      <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl text-left">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.3em] font-semibold">Digital Architecture</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
            Systems Operator for <span className="text-blue-500 font-medium">High-Stakes Environments</span>
          </h2>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            I set up calm, secure, and reliable digital systems for professionals who need their technology to work perfectly every time.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 shrink-0">
          <Button 
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-7 rounded-full shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
          >
            <a href="https://db-it.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Explore IT Services <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            db-it.vercel.app
          </span>
        </div>
      </div>
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
    </section>
  );
};

export default ITServiceBanner;