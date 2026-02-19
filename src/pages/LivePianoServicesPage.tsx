"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Play, ArrowLeft, Music, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Navigation Overlay */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="pointer-events-auto"
        >
          <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full gap-2 backdrop-blur-sm">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </Button>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="pointer-events-auto"
        >
          <Button asChild className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full shadow-lg shadow-yellow-500/20">
            <a href="#enquire">Enquire Now</a>
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-[0.6]">
          <source src="/Daniele Buatti - Gatsby Event Gala 1.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2, ease: "easeOut" }} 
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <div className="flex items-center justify-center gap-3 mb-8 opacity-80">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs uppercase tracking-[0.4em] font-medium text-white/90">Signature Live Performance</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </div>

          <DynamicImage 
            src="/gold-36.png" 
            alt="Daniele Buatti Logo" 
            className="h-20 md:h-28 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" 
            width={112} 
            height={112} 
            href="/" 
          />
          
          <h1 className="text-5xl md:text-8xl font-light tracking-[0.15em] uppercase font-montserrat text-white mb-4">
            DANIELE <span className="font-bold text-yellow-500/90">BUATTI</span>
          </h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="origin-center mx-auto my-8 h-[1px] w-48 md:w-64 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"
          />

          <p className="text-2xl md:text-4xl font-libre-baskerville italic text-white/90 mb-6">
            Pianist & Vocalist
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Sophisticated musical curation for elegant weddings, <br className="hidden md:block" /> high-tier galas, and intimate private soirées.
          </p>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </header>

      {/* Gallery Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }} 
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-libre-baskerville text-white mb-6">Moments of Elegance</h2>
          <div className="w-20 h-[2px] bg-yellow-500/40 mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            A visual journey through prestigious performances across Australia's most iconic venues.
          </p>
        </motion.div>

        <div className="relative mb-16 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-zinc-900 aspect-video md:aspect-auto md:h-[75vh]"
            >
              {currentItem.type === "video" ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110">
                    <source src={currentItem.src} type="video/mp4" />
                  </video>
                  <video autoPlay loop muted playsInline className="relative z-10 max-w-full max-h-full object-contain shadow-2xl">
                    <source src={currentItem.src} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <img src={currentItem.src} alt="Featured performance" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        <Carousel
          opts={{ align: "center", loop: true, dragFree: true }}
          plugins={[WheelGesturesPlugin()]}
          setApi={setApi}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {galleryItems.map((item, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 h-40 border-2",
                    selectedIndex === index
                      ? "border-yellow-500/60 shadow-lg shadow-yellow-500/10"
                      : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-full">
                      <img src={item.poster || "/fallback-poster.jpg"} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20">
                          <Play className="w-6 h-6 text-white fill-white" />
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
          <CarouselPrevious className="hidden md:flex -left-16 bg-zinc-900/50 hover:bg-zinc-800 text-white border-white/10" />
          <CarouselNext className="hidden md:flex -right-16 bg-zinc-900/50 hover:bg-zinc-800 text-white border-white/10" />
        </Carousel>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto text-center space-y-20"
        >
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold font-libre-baskerville text-white leading-tight tracking-tight uppercase">
              AN UNFORGETTABLE <br /> <span className="text-yellow-500/90">MUSICAL EXPERIENCE</span>
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light max-w-3xl mx-auto">
              Elevate your event with the refined artistry of Daniele Buatti — a masterful pianist and captivating vocalist whose presence transforms any space.
            </p>
          </div>

          {/* Performance Video - REDUCED SIZE */}
          <div className="max-w-2xl mx-auto rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/5 bg-black group relative">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
            >
              <source src="/live-piano-performance.MOV" />
            </video>
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 text-left pt-12 border-t border-white/5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                <Music className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-libre-baskerville text-white">Performance Style</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Blending virtuosic piano performance with warm, sophisticated vocals, Daniele delivers a refined piano-bar experience — tailored impeccably to upscale weddings and luxury venues.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-libre-baskerville text-white">Curated Repertoire</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                From timeless jazz standards and classic soul to contemporary reimagined hits, every set is thoughtfully curated to complement the unique atmosphere of your gathering.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section id="enquire" className="py-32 px-4 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-5 gap-16 items-start"
        >
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-4xl md:text-5xl font-libre-baskerville text-white leading-tight">
              Enquire About <br /> <span className="text-yellow-500/90">Your Event</span>
            </h3>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              Daniele is available for select bookings across Australia and internationally. Please provide your event details to receive a tailored proposal.
            </p>
            
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-4 text-white/80 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-light">0424 174 067</span>
              </div>
              <div className="flex items-center gap-4 text-white/80 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-light">info@danielebuatti.com</span>
              </div>
            </div>
          </div>

          <Card className="lg:col-span-3 bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs uppercase tracking-widest">First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="First name" className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-500/50 transition-all h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs uppercase tracking-widest">Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Last name" className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-500/50 transition-all h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-widest">Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your@email.com" className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-500/50 h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs uppercase tracking-widest">Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0424 174 067" className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-500/50 h-12 rounded-xl" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="suburb" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs uppercase tracking-widest">Suburb / Area</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Toorak" className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-500/50 h-12 rounded-xl" />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="eventDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-widest">Event Details</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="Event type, date, venue, and any special requests..." className="bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-500/50 resize-none rounded-xl" />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="pianoType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-widest">Instrument Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/40 border-white/10 text-white h-12 rounded-xl focus:ring-yellow-500/50">
                          <SelectValue placeholder="Is there a piano at the venue?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border border-white/10 text-white rounded-xl">
                        <SelectItem value="grand-piano">Grand Piano</SelectItem>
                        <SelectItem value="upright-piano">Upright Piano</SelectItem>
                        <SelectItem value="digital-piano">Digital Piano / Keyboard</SelectItem>
                        <SelectItem value="none">None – please provide</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg py-7 rounded-xl shadow-xl shadow-yellow-500/10 transition-all duration-300 mt-4"
                >
                  {loading ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>
            </Form>
          </Card>
        </motion.div>
      </section>

      <footer className="relative pt-24 pb-16 text-center border-t border-white/5">
        <div className="relative z-10 space-y-10">
          <DynamicImage src="/gold-36.png" alt="Logo" className="h-16 mx-auto opacity-60" width={64} height={64} />
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-white/60 font-light">
            <a href="https://wa.me/61424174067" className="hover:text-yellow-500 transition-colors flex items-center gap-2">
              <Phone size={18} /> 0424 174 067
            </a>
            <a href="mailto:info@danielebuatti.com" className="hover:text-yellow-500 transition-colors flex items-center gap-2">
              <Mail size={18} /> info@danielebuatti.com
            </a>
          </div>
          <p className="text-zinc-600 text-xs uppercase tracking-[0.3em]">© {new Date().getFullYear()} Daniele Buatti. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;