import React from "react";
import { PageHeader } from "@/components/editorial";

// Shared frame for the site's text-heavy legal pages (/privacy, /terms), so
// they open with the same editorial header as every other page and then read
// as one comfortable, mobile-friendly column.

interface LegalPageProps {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  updated?: string;
  children: React.ReactNode;
}

export const LegalPage: React.FC<LegalPageProps> = ({ eyebrow, title, lede, updated, children }) => (
  <div>
    <PageHeader eyebrow={eyebrow} title={title} lede={lede} />
    <section className="border-t border-border bg-card/60">
      <div className="container py-14 md:py-20">
        <div className="max-w-3xl">
          {updated && (
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{updated}</p>
          )}
          <div className="mt-10 space-y-11 text-base md:text-lg leading-relaxed text-muted-foreground">{children}</div>
        </div>
      </div>
    </section>
  </div>
);

export const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="text-2xl md:text-3xl font-light text-brand-dark">{title}</h2>
    <div className="mt-4 space-y-4">{children}</div>
  </section>
);

export const LegalList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc space-y-2 pl-5 marker:text-brand-primary">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);
