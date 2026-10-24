// Title, description and share image for each public page. Used by the pages
// at runtime (usePageMeta) and by the build, which writes a static HTML file
// per page so link previews (WhatsApp, Facebook, LinkedIn, iMessage) and
// search engines see the right details without running JavaScript.
// Keep this file free of browser-only imports: vite.config.ts loads it.

import { getUpcomingEvening, pianoByHeartDescription } from "../constants/piano-by-heart";

export const SITE_URL = "https://www.danielebuatti.com";

export interface PageMeta {
  title: string;
  description: string;
  // Share image path under /public (1200x630).
  image: string;
}

export const pageMeta = {
  "/": {
    title: "Daniele Buatti | Pianist, Vocal Coach & Music Director",
    description: "Professional embodied coaching for singers, performers, and speakers. Unlock your authentic voice through piano, vocal mastery, and somatic awareness.",
    image: "/og/home.jpg",
  },
  "/voice-piano-services": {
    title: "Singing and Piano Lessons Toorak, Melbourne | Daniele Buatti",
    description: "Singing and piano lessons in Toorak, Melbourne, and online with vocal coach and music theatre music director Daniele Buatti. Audition coaching, repertoire, and technique that holds up on stage.",
    image: "/og/lessons.jpg",
  },
  "/book-voice-piano": {
    title: "Book a Voice or Piano Lesson | Daniele Buatti",
    description: "Choose a 45 or 60 minute voice and piano lesson and book a time that suits you, in Toorak, Melbourne, or online.",
    image: "/og/lessons.jpg",
  },
  "/coaching": {
    title: "Voice & Performance Coaching Melbourne | Daniele Buatti",
    description: "One-to-one coaching for performers, speakers and creatives, integrating voice, piano and body awareness for clear, embodied expression. Melbourne and online.",
    image: "/og/coaching.jpg",
  },
  "/live-piano-services": {
    title: "Live Pianist & Vocalist for Weddings and Events Melbourne | Daniele Buatti",
    description: "Live piano and vocals for weddings, galas, corporate events and private parties in Melbourne. Request a tailored quote from pianist and vocalist Daniele Buatti.",
    image: "/og/live-piano.jpg",
  },
  "/music-director-pianist": {
    title: "Music Director & Pianist Melbourne | Daniele Buatti",
    description: "Collaborative musical leadership for stage, studio and performance development. Music direction and rehearsal piano for music theatre and concerts.",
    image: "/og/music-director.jpg",
  },
  "/ameb-accompanying": {
    title: "AMEB Exam Accompanist Melbourne | Daniele Buatti",
    description: "Calm, reliable piano accompaniment for AMEB exams of all grades and instruments, with optional rehearsals beforehand. Book an accompanist in Melbourne.",
    image: "/og/ameb.jpg",
  },
  "/store": {
    title: "Sheet Music Store | Professional Piano & Vocal Arrangements | Daniele Buatti",
    description: "Browse a curated collection of professional sheet music PDFs, piano arrangements, and vocal scores. Digital downloads delivered instantly.",
    image: "/og/store.jpg",
  },
  "/projects-resources": {
    title: "Projects & Services - Daniele Buatti",
    description: "Live performances, music direction, digital products, and community initiatives.",
    image: "/og/resources.jpg",
  },
  "/gift-cards": {
    title: "Gift Cards - Daniele Buatti",
    description: "Give the gift of transformative coaching sessions or open credit with Daniele Buatti.",
    image: "/og/gift-cards.jpg",
  },
  "/about": {
    title: "About Daniele Buatti | Pianist, Vocal Coach & Music Director",
    description: "Daniele Buatti is a Melbourne-based pianist, vocal coach and music director working across music theatre, cabaret, events and education.",
    image: "/og/about.jpg",
  },
  "/contact": {
    title: "Contact Daniele Buatti",
    description: "Get in touch with Daniele Buatti for coaching, performance bookings, or general inquiries.",
    image: "/og/contact.jpg",
  },
  "/media": {
    title: "Media & Press Kit | Daniele Buatti",
    description: "Press kit for Daniele Buatti — Melbourne pianist, vocalist and music director. Bios, photos, videos, credits and contact for venues, bookers and music directors.",
    image: "/og/media.jpg",
  },
  "/privacy": {
    title: "Privacy Policy | Daniele Buatti",
    description:
      "How the Instagram Work Enquiry Auto-Reply application operated by Daniele Buatti handles information received through the Instagram Messaging API.",
    image: "/og/contact.jpg",
  },
  "/terms": {
    title: "Terms of Service | Daniele Buatti",
    description:
      "Terms of use for danielebuatti.com and its automated Instagram work enquiry replies, including how availability and engagements are confirmed.",
    image: "/og/contact.jpg",
  },
  "/athome": {
    title: "Live piano at home | Daniele Buatti",
    description:
      "Live piano and vocals for home events in Toorak, Melbourne. Get a fast, calm quote for dinner parties, milestones, engagements, weddings and Christmas.",
    image: "/og/live-piano.jpg",
  },
  "/pianobyheart": {
    title: "Piano by Heart — Live improvised piano to rest | Daniele Buatti",
    description: pianoByHeartDescription(getUpcomingEvening()),
    image: "/og/piano-by-heart.jpg",
  },
} satisfies Record<string, PageMeta>;

export type PagePath = keyof typeof pageMeta;
