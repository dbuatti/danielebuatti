"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import SeoMetadata from "@/components/SeoMetadata";
import ContactForm from "@/components/ContactForm";
import CalEmbed from "@/components/CalEmbed";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, MessageSquare } from "lucide-react";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <SeoMetadata 
        title="Contact Daniele Buatti"
        description="Get in touch with Daniele Buatti for coaching, performance bookings, or general inquiries."
        url={`${window.location.origin}/contact`}
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6">Let's Connect</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Have a question about coaching, a performance inquiry, or a collaboration idea? I’d love to hear from you.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact Details & Scheduling */}
          <div className="space-y-8">
            <div className="p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
              <h2 className="text-2xl font-medium mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" /> Studio Details
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Mail className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Email</p>
                    <a href="mailto:info@danielebuatti.com" className="text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      info@danielebuatti.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl group-hover:bg-green-50 dark:group-hover:bg-green-900/30 transition-colors">
                    <Phone className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">WhatsApp</p>
                    <a href="https://wa.me/61424174067" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      +61 424 174 067
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <MapPin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Location</p>
                    <p className="text-lg">Toorak, Melbourne, VIC</p>
                    <p className="text-sm text-gray-500">In-person and online worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling Card with Dialog Embed */}
            <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-3xl">
              <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Professional Discovery
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ready to dive in? Book a free 30-minute discovery call to discuss your artistic goals.
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full text-lg py-7 rounded-full shadow-lg">
                    Book a discovery call
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[90vh] p-0">
                  <CalEmbed calLink="danielebuatti/30min" />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-md border border-gray-200/50 dark:border-gray-800/50">
            <h2 className="text-2xl font-medium mb-2">Send a Message</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              For general enquiries or performance bookings, please fill out the form below.
            </p>
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ContactPage;