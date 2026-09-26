import React from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PracticeCardProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  className?: string;
}

// Card for Daniele's sister practices (kinesiology, IT) that live on their own
// sites. Styled in the site's editorial system rather than each brand's colours.
const PracticeCard: React.FC<PracticeCardProps> = ({ eyebrow, title, description, href, cta, icon: Icon, className }) => {
  const domain = href.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-10 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lifted",
        className,
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-brand-dark/70 transition-colors group-hover:bg-brand-primary group-hover:text-white">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="eyebrow text-muted-foreground">{eyebrow}</span>
        </div>
        <h3 className="mt-6 text-2xl md:text-3xl font-light leading-snug text-brand-dark">{title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-5 text-sm">
        <span className="font-medium text-brand-dark group-hover:text-brand-primary transition-colors">{cta}</span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          {domain}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </a>
  );
};

export default PracticeCard;
