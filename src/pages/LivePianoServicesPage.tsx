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
  phone: z.string().optional(),
  suburb: z.string().optional(),
  eventDescription: z.string().min(10, { message: "Please describe your event (at least 10 characters)." }).max(500, { message: "Description too long." }),
  pianoType: z.string().min(1, { message: "Please select an instrument option." }),
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
    
    const messageBody = `
      Event Description: ${values.eventDescription}
      Piano Type: ${values.pianoType}
      Phone: ${values.phone || 'Not provided'}
      Suburb: ${values.suburb || 'Not provided'}
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
      {/* Hero Section */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-75">
          <source src="/Daniele Buatti - Gatsby Event Gala 1.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="relative z-10 text-center px-6">
          <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-24 md:h-32 mx-auto mb-6 drop-shadow-2xl" width={128} height={128} />
          <h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase font-montserrat text-white">
            DANIELE BUATTI
          </h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="origin-center mx-auto my-6 h-[2px] w-32 md:w-48 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_20px_rgba(234,179,8,0.45)]"
          />

          <p className="text-2xl md:text-4xl font-libre-baskerville italic text-white">
            Pianist & Vocalist
          </p>
          <p className="text-lg md:text-xl mt-4 text-gray-300 max-w-2xl mx-auto">Live piano and vocals for elegant, considered events</p>
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
          <h2 className="text-5xl md:text-6xl font-libre-baskerville text-white mb-6">Moments of Elegance</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Captured performances at prestigious weddings, galas, and private events across Australia
          </p>
        </motion.div>

        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl bg-black"
        >
          {currentItem.type === "video" ? (
            <>
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover blur-3xl scale-150 opacity-60">
                <source src={currentItem.src} type="video/mp4" />
              </video>
              <div className="relative flex items-center justify-center w-full h-[60vh] md:h-[80vh]">
                <video autoPlay loop muted playsInline className="max-w-full max-h-full object-contain">
                  <source src={currentItem.src} type="video/mp4" />
                </video>
              </div>
            </>
          ) : (
            <img src={currentItem.src} alt="Featured performance" className="w-full h-[60vh] md:h-[80vh] object-cover" />
          )}
        </motion.div>

        <Carousel
          opts={{ align: "center", loop: true, dragFree: true }}
          plugins={[WheelGesturesPlugin()]}
          setApi={setApi}
          className="w-full max-w-6xl mx-auto"
        >
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
                      ? "ring-4 ring-yellow-500 shadow-2xl shadow-yellow-500/30"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-full">
                      <img src={item.poster || "/fallback-poster.jpg"} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/60 rounded-full p-5 backdrop-blur-md">
                          <Play className="w-12 h-12 text-white" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={item.src} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  )}
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-black/50 hover:bg-white/10 text-white border-white/20" />
          <CarouselNext className="hidden md:flex -right-12 bg-black/50 hover:bg-white/10 text-white border-white/20" />
        </Carousel>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-black to-zinc-950">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto text-center space-y-16"
        >
          <div>
            <h2 className="text-5xl md:text-7xl font-bold font-libre-baskerville text-white mb-10 leading-tight tracking-tight">
              An Unforgettable Musical Experience
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-white/90 mb-8 font-light max-w-4xl mx-auto">
              Elevate your wedding, gala, corporate function, or intimate private soirée with the refined artistry of Daniele Buatti — a masterful pianist and captivating vocalist.
            </p>
          </div>
          <div className="pt-12 border-t border-white/10">
            <h3 className="text-3xl md:text-4xl font-libre-baskerville text-white mb-8">
              Performance Style
            </h3>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto">
              Blending virtuoso piano performance with warm, sophisticated vocals, Daniele delivers a high-class piano bar experience... tailored impeccably to upscale weddings, luxury venues, and high-brow gatherings.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section id="enquire" className="py-32 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <h3 className="text-4xl md:text-5xl font-libre-baskerville text-center text-white mb-12">
            Enquire About Your Event
          </h3>
          <Card className="bg-zinc-950/90 border border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 md:p-16">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-8 text-white">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="First name" className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-white/50 transition-colors h-12 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Last name" className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-white/50 transition-colors h-12 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email Address *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your@email.com" className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-white/50 h-12 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <div className="grid md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0424 174 067" className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-white/50 h-12 text-lg" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="suburb" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Suburb / Area</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Toorak" className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-white/50 h-12 text-lg" />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="eventDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tell us about your event *</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={6} placeholder="Event type, date, venue..." className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-white/50 resize-none text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="pianoType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Is there an instrument available at the venue? *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 text-lg focus:ring-white/50">
                          <SelectValue placeholder="Please select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border border-white/10 text-white">
                        <SelectItem value="grand-piano" className="text-white hover:bg-white/10 cursor-pointer py-3 transition-colors">Grand Piano</SelectItem>
                        <SelectItem value="upright-piano" className="text-white hover:bg-white/10 cursor-pointer py-3 transition-colors">Upright Piano</SelectItem>
                        <SelectItem value="digital-piano" className="text-white hover:bg-white/10 cursor-pointer py-3 transition-colors">Digital Piano / Keyboard</SelectItem>
                        <SelectItem value="none" className="text-white hover:bg-white/10 cursor-pointer py-3 transition-colors">None – please provide</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-gray-200 font-semibold text-xl py-8 rounded-full shadow-2xl transition-all duration-300"
                >
                  {loading ? "Sending Inquiry..." : "Send Your Inquiry"}
                </Button>
              </form>
            </Form>
          </Card>
        </motion.div>
      </section>

      <footer className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 brightness-50 scale-110" style={{ backgroundImage: `url(/bowtie.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="relative z-10 space-y-12">
          <DynamicImage src="/gold-36.png" alt="Logo" className="h-20 mx-auto opacity-90" width={80} height={80} />
          <div className="space-y-6 text-2xl md:text-3xl font-light">
            <a href="https://wa.me/61424174067" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 hover:text-white transition-colors underline-offset-8 hover:underline">
              <Phone size={32} className="text-white" /> 0424 174 067
            </a>
            <a href="mailto:info@danielebuatti.com" className="flex items-center justify-center gap-4 hover:text-white transition-colors underline-offset-8 hover:underline">
              <Mail size={32} className="text-white" /> info@danielebuatti.com
            </a>
          </div>
          <p className="text-gray-400 text-lg">© {new Date().getFullYear()} Daniele Buatti. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;