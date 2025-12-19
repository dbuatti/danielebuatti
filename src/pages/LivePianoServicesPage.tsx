"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Mail, Phone } from 'lucide-react';
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

const LivePianoServicesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Add more images here, especially ones showing you singing/vocalizing at the piano
  const galleryImages = [
    "/blacktie.avif",
    "/blacktie1.avif",
    "/blacktie3.avif",
    "/blacktie4.avif",
    "/other.avif",
    // Add new paths like: "/daniele-singing1.avif", "/daniele-vocal-piano.avif", etc.
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      suburb: '',
      eventDescription: '',
      pianoType: '',
    },
  });

  useEffect(() => {
    if (!api) return;
    setSelectedImageIndex(api.selectedScrollSnap());
    api.on("select", () => setSelectedImageIndex(api.selectedScrollSnap()));
  }, [api]);

  const handleContactSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const loadingToastId = toast.loading("Sending your inquiry...");

    const { firstName, lastName, email, phone, suburb, eventDescription, pianoType } = values;

    const messageContent = `
      Event Description: ${eventDescription}
      Piano Type: ${pianoType || 'Not specified'}
      Phone: ${phone || 'Not provided'}
      Suburb: ${suburb || 'Not provided'}
    `;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: `${firstName} ${lastName}`,
          email,
          message: messageContent,
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
      {/* Hero Video Section */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        >
          <source src="/Daniele Buatti - Gatsby Event Gala 1.mov" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
          <DynamicImage
            src="/gold-36.png"
            alt="Daniele Buatti Logo"
            className="h-24 md:h-32 mx-auto mb-6 drop-shadow-2xl"
            width={128}
            height={128}
          />
          <h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase font-montserrat text-gold-400">
            Daniele Buatti
          </h1>
          <p className="text-2xl md:text-4xl mt-6 font-libre-baskerville italic text-gold-300">
            Pianist & Vocalist
          </p>
          <p className="text-lg md:text-xl mt-4 text-gray-300 max-w-2xl mx-auto">
            Sophisticated live music for discerning events
          </p>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-3 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-libre-baskerville text-gold-500 mb-6">
            Moments of Elegance
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Captured performances at prestigious weddings, galas, and private events across Australia
          </p>
        </motion.div>

        {/* Main Large Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={galleryImages[selectedImageIndex]}
            alt="Featured performance"
            className="w-full h-[60vh] md:h-[80vh] object-cover transition-transform duration-1000 ease-out"
          />
        </motion.div>

        {/* Thumbnail Carousel */}
        <Carousel
          opts={{ align: "center", loop: true }}
          setApi={setApi}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {galleryImages.map((src, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "cursor-pointer rounded-xl overflow-hidden transition-all duration-300",
                    selectedImageIndex === index
                      ? "ring-4 ring-gold-500 shadow-2xl shadow-gold-500/20"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-48 object-cover" />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-black/50 hover:bg-gold-600 text-white" />
          <CarouselNext className="hidden md:flex -right-12 bg-black/50 hover:bg-gold-600 text-white" />
        </Carousel>
      </section>

      {/* About / Pitch Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-black to-zinc-950">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto text-center space-y-16"
        >
          <div>
            <h2 className="text-5xl md:text-7xl font-bold font-libre-baskerville text-gold-400 mb-10 leading-tight">
              AN UNFORGETTABLE MUSICAL EXPERIENCE
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-200 mb-8 font-light max-w-4xl mx-auto">
              Elevate your wedding, gala, corporate function, or intimate private soirée with the refined artistry of Daniele Buatti — a masterful pianist and captivating vocalist.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Blending virtuoso piano performance with warm, sophisticated vocals, Daniele delivers a high-class piano bar experience that is both intimate and grand — perfect for creating timeless memories at discerning events.
            </p>
          </div>

          <div className="pt-12 border-t border-gold-800/30">
            <h3 className="text-3xl md:text-4xl font-libre-baskerville text-gold-300 mb-8">
              Performance Style
            </h3>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
              Drawing from the golden era of piano bar elegance, Daniele's performances feature exquisite piano artistry paired with velvety vocals across classical masterpieces, timeless jazz standards, swing classics, and curated contemporary favorites. 
              Whether providing subtle background ambiance or commanding the spotlight with dedicated vocal sets, his delivery exudes class, charm, and emotional depth — tailored impeccably to upscale weddings, luxury venues, and high-brow gatherings.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-4xl md:text-5xl font-libre-baskerville text-center text-gold-400 mb-12">
            Enquire About Your Event
          </h3>

          <Card className="bg-zinc-950/90 border border-gold-800/30 backdrop-blur-xl shadow-2xl rounded-2xl p-10 md:p-16">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-8">
                {/* Form fields remain the same */}
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">First Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="First name"
                          className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-500 focus:border-gold-500 transition-colors h-12 text-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Last name"
                          className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-500 focus:border-gold-500 transition-colors h-12 text-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-300">Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-500 focus:border-gold-500 h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <div className="grid md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0424 174 067"
                          className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-500 focus:border-gold-500 h-12 text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="suburb" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300">Suburb / Area</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Sydney CBD"
                          className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-500 focus:border-gold-500 h-12 text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="eventDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-300">Tell us about your event *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Event type, date, venue, special song requests, vocal or instrumental focus..."
                        className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-500 focus:border-gold-500 resize-none text-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="pianoType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-300">Instrument available at venue?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/50 border-gold-700/50 text-white h-12 text-lg">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-gold-800">
                        <SelectItem value="grand-piano">Grand Piano</SelectItem>
                        <SelectItem value="upright-piano">Upright Piano</SelectItem>
                        <SelectItem value="digital-piano">Digital Piano / Keyboard</SelectItem>
                        <SelectItem value="none">None – please provide</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gold-600 to-amber-600 hover:from-gold-500 hover:to-amber-500 text-black font-semibold text-xl py-8 rounded-full shadow-2xl shadow-gold-600/30 transition-all duration-300"
                >
                  {loading ? "Sending Inquiry..." : "Send Your Inquiry"}
                </Button>
              </form>
            </Form>
          </Card>
        </motion.div>
      </section>

      {/* Footer remains the same */}
      <footer className="relative py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10 brightness-50 scale-110"
          style={{
            backgroundImage: `url(/bowtie.avif)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10">
          <DynamicImage src="/gold-36.png" alt="Logo" className="h-20 mx-auto mb-8 opacity-90" width={80} height={80} />
          <div className="space-y-6 text-2xl md:text-3xl font-light">
            <a
              href="https://wa.me/61424174067"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 hover:text-gold-400 transition-colors"
            >
              <Phone size={32} />
              0424 174 067
            </a>
            <a
              href="mailto:info@danielebuatti.com"
              className="flex items-center justify-center gap-4 hover:text-gold-400 transition-colors"
            >
              <Mail size={32} />
              info@danielebuatti.com
            </a>
          </div>
          <p className="mt-12 text-gray-400 text-lg">© {new Date().getFullYear()} Daniele Buatti. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;