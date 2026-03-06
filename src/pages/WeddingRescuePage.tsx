"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicImage from "@/components/DynamicImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Music, Piano, ShieldCheck, Clock, PhoneCall, Star, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SeoMetadata from "@/components/SeoMetadata";

const WeddingRescuePage: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    setIsAccepted(true);
    toast.success("Proposal Accepted!", {
      description: "Daniele has been notified. Please proceed with the transfer to lock in the date.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 selection:text-yellow-200">
      <SeoMetadata 
        title="Wedding Ceremony Proposal - St Dominic’s Camberwell"
        description="Premium Wedding Ceremony Performance by Daniele Buatti."
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-500 text-xs uppercase tracking-[0.3em] font-bold">
              <Star className="w-4 h-4 fill-current" />
              Premium Emergency Wedding Package
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 font-montserrat">
            Wedding Ceremony <br />
            <span className="italic font-serif text-yellow-500">Performance</span>
          </h1>
          <p className="text-2xl text-gray-400 font-light max-w-3xl mx-auto">
            St Dominic’s Church, Camberwell | March 7th, 1:00 PM
          </p>
        </motion.section>

        {/* Main Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-24 border border-white/10"
        >
          <DynamicImage
            src="/blacktie.avif"
            alt="Daniele Buatti Wedding Performance"
            className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            width={1200}
            height={600}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 items-start mb-24">
          {/* Left Column: Repertoire */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif italic text-yellow-500 mb-8 flex items-center gap-3">
                <Music className="w-6 h-6" /> The Musical Curation
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Pre-Ceremony</h3>
                  <p className="text-gray-400">15-20 minutes of ambient, sophisticated background music as your guests arrive and settle into the beautiful acoustics of St Dominic’s.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">The Processional</h3>
                  <p className="text-yellow-500 font-serif italic text-xl">"I Giorni" — Ludovico Einaudi</p>
                  <p className="text-gray-400 mt-2 text-sm">A modern masterpiece of minimalist piano, creating a breathtaking atmosphere for the entrance.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Signing of the Registry</h3>
                  <p className="text-yellow-500 font-serif italic text-xl">"Ave Maria" — Schubert</p>
                  <p className="text-gray-400 mt-2 text-sm">The classic Schubert arrangement, followed by one additional contemporary or classical piece to accompany the formal proceedings.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">The Recessional</h3>
                  <p className="text-gray-400">An uplifting, celebratory exit piece of your choice to lead the congregation out.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-serif italic text-yellow-500 mb-8 flex items-center gap-3">
                <Piano className="w-6 h-6" /> Technical Excellence
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-yellow-500 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Church-Grade Sound System</h4>
                    <p className="text-sm text-gray-400">High-end digital stage piano and premium PA system specifically calibrated for the large-scale acoustics of St Dominic’s.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-yellow-500 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Short-Notice Priority</h4>
                    <p className="text-sm text-gray-400">Immediate repertoire preparation and logistical coordination within 24 hours of the event.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Investment & Acceptance */}
          <div className="space-y-8 sticky top-24">
            <Card className="bg-zinc-900 border-yellow-500/30 shadow-2xl overflow-hidden">
              <div className="bg-yellow-500 p-4 text-black text-center font-bold uppercase tracking-widest text-sm">
                Investment Summary
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Total Package Fee</p>
                  <p className="text-5xl font-light text-white">$950<span className="text-lg text-gray-500">.00</span></p>
                  <p className="text-xs text-gray-500 mt-2">Includes GST, Equipment & Emergency Loading</p>
                </div>

                <Separator className="bg-white/10" />

                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" /> 1-Hour Ceremony Performance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" /> Full Sound System & Piano
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" /> Repertoire Preparation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" /> Direct Phone Consultation
                  </li>
                </ul>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-500">
                    <CreditCard className="w-3 h-3" /> Payment Terms
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Due to the short-notice nature of this booking, full payment is required upon acceptance to secure the date and begin preparation.
                  </p>
                </div>

                {!isAccepted ? (
                  <Button 
                    onClick={handleAccept}
                    className="w-full py-8 text-lg font-bold bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02]"
                  >
                    Accept & Confirm Booking
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 font-semibold">
                      Booking Confirmed
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-800 border border-white/10 text-sm">
                      <p className="font-bold text-white mb-2">Bank Details:</p>
                      <p className="text-gray-400">BSB: 923100</p>
                      <p className="text-gray-400">ACC: 301110875</p>
                      <p className="text-gray-400 mt-2 text-xs italic">Please send a screenshot of the receipt to 0424 174 067.</p>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-center text-gray-500 italic">
                  *If the church provides a tuned piano, the equipment fee can be adjusted upon arrival.
                </p>
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <PhoneCall className="w-6 h-6 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Need to chat?</h4>
              <p className="text-sm text-gray-400 mb-4">Daniele is available for a call this evening to finalize cues.</p>
              <a href="tel:0424174067" className="text-yellow-500 font-bold hover:underline">0424 174 067</a>
            </div>
          </div>
        </div>

        {/* Final Note */}
        <section className="max-w-3xl mx-auto text-center border-t border-white/10 pt-16">
          <p className="text-xl font-serif italic text-gray-400">
            "I’m sorry to hear about the stress with the priest! I'm very happy to step in and ensure the music for your ceremony is seamless, elegant, and exactly as you envisioned."
          </p>
          <p className="mt-6 text-yellow-500 font-bold">— Daniele Buatti</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WeddingRescuePage;