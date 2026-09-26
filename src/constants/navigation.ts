import type { LucideIcon } from "lucide-react";
import { Mic2, Leaf, Sparkles, Music, Piano, Heart } from "lucide-react";

export interface NavLink {
  name: string;
  href: string;
}

export interface ServiceLink extends NavLink {
  description: string;
  icon: LucideIcon;
}

// Everything bookable, shown in the "Work with me" menu and the footer.
export const serviceLinks: ServiceLink[] = [
  {
    name: "Voice & Piano Lessons",
    href: "/voice-piano-services",
    description: "Singing and piano lessons in Toorak and online.",
    icon: Mic2,
  },
  {
    name: "Coaching",
    href: "/coaching",
    description: "Voice, presence and embodiment for performers and speakers.",
    icon: Leaf,
  },
  {
    name: "Live Piano & Vocals",
    href: "/live-piano-services",
    description: "Weddings, galas and private events.",
    icon: Sparkles,
  },
  {
    name: "Music Director & Pianist",
    href: "/music-director-pianist",
    description: "Musical leadership for stage and studio.",
    icon: Music,
  },
  {
    name: "AMEB Accompanying",
    href: "/ameb-accompanying",
    description: "Calm, reliable accompaniment for exams.",
    icon: Piano,
  },
  {
    name: "Ceremony Rescue",
    href: "/ceremony-specialist",
    description: "Last-minute wedding ceremony music.",
    icon: Heart,
  },
];

// Top-level links shown beside the "Work with me" menu.
export const navLinks: NavLink[] = [
  { name: "Store", href: "/store" },
  { name: "Resources", href: "/projects-resources" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const exploreLinks: NavLink[] = [
  { name: "Sheet Music Store", href: "/store" },
  { name: "Projects & Resources", href: "/projects-resources" },
  { name: "Gift Cards", href: "/gift-cards" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const bookingHref = "/book-voice-piano";
