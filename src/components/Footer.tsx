"use client";

import { Link } from "react-router-dom";
import { ArrowUp, Facebook, Instagram, Mail, MapPin, Newspaper, Phone, Twitch, Youtube } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { exploreLinks, serviceLinks } from "@/constants/navigation";

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/daniele.buatti", icon: Instagram },
  { name: "YouTube", href: "https://youtube.com/danielebuatti", icon: Youtube },
  { name: "Substack", href: "https://substack.com/@danielebuatti", icon: Newspaper },
  { name: "Twitch", href: "https://twitch.tv/danielebuatti", icon: Twitch },
  { name: "Facebook", href: "https://www.facebook.com/danielebuatti", icon: Facebook },
];

const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-light/50">{children}</h3>
);

const footerLink = "text-[15px] text-brand-light/80 hover:text-brand-light transition-colors";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-brand-light">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container grid gap-8 py-14 md:grid-cols-[1fr_minmax(0,420px)] md:items-center md:gap-16">
          <div>
            <p className="eyebrow text-[hsl(325_72%_70%)]">Newsletter</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-light text-brand-light">Notes from the studio</h2>
            <p className="mt-3 max-w-md text-brand-light/70">
              Occasional insights on voice, performance and practice, plus first word on new programs and arrangements.
            </p>
          </div>
          <NewsletterSignup variant="dark" />
        </div>
      </div>

      <div className="container grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Daniele Buatti, home">
            <img src="/logo-piano-white-44.png" alt="" className="h-11 w-11" width={44} height={44} loading="lazy" />
            <img src="/logo-white-trans-45.png" alt="Daniele Buatti" className="h-11 w-auto" width={134} height={44} loading="lazy" />
          </Link>
          <p className="max-w-xs text-[15px] leading-relaxed text-brand-light/70">
            Pianist, vocal coach and music director based in Melbourne, working with singers, performers and speakers.
          </p>
          <ul className="flex flex-wrap gap-2">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-brand-light/80 transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Services">
          <FooterHeading>Work with me</FooterHeading>
          <ul className="space-y-2.5">
            {serviceLinks.map((s) => (
              <li key={s.href}>
                <Link to={s.href} className={footerLink}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Explore">
          <FooterHeading>Explore</FooterHeading>
          <ul className="space-y-2.5">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className={footerLink}>
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <FooterHeading>Get in touch</FooterHeading>
          <ul className="space-y-3">
            <li>
              <a href="mailto:info@danielebuatti.com" className={`${footerLink} inline-flex items-center gap-2.5`}>
                <Mail className="h-4 w-4 text-brand-light/50" aria-hidden="true" />
                info@danielebuatti.com
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/61424174067"
                target="_blank"
                rel="noopener noreferrer"
                className={`${footerLink} inline-flex items-center gap-2.5`}
              >
                <Phone className="h-4 w-4 text-brand-light/50" aria-hidden="true" />
                +61 424 174 067
              </a>
            </li>
            <li className="inline-flex items-center gap-2.5 text-[15px] text-brand-light/80">
              <MapPin className="h-4 w-4 text-brand-light/50" aria-hidden="true" />
              Toorak, Melbourne &amp; online
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col-reverse items-start gap-4 py-6 text-sm text-brand-light/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Daniele Buatti. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 hover:text-brand-light transition-colors"
          >
            Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
