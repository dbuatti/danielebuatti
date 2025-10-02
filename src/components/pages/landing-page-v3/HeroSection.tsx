import React from "react";
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CalEmbed from "@/components/CalEmbed";

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto py-12">
      <div className="text-center md:text-left space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-brand-primary">
          Unlock Your Embodied Presence.
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-brand-dark dark:text-brand-light">
          Daniele Buatti – Holistic Coaching for Performers & Communicators
        </p>
        <p className="text-lg md:text-xl text-brand-dark/80 dark:text-brand-light/80 max-w-3xl md:max-w-none mx-auto">
          Whether you're preparing for a big performance, an important audition, or a crucial presentation, my coaching empowers you to communicate with freedom, confidence, and ease. I blend world-class musical and performance training with deep body awareness and a powerful mindset approach, helping you achieve more without the usual strain, stress, or burnout.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Book a Discovery Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] h-[90vh] p-0 overflow-hidden">
            <CalEmbed calLink="danielebuatti/30min" layout="month_view" />
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative flex justify-center md:justify-end">
        <DynamicImage
          src="/headshot.jpeg"
          alt="Daniele Buatti professional headshot"
          className="w-full max-w-lg h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-primary transform rotate-3 hover:rotate-0 transition-transform duration-500"
          width={600}
          height={600}
        />
        <div className="absolute -bottom-10 -left-10 bg-brand-light dark:bg-brand-dark-alt p-6 rounded-xl shadow-lg hidden md:block transform -rotate-3 text-brand-dark dark:text-brand-light">
          <p className="text-sm italic">"True expression begins with the willingness to voice it."</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;