import { cn } from "@/lib/utils";

// Pill button styles shared across the editorial pages.
const btnBase =
  "inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-medium transition-all duration-300 ease-out-expo active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export const primaryButton = cn(btnBase, "bg-brand-primary text-white shadow-soft hover:bg-brand-primary/90 hover:shadow-lifted");
export const inkButton = cn(btnBase, "bg-brand-dark text-brand-light hover:bg-brand-dark/90");
export const outlineButton = cn(btnBase, "border border-brand-dark/20 text-brand-dark hover:border-brand-dark/50 hover:bg-brand-dark/[0.03]");
export const lightButton = cn(btnBase, "bg-brand-light text-brand-dark hover:bg-white");
export const ghostLightButton = cn(btnBase, "border border-white/25 text-brand-light hover:border-white/60 hover:bg-white/5");
