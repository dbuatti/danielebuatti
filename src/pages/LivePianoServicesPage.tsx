"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious, 
  type CarouselApi 
} from "@/components/ui/carousel";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
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
import { cn } from "@/lib/utils";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  venueName: z.string().min(1, { message: "Venue name is required." }),
  eventDate: z.string().min(1, { message: "Event date is required." }),
  eventVision: z.string().min(10, { message: "Please share a little about your vision (at least 10 characters)." }).max(1000),
  pianoRequirement: z.string().min(1, { message: "Please select an instrument option." }),
  referralSource: z.string().optional(),
});

type GalleryItem = {
  type: "image" | "video";
  src: string;
  poster?: string;
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
    { type: "video", src: "/IMG_5103.mov", poster: "/IMG_5103-poster.jpg" },
    { type: "video", src: "/IMG_4436.MOV", poster: "/IMG_4436-poster.jpg" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '', venueName: '', eventDate: '', eventVision: '', pianoRequirement: '', referralSource: '',
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
    const loadingToastId = toast.loading("Sending your inquiry to Daniele...");
    
    const messageBody = `
      Event Date: ${values.eventDate}
      Venue: ${values.venueName}
      Vision: ${values.eventVision}
      Piano Requirement: ${values.pianoRequirement}
      Phone: ${values.phone}
      Heard via: ${values.referralSource || 'Not specified'}
    `;

    try {
      const { error } = await supabase.functions.invoke('submit-contact-message', {
        body: {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          message: messageBody,
        },
      });

      if (error) throw error;
      
      toast.success('Thank you. Daniele will contact you shortly to discuss your event.', { id: loadingToastId });
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
      {/* Hero Section */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-[0.6]">
          <source src="/Daniele Buatti - Gatsby Event Gala 1.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="relative z-10 text-center px-6">
          <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-24 md:h-32 mx-auto mb-6 drop-shadow-2xl" width={128} height={128} />
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.2em] uppercase font-montserrat text-white">
            DANIELE BUATTI
          </h1>
          
          {/* Gold Separator Line */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="h-[1px] bg-[#C5B358] mx-auto mt-6 mb-8" 
          />
          
          <p className="text-2xl md:text-4xl font-libre-baskerville italic text-white/90">Pianist & Vocalist</p>
          <p className="text-lg md:text-xl mt-6 text-gray-300 max-w-2xl mx-auto font-light tracking-wide">Sophisticated live music for distinguished weddings and events</p>
        </motion.div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-libre-baskerville text-[#C5B358] mb-6">Moments of Elegance</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light uppercase tracking-widest">
            Performances at NGV, prestigious estates, and private galas
          </p>
        </motion.div>

        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative mb-12 rounded-sm overflow-hidden shadow-2xl bg-zinc-900 aspect-video md:aspect-[21/9]"
        >
          {currentItem.type === "video" ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={currentItem.src} type="video/mp4" />
            </video>
          ) : (
            <img src={currentItem.src} alt="Performance gallery" className="w-full h-full object-cover" />
          )}
        </motion.div>

        <Carousel opts={{ align: "center", loop: true }} setApi={setApi} className="w-full max-w-5xl mx-auto">
          <CarouselContent className="-ml-4">
            {galleryItems.map((item, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "relative cursor-pointer aspect-square overflow-hidden grayscale transition-all duration-500 hover:grayscale-0",
                    selectedIndex === index ? "ring-1 ring-[#C5B358] grayscale-0 scale-105" : "opacity-40"
                  )}
                >
                  <img src={item.type === "video" ? item.poster : item.src} className="w-full h-full object-cover" alt="Thumbnail" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Narrative Section */}
      <section className="py-32 px-4 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto text-center border-y border-[#C5B358]/20 py-20">
          <h2 className="text-3xl md:text-4xl font-libre-baskerville text-white mb-8 tracking-tight">A Bespoke Musical Atmosphere</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
            Specialising in a refined repertoire that spans jazz standards, the classics of Elton John, and modern ballads. Whether it is a black-tie wedding at the NGV or an intimate dinner party, Daniele provides a premium, high-tier vocal and piano experience tailored for discerning hosts.
          </p>
        </div>
      </section>

      {/* Refined Form Section */}
      <section id="enquire" className="py-32 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-libre-baskerville text-[#C5B358] mb-4">Request Availability</h3>
          <p className="text-gray-400 font-light">Direct consultation for exclusive events and weddings</p>
        </div>
        
        <Card className="bg-transparent border-none shadow-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel className="text-[#C5B358] uppercase tracking-tighter text-xs">First Name</FormLabel><FormControl><Input {...field} className="bg-transparent border-0 border-b border-zinc-800 rounded-none focus-visible:ring-0 focus:border-[#C5B358] transition-all px-0 pb-2 text-lg" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel className="text-[#C5B358] uppercase tracking-tighter text-xs">Last Name</FormLabel><FormControl><Input {...field} className="bg-transparent border-0 border-b border-zinc-800 rounded-none focus-visible:ring-0 focus:border-[#C5B358] transition-all px-0 pb-2 text-lg" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel className="text-[#C5B358] uppercase tracking-tighter text-xs">Email Address</FormLabel><FormControl><Input {...field} type="email" className="bg-transparent border-0 border-b border-zinc-800 rounded-none focus-visible:ring-0 focus:border-[#C5B358] transition-all px-0 pb-2 text-lg" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel className="text-[#C5B358] uppercase tracking-tighter text-xs">Phone Number</FormLabel><FormControl><Input {...field} className="bg-transparent border-0 border-b border-zinc-800 rounded-none focus-visible:ring-0 focus:border-[#C5B358] transition-all px-0 pb-2 text-lg" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                <FormField control={form.control} name="venueName" render={({ field }) => (
                  <FormItem><FormLabel className="text-[#C5B358] uppercase tracking-tighter text-xs">Venue Name</FormLabel><FormControl><Input {...field} placeholder="e.g. NGV International" className="bg-transparent border-0 border-b border-zinc-800 rounded-none focus-visible:ring-0 focus:border-[#C5B358] transition-all px-0 pb-2 text-lg" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="eventDate" render={({ field }) => (
                  <FormItem><FormLabel className="text-[#C5B358] uppercase tracking-tighter text-xs">Event Date</FormLabel><FormControl><Input {...field} type="text" placeholder="DD/MM/YYYY" className="bg-transparent border-0 border-b border-zinc-800 rounded-none focus-visible:ring-0 focus:border-[#C5B358] transition-all px-0 pb-2 text-lg" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="eventVision" render={({ field }) => (
                <FormItem><FormLabel className="text-[#C5B358] uppercase tracking-tighter text-xs">The Vision & Atmosphere</FormLabel><FormControl><Textarea {...field} rows={4} placeholder="Describe the style and flow of your event..." className="bg-transparent border border-zinc-800 rounded-none focus-visible:ring-0 focus:border-[#C5B358] transition-all p-4 text-lg resize-none" /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="pianoRequirement" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#C5B358] uppercase tracking-tighter text-xs">Piano Requirement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border border-zinc-800 rounded-none h-12">
                        <SelectValue placeholder="Select instrument option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="on-site">Acoustic Piano available at venue</SelectItem>
                      <SelectItem value="daniele-provides">Daniele to provide premium digital grand</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C5B358] to-[#E2D192] hover:brightness-110 text-black font-medium text-lg py-8 rounded-none transition-all duration-500 uppercase tracking-[0.2em]"
              >
                {loading ? "Processing..." : "Submit Inquiry"}
              </Button>
            </form>
          </Form>
        </Card>
      </section>

      <footer className="py-20 border-t border-zinc-900 text-center">
        <div className="space-y-8">
          <p className="text-[#C5B358] font-libre-baskerville italic text-2xl">Daniele Buatti</p>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-gray-400 font-light tracking-widest text-sm">
            <a href="mailto:info@danielebuatti.com" className="hover:text-white transition-colors">INFO@DANIELEBUATTI.COM</a>
            <a href="tel:0424174067" className="hover:text-white transition-colors">0424 174 067</a>
          </div>
          <p className="text-zinc-600 text-xs tracking-tighter uppercase">© {new Date().getFullYear()} Melbourne, Australia</p>
        </div>
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;