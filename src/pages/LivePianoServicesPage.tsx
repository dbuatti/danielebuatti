"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Mail, Phone, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DynamicImage from "@/components/DynamicImage";
import { motion } from "framer-motion";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  suburb: z.string().optional(),
  eventDescription: z.string().min(10, { message: "Please describe your event (at least 10 characters)." }).max(500, { message: "Description too long." }),
  pianoType: z.string().optional(),
});

type GalleryItem = {
  type: "image" | "video";
  src: string;
  poster?: string; // Required for videos — a static JPG thumbnail
};

const LivePianoServicesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const galleryItems: GalleryItem[] = [
    { type: "image", src: "/blackgoldquoteimage1.jpg" },
    { type: "image", src: "/blackgoldquoteimage2.jpg" },
    { type: "image", src: "/3Degrees_Xmas_109.JPG" },
    { type: "image", src: "/blacktie.avif" },
    { type: "image", src: "/blacktie1.avif" },
    { type: "image", src: "/blacktie3.avif" },
    { type: "image", src: "/blacktie4.avif" },
    // === VIDEOS WITH POSTER IMAGES ===
    { type: "video", src: "/IMG_5103.mov", poster: "/IMG_5103-poster.jpg" },
    { type: "video", src: "/IMG_4436.MOV", poster: "/IMG_4436-poster.jpg" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '', suburb: '', eventDescription: '', pianoType: '',
    },
  });

  useEffect(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    api.on("select", () => setSelectedIndex(api.selectedScrollSnap()));
  }, [api]);

  const currentItem = galleryItems[selectedIndex];

  const handleContactSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const loadingToastId = toast.loading("Sending your inquiry...");
    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        message: `
          Event Description: ${values.eventDescription}
          Piano Type: ${values.pianoType || 'Not specified'}
          Phone: ${values.phone || 'Not provided'}
          Suburb: ${values.suburb || 'Not provided'}
        `,
      }]);
      if (error) throw error;
      toast.success('Thank you! Daniele will contact you shortly.', { id: loadingToastId });
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.', { id: loadingToastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section - unchanged */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-75">
          <source src="/Daniele Buatti - Gatsby Event Gala 1.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="relative z-10 text-center px-6">
          <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-24 md:h-32 mx-auto mb-6 drop-shadow-2xl" width={128} height={128} />
          <h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase font-montserrat text-gold-400">Daniele Buatti</h1>
          <p className="text-2xl md:text-4xl mt-6 font-libre-baskerville italic text-gold-300">Pianist & Vocalist</p>
          <p className="text-lg md:text-xl mt-4 text-gray-300 max-w-2xl mx-auto">Sophisticated live music for discerning events</p>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-3 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-libre-baskerville text-gold-500 mb-6">Moments of Elegance</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Captured performances at prestigious weddings, galas, and private events across Australia
          </p>
        </motion.div>

        {/* Main Large Media Display - Perfect for portrait videos */}
        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl bg-black"
        >
          {currentItem.type === "video" ? (
            <>
              {/* Blurred background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-150 opacity-60"
              >
                <source src={currentItem.src} type="video/mp4" />
              </video>
              {/* Sharp centered video */}
              <div className="relative flex items-center justify-center w-full h-[60vh] md:h-[80vh]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-w-full max-h-full object-contain"
                >
                  <source src={currentItem.src} type="video/mp4" />
                </video>
              </div>
            </>
          ) : (
            <img
              src={currentItem.src}
              alt="Featured performance"
              className="w-full h-[60vh] md:h-[80vh] object-cover"
            />
          )}
        </motion.div>

        {/* Thumbnail Carousel - NOW 100% RELIABLE */}
        <Carousel opts={{ align: "center", loop: true }} setApi={setApi} className="w-full max-w-6xl mx-auto">
          <CarouselContent className="-ml-2 md:-ml-4">
            {galleryItems.map((item, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 h-48",
                    selectedIndex === index
                      ? "ring-4 ring-gold-500 shadow-2xl shadow-gold-500/30"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-full">
                      <img
                        src={item.poster || "/fallback-poster.jpg"} // Create this as a backup
                        alt="Video performance preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/60 rounded-full p-5 backdrop-blur-md">
                          <Play className="w-12 h-12 text-gold-400" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-black/50 hover:bg-gold-600 text-white" />
          <CarouselNext className="hidden md:flex -right-12 bg-black/50 hover:bg-gold-600 text-white" />
        </Carousel>
      </section>

      {/* About, Contact Form, and Footer remain exactly as before */}
      {/* (Omitted here for brevity — keep your existing code) */}

      <section className="py-32 px-4 bg-gradient-to-b from-black to-zinc-950">
        {/* ... your about section ... */}
      </section>

      <section className="py-32 px-4 max-w-4xl mx-auto">
        {/* ... your form ... */}
      </section>

      <footer className="relative py-24 text-center overflow-hidden">
        {/* ... your footer ... */}
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;