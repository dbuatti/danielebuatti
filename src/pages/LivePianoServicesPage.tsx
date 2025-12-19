"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Mail, Phone, Instagram, Music, Star, Calendar, Users, MapPin, Mic, Heart, Utensils, Wine } from 'lucide-react';
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

// Refined high-tier schema
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(8, { message: "Phone number is required for consultation." }),
  venueName: z.string().min(1, { message: "Venue name is required." }),
  guestCount: z.string().optional(),
  eventDate: z.string().min(1, { message: "Wedding date is required." }),
  performanceType: z.string().min(1, { message: "Please select a performance type." }),
  eventVision: z.string().min(10, { message: "Please tell us a bit about the atmosphere you are creating." }).max(1000),
  pianoRequirement: z.enum(["on-site", "provided"], { required_error: "Please select a piano requirement." }),
  howDidYouHear: z.string().optional(),
});

const LivePianoServicesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const galleryImages = [
    "/blacktie.avif",
    "/blacktie1.avif",
    "/blacktie3.avif",
    "/blacktie4.avif",
    "/other.avif",
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      venueName: '',
      guestCount: '',
      eventDate: '',
      performanceType: '',
      eventVision: '',
      pianoRequirement: "on-site",
      howDidYouHear: '',
    },
  });

  useEffect(() => {
    if (!api) return;
    setSelectedImageIndex(api.selectedScrollSnap());
    api.on("select", () => setSelectedImageIndex(api.selectedScrollSnap()));
  }, [api]);

  const handleContactSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const loadingToastId = toast.loading("Processing your request...");

    const messageContent = `
      --- WEDDING CONSULTATION REQUEST ---
      Wedding Date: ${values.eventDate}
      Venue: ${values.venueName}
      Guest Count: ${values.guestCount || 'Not specified'}
      Performance Type: ${values.performanceType}
      Piano Requirement: ${values.pianoRequirement === 'on-site' ? 'Venue has tuned grand' : 'Daniele to provide digital baby grand'}
      Vision/Atmosphere: ${values.eventVision}
      Referral: ${values.howDidYouHear || 'Not specified'}
      Phone: ${values.phone}
    `;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          message: messageContent,
        }]);

      if (error) throw error;

      toast.success('Consultation request sent!', { id: loadingToastId });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send request. Please try again.', { id: loadingToastId });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-livePiano-darker p-12 rounded-xl shadow-2xl border border-livePiano-border/30 text-center space-y-8">
          <Heart className="h-16 w-16 text-livePiano-primary mx-auto animate-pulse" />
          <h2 className="text-4xl font-libre-baskerville font-bold text-livePiano-primary">Thank You</h2>
          <p className="text-xl leading-relaxed opacity-90">
            I personally review every enquiry to ensure my performance style aligns with your vision. 
            Expect a personal response within 24 hours.
          </p>
          <div className="pt-6">
            <Button asChild className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-darker font-bold px-8 py-6 rounded-full text-lg">
              <a href="/Wedding-Portfolio-Placeholder.pdf" target="_blank">Download Wedding Portfolio PDF</a>
            </Button>
          </div>
          <p className="text-sm opacity-60">
            <Link to="/" className="hover:text-livePiano-primary underline underline-offset-4">Return to Home</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light">
      <header className="bg-livePiano-darker py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-livePiano-light hover:text-livePiano-primary hover:bg-transparent px-0">
              <Link to="/"><span className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> Back to Home</span></Link>
            </Button>
          </div>
          <div className="flex flex-col items-end">
            <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-16 md:h-20" width={80} height={80} />
            <h1 className="text-xl md:text-2xl font-montserrat font-light uppercase text-livePiano-light tracking-widest mt-2">
              Daniele Buatti
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <section className="text-center py-0">
          <h1 className="text-5xl md:text-6xl font-libre-baskerville font-bold text-livePiano-primary mb-6 leading-tight">
            Daniele Buatti
          </h1>
          <h2 className="text-3xl md:text-4xl font-libre-baskerville text-livePiano-light mb-8">
            Concert Piano & Vocals for Distinguished Weddings
          </h2>
          <p className="text-xl text-livePiano-light/90 max-w-3xl mx-auto mb-8">
            Elevate your wedding with the incomparable talent of Daniele Buatti. His versatile, refined performance creates an unforgettable atmosphere, with a repertoire spanning classical, jazz, and pop genres.
          </p>
        </section>

        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center">Recent Performances</h3>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-livePiano-primary" />
              <span className="text-lg font-semibold">The National Gallery of Victoria</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-livePiano-primary" />
              <span className="text-lg font-semibold">Private Estates</span>
            </div>
          </div>
        </section>

        <section className="py-0">
          <Card className="bg-livePiano-darker border-livePiano-border/30 rounded-xl overflow-hidden shadow-lg">
            <img
              src={galleryImages[selectedImageIndex]}
              alt={`Selected event image ${selectedImageIndex + 1}`}
              className="w-full h-[500px] md:h-[700px] object-cover object-center"
            />
          </Card>
        </section>

        <section className="py-0">
          <Carousel opts={{ align: "start", loop: true, dragFree: true }} setApi={setApi} className="w-full">
            <CarouselContent className="-ml-4">
              {galleryImages.map((imageSrc, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card
                    className={cn(
                      "bg-livePiano-darker border-livePiano-border/30 rounded-xl overflow-hidden shadow-lg cursor-pointer",
                      selectedImageIndex === index ? "border-4 border-livePiano-primary" : ""
                    )}
                    onClick={() => api?.scrollTo(index)}
                  >
                    <img src={imageSrc} alt={`Event ${index + 1}`} className="w-full h-48 object-cover" />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-8 flex" />
            <CarouselNext className="-right-8 flex" />
          </Carousel>
        </section>

        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-4xl font-bold text-livePiano-primary text-center">The Wedding Experience</h3>
          <p className="text-xl text-livePiano-light/90 text-center">
            A seamless, stress-free musical experience for your special day.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-livePiano-primary mb-4" />
              <h4 className="text-xl font-semibold text-livePiano-light mb-2">Initial Consultation</h4>
              <p className="text-livePiano-light/80">Select your perfect aisle song and discuss your musical vision.</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-livePiano-primary mb-4" />
              <h4 className="text-xl font-semibold text-livePiano-light mb-2">Venue Coordination</h4>
              <p className="text-livePiano-light/80">Seamless coordination with your venue manager for perfect setup.</p>
            </div>
            <div className="flex flex-col items-center">
              <Music className="h-12 w-12 text-livePiano-primary mb-4" />
              <h4 className="text-xl font-semibold text-livePiano-light mb-2">Seamless Performance</h4>
              <p className="text-livePiano-light/80">Professional setup and performance without any stress.</p>
            </div>
          </div>
        </section>

        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-3xl font-bold text-livePiano-primary text-center">Acoustic Excellence</h3>
          <p className="text-xl text-livePiano-light/90 text-center">
            Performed on premium instruments using high-end equipment for studio-grade sound in any ballroom.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-livePiano-light mb-4">Premium Instruments</h4>
              <p className="text-livePiano-light/80">Grand pianos and high-quality digital instruments for the perfect sound.</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-livePiano-light mb-4">Professional Audio</h4>
              <p className="text-livePiano-light/80">High-end microphones and sound systems for crystal-clear audio.</p>
            </div>
          </div>
        </section>

        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 space-y-6">
          <h3 className="text-3xl font-bold text-livePiano-primary text-center">Curation List</h3>
          <p className="text-xl text-livePiano-light/90 text-center">
            Download our curated repertoire list grouped by atmosphere.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="text-xl font-semibold text-livePiano-light mb-2 flex items-center justify-center gap-2">
                <Mic className="h-6 w-6" /> The Ceremony
              </h4>
              <p className="text-livePiano-light/80">Classical and contemporary pieces for your special moments.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-livePiano-light mb-2 flex items-center justify-center gap-2">
                <Wine className="h-6 w-6" /> The Cocktail Hour
              </h4>
              <p className="text-livePiano-light/80">Jazz and soul standards to set the perfect mood.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-livePiano-light mb-2 flex items-center justify-center gap-2">
                <Utensils className="h-6 w-6" /> The Dinner
              </h4>
              <p className="text-livePiano-light/80">Sophisticated pop and contemporary pieces for your celebration.</p>
            </div>
          </div>
          <div className="text-center pt-6">
            <Button asChild className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light">
              <Link to="/repertoire">
                <Music className="h-4 w-4 mr-2" /> View Full Repertoire
              </Link>
            </Button>
          </div>
        </section>

        <section className="max-w-3xl mx-auto bg-livePiano-darker p-8 md:p-12 rounded-xl shadow-2xl border border-livePiano-border/30">
          <div className="text-center mb-10 space-y-2">
            <h3 className="text-4xl font-libre-baskerville font-bold text-livePiano-primary">Request a Consultation</h3>
            <p className="text-livePiano-light/70 italic text-lg">Check Availability for Your Date</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Wedding Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="venueName"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Venue Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. The National Gallery of Victoria" {...field} className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your First Name" {...field} className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Last Name" {...field} className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Phone Number *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Your Phone Number" {...field} className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="performanceType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Type of Performance *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-livePiano-darker border-livePiano-border">
                          <SelectItem value="ceremony">Ceremony Only</SelectItem>
                          <SelectItem value="cocktail">Cocktail Hour Only</SelectItem>
                          <SelectItem value="reception">Dinner & Reception</SelectItem>
                          <SelectItem value="full-experience">Full Wedding Experience</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guestCount"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Estimated Guest Count</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number of Guests" {...field} className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pianoRequirement"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Piano Requirements</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-livePiano-border/50 rounded-lg cursor-pointer hover:border-livePiano-primary transition-colors">
                          <FormControl>
                            <RadioGroupItem value="on-site" className="border-livePiano-primary text-livePiano-primary" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-livePiano-light/90">
                            My venue has a tuned grand piano on-site.
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-livePiano-border/50 rounded-lg cursor-pointer hover:border-livePiano-primary transition-colors">
                          <FormControl>
                            <RadioGroupItem value="provided" className="border-livePiano-primary text-livePiano-primary" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-livePiano-light/90">
                            I require Daniele to provide a premium digital baby grand setup.
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventVision"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">Performance Vision</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about the atmosphere you are creating (e.g. Black tie, NGV-style, Intimate Garden Party)..."
                        {...field}
                        rows={5}
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light px-6 py-4 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="howDidYouHear"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-livePiano-light uppercase tracking-wider text-xs font-bold">How did you hear about Daniele?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light h-14 px-6">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-livePiano-darker border-livePiano-border">
                        <SelectItem value="referral">Word of Mouth / Colleague</SelectItem>
                        <SelectItem value="performance">Attended a Previous Performance (NGV, etc.)</SelectItem>
                        <SelectItem value="venue">Venue Recommendation</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full bg-brand-champagne hover:bg-brand-champagne/90 text-livePiano-darker font-bold text-xl py-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.01]" disabled={loading}>
                {loading ? 'Processing...' : 'Send Consultation Request'}
              </Button>
            </form>
          </Form>
        </section>
      </main>

      <footer className="relative py-16 text-center overflow-hidden" style={{ backgroundImage: `url(/bowtie.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <a href="https://instagram.com/daniele.buatti" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-livePiano-light hover:text-livePiano-primary transition-colors">
              <Instagram className="h-6 w-6" />
              <span className="text-lg font-semibold">@daniele.buatti</span>
            </a>
          </div>
          <p className="text-livePiano-light text-2xl font-semibold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <a href="https://wa.me/61424174067" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-livePiano-primary transition-colors">
              <Phone size={24} /> 0424 174 067
            </a>
            <a href="mailto:info@danielebuatti.com" className="flex items-center gap-2 hover:text-livePiano-primary transition-colors">
              <Mail size={24} /> info@danielebuatti.com
            </a>
          </p>
          <p className="text-livePiano-light/80 text-sm">
            &copy; {new Date().getFullYear()} Daniele Buatti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;