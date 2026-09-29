"use client";

import React from "react";
import { ArrowUpRight, Clock, Gift, Mail, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/editorial";
import { useRouteMeta } from "@/hooks/use-page-meta";
import { cn } from "@/lib/utils";

interface GiftCardItem {
  name: string;
  subtitle: string;
  description: string;
  price: number; // AUD
  duration?: string;
  stripeLink: string;
  type: "open" | "session";
}

const giftCards: GiftCardItem[] = [
  {
    name: "Open Gift Card",
    subtitle: "$100 credit",
    description:
      "A $100 open credit to be applied to any session of your choice. Comes with a private redemption code emailed to the buyer.",
    price: 100,
    stripeLink: "https://buy.stripe.com/28EcN7gqe8aCgqM1DI53O01",
    type: "open",
  },
  {
    name: "Voice Coaching",
    subtitle: "45 minutes",
    description:
      "45-minute tailored voice coaching session for exploring repertoire, technique, and performance skills with personalised guidance.",
    price: 75,
    duration: "45 minutes",
    stripeLink: "https://buy.stripe.com/28EeVf5LA0IafmIdmq53O03",
    type: "session",
  },
  {
    name: "Kinesiology Session",
    subtitle: "90 minutes",
    description:
      "A 90-minute one-to-one kinesiology session for regulation, clarity, and integration of the body and nervous system. Includes gentle muscle testing, energy balancing, and intuitive inquiry.",
    price: 100,
    duration: "90 minutes",
    stripeLink: "https://buy.stripe.com/8x200lfmagH81vS4PU53O05",
    type: "session",
  },
  {
    name: "Audition Support",
    subtitle: "15 minutes",
    description:
      "15-minute focused session to run through your audition cut, receive feedback on tempo, phrasing, and performance preparation.",
    price: 30,
    duration: "15 minutes",
    stripeLink: "https://buy.stripe.com/9B6bJ3ei6gH8caw4PU53O04",
    type: "session",
  },
];

const GiftCardsPage: React.FC = () => {
  useRouteMeta("/gift-cards");

  return (
    <div>
      <PageHeader
        eyebrow="Gift cards"
        title={
          <>
            Give the gift of a <em className="italic text-brand-primary">session</em>
          </>
        }
        lede="Each gift card comes with a private redemption code emailed to the recipient. Perfect for kinesiology, voice coaching, audition support, or open credit."
      >
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-brand-dark/75">
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand-primary" aria-hidden="true" /> Code delivered by email
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-primary" aria-hidden="true" /> Secure Stripe checkout
          </li>
        </ul>
      </PageHeader>

      <section className="container pb-24 lg:pb-32">
        <div className="grid gap-5 md:grid-cols-2">
          {giftCards.map((card) => {
            const featured = card.type === "open";
            return (
              <a
                key={card.name}
                href={card.stripeLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative flex flex-col justify-between gap-10 overflow-hidden rounded-2xl border p-8 md:p-10 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lifted",
                  featured ? "border-transparent bg-brand-dark text-brand-light" : "border-border bg-card",
                )}
              >
                {featured && (
                  <div
                    className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-primary/30 blur-[90px]"
                    aria-hidden="true"
                  />
                )}
                <div className="relative">
                  <div className="flex items-start justify-between gap-6">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                        featured
                          ? "bg-white/10 text-brand-light"
                          : "bg-secondary text-brand-dark/80 group-hover:bg-brand-primary group-hover:text-white",
                      )}
                    >
                      <Gift className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className={cn("font-serif text-4xl font-light", featured ? "text-brand-light" : "text-brand-dark")}>
                      <span className="align-top text-lg">A$</span>
                      {card.price}
                    </p>
                  </div>
                  <h2 className={cn("mt-8 text-3xl font-light", featured ? "text-brand-light" : "text-brand-dark")}>
                    {card.name}
                  </h2>
                  <p className={cn("mt-1 text-sm font-medium uppercase tracking-[0.18em]", featured ? "text-[hsl(325_72%_72%)]" : "text-brand-primary")}>
                    {card.subtitle}
                  </p>
                  <p className={cn("mt-5 max-w-md leading-relaxed", featured ? "text-brand-light/75" : "text-muted-foreground")}>
                    {card.description}
                  </p>
                </div>
                <div
                  className={cn(
                    "relative flex items-center justify-between border-t pt-5 text-sm",
                    featured ? "border-white/15" : "border-border",
                  )}
                >
                  <span className={cn("inline-flex items-center gap-2", featured ? "text-brand-light/70" : "text-muted-foreground")}>
                    {card.duration ? (
                      <>
                        <Clock className="h-4 w-4" aria-hidden="true" /> {card.duration}
                      </>
                    ) : (
                      "Any session"
                    )}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 font-medium transition-colors",
                      featured ? "text-brand-light" : "text-brand-dark group-hover:text-brand-primary",
                    )}
                  >
                    Buy gift card
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default GiftCardsPage;
