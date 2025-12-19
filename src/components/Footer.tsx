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
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 items-start text-center md:text-left">
          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Stay Connected</h3>
            <p className="text-brand-light/80 text-lg leading-relaxed">
              Occasional reflections on voice, performance, embodiment, and creative practice — plus updates on workshops and availability.
            </p>
            <div className="mt-6">
              <NewsletterSignup />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-medium mb-6">Find Me Online</h4>
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-brand-light hover:text-brand-primary transition-colors duration-300"
                  aria-label={`Visit Daniele Buatti on ${link.name}`}
                >
                  <link.icon className="h-7 w-7" />
                  <span className="text-base">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-5 text-center md:text-right">
            <h4 className="text-lg font-medium">Contact</h4>
            <a
              href="mailto:info@danielebuatti.com"
              className="flex items-center justify-center md:justify-end gap-3 text-brand-light hover:text-brand-primary transition-colors duration-300"
              aria-label="Email Daniele Buatti"
            >
              <Mail className="h-6 w-6" />
              <span className="text-base">info@danielebuatti.com</span>
            </a>
            <a
              href="https://wa.me/61424174067"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center md:justify-end gap-3 text-brand-light hover:text-brand-primary transition-colors duration-300"
              aria-label="Message Daniele Buatti on WhatsApp"
            >
              <Phone className="h-6 w-6" />
              <span className="text-base">+61 424 174 067</span>
            </a>
          </div>
        </div>

        {/* Logo & Copyright */}
        <div className="mt-16 flex flex-col items-center gap-8">
          <DynamicImage
            src="/logo-piano-white-44.png"
            alt="Daniele Buatti Brand Symbol"
            className="h-28 w-auto opacity-90"
            width={112}
            height={112}
          />
          <p className="text-sm text-brand-light/60">
            © {currentYear} Daniele Buatti. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;