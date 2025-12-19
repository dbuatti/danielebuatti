"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { ArrowLeft, Download, Mic, Wine, Utensils } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RepertoirePage: React.FC = () => {
  return (
    <div className="live-piano-theme min-h-screen bg-livePiano-background text-livePiano-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center py-0">
          <h1 className="text-5xl md:text-6xl font-libre-baskerville font-bold text-livePiano-primary mb-6 leading-tight">
            Curation List
          </h1>
          <h2 className="text-3xl md:text-4xl font-libre-baskerville text-livePiano-light mb-8">
            Download our curated repertoire list grouped by atmosphere
          </h2>
          <p className="text-xl text-livePiano-light/90 max-w-3xl mx-auto mb-8">
            Explore our carefully curated selection of music, organized by the perfect atmosphere for each moment of your special day.
          </p>
        </section>

        {/* Atmosphere Sections */}
        <section className="space-y-12">
          {/* The Ceremony */}
          <div className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
              <div className="md:w-1/3">
                <DynamicImage
                  src="/blacktie.avif"
                  alt="Elegant ceremony setting"
                  className="w-full h-64 object-cover rounded-lg shadow-lg border border-livePiano-border/50"
                  width={400}
                  height={256}
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-3xl font-bold text-livePiano-primary mb-4 flex items-center gap-2">
                  <Mic className="h-8 w-8" />
                  The Ceremony
                </h3>
                <p className="text-livePiano-light/90 mb-4">
                  Classical and contemporary pieces for your special moments.
                </p>
                <p className="text-livePiano-light/80">
                  From the processional to the recessional, these timeless pieces create the perfect atmosphere for your wedding ceremony.
                </p>
              </div>
            </div>
            <div className="text-center">
              <Button className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light">
                <Download className="h-4 w-4 mr-2" /> Download Ceremony List
              </Button>
            </div>
          </div>

          {/* The Cocktail Hour */}
          <div className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
              <div className="md:w-2/3 md:order-1">
                <h3 className="text-3xl font-bold text-livePiano-primary mb-4 flex items-center gap-2">
                  <Wine className="h-8 w-8" />
                  The Cocktail Hour
                </h3>
                <p className="text-livePiano-light/90 mb-4">
                  Jazz and soul standards to set the perfect mood.
                </p>
                <p className="text-livePiano-light/80">
                  As your guests mingle and enjoy cocktails, these sophisticated pieces create an elegant and relaxed atmosphere.
                </p>
              </div>
              <div className="md:w-1/3 md:order-2">
                <DynamicImage
                  src="/blacktie1.avif"
                  alt="Cocktail hour setting"
                  className="w-full h-64 object-cover rounded-lg shadow-lg border border-livePiano-border/50"
                  width={400}
                  height={256}
                />
              </div>
            </div>
            <div className="text-center">
              <Button className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light">
                <Download className="h-4 w-4 mr-2" /> Download Cocktail Hour List
              </Button>
            </div>
          </div>

          {/* The Dinner */}
          <div className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
              <div className="md:w-1/3">
                <DynamicImage
                  src="/blacktie3.avif"
                  alt="Elegant dinner setting"
                  className="w-full h-64 object-cover rounded-lg shadow-lg border border-livePiano-border/50"
                  width={400}
                  height={256}
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-3xl font-bold text-livePiano-primary mb-4 flex items-center gap-2">
                  <Utensils className="h-8 w-8" />
                  The Dinner
                </h3>
                <p className="text-livePiano-light/90 mb-4">
                  Sophisticated pop and contemporary pieces for your celebration.
                </p>
                <p className="text-livePiano-light/80">
                  As you and your guests enjoy your wedding dinner, these pieces provide the perfect backdrop for conversation and celebration.
                </p>
              </div>
            </div>
            <div className="text-center">
              <Button className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light">
                <Download className="h-4 w-4 mr-2" /> Download Dinner List
              </Button>
            </div>
          </div>
        </section>

        {/* Complete Curation List */}
        <section className="bg-livePiano-darker p-8 rounded-xl shadow-2xl border border-livePiano-border/30 text-center">
          <h3 className="text-3xl font-bold text-livePiano-primary mb-4">Complete Curation List</h3>
          <p className="text-livePiano-light/90 mb-6">
            Download the complete repertoire list for all atmospheres.
          </p>
          <Button className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light text-lg px-8 py-6 rounded-full">
            <Download className="h-5 w-5 mr-2" /> Download Complete Curation List
          </Button>
        </section>

        {/* Back to Services */}
        <section className="text-center">
          <Button asChild className="bg-livePiano-primary hover:bg-livePiano-primary/90 text-livePiano-light text-lg px-8 py-6 rounded-full">
            <Link to="/live-piano-services">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Live Piano Services
            </Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RepertoirePage;