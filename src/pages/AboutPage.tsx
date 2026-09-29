"use client";

import React from "react";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLink, CtaBand, PageHeader, SectionIntro } from "@/components/editorial";
import { useRouteMeta } from "@/hooks/use-page-meta";

const steps = [
  { title: "Thought", text: "Becoming aware of mental patterns and habits that hold you back." },
  { title: "Intention", text: "Clarifying what you want to express and aligning your body with that purpose." },
  { title: "Breath", text: "Freeing and deepening breath to release tension and support sound." },
  { title: "Expression", text: "Letting your natural voice and presence emerge without force." },
];

const gallery = [
  { src: "/greenroom.jpeg", alt: "Daniele Buatti at the Green Room Awards", position: "center" },
  { src: "/live-performance.jpeg", alt: "Daniele Buatti performing at the piano", position: "center 30%" },
  { src: "/tulips.jpeg", alt: "Daniele Buatti among the tulips", position: "22% center" },
];

const AboutPage: React.FC = () => {
  useRouteMeta("/about");

  return (
    <div>
      <PageHeader
        eyebrow="About"
        title={
          <>
            Daniele <em className="italic text-brand-primary">Buatti</em>
          </>
        }
        lede="Pianist, music director, vocal coach, and embodiment practitioner based in Melbourne."
        image={{ src: "/daniele simple.jpeg", alt: "Portrait of Daniele Buatti", position: "center 30%" }}
      />

      {/* Story */}
      <section className="border-y border-border bg-card/60">
        <div className="container grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-28">
          <div>
            <p className="eyebrow">The story so far</p>
            <p className="mt-6 font-serif text-3xl md:text-4xl font-light leading-[1.2] text-brand-dark">
              “The voice cannot be separated from the body it lives in — the interconnection between the two is
              everything.”
            </p>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-brand-dark/80">
            <p>
              I’ve spent over fifteen years working across music theatre and performance as a music director, pianist,
              arranger, vocal coach, and educator.
            </p>
            <p>
              Alongside this, I trained in kinesiology and draw from yoga and somatic practices, allowing me to work with
              performers in a way that integrates body, breath, and voice — not as separate skills, but as a single,
              responsive system.
            </p>
            <p>
              My work centres on reducing unnecessary tension, increasing awareness, and creating the conditions for
              authentic expression to emerge naturally — whether on stage, in the studio, or in everyday communication.
            </p>
            <p>
              I’m deeply passionate about posture, breath, and movement, and draw great influence from Feldenkrais,
              Alexander Technique, and yoga in my teaching.
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="container py-24 lg:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionIntro eyebrow="My approach" title="Four connected steps">
            Everything I teach is built around them.
          </SectionIntro>
          <ArrowLink to="/coaching" className="shrink-0">
            More about my coaching
          </ArrowLink>
        </div>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-brand-dark/15 pt-6">
              <span className="font-serif text-sm text-brand-primary">0{i + 1}</span>
              <h3 className="mt-3 text-2xl font-light text-brand-dark">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Gallery */}
      <section className="container pb-24 lg:pb-32" aria-label="Photos">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {gallery.map((g, i) => (
            <div key={g.src} className={i === 1 ? "sm:translate-y-10" : undefined}>
              <div className="overflow-hidden rounded-2xl bg-secondary">
                <DynamicImage
                  src={g.src}
                  alt={g.alt}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-out-expo hover:scale-[1.04]"
                  style={{ objectPosition: g.position }}
                  width={500}
                  height={625}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        eyebrow="Say hello"
        title="Get in touch"
        text="If you’d like to talk about coaching, performance work, or anything else, feel free to reach out."
        primary={{ label: "Contact me", to: "/contact" }}
        secondary={{ label: "Book a lesson", to: "/voice-piano-services#book" }}
      />
    </div>
  );
};

export default AboutPage;
