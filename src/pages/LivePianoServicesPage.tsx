"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
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

// Define the form schema using zod
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  venueName: z.string().min(1, { message: "Venue name is required." }),
  guestCount: z.string().optional(),
  eventDate: z.string().min(1, { message: "Event date is required." }),
  eventDescription: z.string().min(10, { message: "Please describe your event (at least 10 characters)." }).max(500, { message: "Event description must not be longer than 500 characters." }),
  howDidYouHear: z.string().optional(),
});

const LivePianoServicesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [api, setApi] = useState<CarouselApi>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const galleryImages = [
    "/blacktie.avif",
    "/blacktie1.avif",
    "/blacktie3.avif",
    "/blacktie4.avif",
    "/other.avif",
  ];

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      venueName: '',
      guestCount: '',
      eventDate: new Date().toISOString().split('T')[0],
      eventDescription: '',
      howDidYouHear: '',
    },
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    setSelectedImageIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setSelectedImageIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const handleContactSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const loadingToastId = toast.loading("Sending your inquiry...");

    const { firstName, lastName, email, phone, venueName, guestCount, eventDate, eventDescription, howDidYouHear } = values;

    const messageContent = `
      Event Date: ${eventDate}
      Venue Name: ${venueName}
      Estimated Guest Count: ${guestCount || 'Not specified'}
      Event Description: ${eventDescription}
      Phone: ${phone || 'Not provided'}
      How did you hear about Daniele: ${howDidYouHear || 'Not specified'}
    `;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: `${firstName} ${lastName}`,
            email: email,
            message: messageContent,
          },
        ]);

      if (error) {
        throw error;
      }

      toast.success('Inquiry sent successfully! Daniele will be in touch soon.', { id: loadingToastId });
      form.reset(); // Reset the form after successful submission
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send inquiry. Please try again.', { id: loadingToastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light">
      {/* Header */}
      <header className="bg-livePiano-darker py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left section: Back to Home */}
          <div className="flex items-center gap-4">
            <Button asChild className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light px-4 py-2 text-sm">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>

          {/* Right section: Logo and Title */}
          <div className="flex flex-col items-end">
            <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-16 md:h-20" width={80} height={80} />
            <h1 className="text-xl md:text-2xl font-montserrat font-light uppercase text-livePiano-light tracking-widest mt-2">
              Daniele Buatti
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
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

        {/* NGV Proof Section */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
          <h3 className="text-3xl font-bold text-livePiano-light mb-6 text-center">Recent Performances</h3>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-livePiano-primary" />
              <span className="text-lg font-semibold">The National Gallery of Victoria</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-livePiano-primary" />
              <span className="text-lg font-semibold">The Victorian Pride Centre</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-livePiano-primary" />
              <span className="text-lg font-semibold">Private Estates</span>
            </div>
          </div>
        </section>

        {/* Large Image Display */}
        <section className="py-0">
          <Card className="bg-livePiano-darker border-livePiano-border/30 rounded-xl overflow-hidden shadow-lg">
            <img
              src={galleryImages[selectedImageIndex]}
              alt={`Selected event image ${selectedImageIndex + 1}`}
              className="w-full h-[500px] md:h-[700px] object-cover object-center"
            />
          </Card>
        </section>

        {/* Image Carousel */}
        <section className="py-0">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            setApi={setApi}
            className="w-full"
          >
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

        {/* The Wedding Experience Section */}
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

        {/* Tech Rider Section */}
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

        {/* Repertoire Section */}
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

        {/* Contact Form */}
        <section className="max-w-2xl mx-auto bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 py-0">
          <h3 className="text-4xl font-bold text-center text-livePiano-light mb-8">Enquire now!</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-livePiano-light">First Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your First Name"
                          {...field}
                          className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-livePiano-light">Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Last Name"
                          {...field}
                          className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light">Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light">Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Your Phone Number"
                        {...field}
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light">Venue Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Venue Name"
                        {...field}
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light">Estimated Guest Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of Guests"
                        {...field}
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light">Event Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light">Tell us about your event *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your event, time, and any special requests..."
                        {...field}
                        rows={5}
                        className="bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60"
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
                  <FormItem>
                    <FormLabel className="text-livePiano-light">How did you hear about Daniele?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-50 bg-livePiano-darker border-livePiano-border">
                        <SelectItem value="referral" className="text-livePiano-light focus:bg-livePiano-primary focus:text-livePiano-light data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker">Referral</SelectItem>
                        <SelectItem value="social-media" className="text-livePiano-light focus:bg-livePiano-primary focus:text-livePiano-light data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker">Social Media</SelectItem>
                        <SelectItem value="website" className="text-livePiano-light focus:bg-livePiano-primary focus:text-livePiano-light data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker">Website</SelectItem>
                        <SelectItem value="other" className="text-livePiano-light focus:bg-livePiano-primary focus:text-livePiano-light data-[state=checked]:bg-livePiano-primary data-[state=checked]:text-livePiano-darker">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light text-lg py-3 rounded-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </Form>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative py-16 text-center overflow-hidden"
        style={{ backgroundImage: `url(/bowtie.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <a
              href="https://instagram.com/daniele.buatti"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-livePiano-light hover:text-livePiano-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="text-lg font-semibold">@daniele.buatti</span>
            </a>
          </div>

          <p className="text-livePiano-light text-2xl font-semibold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <a
              href="https://wa.me/61424174067"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-livePiano-primary transition-colors"
            >
              <Phone size={24} /> 0424 174 067
            </a>
            <a
              href="mailto:info@danielebuatti.com"
              className="flex items-center gap-2 hover:text-livePiano-primary transition-colors"
            >
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