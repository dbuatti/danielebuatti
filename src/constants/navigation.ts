export const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "About",
    type: "dropdown",
    subLinks: [
      { name: "My Story", href: "#about" },
      { name: "My Approach", href: "#approach" },
      { name: "Who I Work With", href: "#who-i-work-with" },
      { name: "Why Work With Me?", href: "#why-me" },
      { name: "Testimonials", href: "#testimonials" },
    ]
  },
  {
    name: "Services",
    type: "dropdown",
    subLinks: [
      { name: "All Coaching Services", href: "/services" },
      { name: "AMEB Accompanying", href: "/services/ameb-accompanying" },
      { name: "Live Piano Services", href: "/live-piano-services" },
      { name: "All Programs & Projects", href: "/programs" },
      { name: "Music Director & Pianist", href: "/music-director-pianist" },
    ]
  },
  { name: "Contact", href: "#contact" },
];