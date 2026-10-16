/* ===========================================================================
 *  CONTENT TO SWAP FOR /at-home
 * --------------------------------------------------------------------------
 *  Everything on this page that you supply lives here. Nothing plays with
 *  sound on load, and the video embed is only fetched when a visitor taps it.
 * =========================================================================== */

/* ---------------------------------------------------------------------------
 *  1. HERO VIDEO — a clearly marked placeholder
 * --------------------------------------------------------------------------
 *  Replace HERO_VIDEO with your own 60–90 second clip of playing and singing.
 *
 *    YouTube:  { provider: "youtube", id: "XXXXXXXXXXX" }     // the ID only
 *    Vimeo:    { provider: "vimeo",   id: "123456789" }       // the ID only
 *    File:     { provider: "file",    file: "/my-clip.mp4" }  // self-hosted
 *
 *  `poster` is the still frame shown before playback — swap the image too.
 *  Leaving `id`/`file` blank renders the poster with a "Video coming soon"
 *  badge, which is handy while the final clip is still being edited.
 * ------------------------------------------------------------------------- */

export type VideoProvider = "youtube" | "vimeo" | "file";

export interface AtHomeVideoConfig {
  provider: VideoProvider;
  /** YouTube / Vimeo video id (not the full URL). */
  id?: string;
  /** Self-hosted file path, used when provider is "file". */
  file?: string;
  /** Still image shown before playback. */
  poster: string;
  title: string;
}

export const HERO_VIDEO: AtHomeVideoConfig = {
  // Placeholder: a self-hosted performance clip so the section works today.
  // Swap for the final YouTube/Vimeo link when it is ready.
  provider: "file",
  file: "/live-piano-performance.mp4",
  poster: "/live-piano-performance-poster.jpg",
  title: "Daniele Buatti playing and singing at the piano",
};

/* ---------------------------------------------------------------------------
 *  2. TESTIMONIALS — two empty slots, hidden until you add real quotes
 * --------------------------------------------------------------------------
 *  Add genuine testimonials only. While the list below is empty (or an entry
 *  has no quote/name), the whole section is hidden. Do not add placeholder or
 *  made-up quotes.
 * ------------------------------------------------------------------------- */

export interface AtHomeTestimonial {
  quote: string;
  name: string;
  context?: string;
}

export const ATHOME_TESTIMONIALS: AtHomeTestimonial[] = [
  // Slot 1: { quote: "...", name: "Name and area", context: "Dinner party, Toorak" },
  // Slot 2: { quote: "...", name: "Name and area", context: "Engagement, Toorak" },
];
