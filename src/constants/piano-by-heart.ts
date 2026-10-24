// Piano by Heart (/pianobyheart): the next evening's details. Edit this one
// object to change the date, venue, price or booking status; the page, its
// meta description and its schema.org Event all read from it. Set it to null
// when no evening is scheduled. An evening whose endDate has passed is treated
// as no evening, so the page falls back to "announced soon" on its own.
// Keep this file free of browser-only imports: vite.config.ts loads it.

export type PianoByHeartStatus = "on-sale" | "sold-out";

export interface PianoByHeartEvening {
  // As shown on the page.
  date: string;
  time: string;
  price: string;
  places: string;
  // Short form used in the page's meta description and share previews.
  shortDate: string;
  // ISO 8601 with Melbourne's UTC offset (+11:00 in daylight saving, +10:00 otherwise).
  startDate: string;
  endDate: string;
  venue: {
    room: string;
    name: string;
    streetAddress: string;
    locality: string;
    region: string;
    postcode: string;
  };
  // Lowest ticket price in AUD, for the schema.org offer.
  priceFrom: number;
  status: PianoByHeartStatus;
  bookingUrl: string;
}

export const nextEvening: PianoByHeartEvening | null = {
  date: "Saturday 14 November 2026",
  time: "5:00–6:15pm (arrive from 5pm)",
  price: "Early bird $28 until 8 Nov, then $35",
  places: "Limited to 11 futons",
  shortDate: "Sat 14 Nov 2026, 5pm",
  startDate: "2026-11-14T17:00+11:00",
  endDate: "2026-11-14T18:15+11:00",
  venue: {
    room: "Inner HUMM Studio",
    name: "HUMM",
    streetAddress: "144 St Kilda Rd",
    locality: "St Kilda",
    region: "VIC",
    postcode: "3182",
  },
  priceFrom: 28,
  status: "on-sale",
  bookingUrl: "https://events.humanitix.com/pianobyheart",
};

export const pianoByHeartLinks = {
  spotify: "https://open.spotify.com/artist/757mrj4tUtmbtCHVqFWNZt",
  spotifyEmbed: "https://open.spotify.com/embed/artist/757mrj4tUtmbtCHVqFWNZt",
  instagram: "https://www.instagram.com/daniele.buatti/",
  enquiry: `mailto:info@danielebuatti.com?subject=${encodeURIComponent("Piano by Heart — next evening")}`,
};

// Text-free background artwork for the hero (wide, about 2400x1350).
export const pianoByHeartArtwork = {
  src: "/piano-by-heart-bg.jpg",
  alt: "Piano by Heart — abstract indigo and pink artwork",
};

// The scheduled evening, or null if there isn't one or it has already finished.
export function getUpcomingEvening(now: Date = new Date()): PianoByHeartEvening | null {
  if (!nextEvening) return null;
  return new Date(nextEvening.endDate) > now ? nextEvening : null;
}

export const venueAddress = (e: PianoByHeartEvening) =>
  `${e.venue.streetAddress}, ${e.venue.locality} ${e.venue.region} ${e.venue.postcode}`;

export function pianoByHeartDescription(evening: PianoByHeartEvening | null): string {
  const base = "An hour of live improvised piano to rest, move and sound.";
  if (!evening) return `${base} Lie back on a futon in a dark, cosy room in Melbourne. Next evening announced soon.`;
  return `${base} Lie back on a futon at ${evening.venue.name}, ${evening.venue.locality}. ${evening.shortDate}.`;
}

// schema.org Event for the evening, as JSON-LD.
export function pianoByHeartEventSchema(evening: PianoByHeartEvening, pageUrl: string, imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Piano by Heart",
    description: pianoByHeartDescription(evening),
    url: pageUrl,
    image: [imageUrl],
    startDate: evening.startDate,
    endDate: evening.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: evening.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: evening.venue.streetAddress,
        addressLocality: evening.venue.locality,
        addressRegion: evening.venue.region,
        postalCode: evening.venue.postcode,
        addressCountry: "AU",
      },
    },
    offers: {
      "@type": "Offer",
      url: evening.bookingUrl,
      price: evening.priceFrom,
      priceCurrency: "AUD",
      availability: evening.status === "sold-out" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
    performer: { "@type": "Person", name: "Daniele Buatti", url: "https://www.danielebuatti.com/" },
    organizer: { "@type": "Person", name: "Daniele Buatti", url: "https://www.danielebuatti.com/" },
  };
}
