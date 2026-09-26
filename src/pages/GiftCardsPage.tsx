"use client";

import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, CalendarDays } from "lucide-react"; // Removed Clock, Added CalendarDays
import SectionHeading from "@/components/SectionHeading";
import { useRouteMeta } from "@/hooks/use-page-meta";
// import { cn } from "@/lib/utils"; // Removed unused import

interface GiftCardItem {
  name: string;
  description: string;
  price: number; // AUD
  duration?: string; // Optional, e.g., "90 minutes"
  stripeLink: string; // Stripe Buy Link URL
  type: 'open' | 'session'; // Open credit vs specific session
}

const giftCards: GiftCardItem[] = [
  {
    name: "Kinesiology Session – 90 minutes",
    description: "A 90-minute one-to-one kinesiology session for regulation, clarity, and integration of the body and nervous system. Includes gentle muscle testing, energy balancing, and intuitive inquiry.",
    price: 100,
    duration: "90 minutes",
    stripeLink: "https://buy.stripe.com/8x200lfmagH81vS4PU53O05", // Updated to the new link
    type: "session"
  },
  {
    name: "Audition Support Gift Card – 15 min",
    description: "15-minute focused session to run through your audition cut, receive feedback on tempo, phrasing, and performance preparation.",
    price: 30,
    duration: "15 minutes",
    stripeLink: "https://buy.stripe.com/9B6bJ3ei6gH8caw4PU53O04",
    type: "session"
  },
  {
    name: "Voice Coaching Gift Card – 45 min",
    description: "45-minute tailored voice coaching session for exploring repertoire, technique, and performance skills with personalized guidance.",
    price: 75,
    duration: "45 minutes",
    stripeLink: "https://buy.stripe.com/28EeVf5LA0IafmIdmq53O03",
    type: "session"
  },
  {
    name: "Open Gift Card – $100 Credit",
    description: "A $100 open credit to be applied to any session of your choice. Comes with a private redemption code emailed to the buyer.",
    price: 100,
    stripeLink: "https://buy.stripe.com/28EcN7gqe8aCgqM1DI53O01",
    type: "open"
  }
];

const GiftCardsPage: React.FC = () => {
  useRouteMeta("/gift-cards");

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <div className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center space-y-4 mb-10">
          <SectionHeading as="h1">Gift Cards</SectionHeading>
          <p className="text-xl font-medium text-brand-dark/70 dark:text-brand-light/70 max-w-3xl mx-auto">
            Give the gift of a transformative session. Each gift card comes with a private redemption code emailed to the recipient. Perfect for Kinesiology, Voice Coaching, Audition Support, or open credit.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto py-8">
          {giftCards.map((card) => (
            <Card 
              key={card.name} 
              className="bg-brand-light dark:bg-brand-dark-alt shadow-soft border-brand-secondary/50 p-6 flex flex-col justify-between hover:shadow-lifted hover:scale-[1.02] transition-all duration-300"
            >
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="h-7 w-7 text-brand-primary" />
                  <CardTitle className="text-2xl font-normal text-brand-dark">{card.name}</CardTitle>
                </div>
                <p className="text-lg font-semibold text-brand-dark/80 dark:text-brand-light/80">
                  A${card.price.toFixed(2)}
                </p>
              </CardHeader>
              <CardContent className="p-0 flex-grow space-y-4 text-brand-dark/80 dark:text-brand-light/80">
                <p>{card.description}</p>
                {card.duration && (
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <CalendarDays className="h-4 w-4 text-brand-secondary" />
                    Duration: {card.duration}
                  </p>
                )}
              </CardContent>
              <div className="mt-6">
                <Button asChild size="lg" className="w-full bg-brand-dark hover:bg-brand-primary text-brand-light text-lg px-8 py-6 rounded-full shadow-soft transition-all duration-300 ease-in-out transform hover:scale-105">
                  <a href={card.stripeLink} target="_blank" rel="noopener noreferrer">
                    Buy Now
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </section>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default GiftCardsPage;