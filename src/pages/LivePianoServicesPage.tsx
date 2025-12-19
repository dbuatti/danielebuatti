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
          <h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase font-montserrat text-gold-400">Daniele Buatti</h1>
          <p className="text-2xl md:text-4xl mt-6 font-libre-baskerville italic text-gold-300">Pianist & Vocalist</p>
          <p className="text-lg md:text-xl mt-4 text-gray-300 max-w-2xl mx-auto">Sophisticated live music for discerning events</p>
        </motion.div>
      </header>

      {/* Contact Form Section */}
      <section id="enquire" className="py-32 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <h3 className="text-4xl md:text-5xl font-libre-baskerville text-center text-gold-400 mb-12 uppercase tracking-wide">Enquire About Your Event</h3>
          <Card className="bg-zinc-950/90 border border-gold-800/30 backdrop-blur-xl shadow-2xl rounded-2xl p-10 md:p-16">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-8">
                
                {/* First and Last Name */}
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300 text-lg">First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your first name" className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-600 focus:border-gold-500 transition-colors h-14 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300 text-lg">Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your last name" className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-600 focus:border-gold-500 transition-colors h-14 text-lg" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )} />
                </div>

                {/* Email */}
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-300 text-lg">Email Address *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your@email.com" className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-600 focus:border-gold-500 h-14 text-lg" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                {/* Phone and Suburb */}
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300 text-lg">Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0400 000 000" className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-600 focus:border-gold-500 h-14 text-lg" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="suburb" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold-300 text-lg">Event Suburb / Area</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Toorak, Melbourne" className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-600 focus:border-gold-500 h-14 text-lg" />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                {/* Event Description */}
                <FormField control={form.control} name="eventDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-300 text-lg">Tell us about your event *</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} placeholder="Event type, expected date, specific songs..." className="bg-black/50 border-gold-700/50 text-white placeholder:text-gray-600 focus:border-gold-500 resize-none text-lg p-4" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                {/* Piano Type Select */}
                <FormField control={form.control} name="pianoType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-300 text-lg">Is there an instrument available at the venue? *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/50 border-gold-700/50 text-white h-14 text-lg focus:ring-gold-500">
                          <SelectValue placeholder="Click to select an option..." className="text-gray-400" />
                        </SelectTrigger>
                      </FormControl>
                      {/* Fixed Dropdown Styling */}
                      <SelectContent className="bg-zinc-900 border border-gold-800 text-white">
                        <SelectItem value="grand-piano" className="text-white hover:bg-gold-500 focus:bg-gold-500 focus:text-black cursor-pointer py-4 text-lg">Grand Piano</SelectItem>
                        <SelectItem value="upright-piano" className="text-white hover:bg-gold-500 focus:bg-gold-500 focus:text-black cursor-pointer py-4 text-lg">Upright Piano</SelectItem>
                        <SelectItem value="digital-piano" className="text-white hover:bg-gold-500 focus:bg-gold-500 focus:text-black cursor-pointer py-4 text-lg">Digital Piano / Keyboard</SelectItem>
                        <SelectItem value="none" className="text-white hover:bg-gold-500 focus:bg-gold-500 focus:text-black cursor-pointer py-4 text-lg">None – please provide</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )} />

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-bold text-xl py-10 rounded-full shadow-2xl shadow-yellow-500/30 transition-all duration-300"
                >
                  {loading ? "Sending Inquiry..." : "Submit Inquiry"}
                </Button>
              </form>
            </Form>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 brightness-50 scale-110" style={{ backgroundImage: `url(/bowtie.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="relative z-10 space-y-12">
          <DynamicImage src="/gold-36.png" alt="Logo" className="h-20 mx-auto opacity-90" width={80} height={80} />
          <div className="space-y-6 text-2xl md:text-3xl font-light">
            <a href="https://wa.me/61424174067" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 hover:text-gold-400 transition-colors underline-offset-8 hover:underline text-white">
              <Phone size={32} className="text-gold-400" /> 0424 174 067
            </a>
            <a href="mailto:info@danielebuatti.com" className="flex items-center justify-center gap-4 hover:text-gold-400 transition-colors underline-offset-8 hover:underline text-white">
              <Mail size={32} className="text-gold-400" /> info@danielebuatti.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;