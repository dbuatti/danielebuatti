"use client";

import { useState, type MouseEvent } from "react";
import {
  ArrowRight,
  AudioLines,
  Check,
  Copy,
  Download,
  Drama,
  ExternalLink,
  Mail,
  Phone,
  Piano,
  Play,
  Printer,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRouteMeta } from "@/hooks/use-page-meta";
import { SITE_URL } from "@/seo/pages";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MediaBookingForm from "@/components/MediaBookingForm";

/* ---------------------------------------------------------------------------
 * /media — Media & Press Kit (one-link EPK)
 *
 * Palette (matches the printed brand + /athome):
 *   black      #0B0B0B   hero panel + primary button text
 *   ivory      #F7F3EA   page background
 *   gold       #D4A208   accents, rules, primary buttons
 *   charcoal   #1F1C19   body text on ivory
 *   gold ink   #8A6900   small gold text on ivory (AA contrast)
 * ------------------------------------------------------------------------- */

type BioKey = "short" | "medium" | "long";

interface Video {
  id: string;
  title: string;
}

interface Photo {
  src: string;
  alt: string;
  /** Photographer, shown as "Photo: …" under the image. */
  credit?: string;
  /** Optional filename suggested when the full-size file is downloaded. */
  downloadName?: string;
}

interface Credit {
  name: string;
  role: string;
}

interface Offer {
  title: string;
  description: string;
  icon: "piano" | "theater" | "users" | "tracks";
  link?: string;
}

interface BookingOption {
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  attribution: string;
}

/* ========================================================================== */
/*  DATA — edit everything here without touching the layout below              */
/* ========================================================================== */

const mediaData = {
  name: "Daniele Buatti",
  tagline: "Pianist, vocalist and music director · Melbourne",
  headshot: "/media/headshot.jpg",
  contact: {
    email: "info@danielebuatti.com",
    phone: "0424 174 067",
    servicesPage: "/live-piano-services",
    servicesLabel: "Live piano services",
  },
  // Hi-res photos, CV and full press kit (Google Drive).
  pressKitUrl: "https://drive.google.com/drive/folders/19kmkNG3kKZw0HABgkW2tIOuwZIz7lAui",
  instagram: "https://www.instagram.com/daniele.buatti",
  // privacy-enhanced, click-to-load YouTube embeds (see VideoCard below).
  // The first video is featured and should be the strongest live performance.
  videos: [
    { id: "DcVOldCIbgE", title: "Misty (Erroll Garner)" },
    { id: "vW_-D9AhZag", title: "Dangerous Woman (Ariana Grande, jazz arrangement)" },
    { id: "0Oq5SCM_OIE", title: "Bridge Over Troubled Water, with Kala Gare" },
  ] as Video[],
  // `credit` is shown under the photo; press should credit the photographer.
  // TODO: add credits for photos 2, 4, 5 and 6 if known.
  photos: [
    { src: "/media/photo-1.jpg", alt: "Daniele Buatti playing grand piano on stage", credit: "Paul Micallef", downloadName: "daniele-buatti-on-stage.jpg" },
    { src: "/media/photo-2.jpg", alt: "Guests singing around the piano as Daniele plays at a private party", downloadName: "daniele-buatti-private-party.jpg" },
    { src: "/media/photo-3.jpg", alt: "Daniele Buatti smiling at the keyboard during a live show", credit: "Vudoo Photos", downloadName: "daniele-buatti-live-show.jpg" },
    { src: "/media/photo-4.jpg", alt: "Daniele Buatti singing at an upright piano in black tie", downloadName: "daniele-buatti-piano-vocals.jpg" },
    { src: "/media/photo-5.jpg", alt: "Daniele Buatti at the piano with guests at a cabaret evening", downloadName: "daniele-buatti-cabaret-evening.jpg" },
    { src: "/media/photo-6.jpg", alt: "Daniele Buatti on keys with a live band in rehearsal", downloadName: "daniele-buatti-with-band.jpg" },
  ] as Photo[],
  // Curated formal set (Google Drive) for weddings, galas and corporate bookers.
  photosArchiveLabel: "Black-tie and cocktail jazz photos",
  photosArchiveUrl:
    "https://drive.google.com/drive/folders/1jKpXpOYhZmYOG5Sx2VqixQFvcV_hZpf1",
  bios: {
    short: "Daniele Buatti is a Melbourne pianist, vocalist and music director.",
    medium:
      "Daniele Buatti is a Melbourne pianist, vocalist and music director with over 12 years in the city's music theatre scene. He performs solo piano and vocals for private events, functions and venues, moving easily between jazz standards, music theatre and contemporary songs reimagined at the piano.",
    long: "Daniele Buatti is a Melbourne pianist, vocalist and music director with over 12 years in the city's music theatre scene. His theatre work includes rehearsal pianist on Wicked, deputy keyboard on The Bodyguard and assistant music director on Into the Woods at the VCA. For about 12 years he ran Broadway Unplugged, a not-for-profit music theatre concert series. Today he performs solo piano and vocals for private events, functions and venues, blending jazz standards, music theatre and contemporary songs in his own arrangements. He also coaches voice and piano, and creates custom audition tracks for performers through Piano Backings by Daniele.",
  } satisfies Record<BioKey, string>,
  offers: [
    {
      title: "Solo piano and vocals",
      description: "Jazz, cocktail and piano-bar sets for events and venues.",
      icon: "piano",
    },
    {
      title: "Music theatre",
      description: "Rehearsal pianist, keys and music direction.",
      icon: "theater",
    },
    {
      title: "Bands and arrangements",
      description: "Larger line-ups and custom arrangements on request.",
      icon: "users",
    },
    {
      title: "Custom backing tracks",
      description: "Audition tracks and rehearsal backings.",
      icon: "tracks",
      link: "https://pianobackings.danielebuatti.com",
    },
  ] as Offer[],
  bookingOptions: [
    { title: "Solo piano bar", description: "Standards, pop and music theatre, with requests welcome." },
    { title: "Pianist & vocalist", description: "Piano and lead vocals from one performer." },
    { title: "Three-piece", description: "Piano, bass and drums." },
    { title: "Musical theatre nights / cabaret", description: "Co-lead of Broadway Unplugged." },
    { title: "Open mic host and accompanist", description: "Hosting the night and accompanying each performer." },
    { title: "Music direction and audition pianist", description: "For productions, auditions and rehearsals." },
  ] as BookingOption[],
  // Stage work and events first, then Daniele's own projects.
  // TODO: "My Fair Lady" — add the company / venue if known.
  // TODO: "School productions" — name the school(s) if it's a recognisable one.
  // TODO: Broadway Unplugged ran for ~12 years? If that figure is about
  // Daniele's overall career rather than the series, move it into the bio
  // (long bio) and leave the credit as-is.
  credits: {
    theatre: [
      { name: "Mrs Doubtfire", role: "Rehearsal pianist · JONES Theatrical Group" },
      { name: "My Fair Lady", role: "Pianist · MD David Young" },
      { name: "Elf the Musical", role: "Audition pianist · MD Vicky Jacobs" },
      { name: "Wicked", role: "Rehearsal pianist" },
      { name: "The Bodyguard", role: "Deputy keyboard player" },
      { name: "Into the Woods, VCA", role: "Assistant Music Director" },
      { name: "School productions", role: "Musical director (multiple)" },
    ] as Credit[],
    events: [{ name: "NGV Gala", role: "Piano bar" }] as Credit[],
    ownWork: [
      { name: "Broadway Unplugged", role: "Co-creator and co-host (with Bradley Dylan)" },
      { name: "Piano by Heart", role: "Creator and pianist · improvised piano sound journey, HUMM St Kilda, from Nov 2026" },
      { name: "Dharma Piano", role: "Composer and pianist · 'Remembering' on Spotify, Apple Music and Insight Timer" },
      { name: "Resonance", role: "Founder and director · pop-up choir" },
      { name: "Piano Backings by Daniele", role: "Custom audition tracks for music theatre performers" },
      { name: "The Audition Guidebook", role: "Author · online course for music theatre auditionees" },
    ] as Credit[],
  },
  // Real quotes already published on the site (src/constants/testimonials.ts),
  // attributed by first name only. The section hides itself if this is empty.
  testimonials: [
    {
      quote:
        "Nothing quite compares to the atmosphere of a live piano performance and Daniele Buatti has it all covered – any room, any mood, genre or occasion, he'll make sure it's a night to remember. Highly recommend. Book him for your next special event!",
      attribution: "Tommy, live piano & vocals client",
    },
    {
      quote:
        "The show was awesome! Daniele's energy and piano playing were amazing, truly had me grooving along. An unforgettable performance.",
      attribution: "Alex, audience member",
    },
    {
      quote:
        "Daniele is an awesome Music Director, guiding us with such thought and care. His positive energy makes every session a joy, and I always look forward to returning.",
      attribution: "Joanne, choir member",
    },
  ] as Testimonial[],
  tech: [
    "Solo setup: can bring own keyboard, PA and vocal mic, or use a house piano",
    "Typical set lengths: 2 × 45 min or a 2-hour evening; flexible",
    "Dress: to suit the event (black tie available)",
  ],
};

/* ========================================================================== */
/*  Small shared pieces                                                        */
/* ========================================================================== */

const SectionHeading = ({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) => (
  <div className={cn("mb-10 max-w-2xl", className)}>
    <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8A6900]">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-light text-[#1F1C19] md:text-4xl">{title}</h2>
    {description && <p className="mt-4 leading-relaxed text-[#1F1C19]/70">{description}</p>}
  </div>
);

/* Smooth-scrolls to the booking enquiry form; the href keeps it working without JS. */
const scrollToBookingForm = (e: MouseEvent<HTMLAnchorElement>) => {
  const form = document.getElementById("book");
  if (!form) return;
  e.preventDefault();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", "#book");
};

const EnquiryButton = ({ className }: { className?: string }) => (
  <a
    href="#book"
    onClick={scrollToBookingForm}
    className={cn(
      "print-hide inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D4A208] px-6 py-3 text-sm font-medium text-[#0B0B0B] transition-all hover:brightness-95 active:scale-[0.98]",
      className,
    )}
  >
    Make an enquiry
    <ArrowRight className="h-4 w-4" aria-hidden="true" />
  </a>
);

/* Email + phone, for use on the dark hero / closing band. */
const ContactLinks = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-6", className)}>
    <a
      href={`mailto:${mediaData.contact.email}`}
      className="inline-flex min-h-11 w-fit items-center gap-2.5 text-[#F7F3EA]/85 transition-colors hover:text-[#D4A208]"
    >
      <Mail className="h-4 w-4 text-[#D4A208]" aria-hidden="true" />
      {mediaData.contact.email}
    </a>
    <a
      href={`tel:${mediaData.contact.phone.replace(/\s/g, "")}`}
      className="inline-flex min-h-11 w-fit items-center gap-2.5 text-[#F7F3EA]/85 transition-colors hover:text-[#D4A208]"
    >
      <Phone className="h-4 w-4 text-[#D4A208]" aria-hidden="true" />
      {mediaData.contact.phone}
    </a>
  </div>
);

/* Person schema for this page. Kept separate from the site-wide Person in
 * SeoStructuredData (which describes the coaching business). */
const PersonJsonLd = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: mediaData.name,
    jobTitle: "Pianist, vocalist and music director",
    url: `${SITE_URL}/`,
    email: `mailto:${mediaData.contact.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Melbourne",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
    sameAs: [mediaData.instagram],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

const OFFER_ICONS: Record<Offer["icon"], LucideIcon> = {
  piano: Piano,
  theater: Drama,
  users: Users,
  tracks: AudioLines,
};

const OfferCard = ({ offer }: { offer: Offer }) => {
  const Icon = OFFER_ICONS[offer.icon];

  const body = (
    <>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4A208]/15 text-[#8A6900]">
        <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-[#1F1C19]">{offer.title}</h3>
      <p className="text-sm leading-relaxed text-[#1F1C19]/70">{offer.description}</p>
    </>
  );

  const base = "offer-card flex flex-col rounded-2xl border border-[#1F1C19]/10 bg-white/60 p-6 shadow-sm";

  if (offer.link) {
    return (
      <a
        href={offer.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, "group transition-colors hover:border-[#D4A208]")}
      >
        {body}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#8A6900]">
          {new URL(offer.link).hostname}
          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </a>
    );
  }

  return <div className={base}>{body}</div>;
};

/* ========================================================================== */
/*  Bio with length tabs + copy buttons                                        */
/* ========================================================================== */

const BioTabs = () => {
  const [active, setActive] = useState<BioKey>("medium");
  const [, copy] = useCopyToClipboard();
  const keys: BioKey[] = ["short", "medium", "long"];
  const labels: Record<BioKey, string> = { short: "Short", medium: "Medium", long: "Long" };

  const handleCopy = (key: BioKey) => {
    copy(mediaData.bios[key]);
    toast.success("Bio copied to clipboard");
  };

  return (
    <div>
      <div className="bio-tabs flex flex-wrap gap-2" role="tablist" aria-label="Bio length">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`bio-tab-${key}`}
            aria-selected={active === key}
            aria-controls={`bio-panel-${key}`}
            onClick={() => setActive(key)}
            className={cn(
              "min-h-11 rounded-full px-5 py-2 text-sm font-medium transition-colors",
              active === key
                ? "bg-[#D4A208] text-[#0B0B0B]"
                : "border border-[#1F1C19]/15 text-[#1F1C19]/70 hover:border-[#D4A208] hover:text-[#1F1C19]",
            )}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      {/* All three panels stay in the DOM so print always shows the medium bio. */}
      <div className="mt-6">
        {keys.map((key) => (
          <div
            key={key}
            id={`bio-panel-${key}`}
            role="tabpanel"
            aria-labelledby={`bio-tab-${key}`}
            data-bio={key}
            className={cn(
              "relative rounded-2xl border border-[#1F1C19]/10 bg-white/60 p-6",
              active !== key && "hidden",
            )}
          >
            <p className="max-w-3xl pr-24 leading-relaxed text-[#1F1C19]/85">
              {mediaData.bios[key]}
            </p>
            <button
              type="button"
              onClick={() => handleCopy(key)}
              className="bio-copy absolute right-3 top-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#D4A208]/15 px-4 text-xs font-medium text-[#8A6900] transition-colors hover:bg-[#D4A208]/25"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========================================================================== */
/*  Video card — click-to-load YouTube (privacy-enhanced)                     */
/* ========================================================================== */

const VideoCard = ({ video, featured = false }: { video: Video; featured?: boolean }) => {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <figure className="m-0">
      {/* On screen: poster → iframe. Hidden in print. */}
      <div className="print-hide-video relative aspect-video w-full overflow-hidden rounded-2xl border border-[#1F1C19]/10 bg-[#0B0B0B]">
        {loaded ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4A208]"
            aria-label={`Play video: ${video.title}`}
          >
            {/* hqdefault is 4:3 with letterbox bars; object-cover crops them off. */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              width={480}
              height={360}
              className="absolute inset-0 h-full w-full object-cover brightness-[0.72] transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
            />
            <span
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full bg-[#D4A208] text-[#0B0B0B] shadow-lifted transition-transform duration-300 ease-out-expo group-hover:scale-105 group-active:scale-95",
                featured ? "h-20 w-20" : "h-16 w-16",
              )}
            >
              <Play className={cn("ml-1", featured ? "h-8 w-8" : "h-7 w-7")} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      {/* Title stays visible on screen and in print; the URL only prints. */}
      <figcaption className={cn("mt-1 font-medium text-[#1F1C19]", featured ? "text-base" : "text-sm")}>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center transition-colors hover:text-[#8A6900]"
        >
          {video.title}
        </a>
        <span className="print-video-url"> — {watchUrl}</span>
      </figcaption>
    </figure>
  );
};

/* ========================================================================== */
/*  Page                                                                       */
/* ========================================================================== */

const MediaPage = () => {
  useRouteMeta("/media");

  const handlePrint = () => {
    // TODO: Replace with a static download once the one-sheet is generated:
    //   const a = document.createElement("a");
    //   a.href = "/media/daniele-buatti-one-sheet.pdf";
    //   a.download = "daniele-buatti-one-sheet.pdf";
    //   a.click();
    // For now, print the page (see the print stylesheet for the A4 layout).
    window.print();
  };

  return (
    <div className="media-page overflow-x-hidden bg-[#F7F3EA] text-[#1F1C19] selection:bg-[#D4A208]/30">
      {/* ===== Hero ===== */}
      <section className="media-hero bg-[#0B0B0B] text-[#F7F3EA]">
        <div className="container py-10 md:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
            {/* Headshot (left) — small and stacked above the text on phones so
                the first video is reachable within one scroll. */}
            <div className="mx-auto w-full max-w-[180px] sm:max-w-sm lg:mx-0">
              <img
                src={mediaData.headshot}
                alt={`${mediaData.name}, pianist and vocalist`}
                loading="eager"
                decoding="async"
                width={400}
                height={533}
                className="aspect-[3/4] w-full rounded-2xl border border-[#D4A208]/35 object-cover"
              />
            </div>

            {/* Text */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#D4A208]">
                Media &amp; Press Kit
              </p>
              <h1 className="mt-3 text-[40px] font-light leading-[1.05] text-[#F7F3EA] sm:text-6xl">
                {mediaData.name}
              </h1>
              <div className="mt-5 h-px w-24 bg-[#D4A208]" aria-hidden="true" />
              <p className="media-tagline mt-5 text-lg text-[#F7F3EA]/80">{mediaData.tagline}</p>

              {/* Top contact strip */}
              <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
                <EnquiryButton />
                <button
                  type="button"
                  onClick={handlePrint}
                  className="print-hide inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D4A208] px-6 py-3 text-sm font-medium text-[#D4A208] transition-colors hover:bg-[#D4A208] hover:text-[#0B0B0B]"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Print or save one-sheet
                </button>
              </div>
              <ContactLinks className="mt-4 border-t border-[#D4A208]/20 pt-3" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Downloads (screen only) ===== */}
      <section aria-label="Downloads" data-print="hide" className="border-b border-[#1F1C19]/10 bg-[#D4A208]/10">
        <div className="container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8A6900]">Downloads</p>
            <p className="mt-1 text-sm text-[#1F1C19]/70">
              The full press kit, plus a formal photo set for weddings, galas and corporate listings.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            <a
              href={mediaData.pressKitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0B0B0B] px-6 py-3 text-center text-sm font-medium text-[#F7F3EA] transition-colors hover:bg-[#1F1C19]"
            >
              <Download className="h-4 w-4 shrink-0 text-[#D4A208]" aria-hidden="true" />
              Download hi-res photos, CV and full press kit
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={mediaData.photosArchiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0B0B0B]/80 px-6 py-3 text-center text-sm font-medium text-[#0B0B0B] transition-colors hover:bg-[#0B0B0B] hover:text-[#F7F3EA]"
            >
              {mediaData.photosArchiveLabel}
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== Watch ===== */}
      <section aria-label="Watch" className="container py-10 md:py-20">
        <SectionHeading
          eyebrow="Watch"
          title="Selected performances"
          description="Solo piano and vocals, from jazz standards to contemporary songs reimagined at the piano."
          className="mb-6 md:mb-10"
        />
        {/* First video is featured: full width on tablets, two-thirds width
            beside the others (stacked) on desktop. */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {mediaData.videos.map((v, i) => (
            <div key={v.id} className={cn(i === 0 && "sm:col-span-2 lg:row-span-2")}>
              <VideoCard video={v} featured={i === 0} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== Booking options ===== */}
      <section aria-label="Booking options" className="container pb-16 md:pb-20">
        <SectionHeading eyebrow="Booking options" title="Formats" />
        <ul className="booking-options grid gap-x-10 gap-y-1 rounded-2xl border border-[#1F1C19]/10 bg-white/60 p-6 sm:grid-cols-2 md:p-8">
          {mediaData.bookingOptions.map((option) => (
            <li key={option.title} className="flex items-start gap-3 border-b border-[#1F1C19]/10 py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
              <Check className="mt-1 h-4 w-4 shrink-0 text-[#8A6900]" aria-hidden="true" />
              <p>
                <span className="font-medium text-[#1F1C19]">{option.title}</span>
                <span className="text-[#1F1C19]/65"> — {option.description}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Photos (hidden in print) ===== */}
      <section aria-label="Photos" data-print="hide" className="container pb-16 md:pb-20">
        <SectionHeading
          eyebrow="Photos"
          title="Press photos"
          description="High-resolution images for press and promotional use. Please credit the photographer where listed."
        />
        {/* Masonry-style columns so tall/portrait photos are never cropped. */}
        <div className="columns-2 gap-4 sm:columns-3">
          {mediaData.photos.map((photo) => (
            <figure key={photo.src} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-[#1F1C19]/10 bg-white/60">
              <div className="overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full transition-transform duration-500 ease-out-expo hover:scale-[1.04]"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 border-t border-[#1F1C19]/10 px-3">
                <span className="truncate text-xs text-[#1F1C19]/60">
                  {photo.credit ? `Photo: ${photo.credit}` : "Daniele Buatti"}
                </span>
                <a
                  href={photo.src}
                  download={photo.downloadName}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1 text-xs font-medium text-[#8A6900] transition-colors hover:text-[#1F1C19]"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8">
          <a
            href={mediaData.photosArchiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-medium text-[#8A6900] underline-offset-4 transition-colors hover:text-[#1F1C19] hover:underline"
          >
            {mediaData.photosArchiveLabel}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ===== Bio ===== */}
      <section aria-label="Bio" className="container pb-16 md:pb-20">
        <SectionHeading eyebrow="Bio" title="About Daniele" description="Three lengths for programmes, listings and press. Copy the one you need." />
        <BioTabs />
      </section>

      {/* ===== What I offer ===== */}
      <section aria-label="What I offer" className="container pb-16 md:pb-20">
        <SectionHeading eyebrow="What I offer" title="Services" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mediaData.offers.map((offer) => (
            <OfferCard key={offer.title} offer={offer} />
          ))}
        </div>
      </section>

      {/* ===== Selected credits ===== */}
      <section aria-label="Selected credits" className="container pb-16 md:pb-20">
        <SectionHeading eyebrow="Selected credits" title="Credits" />
        <div className="grid gap-10 md:grid-cols-2">
          {(
            [
              [["Theatre", mediaData.credits.theatre], ["Events", mediaData.credits.events]],
              [["Own work", mediaData.credits.ownWork]],
            ] as const
          ).map((groups) => (
            <div key={groups[0][0]} className="space-y-10">
              {groups.map(([label, items]) => (
                <div key={label}>
                  <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-[#8A6900]">{label}</h3>
                  <ul className="space-y-4">
                    {items.map((credit) => (
                      <li key={credit.name} className="border-b border-[#1F1C19]/10 pb-3">
                        <p className="font-medium text-[#1F1C19]">{credit.name}</p>
                        <p className="mt-0.5 text-sm text-[#1F1C19]/60">{credit.role}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimonials — hidden entirely while the array is empty ===== */}
      {mediaData.testimonials.length > 0 && (
        <section aria-label="Testimonials" data-print="hide" className="container pb-16 md:pb-20">
          <SectionHeading eyebrow="Testimonials" title="What people say" />
          <div className="grid gap-6 md:grid-cols-3">
            {mediaData.testimonials.slice(0, 3).map((t, i) => (
              <figure key={i} className="m-0 rounded-2xl border border-[#1F1C19]/10 bg-white/60 p-6">
                <blockquote className="text-base italic leading-relaxed text-[#1F1C19]/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-[#8A6900]">— {t.attribution}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ===== Tech and logistics (hidden in print) ===== */}
      <section aria-label="Tech and logistics" data-print="hide" className="container pb-16 md:pb-20">
        <SectionHeading eyebrow="Tech and logistics" title="On the day" />
        <ul className="space-y-3">
          {mediaData.tech.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[#1F1C19]/80">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A208]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Contact + booking enquiry form ===== */}
      <section aria-label="Contact" id="book" className="scroll-mt-24 border-t border-[#1F1C19]/10">
        <div className="container py-16 md:py-20">
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch"
            description="Send a booking enquiry for your venue or event, or reach me directly."
          />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="flex flex-col gap-1">
              <a
                href={`mailto:${mediaData.contact.email}`}
                className="inline-flex min-h-11 w-fit items-center gap-3 text-[#1F1C19] transition-colors hover:text-[#8A6900]"
              >
                <Mail className="h-5 w-5 text-[#8A6900]" aria-hidden="true" />
                {mediaData.contact.email}
              </a>
              <a
                href={`tel:${mediaData.contact.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-11 w-fit items-center gap-3 text-[#1F1C19] transition-colors hover:text-[#8A6900]"
              >
                <Phone className="h-5 w-5 text-[#8A6900]" aria-hidden="true" />
                {mediaData.contact.phone}
              </a>
              <a
                href={mediaData.contact.servicesPage}
                className="inline-flex min-h-11 w-fit items-center gap-3 text-[#1F1C19] transition-colors hover:text-[#8A6900]"
              >
                <ArrowRight className="h-5 w-5 text-[#8A6900]" aria-hidden="true" />
                {mediaData.contact.servicesLabel}
              </a>
            </div>

            {/* Form is screen-only; the one-sheet already lists the contact details. */}
            <div data-print="hide" className="rounded-2xl border border-[#1F1C19]/10 bg-white/60 p-6 md:p-8">
              <MediaBookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Bottom contact strip (screen only) ===== */}
      <section aria-label="Book Daniele" data-print="hide" className="bg-[#0B0B0B] text-[#F7F3EA]">
        <div className="container flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#D4A208]">Bookings</p>
            <ContactLinks className="mt-2" />
          </div>
          <EnquiryButton className="w-full sm:w-auto" />
        </div>
      </section>

      <PersonJsonLd />
    </div>
  );
};

export default MediaPage;
