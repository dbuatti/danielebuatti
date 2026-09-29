import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import DynamicImage from "@/components/DynamicImage";
import { ghostLightButton, primaryButton } from "@/lib/button-styles";


// Shared building blocks for the editorial page layout, so every inner page
// opens, breathes and closes the same way as the homepage.

/* -------------------------------------------------------------------------- */
/* Page header                                                                */
/* -------------------------------------------------------------------------- */

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
  image?: { src: string; alt: string; position?: string };
  // Extra content under the lede (facts row, note, etc.)
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, lede, actions, image, children, className }) => (
  <header
    className={cn(
      "container grid items-center gap-12 pb-16 pt-10 md:pt-16 lg:pb-24",
      image && "lg:grid-cols-[1.1fr_1fr] lg:gap-20",
      className,
    )}
  >
    <div className={cn(!image && "max-w-3xl")}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-5 text-[44px] leading-[1.02] sm:text-6xl lg:text-7xl font-light text-brand-dark">{title}</h1>
      {lede && <p className="mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-muted-foreground">{lede}</p>}
      {actions && <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">{actions}</div>}
      {children}
    </div>
    {image && (
      <div className="relative mx-auto w-full max-w-md lg:mr-5">
        <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 h-full w-full rounded-2xl bg-secondary" aria-hidden="true" />
        <DynamicImage
          src={image.src}
          alt={image.alt}
          className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-lifted"
          style={image.position ? { objectPosition: image.position } : undefined}
          width={600}
          height={750}
          priority
        />
      </div>
    )}
  </header>
);

/* -------------------------------------------------------------------------- */
/* Section intro                                                              */
/* -------------------------------------------------------------------------- */

export const SectionIntro = ({
  eyebrow,
  title,
  children,
  className,
  tone = "light",
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) => (
  <div className={cn("max-w-2xl", className)}>
    <p className={cn("eyebrow", tone === "dark" && "text-[hsl(325_72%_72%)]")}>{eyebrow}</p>
    <h2
      className={cn(
        "mt-4 text-4xl md:text-5xl font-light leading-[1.08]",
        tone === "dark" ? "text-brand-light" : "text-brand-dark",
      )}
    >
      {title}
    </h2>
    {children && (
      <p className={cn("mt-5 text-lg leading-relaxed", tone === "dark" ? "text-brand-light/70" : "text-muted-foreground")}>
        {children}
      </p>
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Buttons & links                                                            */
/* -------------------------------------------------------------------------- */

export const ArrowLink = ({
  to,
  href,
  children,
  className,
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const cls = cn("group inline-flex items-center gap-2 text-base font-medium text-brand-dark", className);
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to ?? "/"} className={cls}>
      {inner}
    </Link>
  );
};

/* -------------------------------------------------------------------------- */
/* Closing call-to-action band                                                */
/* -------------------------------------------------------------------------- */

export const CtaBand = ({
  eyebrow = "Next step",
  title,
  text,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}) => (
  <section className="container pb-24 lg:pb-32">
    <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-8 py-14 text-brand-light md:px-14 md:py-20">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-primary/25 blur-[100px]"
        aria-hidden="true"
      />
      <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow text-[hsl(325_72%_72%)]">{eyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-light leading-[1.08] text-brand-light">{title}</h2>
          {text && <p className="mt-5 text-lg leading-relaxed text-brand-light/70">{text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={primary.to} className={primaryButton}>
            {primary.label}
          </Link>
          {secondary && (
            <Link to={secondary.to} className={ghostLightButton}>
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  </section>
);
