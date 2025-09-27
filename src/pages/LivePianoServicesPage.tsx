"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Home, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

const LivePianoServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    suburb: '',
    eventDescription: '',
    pianoType: '',
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { firstName, lastName, email, phone, suburb, eventDescription, pianoType } = formData;

    if (!firstName || !lastName || !email || !eventDescription) {
      toast.error("Please fill in all required fields (First Name, Last Name, Email, Event Description).");
      setLoading(false);
      return;
    }

    const messageContent = `
      Event Description: ${eventDescription}
      Piano Type: ${pianoType || 'Not specified'}
      Phone: ${phone || 'Not provided'}
      Suburb: ${suburb || 'Not provided'}
    `;

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: `${firstName} ${lastName}`,
          email: email,
          message: messageContent,
        },
      ]);

    if (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } else {
      toast.success('Inquiry sent successfully! Daniele will be in touch soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        suburb: '',
        eventDescription: '',
        pianoType: '',
      });
    }
    setLoading(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for newsletter submission logic
    if (newsletterEmail) {
      toast.success(`Subscribed ${newsletterEmail} to newsletter! (Placeholder)`);
      setNewsletterEmail('');
    } else {
      toast.error("Please enter your email for the newsletter.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light">
      {/* Header */}
      <header className="bg-brand-dark-alt py-4 px-6 md:px-12 border-b border-brand-secondary/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <form onSubmit={handleNewsletterSubmit} className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-brand-light/80">Join my Newsletter</span>
              <Input
                type="text"
                placeholder="Enter first name"
                className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60 w-32"
              />
              <Input
                type="text"
                placeholder="Enter last name"
                className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60 w-32"
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60 w-32"
                required
              />
              <Button type="submit" size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
                Subscribe
              </Button>
            </form>
          </div>
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light px-6 py-2">
            <Link to="/">Back to Services</Link>
          </Button>
        </div>
        {/* Main Header */}
        <div className="max-w-7xl mx-auto flex items-center justify-between mt-4">
          <Link to="/" className="text-brand-light hover:text-brand-primary transition-colors">
            <Home size={24} />
          </Link>
          <div className="flex flex-col items-center">
            <img src="/daniele-buatti-logo.png" alt="Daniele Buatti Logo" className="h-16 md:h-20" />
            <h1 className="text-xl md:text-2xl font-bold text-brand-light tracking-widest mt-2">DANIELE BUATTI</h1>
          </div>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Video Section */}
        <section className="mb-16">
          <div className="relative w-full h-[400px] md:h-[600px] bg-gray-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Placeholder for video */}
            <img
              src="/blacktie.avif" // Using the same image as a placeholder for the video
              alt="Daniele Buatti playing piano"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button variant="ghost" className="text-white text-6xl opacity-80 hover:opacity-100 transition-opacity">
                ▶
              </Button>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-brand-dark-alt border-brand-secondary/30 rounded-xl overflow-hidden shadow-lg">
              <img src="/gallery-img-1.jpeg" alt="Event 1" className="w-full h-48 object-cover" />
            </Card>
            <Card className="bg-brand-dark-alt border-brand-secondary/30 rounded-xl overflow-hidden shadow-lg">
              <img src="/gallery-img-2.jpeg" alt="Event 2" className="w-full h-48 object-cover" />
            </Card>
            <Card className="bg-brand-dark-alt border-brand-secondary/30 rounded-xl overflow-hidden shadow-lg">
              <img src="/gallery-img-3.jpeg" alt="Event 3" className="w-full h-48 object-cover" />
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <section className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-brand-primary mb-6 leading-tight">
            AN UNFORGETTABLE MUSICAL EXPERIENCE
          </h2>
          <p className="text-xl text-brand-light/90 max-w-3xl mx-auto mb-8">
            Indulge in the elegance of live piano music and elevate your wedding, corporate event, or private party to new heights with the incomparable talent of Daniele Buatti. Daniele's versatile, refined performance creates an unforgettable atmosphere, with a repertoire spanning classical, jazz, and pop genres.
          </p>
          <p className="text-lg text-brand-light/80 max-w-2xl mx-auto mb-8">
            CONTACT DANIELE TODAY TO BOOK HIS SERVICES AND EXPERIENCE THE UNFORGETTABLE MAGIC OF LIVE PIANO MUSIC AT YOUR EVENT.
          </p>
          <div className="space-y-2 text-lg">
            <p>Media as link <a href="#" className="text-brand-primary hover:underline">here</a></p>
            <p>Blue Velvet Style <a href="#" className="text-brand-primary hover:underline">here</a></p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-2xl mx-auto bg-brand-dark-alt p-8 rounded-xl shadow-2xl border border-brand-secondary/30">
          <h3 className="text-4xl font-bold text-center text-brand-light mb-8">Enquire now!</h3>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60"
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60"
                required
              />
            </div>
            <Input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60"
              required
            />
            <Input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60"
            />
            <Input
              type="text"
              name="suburb"
              placeholder="Suburb"
              value={formData.suburb}
              onChange={handleChange}
              className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60"
            />
            <Textarea
              name="eventDescription"
              placeholder="Tell us about your event"
              value={formData.eventDescription}
              onChange={handleChange}
              rows={5}
              className="bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60"
              required
            />
            <Select onValueChange={(value) => handleSelectChange('pianoType', value)} value={formData.pianoType}>
              <SelectTrigger className="w-full bg-brand-dark border-brand-secondary/50 text-brand-light placeholder:text-brand-light/60">
                <SelectValue placeholder="What piano do you have at your home?" />
              </SelectTrigger>
              <SelectContent className="bg-brand-dark border-brand-secondary text-brand-light">
                <SelectItem value="grand-piano">Grand Piano</SelectItem>
                <SelectItem value="upright-piano">Upright Piano</SelectItem>
                <SelectItem value="digital-piano">Digital Piano</SelectItem>
                <SelectItem value="none">None (I need one provided)</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" size="lg" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg py-3 rounded-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark-alt py-8 text-center border-t border-brand-secondary/20 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <img src="/bowtie-logo.png" alt="Bowtie Logo" className="h-12 mx-auto mb-4" />
          <p className="text-brand-light/80 text-lg flex items-center justify-center gap-4">
            <Phone size={18} /> 0424 174 067
            <Mail size={18} /> info@danielebuatti.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LivePianoServicesPage;