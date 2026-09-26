"use client";

import React from "react";
import BackToTopButton from "@/components/BackToTopButton";
import ContactForm from "@/components/ContactForm";
import CalEmbed from "@/components/CalEmbed";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useRouteMeta } from "@/hooks/use-page-meta";

const ContactPage: React.FC = () => {
  useRouteMeta("/contact");

  return (
    <div className="min-h-screen bg-background text-gray-800 dark:text-gray-200">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6">Get in Touch</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            I look forward to hearing from you. Please use the form below for general inquiries, or check the dedicated links for bookings.
          </p>
        </header>

        {/* Updated grid with items-stretch to ensure equal height */}
        <div className="grid md:grid-cols-2 gap-12 items-stretch [&>*]:min-w-0">
          
          {/* Left Column: Contact Details & Quick Links */}
          <div className="flex flex-col p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-200/50 dark:border-gray-800/50">
            <div className="flex-grow">
              <h2 className="text-3xl font-medium mb-8">Direct Contact</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="w-7 h-7 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Email</p>
                    <a href="mailto:info@danielebuatti.com" className="text-lg text-brand-dark underline decoration-brand-primary/40 underline-offset-4 hover:decoration-brand-primary">
                      info@danielebuatti.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-7 h-7 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">WhatsApp</p>
                    <a href="https://wa.me/61424174067" target="_blank" rel="noopener noreferrer" className="text-lg text-brand-dark underline decoration-brand-primary/40 underline-offset-4 hover:decoration-brand-primary">
                      +61 424 174 067
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-7 h-7 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Studio Location</p>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Toorak, Melbourne, VIC</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links Section anchored to the bottom */}
            <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <h3 className="text-xl font-medium mb-4">Quick Actions</h3>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start text-lg py-7 rounded-full gap-3 shadow-sm transition-all hover:scale-[1.01] bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
                      <Calendar className="w-5 h-5" /> Book a discovery call
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[90vh] p-0">
                    <CalEmbed calLink="danielebuatti/30min" />
                  </DialogContent>
                </Dialog>

                <Button asChild variant="outline" className="w-full justify-start border-2 text-lg py-7 rounded-full gap-3 transition-all hover:scale-[1.01]">
                  <Link to="/book-voice-piano">
                    <ExternalLink className="w-5 h-5" /> Book a Coaching Session
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start border-2 text-lg py-7 rounded-full gap-3 transition-all hover:scale-[1.01]">
                    <Link to="/ameb-accompanying">
                        <ExternalLink className="w-5 h-5" /> View AMEB Rates & Book
                    </Link>
                </Button>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex flex-col p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-soft border border-gray-200/50 dark:border-gray-800/50">
            <h2 className="text-3xl font-medium mb-6">Send a Message</h2>
            <div className="flex-grow">
                <ContactForm />
            </div>
          </div>

        </div>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default ContactPage;