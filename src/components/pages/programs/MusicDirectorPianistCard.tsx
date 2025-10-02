"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DynamicImage from "@/components/DynamicImage";
import { GraduationCap } from "lucide-react";

interface MusicDirectorPianistCardProps {
  className?: string;
}

const MusicDirectorPianistCard: React.FC<MusicDirectorPianistCardProps> = ({ className }) => {
  const title = "Music Director & Pianist";
  const description = (
    <>
      <p>
        I am a versatile music theatre practitioner with extensive experience as a vocal coach, pianist, music director, and performer. With a career spanning over a decade, I have collaborated on a wide range of productions, from large-scale musicals to intimate workshops, including Paw Patrol Live, Beetlejuice, Heathers, A Chorus Line, Shrek, Legally Blonde, Mary Poppins, and Madiba the Musical at Melbourne’s Comedy Theatre.
      </p>
      <p>
        My approach blends technical expertise with a deep understanding of embodiment, performance psychology, and improvisation, helping performers find freedom, resonance, and authenticity in their voice. I am also known for my innovative work in educational and charitable theatre programs, mentoring emerging artists and facilitating workshops that integrate movement, sound, and emotional awareness.
      </p>
      <p>
        As a pianist and music director, I bring a nuanced, collaborative energy to every production, tailoring musical direction to support both performers and the narrative. My teaching and coaching practice focuses on helping artists unlock their potential, manage performance stress, and develop a sustainable, expressive relationship with their craft. This often involves addressing underlying physical or energetic blocks through body-voice integration, leading to deeper healing and more authentic expression.
      </p>
      <p>
        Passionate about the transformative power of music and theatre, I continue to inspire performers of all ages and levels, combining artistry, empathy, and technical skill to create performances that are both compelling and heartfelt.
      </p>
      <div className="pt-8 space-y-4">
        <h3 className="flex items-center gap-3 text-2xl font-bold text-brand-primary justify-center md:justify-start">
          <GraduationCap className="h-7 w-7" />
          My Education & Certifications
        </h3>
        <p>
          I completed a Bachelor of Music at the Australian Institute of Music (2014-2016), where I focused on Arranging, Composition, Orchestration, and Piano. Furthering my commitment to holistic development, I also earned a Diploma of Kinesiology, specialising in mind-body integration for performance and well-being, which deeply informs my integrated coaching approach.
        </p>
      </div>
    </>
  );
  const cvLink = "https://rxresu.me/daniele.buatti/daniele-buatti-md";
  const imageSrc = "/daniele simple.jpeg";

  return (
    <Card className={cn(
      "bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 md:p-8",
      "flex flex-col lg:flex-row items-center gap-8 max-w-6xl mx-auto",
      className
    )}>
      <div className="lg:w-1/3 flex-shrink-0">
        <DynamicImage
          src={imageSrc}
          alt="Daniele Buatti simple headshot"
          className="w-full h-auto rounded-xl shadow-lg object-cover border-4 border-brand-primary"
          width={400}
          height={400}
        />
      </div>
      <div className="lg:w-2/3 text-center lg:text-left space-y-6">
        <CardHeader className="p-0">
          <CardTitle className="text-4xl font-extrabold leading-tight text-brand-primary">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed space-y-4">
          {description}
        </CardContent>
        <Button size="lg" className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <a href={cvLink} target="_blank" rel="noopener noreferrer">
            View CV
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default MusicDirectorPianistCard;