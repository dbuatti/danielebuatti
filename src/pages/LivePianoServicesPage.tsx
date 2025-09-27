"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Home, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useForm } from "react-hook-form"; // Import useForm
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import * as z from "zod"; // Import zod
import { // Import form components
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema using zod
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  suburb: z.string().optional(),
  eventDescription: z.string().min(10, { message: "Please describe your event (at least 10 characters)." }).max(500, { message: "Event description must not be longer than 500 characters." }),
  pianoType: z.string().optional(),
});

const LivePianoServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [api, setApi] = useState<CarouselApi>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const galleryImages = [
    "/blacktie.avif",
    "/blacktie1.avif",
    // Removed "/blacktie2.avif",
    "/blacktie3.avif",
    "/blacktie4.avif",
    "/other.avif",
    // Removed "/426062_bc3659f68c1c4c6ca899497d7350a91f~mv2.avif",
  ];

  // Initialize react-hook-form
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
          {/* Left section: Home and Back to Services */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-livePiano-light hover:text-livePiano-primary transition-colors">
              <Home size={24} />
            </Link>
            <Button asChild className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light px-4 py-2 text-sm">
              <Link to="/">Back to Services</Link>
            </Button>
          </div>

          {/* Right section: Logo and Title */}
          <div className="flex flex-col items-end">
            <img src="/gold-36.png" alt="Daniele Buatti Logo" className="h-16 md:h-20" />
            <h1 className="text-xl md:text-2xl font-montserrat font-light uppercase text-livePiano-light tracking-widest mt-2">
              Daniele Buatti
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Large Image Display */}
        <section className="mb-8">
          <Card className="bg-livePiano-darker border-livePiano-border/30 rounded-xl overflow-hidden shadow-lg">
            <img
              src={galleryImages[selectedImageIndex]}
              alt={`Selected event image ${selectedImageIndex + 1}`}
              className="w-full h-[500px] md:h-[700px] object-cover object-center"
            />
          </Card>
        </section>

        {/* Image Carousel */}
        <section className="mb-16">
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
            <CarouselPrevious className="-left-8 hidden md:flex" />
            <CarouselNext className="-right-8 hidden md:flex" />
          </Carousel>
        </section>

        {/* Main Content */}
        <section className="text-center mb-16">
          <h2 className="text-5xl font-libre-baskerville font-bold text-livePiano-primary mb-6 leading-tight">
            AN UNFORGETTABLE MUSICAL EXPERIENCE
          </h2>
          <p className="text-xl font-libre-baskerville text-livePiano-light/90 max-w-3xl mx-auto mb-8">
            Indulge in the elegance of live piano music and elevate your wedding, corporate event, or private party to new heights with the incomparable talent of Daniele Buatti.
          </p>
          <p className="text-lg font-libre-baskerville text-livePiano-light/80 max-w-2xl mx-auto mb-8">
            Daniele's versatile, refined performance creates an unforgettable atmosphere, with a repertoire spanning classical, jazz, and pop genres. Contact Daniele today to book his services and experience the unforgettable magic of live piano music at your event.
          </p>
        </section>

        {/* Contact Form */}
        <section className="max-w-2xl mx-auto bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
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
                name="suburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light">Suburb</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Suburb"
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
                        placeholder="Describe your event, date, time, and any special requests..."
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
                name="pianoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-livePiano-light">What piano do you have at your home?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-livePiano-background border-livePiano-border/50 text-livePiano-light placeholder:text-livePiano-light/60">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-livePiano-background border-livePiano-border text-livePiano-light">
                        <SelectItem value="grand-piano">Grand Piano</SelectItem>
                        <SelectItem value="upright-piano">Upright Piano</SelectItem>
                        <SelectItem value="digital-piano">Digital Piano</SelectItem>
                        <SelectItem value="none">None (I need one provided)</SelectItem>
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
        className="relative py-16 text-center mt-12 overflow-hidden"
        style={{ backgroundImage: `url(/Piano Keys_edited_edited.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* Overlay for readability */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
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
        </div>
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;