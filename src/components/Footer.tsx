import React from "react";
import { Instagram, Youtube, Mail, Phone, Link as LinkIcon, Newspaper, Twitch, Facebook, Patreon, Discord } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DynamicImage from "@/components/DynamicImage";

const Footer = () => {
  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/daniele.buatti", icon: Instagram },
    { name: "YouTube", href: "http://youtube.com/danielebuatti", icon: Youtube },
    { name: "Twitch", href: "https://twitch.tv/danielebuatti", icon: Twitch },
    { name: "Substack", href: "https://substack.com/@danielebuatti", icon: Newspaper },
    { name: "Facebook", href: "http://www.facebook.com/danielebuatti", icon: Facebook },
    { name: "Patreon", href: "http://patreon.com/danielebuatti", icon: Patreon },
    { name: "Discord", href: "https://discord.gg/pfW8B3Fy", icon: Discord },
    { name: "Mailing List", href: "http://eepurl.com/hg2ptX", icon: LinkIcon },
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
            href="mailto:info@danielebuatti.com"
            className="flex items-center justify-center gap-2 text-brand-light hover:text-brand-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
            info@danielebuatti.com
          </a>
          <a
            href="https://wa.me/61424174067"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-brand-light hover:text-brand-primary transition-colors"
          >
            <Phone className="h-5 w-5" />
            +61 424 174 067
          </a>
        </div>

        <Separator className="max-w-md mx-auto bg-brand-secondary" />

        <div className="flex justify-center py-4">
          <DynamicImage
            src="/logo-piano-white-44.png"
            alt="Daniele Buatti Brand Symbol"
            className="h-24 w-auto"
            width={96}
            height={96}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;