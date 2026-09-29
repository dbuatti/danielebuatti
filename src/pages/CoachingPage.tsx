"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Leaf, Megaphone, Mic2 } from "lucide-react";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLink, CtaBand, PageHeader, SectionIntro } from "@/components/editorial";
import { primaryButton } from "@/lib/button-styles";
import { useRouteMeta } from "@/hooks/use-page-meta";

const strands = [
  {
    icon: Mic2,
    title: "Voice & Piano",
    body: [
      "Refined, musical work grounded in real-world performance. Vocal technique that prioritises ease and resonance. Piano skills for singers and directors. Repertoire, interpretation, and stylistic clarity. Audition and performance preparation. Sight-reading, theory, and musical literacy.",
    ],
    line: "Always in service of expression — never mechanics for their own sake.",
    link: { label: "See lesson details & pricing", to: "/voice-piano-services" },
  },
  {
    icon: Leaf,
    title: "Body, Breath & Regulation",
    body: [
      "Where most vocal training stops — this work begins. Using kinesiology, breath work, and somatic practices to address unconscious holding patterns, performance stress, and disconnection between intention and sound.",
      "I’m deeply passionate about posture, breath, and movement, and draw great influence from Feldenkrais, Alexander Technique, and yoga in my teaching. For me, the voice cannot be separated from the body it lives in — the interconnection between the two is everything.",
    ],
    line: "The aim is a voice that responds — not one that’s managed.",
    link: { label: "Book pure kinesiology sessions", href: "https://kinesiology.danielebuatti.com/" },
  },
  {
    icon: Megaphone,
    title: "Presence & Communication",
    body: [
      "For moments where clarity matters. Public speaking and presentations. On-camera confidence. Acting and text delivery. Leadership presence. Focused on nervous system regulation, clarity of intention, and grounded delivery.",
    ],
    line: "So you’re felt, not just heard.",
  },
];

const CoachingPage: React.FC = () => {
  useRouteMeta("/coaching");

  return (
    <div>
      <PageHeader
        eyebrow="One-to-one coaching"
        title={
          <>
            Voice. Presence. <em className="italic text-brand-primary">Musical authority.</em>
          </>
        }
        lede="One-to-one work for performers, speakers, and creatives who want to communicate with clarity, depth, and ease — without forcing or over-efforting."
        actions={
          <>
            <Link to="/voice-piano-services#book" className={primaryButton}>
              Check availability &amp; book
            </Link>
            <ArrowLink to="/contact">Ask a question first</ArrowLink>
          </>
        }
      >
        <p className="mt-8 max-w-xl border-l-2 border-brand-primary/60 pl-5 text-base leading-relaxed text-brand-dark/75">
          This work integrates voice, piano, body awareness, and somatic intelligence to support sustainable, embodied
          expression.
        </p>
      </PageHeader>

      {/* Wide image */}
      <section className="container">
        <div className="overflow-hidden rounded-3xl shadow-lifted">
          <DynamicImage
            src="/danielecalmatpiano.jpeg"
            alt="Daniele Buatti in flow at the piano"
            className="h-[340px] w-full object-cover sm:h-[460px] lg:h-[560px]"
            style={{ objectPosition: "center 12%" }}
            width={1400}
            height={800}
            priority
          />
        </div>
      </section>

      {/* The work */}
      <section className="container py-24 lg:py-32">
        <SectionIntro eyebrow="The work" title="Three strands, one practice">
          Most sessions draw on all three. We start wherever you are and follow what the voice is asking for.
        </SectionIntro>

        <ol className="mt-16 divide-y divide-border border-y border-border">
          {strands.map(({ icon: Icon, title, body, line, link }, i) => (
            <li key={title} className="grid gap-6 py-12 md:grid-cols-[180px_1fr] lg:grid-cols-[240px_1fr_1fr] lg:gap-12">
              <div className="flex items-center gap-4 md:flex-col md:items-start">
                <span className="font-serif text-sm text-brand-primary">0{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-brand-dark/80">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-light leading-tight text-brand-dark">{title}</h3>
                <p className="mt-5 font-serif text-xl italic leading-snug text-brand-dark/80">{line}</p>
                {link &&
                  ("href" in link && link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-6 inline-flex items-center gap-1.5 font-medium text-brand-primary"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ) : (
                    <ArrowLink to={(link as { to: string }).to} className="mt-6 text-brand-primary">
                      {link.label}
                    </ArrowLink>
                  ))}
              </div>
              <div className="space-y-4 text-[17px] leading-relaxed text-muted-foreground md:col-start-2 lg:col-start-3">
                {body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand
        eyebrow="Beyond coaching"
        title="Additional musical services"
        text="Alongside coaching, I work professionally as a pianist, music director, and arranger — including live performance, music direction, AMEB accompaniment, custom sheet music, and backing tracks."
        primary={{ label: "Book a session", to: "/voice-piano-services#book" }}
        secondary={{ label: "Explore all services", to: "/projects-resources" }}
      />
    </div>
  );
};

export default CoachingPage;
