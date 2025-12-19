"use client";

import React from "react";
import { Instagram, Youtube, Mail, Phone, Newspaper, Twitch, Facebook } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DynamicImage from "@/components/DynamicImage";
import NewsletterSignup from "@/components/NewsletterSignup";

const Footer = () => {
  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/daniele.buatti", icon: Instagram },
    { name: "YouTube", href: "http://youtube.com/danielebuatti", icon: Youtube },
    { name: "Twitch", href: "https://twitch.tv/danielebuatti", icon: Twitch },
    { name: "Substack", href: "https://substack.com/@danielebuatti", icon: Newspaper },
    { name: "Facebook", href: "http://www.facebook.com/danielebuatti", icon: Facebook },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-brand-light py-16">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
        {/* Newsletter – original centered style, slightly refined */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Stay Connected</h3>
          <p className="text-brand-light/80 max-w-xl mx-auto text-lg leading-relaxed">
            Occasional reflections on voice, performance, embodiment, and creative practice — plus updates on workshops and availability.
          </p>
          <div className="mt-6">
            <NewsletterSignup />
          </div>
        </div>

        <Separator className="max-w-md mx-auto bg-brand-secondary/50" />

        {/* Social Links – original vertical icon + label, spaced nicely */}
        <div className="flex flex-wrap justify-center gap-10">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 text-brand-light hover:text-brand-primary transition-colors duration-300"
              aria-label={`Visit Daniele Buatti on ${link.name}`}
            >
              <link.icon className="h-8 w-8" />
              <span className="text-base">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Contact – original style, slightly larger icons */}
        <div className="space-y-4">
          <p className="text-xl font-semibold">Contact Me</p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="mailto:info@danielebuatti.com"
              className="flex items-center gap-3 text-brand-light hover:text-brand-primary transition-colors duration-300"
            >
              <Mail className="h-6 w-6" />
              <span className="text-base">info@danielebuatti.com</span>
            </a>
            <a
              href="https://wa.me/61424174067"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-brand-light hover:text-brand-primary transition-colors duration-300"
            >
              <Phone className="h-6 w-6" />
              <span className="text-base">+61 424 174 067</span>
            </a>
          </div>
        </div>

        <Separator className="max-w-md mx-auto bg-brand-secondary/50" />

        {/* Logo – original centered placement */}
        <div className="flex justify-center">
          <DynamicImage
            src="/logo-piano-white-44.png"
            alt="Daniele Buatti Brand Symbol"
            className="h-28 w-auto opacity-90"
            width={112}
            height={112}
          />
        </div>

        {/* Copyright – original subtle style */}
        <div className="pt-4 text-sm text-brand-light/60">
          © {currentYear} Daniele Buatti. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;