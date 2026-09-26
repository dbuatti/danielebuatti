"use client";

import React, { useState } from 'react';
import CalEmbed from '@/components/CalEmbed';
import SectionHeading from '@/components/SectionHeading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { usePageMeta } from "@/hooks/use-page-meta";

type Duration = "45" | "60";

const durationOptions: { value: Duration; label: string; calLink: string }[] = [
  { value: "45", label: "45 Minute Lesson", calLink: "danielebuatti/voice-and-piano-coaching-45" },
  { value: "60", label: "60 Minute Lesson", calLink: "danielebuatti/voice-and-piano-coaching-60" },
];

const VoicePianoBookingPage: React.FC = () => {
  usePageMeta(
    "Book a Voice or Piano Lesson | Daniele Buatti",
    "Choose a 45 or 60 minute voice and piano lesson and book a time that suits you, in Toorak, Melbourne, or online.",
  );

  const [selectedDuration, setSelectedDuration] = useState<Duration>("45");

  const pageTitle = "Book Performance & Musicianship Sessions";

  const currentOption = durationOptions.find(o => o.value === selectedDuration)!;

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <main className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <SectionHeading>{pageTitle}</SectionHeading>
          <Separator className="max-w-xs mx-auto bg-brand-secondary" />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {durationOptions.map(opt => (
            <Button
              key={opt.value}
              onClick={() => setSelectedDuration(opt.value)}
              variant={selectedDuration === opt.value ? "default" : "outline"}
              className={selectedDuration === opt.value
                ? "bg-brand-primary text-brand-light"
                : "border-brand-primary text-brand-primary"
              }
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto" key={selectedDuration}>
          <CalEmbed calLink={currentOption.calLink} layout="month_view" />
        </div>
      </main>
    </div>
  );
};

export default VoicePianoBookingPage;