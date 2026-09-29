"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Mail, MapPin, MessageCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import CalEmbed from "@/components/CalEmbed";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/editorial";
import { useRouteMeta } from "@/hooks/use-page-meta";

const details = [
  { icon: Mail, label: "Email", value: "info@danielebuatti.com", href: "mailto:info@danielebuatti.com" },
  { icon: MessageCircle, label: "WhatsApp", value: "+61 424 174 067", href: "https://wa.me/61424174067", external: true },
  { icon: MapPin, label: "Studio", value: "Toorak, Melbourne, VIC" },
];

const quickLinks = [
  { label: "Book a coaching session", to: "/book-voice-piano" },
  { label: "AMEB rates & booking", to: "/ameb-accompanying" },
  { label: "Live piano for your event", to: "/live-piano-services" },
];

const ContactPage: React.FC = () => {
  useRouteMeta("/contact");

  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Get in <em className="italic text-brand-primary">touch</em>
          </>
        }
        lede="I look forward to hearing from you. Use the form for general enquiries, or jump straight to a booking below."
      />

      <section className="container pb-24 lg:pb-32">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.35fr] [&>*]:min-w-0">
          {/* Details */}
          <aside className="flex flex-col justify-between gap-10 rounded-2xl bg-brand-dark p-8 text-brand-light md:p-10">
            <ul className="space-y-7">
              {details.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-light/50">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="mt-1 block break-words text-lg text-brand-light underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-[hsl(325_72%_72%)]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-lg text-brand-light">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/15 pt-8">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-8 text-base font-medium text-white transition-all duration-300 hover:bg-brand-primary/90">
                    <Calendar className="h-5 w-5" aria-hidden="true" /> Book a discovery call
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[90vh] p-0">
                  <DialogTitle className="sr-only">Book a discovery call</DialogTitle>
                  <CalEmbed calLink="danielebuatti/30min" fill />
                </DialogContent>
              </Dialog>
              <ul className="mt-6 divide-y divide-white/10">
                {quickLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="group flex items-center justify-between py-3.5 text-brand-light/85 transition-colors hover:text-brand-light">
                      {l.label}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft md:p-10">
            <h2 className="text-3xl font-light text-brand-dark">Send a message</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
