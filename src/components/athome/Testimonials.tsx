"use client";

import React from "react";
import { ATHOME_TESTIMONIALS } from "@/components/athome/content";

const Testimonials: React.FC = () => {
  const slots = ATHOME_TESTIMONIALS.filter(
    (t) => t.quote && t.quote.trim() && t.name && t.name.trim(),
  ).slice(0, 2);

  if (slots.length === 0) return null;

  return (
    <section className="bg-[#F7F3EA] py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          {slots.map((t, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-[#1F1C19]/10 bg-white/50 p-8 shadow-sm"
            >
              <blockquote className="text-lg italic leading-relaxed text-[#1F1C19]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm text-[#8A6900]">
                — {t.name}
                {t.context ? <span className="text-[#1F1C19]/70">, {t.context}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
