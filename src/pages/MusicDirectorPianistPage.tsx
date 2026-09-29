"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { ArrowLink, CtaBand, PageHeader, SectionIntro } from "@/components/editorial";
import { primaryButton } from "@/lib/button-styles";
import { useRouteMeta } from "@/hooks/use-page-meta";

const cvLink = "https://rxresu.me/daniele.buatti/daniele-buatti-md";

const credits = [
  "Paw Patrol Live",
  "Beetlejuice",
  "Heathers",
  "A Chorus Line",
  "Shrek",
  "Legally Blonde",
  "Mary Poppins",
  "Madiba the Musical",
];

const education = [
  {
    title: "Bachelor of Music",
    detail: "Australian Institute of Music (2014–2016) — majoring in Arranging, Composition, Orchestration, and Piano.",
  },
  {
    title: "Diploma of Kinesiology",
    detail:
      "Specialising in mind-body integration, which underpins my approach to performance coaching and artist development.",
  },
];

const MusicDirectorPianistPage: React.FC = () => {
  useRouteMeta("/music-director-pianist");

  return (
    <div>
      <PageHeader
        eyebrow="Music direction · Piano"
        title={
          <>
            Music Director <em className="italic text-brand-primary">&amp;</em> Pianist
          </>
        }
        lede="Collaborative musical leadership for stage, studio, and performance development."
        image={{ src: "/danielecalmatpiano.jpeg", alt: "Daniele Buatti at the piano", position: "38% center" }}
        actions={
          <>
            <a href={cvLink} target="_blank" rel="noopener noreferrer" className={primaryButton}>
              View full CV
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <ArrowLink to="/contact">Discuss a production</ArrowLink>
          </>
        }
      />

      {/* Credits */}
      <section className="border-y border-border bg-card/60">
        <div className="container py-14">
          <p className="eyebrow text-muted-foreground">Selected credits</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 font-serif text-xl font-light text-brand-dark sm:flex sm:flex-wrap sm:gap-x-8 sm:text-2xl md:text-3xl">
            {credits.map((c, i) => (
              <li key={c} className="flex items-center sm:gap-8">
                <span className={c === "Madiba the Musical" ? "italic" : undefined}>{c}</span>
                {i < credits.length - 1 && <span className="hidden h-1.5 w-1.5 rounded-full bg-brand-primary/60 sm:block" aria-hidden="true" />}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">Madiba the Musical at Melbourne’s Comedy Theatre.</p>
        </div>
      </section>

      {/* Bio */}
      <section className="container grid gap-12 py-24 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:py-32">
        <p className="font-serif text-3xl md:text-4xl font-light leading-[1.2] text-brand-dark">
          I’m a music theatre practitioner based in Melbourne, with over a decade of experience as a music director,
          pianist, vocal coach, and performer.
        </p>
        <div className="space-y-6 text-lg leading-relaxed text-brand-dark/80">
          <p>
            My work spans large-scale productions and intimate workshops. As a music director and pianist, I bring a
            collaborative, detail-oriented approach to every production — supporting performers, serving the narrative,
            and building a musical environment where the whole cast can do their best work.
          </p>
          <p>
            As a vocal coach, I work with performers at all levels to develop technical skill, expressive range, and
            confidence under pressure. My coaching draws on vocal pedagogy, performance psychology, and body-voice
            integration informed by my <em>Diploma of Kinesiology</em> — helping singers address not just technique, but
            the physical and psychological patterns that shape how they perform.
          </p>
        </div>
      </section>

      {/* Education */}
      <section className="container pb-24 lg:pb-32">
        <SectionIntro eyebrow="Education & training" title="Training" />
        <ol className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          {education.map((e, i) => (
            <li key={e.title} className="border-t border-brand-dark/15 pt-6">
              <span className="font-serif text-sm text-brand-primary">0{i + 1}</span>
              <h3 className="mt-3 text-2xl font-light text-brand-dark">{e.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{e.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand
        eyebrow="Availability"
        title="Available for music direction, piano performance, and vocal coaching."
        primary={{ label: "Get in touch", to: "/contact" }}
        secondary={{ label: "All services", to: "/projects-resources" }}
      />
    </div>
  );
};

export default MusicDirectorPianistPage;
