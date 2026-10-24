"use client";

import React from "react";
import "@fontsource-variable/dm-sans/index.css";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { SectionIntro } from "@/components/editorial";
import DynamicImage from "@/components/DynamicImage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ghostLightButton, inkButton, lightButton, primaryButton } from "@/lib/button-styles";
import { useRouteMeta } from "@/hooks/use-page-meta";
import { SITE_URL } from "@/seo/pages";
import { cn } from "@/lib/utils";
import {
  getUpcomingEvening,
  pianoByHeartEventSchema,
  pianoByHeartArtwork,
  pianoByHeartLinks,
  venueAddress,
  type PianoByHeartEvening,
} from "@/constants/piano-by-heart";

/* ---------------------------------------------------------------------------
 * Full-bleed colour bands taken from the event artwork, so the page reads as
 * one continuous piece rather than white with cards on it.
 *   indigo   #11153F   hero overlay (the artwork's deep blue)
 *   blush    #F6DCE6   intro, FAQ
 *   lavender #E3E0F4   the evening / good to know
 *   ink      brand-dark  next evening
 *   magenta  brand-primary  listen first
 * Text on each band is ivory or navy ink. The magenta accent drops to a
 * deeper shade on the pale bands so small text keeps AA contrast.
 * ------------------------------------------------------------------------- */

const band = {
  indigo: "bg-[#11153F] text-brand-light",
  blush: "bg-[#F6DCE6] text-brand-dark [&_.eyebrow]:text-[hsl(325_72%_36%)]",
  lavender: "bg-[#E3E0F4] text-brand-dark [&_.eyebrow]:text-[hsl(325_72%_36%)]",
  ink: "bg-brand-dark text-brand-light",
  magenta: "bg-brand-primary text-white",
};

// Pink eyebrow that stays readable on the dark bands.
const darkEyebrow = "eyebrow text-[hsl(325_72%_78%)]";

const runSheet = [
  { time: "5:00pm", detail: "Arrive, settle in and find your spot" },
  { time: "5:15pm", detail: "An hour of live improvised piano" },
  { time: "6:15pm", detail: "A quiet close and a cup of tea" },
];

const goodToKnow = [
  "Wear something comfortable. Bring a blanket or eye mask if you like.",
  "Phones off, no talking during the music.",
  "Futons and bolsters provided.",
  "Places are limited so the room stays spacious.",
];

const faqItems = [
  {
    q: "Do I need any experience with meditation or music?",
    a: "Not at all. There's nothing to learn and nothing to do. Just arrive, get comfortable and listen.",
  },
  {
    q: "Can I move or make sound?",
    a: "Yes. Stretch, sway, hum or sigh, whatever your body wants. Or lie completely still.",
  },
  { q: "What if I fall asleep?", a: "That's completely fine. Rest is the point." },
  {
    q: "Is this a sound bath?",
    a: "It's in a similar spirit, but everything is played live on piano and made up in the moment.",
  },
  {
    q: "What if I'm running late?",
    a: "Please arrive by 5:15pm, when the music begins, so the room stays undisturbed.",
  },
  {
    q: "Can I take photos or videos?",
    a: "Please keep phones off and away so everyone can fully switch off.",
  },
  {
    q: "I have an injury or a specific need.",
    a: "Let me know when you book, or get in touch, and I'll make sure you're comfortable.",
  },
  { q: "What's the refund policy?", a: "Refunds are available up to 7 days before the event." },
];

const bookingLabel = (evening: PianoByHeartEvening) =>
  evening.status === "sold-out" ? "Join the waitlist" : "Book your place";

const BookingLink = ({ evening, className }: { evening: PianoByHeartEvening; className: string }) => (
  <a href={evening.bookingUrl} target="_blank" rel="noopener noreferrer" className={className}>
    {bookingLabel(evening)}
    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
  </a>
);


// In-page jump to the booking details. A plain anchor so the browser scrolls to it.
const JumpLink = ({ children }: { children: React.ReactNode }) => (
  <a href="#next-evening" className="group inline-flex items-center gap-2 text-base font-medium text-brand-light">
    {children}
    <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
  </a>
);

const EventSchema = ({ evening }: { evening: PianoByHeartEvening }) => {
  const schema = pianoByHeartEventSchema(evening, `${SITE_URL}/pianobyheart`, `${SITE_URL}${pianoByHeartArtwork.src}`);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

// Full-bleed artwork with the poster's type set live over it, so the date and
// venue come from the config rather than being baked into an image.
const Hero = ({ evening }: { evening: PianoByHeartEvening | null }) => (
  <header className={cn(band.indigo, "relative isolate overflow-hidden")}>
    <DynamicImage
      src={pianoByHeartArtwork.src}
      alt={pianoByHeartArtwork.alt}
      className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
      width={2000}
      height={1125}
      priority
    />
    {/* Darkens the left side (and all of it on phones) so the type stays legible. */}
    <div
      className="absolute inset-0 -z-10 bg-[#11153F]/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#11153F]/90 lg:via-[#11153F]/50 lg:to-transparent"
      aria-hidden="true"
    />
    <div className="container flex min-h-[min(88vh,820px)] flex-col justify-center py-24 lg:py-32">
      <div className="max-w-xl">
        <h1 className="font-seasons text-[64px] leading-[0.95] sm:text-8xl lg:text-[120px] font-light tracking-[-0.01em] text-brand-light">
          Piano
          <br />
          by Heart
        </h1>
        <p className="mt-6 font-dm-sans text-lg md:text-xl leading-relaxed text-brand-light/90">
          An hour of improvised piano to rest, move and sound.
        </p>
        {evening && (
          <>
            <span className="mt-8 block h-px w-full max-w-sm bg-[#E9C98B]/50" aria-hidden="true" />
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-[#E9C98B]">
              {evening.date}
              <span className="hidden sm:inline" aria-hidden="true"> · </span>
              <br className="sm:hidden" />
              {evening.venue.name}, {evening.venue.locality}
            </p>
          </>
        )}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {evening ? (
            <>
              <BookingLink evening={evening} className={primaryButton} />
              <JumpLink>Details</JumpLink>
            </>
          ) : (
            <JumpLink>Next evening</JumpLink>
          )}
        </div>
      </div>
    </div>
  </header>
);

const NextEvening = ({ evening }: { evening: PianoByHeartEvening | null }) => (
  <section id="next-evening" className={cn(band.ink, "relative scroll-mt-20 overflow-hidden")}>
    <div
      className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-primary/25 blur-[110px]"
      aria-hidden="true"
    />
    <div className="container relative py-24 lg:py-32">
      <p className={darkEyebrow}>Next evening</p>
      {evening ? (
        <>
          <h2 className="mt-4 text-4xl md:text-5xl font-light leading-[1.08] text-brand-light">{evening.date}</h2>
          {evening.status === "sold-out" && (
            <p className="mt-4 text-lg text-brand-light/80">This evening is sold out. Join the waitlist for a place.</p>
          )}
          <dl className="mt-10 grid max-w-4xl gap-x-12 gap-y-6 sm:grid-cols-2">
            {[
              { label: "Time", value: evening.time },
              {
                label: "Venue",
                value: (
                  <>
                    {evening.venue.room}, {evening.venue.name}
                    <br />
                    {venueAddress(evening)}
                  </>
                ),
              },
              { label: "Price", value: evening.price },
              { label: "Places", value: evening.places },
            ].map(({ label, value }) => (
              <div key={label} className="border-t border-white/15 pt-4">
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-brand-light/60">{label}</dt>
                <dd className="mt-2 text-lg leading-relaxed text-brand-light/90">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <BookingLink evening={evening} className={primaryButton} />
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-4xl md:text-5xl font-light leading-[1.08] text-brand-light">
            The next evening will be announced soon.
          </h2>
          <div className="mt-10">
            <a href={pianoByHeartLinks.enquiry} className={ghostLightButton}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Get in touch
            </a>
          </div>
        </>
      )}
    </div>
  </section>
);

const PianoByHeartPage: React.FC = () => {
  useRouteMeta("/pianobyheart");
  const evening = getUpcomingEvening();

  return (
    <div>
      {evening && <EventSchema evening={evening} />}

      <Hero evening={evening} />

      {/* Intro */}
      <section className={band.blush}>
        <div className="container grid gap-8 py-20 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:py-28">
          <p className="font-serif text-3xl md:text-4xl font-light leading-[1.2] text-brand-dark">Come as you are.</p>
          <div className="space-y-6 text-lg leading-relaxed text-brand-dark/85">
            <p>
              Lie back on a thick futon in a dark, cosy room, and let an hour of live, improvised piano move through
              you. There's nothing to do and nothing to get right. Some people rest the whole time, some drift into
              sleep, some stretch, sway or hum along. All of it is welcome.
            </p>
            <p>
              Every note is made up in the moment, played live by Melbourne pianist Daniele Buatti, responding to the
              room and the people in it. No two evenings are the same.
            </p>
          </div>
        </div>
      </section>

      {/* The evening + good to know */}
      <section className={band.lavender}>
        <div className="container grid gap-16 py-24 lg:grid-cols-2 lg:gap-20 lg:py-32">
          <div>
            <SectionIntro eyebrow="Run-sheet" title="The evening" />
            <ol className="mt-10">
              {runSheet.map((item) => (
                <li key={item.time} className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-brand-dark/15 py-5">
                  <span className="font-serif text-lg text-[hsl(325_72%_36%)]">{item.time}</span>
                  <span className="text-lg leading-relaxed text-brand-dark/85">{item.detail}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionIntro eyebrow="Before you come" title="Good to know" />
            <ul className="mt-10">
              {goodToKnow.map((item) => (
                <li key={item} className="flex gap-4 border-t border-brand-dark/15 py-5 text-lg leading-relaxed text-brand-dark/85">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <NextEvening evening={evening} />

      {/* Listen first */}
      <section className={band.magenta}>
        <div className="container grid gap-12 py-24 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-20 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/80">Listen first</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-light leading-[1.08] text-white">Hear the music</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/90">Get a feel for the music before you come.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={pianoByHeartLinks.spotify} target="_blank" rel="noopener noreferrer" className={lightButton}>
                Listen on Spotify
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={pianoByHeartLinks.instagram} target="_blank" rel="noopener noreferrer" className={ghostLightButton}>
                Instagram
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <iframe
            src={pianoByHeartLinks.spotifyEmbed}
            title="Daniele Buatti on Spotify"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="h-[352px] w-full rounded-2xl border-0 bg-black/10 shadow-lifted"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className={band.blush}>
        <div className="container py-24 lg:py-32">
          <div className="mx-auto max-w-3xl">
            <SectionIntro eyebrow="Questions" title="FAQ" />
            <Accordion type="single" collapsible className="mt-10">
              {faqItems.map(({ q, a }) => (
                <AccordionItem key={q} value={q} className="border-brand-dark/15">
                  <AccordionTrigger className="text-left text-lg font-normal text-brand-dark hover:no-underline">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-brand-dark/85">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {evening && (
              <div className="mt-12">
                <BookingLink evening={evening} className={inkButton} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PianoByHeartPage;
