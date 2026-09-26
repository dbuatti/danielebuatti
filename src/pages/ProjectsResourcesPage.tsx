"use client";

import React from "react";
import SeoStructuredData from "@/components/SeoStructuredData";
import DynamicImage from "@/components/DynamicImage";
import ITServiceBanner from "@/components/ITServiceBanner";
import KinesiologyBanner from "@/components/KinesiologyBanner";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouteMeta } from "@/hooks/use-page-meta";

// Image card linking to a service or project (internal route or external site).
const ProjectCard: React.FC<{
  title: string;
  description: string;
  link: string;
  imageSrc: string;
  className?: string;
}> = ({ title, description, link, imageSrc, className }) => {
  const isInternal = link.startsWith("/");
  const content = (
    <>
      <DynamicImage
        src={imageSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
        width={800}
        height={600}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0" />
      <div className="relative z-10 flex h-full flex-col justify-end p-7">
        <h3 className="text-2xl font-normal leading-snug text-white">{title}</h3>
        <p className="mt-2 text-[15px] text-white/80">{description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white">
          {isInternal ? "Learn more" : "Visit site"}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </>
  );
  const cardClass = cn("group relative block h-80 overflow-hidden rounded-2xl bg-brand-dark shadow-soft transition-shadow duration-500 hover:shadow-lifted", className);
  return isInternal ? (
    <Link to={link} className={cardClass}>{content}</Link>
  ) : (
    <a href={link} target="_blank" rel="noopener noreferrer" className={cardClass}>{content}</a>
  );
};

const PianoBackingsCard: React.FC = () => (
  <a
    href="https://pianobackingsbydaniele.vercel.app"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Piano Backings by Daniele"
    className="group relative flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-[#ff00b3] p-10 shadow-soft transition-shadow duration-500 hover:shadow-lifted"
  >
    <DynamicImage
      src="/pianobackingslogo.png"
      alt="Piano Backings by Daniele"
      className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out-expo group-hover:scale-105"
      width={1200}
      height={600}
    />
  </a>
);

const Group = ({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) => (
  <section>
    <p className="eyebrow">{eyebrow}</p>
    <h2 className="mt-3 text-3xl md:text-4xl font-light text-brand-dark">{title}</h2>
    <div className="mt-8">{children}</div>
  </section>
);

const ProjectsPage: React.FC = () => {
  useRouteMeta("/projects-resources");

  return (
    <div>
      <SeoStructuredData />
      <div className="container py-14 md:py-20">
        <header className="max-w-3xl">
          <p className="eyebrow">Projects &amp; resources</p>
          <h1 className="mt-4 text-5xl md:text-6xl font-light leading-[1.05] text-brand-dark">Projects &amp; Services</h1>
          <p className="mt-5 text-lg md:text-xl leading-relaxed text-muted-foreground">
            Explore my work beyond one-to-one coaching — from live performance and music direction to digital resources and community singing.
          </p>
        </header>

        <div className="mt-16 space-y-20">
          <Group eyebrow="On stage" title="Specialised services">
            <div className="grid gap-6 md:grid-cols-3">
              <ProjectCard title="Music Director & Pianist" description="Music theatre direction, vocal coaching, and performance." link="/music-director-pianist" imageSrc="/daniele-conducting.jpeg" />
              <ProjectCard title="Live Piano Services" description="Weddings, events, and private functions." link="/live-piano-services" imageSrc="/blacktie.avif" />
              <ProjectCard title="AMEB Accompanying" description="Exam day and rehearsal accompaniment." link="/ameb-accompanying" imageSrc="/ameb-placeholder.jpg" />
            </div>
          </Group>

          <Group eyebrow="Online & in the community" title="Digital products & community">
            <div className="grid gap-6 md:grid-cols-3">
              <ProjectCard title="Sheet Music Store" description="Professional arrangements and vocal scores. Instant digital downloads." link="/store" imageSrc="/sheetmusic.png" />
              <PianoBackingsCard />
              <ProjectCard title="Resonance with Daniele" description="A joyful pop-up choir for all voices. No experience needed." link="https://resonance-with-daniele.vercel.app" imageSrc="/conduct.jpeg" />
            </div>
          </Group>

          <Group eyebrow="Beyond music" title="Somatic health & digital architecture">
            <div className="grid gap-6 md:grid-cols-2">
              <KinesiologyBanner />
              <ITServiceBanner />
            </div>
          </Group>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;