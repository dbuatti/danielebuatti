import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Instagram, Youtube, Twitch, Mail, Phone, Link as LinkIcon, Piano } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/daniele.buatti", icon: Instagram },
    { name: "YouTube", href: "http://youtube.com/danielebuatti", icon: Youtube },
    { name: "Twitch", href: "https://twitch.tv/danielebuatti", icon: Twitch },
    { name: "Piano Backings", href: "https://pianobackingsbydaniele.vercel.app", icon: Piano }, // Using Piano icon for piano backings
    { name: "Substack", href: "https://substack.com/@danielebuatti", icon: LinkIcon },
  ];

  return (
    <footer className="bg-brand-dark text-brand-light py-12">
      <div className="container mx-auto px-4 text-center space-y-8">
        <div className="flex flex-wrap justify-center gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-brand-light hover:text-brand-primary transition-colors"
            >
              <link.icon className="h-6 w-6" />
              <span className="text-sm">{link.name}</span>
            </a>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold">Contact Me</p>
          <a
            href="mailto:daniele.buatti@gmail.com"
            className="flex items-center justify-center gap-2 text-brand-light hover:text-brand-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
            daniele.buatti@gmail.com
          </a>
          <a
            href="tel:+61424174067"
            className="flex items-center justify-center gap-2 text-brand-light hover:text-brand-primary transition-colors"
          >
            <Phone className="h-5 w-5" />
            +61 424 174 067
          </a>
        </div>

        <Separator className="max-w-md mx-auto bg-brand-secondary" />

        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;