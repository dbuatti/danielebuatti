"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicImage from "@/components/DynamicImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Music, Piano, ShieldCheck, Clock, PhoneCall, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SeoMetadata from "@/components/SeoMetadata";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const CeremonySpecialistPage: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    const loadingToastId = toast.loading("Sending your emergency enquiry...");

    try {
      // Send notification email to Daniele
      const { error } = await supabase.functions.invoke('send-admin-email', {
        body: {
          recipientEmail: 'info@danielebuatti.com',
          subject: "🚨 EMERGENCY WEDDING ENQUIRY: Rescue Page Submission",
          body: `
            <div style="font-family: sans-serif; padding: 20px; border: 2px solid #fdb813; border-radius: 10px;">
              <h2 style="color: #00022D;">New Emergency Booking Enquiry!</h2>
              <p>A client has clicked "Emergency Enquiry" on your Ceremony Specialist rescue page.</p>
              <p><strong>Package:</strong> Premium Rescue ($950.00)</p>
              <hr />
              <p><strong>Action Required:</strong> Please check your email/WhatsApp for follow-up details or contact the lead immediately.</p>
            </div>
          `,
        },
      });

      if (error) throw error;

      setIsAccepted(true);
      toast.success("Enquiry Sent!", {
        id: loadingToastId,
        description: "Daniele has been notified and will contact you as a priority.",
      });
    } catch (err) {
      console.error("Error sending enquiry:", err);
      toast.error("Failed to send enquiry.", {
        id: loadingToastId,
        description: "Please call Daniele directly at 0424 174 067 for immediate assistance.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 selection:text-yellow-200">
      <SeoMetadata 
        title="Wedding Ceremony Rescue Specialist | Daniele Buatti"
        description="Premium last-minute wedding ceremony performance. Professional piano and vocals for when you need a reliable, high-end musical solution."
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
              <Sparkles className="w-4 h-4 fill-current" />
              Emergency Rescue Service
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 font-montserrat">
            Wedding Ceremony <br />
            <span className="italic font-serif text-yellow-500">Rescue Specialist</span>
          </h1>
          <p className="text-2xl text-gray-400 font-light max-w-3xl mx-auto">
            Sophisticated Piano & Vocals for Last-Minute Bookings
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
                <Music className="w-6 h-6" /> Signature Musical Curation
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Pre-Ceremony Atmosphere</h3>
                  <p className="text-gray-400">20 minutes of ambient, sophisticated piano as your guests arrive, setting a tone of elegance and anticipation.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">The Processional</h3>
                  <p className="text-yellow-500 font-serif italic text-xl">Tailored to Your Entrance</p>
                  <p className="text-gray-400 mt-2 text-sm">Whether it's a modern minimalist masterpiece like Einaudi's "I Giorni" or a timeless classical standard, I ensure the timing is perfect for your walk down the aisle.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Signing & Formalities</h3>
                  <p className="text-gray-400">Beautifully balanced accompaniment for the signing of the registry and any reflective moments during the ceremony.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">The Recessional</h3>
                  <p className="text-gray-400">An uplifting, celebratory exit piece to lead you and your guests out into the celebrations.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-serif italic text-yellow-500 mb-8 flex items-center gap-3">
                <Piano className="w-6 h-6" /> Why Choose a Specialist?
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-yellow-500 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Absolute Reliability</h4>
                    <p className="text-sm text-gray-400">When other plans fall through, you need a professional who shows up early and delivers flawlessly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-yellow-500 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Rapid Preparation</h4>
                    <p className="text-sm text-gray-400">Expert ability to learn specific cues and repertoire within 24-48 hours.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Investment & Acceptance */}
          <div className="space-y-8 sticky top-24">
            <Card className="bg-zinc-900 border-yellow-500/30 shadow-2xl overflow-hidden">
              <div className="bg-yellow-500 p-4 text-black text-center font-bold uppercase tracking-widest text-sm">
                Premium Rescue Package
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Investment from</p>
                  <p className="text-5xl font-light text-white">$950<span className="text-lg text-gray-500">.00</span></p>
                  <p className="text-xs text-gray-500 mt-2">Includes Emergency Priority Loading</p>
                </div>

                <Separator className="bg-white/10" />

                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" /> Full Ceremony Performance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" /> Rapid Repertoire Prep
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" /> Direct Priority Consultation
                  </li>
                </ul>

                {!isAccepted ? (
                  <Button 
                    onClick={handleAccept}
                    disabled={isSubmitting}
                    className="w-full py-8 text-lg font-bold bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02]"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Emergency Enquiry
                  </Button>
                ) : (
                  <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Priority Alert Sent
                  </div>
                )}

                <p className="text-[10px] text-center text-gray-500 italic">
                  *Subject to availability. Equipment fees may apply if a digital keyboard is required.
                </p>
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <PhoneCall className="w-6 h-6 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Immediate Assistance</h4>
              <p className="text-sm text-gray-400 mb-4">For emergencies within 48 hours, please call directly.</p>
              <a href="tel:0424174067" className="text-yellow-500 font-bold hover:underline">0424 174 067</a>
            </div>
          </div>
        </div>

        {/* Final Note */}
        <section className="max-w-3xl mx-auto text-center border-t border-white/10 pt-16">
          <p className="text-xl font-serif italic text-gray-400">
            "I understand that wedding planning can be unpredictable. My goal is to step in and ensure the music for your ceremony is seamless, elegant, and exactly as you envisioned—no matter the timeline."
          </p>
          <p className="mt-6 text-yellow-500 font-bold">— Daniele Buatti</p>
          <div className="mt-12">
            <Button asChild variant="link" className="text-gray-500 hover:text-white">
              <Link to="/live-piano-services">View Full Performance Gallery</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CeremonySpecialistPage;