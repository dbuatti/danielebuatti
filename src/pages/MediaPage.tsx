"use client";

import { useState, type ReactNode } from "react";
import { Copy, Mail, Phone, ExternalLink, Play } from "lucide-react";
import { useRouteMeta } from "@/hooks/use-page-meta";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { toast } from "sonner";

/* ========================================================================== */
/*  DATA — edit everything here without touching layout                        */
/* ========================================================================== */

const mediaData = {
  name: "Daniele Buatti",
  tagline: "Pianist, vocalist and music director · Melbourne",
  headshot: "/media/headshot.jpg",
  contact: {
    email: "info@danielebuatti.com",
    phone: "0424 174 067",
    servicesPage: "/live-piano-services",
  },
  videos: [
    {
      id: "DcVOldCIbgE",
      title: "Misty (Erroll Garner)",
      thumbnail: "https://img.youtube.com/vi/DcVOldCIbgE/hqdefault.jpg",
    },
    {
      id: "vW_-D9AhZag",
      title: "Dangerous Woman (Ariana Grande, jazz arrangement)",
      thumbnail: "https://img.youtube.com/vi/vW_-D9AhZag/hqdefault.jpg",
    },
    {
      id: "0Oq5SCM_OIE",
      title: "Bridge Over Troubled Water, with Kala Gare",
      thumbnail: "https://img.youtube.com/vi/0Oq5SCM_OIE/hqdefault.jpg",
    },
    {
      id: "qOsEDG8td1Q",
      title: "Piano improvisation",
      thumbnail: "https://img.youtube.com/vi/qOsEDG8td1Q/hqdefault.jpg",
    },
  ],
  photos: [
    { src: "/media/photo-1.jpg", alt: "Daniele Buatti at the piano" },
    { src: "/media/photo-2.jpg", alt: "Daniele Buatti at the piano" },
    { src: "/media/photo-3.jpg", alt: "Daniele Buatti at the piano" },
    { src: "/media/photo-4.jpg", alt: "Daniele Buatti at the piano" },
    { src: "/media/photo-5.jpg", alt: "Daniele Buatti at the piano" },
    { src: "/media/photo-6.jpg", alt: "Daniele Buatti at the piano" },
  ],
  bios: {
    short:
      "Daniele Buatti is a Melbourne pianist, vocalist and music director.",
    medium:
      "Daniele Buatti is a Melbourne pianist, vocalist and music director with over 12 years in the city's music theatre scene. He performs solo piano and vocals for private events, functions and venues, moving easily between jazz standards, music theatre and contemporary songs reimagined at the piano.",
    long:
      "Daniele Buatti is a Melbourne pianist, vocalist and music director with over 12 years in the city's music theatre scene. His theatre work includes rehearsal pianist on Wicked, deputy keyboard on The Bodyguard and assistant music director on Into the Woods at the VCA. For about 12 years he ran Broadway Unplugged, a not-for-profit music theatre concert series. Today he performs solo piano and vocals for private events, functions and venues, blending jazz standards, music theatre and contemporary songs in his own arrangements. He also coaches voice and piano, and creates custom audition tracks for performers through Piano Backings by Daniele.",
  },
  offers: [
    {
      title: "Solo piano and vocals",
      description:
        "Jazz, cocktail and piano-bar sets for events and venues.",
      icon: "music",
    },
    {
      title: "Music theatre",
      description:
        "Rehearsal pianist, keys and music direction.",
      icon: "theater",
    },
    {
      title: "Bands and arrangements",
      description:
        "Larger line-ups and custom arrangements on request.",
      icon: "users",
    },
    {
      title: "Custom backing tracks",
      description:
        "Audition tracks and rehearsal backings.",
      icon: "disc",
      link: "https://pianobackings.danielebuatti.com",
    },
  ],
  credits: [
    { role: "Wicked", description: "Rehearsal pianist" },
    { role: "The Bodyguard", description: "Deputy keyboard" },
    { role: "Into the Woods (VCA)", description: "Assistant music director" },
    { role: "Broadway Unplugged", description: "Creator and host, ~12 years" },
  ],
  // TODO: Replace with real testimonials when available.
  testimonials: [],
  tech: [
    "Solo setup: can bring own keyboard, PA and vocal mic, or use a house piano",
    "Typical set lengths: 2 × 45 min or a 2-hour evening; flexible",
    "Dress: to suit the event (black tie available)",
  ],
  photoArchiveUrl:
    "https://drive.google.com/drive/folders/1jKpXpOYhZmYOG5Sx2VqixQFvcV_hZpf1",
};

/* ========================================================================== */
/*  COMPONENTS                                                                */
/* ========================================================================== */

const BioTabs = () => {
  const [active, setActive] = useState<"short" | "medium" | "long">("medium");
  const [, copy] = useCopyToClipboard();

  const labels = {
    short: "Short",
    medium: "Medium",
    long: "Long",
  };

  const handleCopy = (text: string) => {
    copy(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" role="tablist">
        {(["short", "medium", "long"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            aria-controls={`bio-panel-${key}`}
            id={`bio-tab-${key}`}
            onClick={() => setActive(key)}
            className={`
              px-4 py-2 text-sm font-medium transition-all
              ${
                active === key
                  ? "bg-brand-primary text-white"
                  : "bg-secondary text-brand-dark/70 hover:text-brand-dark"
              }
              rounded-lg
            `}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      <div
        id={`bio-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`bio-tab-${active}`}
        className="relative"
      >
        <p className="max-w-none text-brand-dark/80 leading-relaxed">
          {mediaData.bios[active]}
        </p>
        <button
          type="button"
          onClick={() => handleCopy(mediaData.bios[active])}
          className="absolute top-0 right-0 inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-primary/80 print-hide"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>
    </div>
  );
};

const VideoCard = ({
  video,
}: {
  video: {
    id: string;
    title: string;
    thumbnail: string;
  };
}) => {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-secondary">
      {loaded ? (
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center transition-transform group-hover:scale-[1.02]"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="absolute inset-0 h-full w-full object-cover brightness-75"
            loading="lazy"
            width={480}
            height={270}
          />
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/90 text-white shadow-lg">
            <Play className="h-7 w-7" />
          </div>
          <span className="relative z-10 text-sm font-medium text-brand-light">
            {video.title}
          </span>
        </button>
      )}
      {/* Print-friendly title and link */}
      <a
        href={watchUrl}
        className="print-video-title text-sm text-brand-dark/70"
        target="_blank"
        rel="noopener noreferrer"
      >
        {video.title}
      </a>
    </div>
  );
};

const OfferCard = ({
  offer,
}: {
  offer: {
    title: string;
    description: string;
    icon: string;
    link?: string;
  };
}) => {
  const IconMap: Record<string, ReactNode> = {
    music: <MusicIcon />,
    theater: <TheaterIcon />,
    users: <UsersIcon />,
    disc: <DiscIcon />,
  };

  const content = (
    <>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
        {IconMap[offer.icon]}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-brand-dark">{offer.title}</h3>
      <p className="text-sm leading-relaxed text-brand-dark/70">{offer.description}</p>
    </>
  );

  if (offer.link) {
    return (
      <a
        href={offer.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-2xl border border-border bg-card p-6 text-left shadow-soft transition-all hover:shadow-lg"
      >
        {content}
        <ExternalLink className="mt-3 h-4 w-4 text-brand-primary opacity-0 transition-opacity group-hover:opacity-100" />
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      {content}
    </div>
  );
};

/* Simple line icons (matching the brand's line-icon aesthetic) */
const MusicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="9" cy="18" r="3" />
    <circle cx="21" cy="16" r="3" />
  </svg>
);
const TheaterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
    <path d="M2 12v8a2 2 0 0 0 2 2h16a2 2 0 0 1-2-2V12" />
    <path d="M4 16h16" />
  </svg>
);
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-3.87-4H8.83a4 4 0 0 0-3.86 4 2 2 0 0 0 2 2h10Z" />
    <circle cx="9" cy="7" r="2" />
    <path d="M21 15.5a4 4 0 0 0-3.87-4H16" />
    <circle cx="17" cy="10" r="2" />
  </svg>
);
const DiscIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 10v6" />
  </svg>
);

/* ========================================================================== */
/*  PAGE                                                                       */
/* ========================================================================== */

const MediaPage = () => {
  useRouteMeta("/media");

  const handlePrint = () => {
    // TODO: Replace with a static /media/daniele-buatti-one-sheet.pdf download
    // once the PDF is generated. For now, use window.print().
    window.print();
  };

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="container py-16 md:py-24 lg:py-32 print:py-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-[44px] leading-[1.02] sm:text-6xl lg:text-7xl font-light text-brand-dark">
              {mediaData.name}
            </h1>
            <p className="mt-4 text-xl text-brand-dark/70">{mediaData.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-all hover:bg-brand-primary/90 hover:shadow-lg print-hide"
              >
                Download one-sheet (PDF)
              </button>
              <a
                href={`mailto:${mediaData.contact.email}?subject=Booking enquiry — ${mediaData.name}`}
                className="inline-flex items-center justify-center rounded-full border border-brand-primary px-6 py-3 text-sm font-medium text-brand-primary transition-all hover:bg-brand-primary hover:text-white print-hide"
              >
                Book me
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:mr-0 lg:max-w-sm">
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-secondary" aria-hidden="true" />
            <img
              src={mediaData.headshot}
              alt={mediaData.name}
              className="relative aspect-[3/4] w-full rounded-2xl object-cover shadow-lifted"
              loading="eager"
              fetchPriority="high"
              width={400}
              height={533}
            />
          </div>
        </div>
      </section>

      {/* ===== Watch ===== */}
      <section className="container py-16 md:py-24" aria-label="Watch">
        <h2 className="mb-4 text-3xl md:text-4xl font-light text-brand-dark">Watch</h2>
        <p className="mb-10 max-w-2xl text-brand-dark/70">
          Selected performances and arrangements. All videos are embedded from YouTube
          (privacy-enhanced mode) and load only when you click play.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {mediaData.videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>

      {/* ===== Photos ===== */}
      <section className="container py-16 md:py-24" aria-label="Photos">
        <h2 className="mb-4 text-3xl md:text-4xl font-light text-brand-dark">Photos</h2>
        <p className="mb-10 max-w-2xl text-brand-dark/70">
          High-resolution photos available for download. All images are lazy-loaded.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mediaData.photos.map((photo, i) => (
            <div key={photo.src} className="group relative overflow-hidden rounded-2xl border border-border bg-secondary">
              <img
                src={photo.src}
                alt={photo.alt}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                width={500}
                height={375}
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <a
                  href={photo.src}
                  download
                  className="rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <a
            href={mediaData.photoArchiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-primary hover:underline"
          >
            Full photo and video archive
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ===== Bio ===== */}
      <section className="container py-16 md:py-24" aria-label="Bio">
        <h2 className="mb-4 text-3xl md:text-4xl font-light text-brand-dark">Bio</h2>
        <BioTabs />
      </section>

      {/* ===== What I offer ===== */}
      <section className="container py-16 md:py-24" aria-label="What I offer">
        <h2 className="mb-4 text-3xl md:text-4xl font-light text-brand-dark">What I offer</h2>
        <p className="mb-10 max-w-2xl text-brand-dark/70">
          Solo piano and vocals, music direction, bands and arrangements, and custom
          backing tracks — all tailored to your event or project.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mediaData.offers.map((offer) => (
            <OfferCard key={offer.title} offer={offer} />
          ))}
        </div>
      </section>

      {/* ===== Selected credits ===== */}
      <section className="container py-16 md:py-24" aria-label="Selected credits">
        <h2 className="mb-4 text-3xl md:text-4xl font-light text-brand-dark">Selected credits</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mediaData.credits.map((credit) => (
            <div key={credit.role} className="border-b border-border pb-3">
              <span className="font-semibold text-brand-dark">{credit.role}</span>
              <span className="text-brand-dark/60"> · {credit.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimonials (hidden if empty) ===== */}
      {mediaData.testimonials.length > 0 && (
        <section className="container py-16 md:py-24" aria-label="Testimonials">
          <h2 className="mb-4 text-3xl md:text-4xl font-light text-brand-dark">Testimonials</h2>
          <div className="space-y-8">
            {mediaData.testimonials.map((t, i) => (
              <blockquote key={i} className="border-l-4 border-brand-primary pl-6">
                <p className="text-lg italic text-brand-dark/80">"{t.quote}"</p>
                <footer className="mt-2 text-sm text-brand-dark/60">— {t.attribution}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* ===== Tech and logistics ===== */}
      <section className="container py-16 md:py-24" aria-label="Tech and logistics">
        <h2 className="mb-4 text-3xl md:text-4xl font-light text-brand-dark">Tech and logistics</h2>
        <ul className="space-y-3 text-brand-dark/80">
          {mediaData.tech.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Contact ===== */}
      <section className="container py-16 md:py-24" aria-label="Contact">
        <h2 className="mb-4 text-3xl md:text-4xl font-light text-brand-dark">Contact</h2>
        <div className="space-y-4">
          <a
            href={`mailto:${mediaData.contact.email}`}
            className="flex items-center gap-3 text-brand-dark hover:text-brand-primary"
          >
            <Mail className="h-5 w-5 text-brand-primary" />
            <span>{mediaData.contact.email}</span>
          </a>
          <a
            href={`tel:${mediaData.contact.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-3 text-brand-dark hover:text-brand-primary"
          >
            <Phone className="h-5 w-5 text-brand-primary" />
            <span>{mediaData.contact.phone}</span>
          </a>
          <a
            href={mediaData.contact.servicesPage}
            className="flex items-center gap-3 text-brand-dark hover:text-brand-primary"
          >
            <ExternalLink className="h-5 w-5 text-brand-primary" />
            <span>Live piano services</span>
          </a>
        </div>
      </section>
    </>
  );
};

export default MediaPage;
