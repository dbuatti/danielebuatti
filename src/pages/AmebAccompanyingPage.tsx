"use client";

import React from "react";
import DynamicImage from "@/components/DynamicImage";
import AmebBookingForm from "@/components/AmebBookingForm";
import { Piano, Calendar, MapPin } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";

const AmebAccompanyingPage: React.FC = () => {
  usePageMeta(
    "AMEB Exam Accompanist Melbourne | Daniele Buatti",
    "Calm, reliable piano accompaniment for AMEB exams of all grades and instruments, with optional rehearsals beforehand. Book an accompanist in Melbourne.",
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-4 text-brand-dark dark:text-brand-light">AMEB Accompanying</h1>
          <p className="text-xl max-w-3xl mx-auto text-brand-dark/70 dark:text-brand-light/70">
            Professional piano accompaniment for your AMEB exams and rehearsals.
          </p>
        </header>

        {/* Hero Image */}
        <div className="mb-16">
          <DynamicImage
            src="/danieleatkeyboard.jpeg"
            alt="Daniele Buatti at the keyboard"
            className="w-full h-[400px] md:h-[500px] object-cover object-center rounded-3xl shadow-2xl"
            width={1200}
            height={600}
          />
        </div>

        {/* Overview */}
        <section className="mb-16 text-center">
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-brand-dark/70 dark:text-brand-light/70">
            I provide calm, reliable accompaniment for AMEB exams (all grades and instruments) and optional rehearsals beforehand. My goal is to help you feel prepared and supported on the day.
          </p>
        </section>

        {/* Exam Day */}
        <section className="mb-12 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-3xl p-8 md:p-12 shadow-lg border border-brand-secondary/30">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-medium flex items-center gap-4 text-brand-dark dark:text-brand-light">
                <Piano className="w-10 h-10 text-brand-dark/70 dark:text-brand-light/70" />
                Exam Day
              </h2>
              <div className="inline-block bg-brand-secondary/20 dark:bg-brand-dark/50 px-4 py-2 rounded-xl">
                 <p className="text-2xl font-semibold text-brand-dark dark:text-brand-light">$100 per exam</p>
              </div>
              <ul className="space-y-3 text-lg text-brand-dark/70 dark:text-brand-light/70">
                <li className="flex items-start gap-2"><span>•</span> I arrive 15–20 minutes early to set up</li>
                <li className="flex items-start gap-2"><span>•</span> Repertoire fully prepared in advance</li>
                <li className="flex items-start gap-2"><span>•</span> Clear communication about tempo and feel</li>
                <li className="flex items-start gap-2"><span>•</span> Calm, supportive presence throughout</li>
              </ul>
            </div>
            <div className="bg-brand-secondary/20 dark:bg-brand-dark/50 rounded-2xl p-8 border border-brand-secondary/30">
              <p className="text-xl italic text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
                “Having a reliable accompanist who knows the music inside out makes a huge difference on exam day.”
              </p>
            </div>
          </div>
        </section>

        {/* Rehearsals */}
        <section className="mb-12 py-12 px-8 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-3xl shadow-lg border border-brand-secondary/30">
          <h2 className="text-3xl font-medium text-center mb-10 flex items-center justify-center gap-4 text-brand-dark dark:text-brand-light">
            <Calendar className="w-10 h-10 text-brand-dark/70 dark:text-brand-light/70" />
            Rehearsal Sessions
          </h2>
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              <div className="p-4 rounded-2xl bg-brand-secondary/20 dark:bg-brand-dark/50">
                <p className="text-2xl md:text-3xl font-light text-brand-dark dark:text-brand-light">15 min</p>
                <p className="text-lg md:text-xl mt-2 font-semibold text-brand-primary">$30</p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-secondary/20 dark:bg-brand-dark/50">
                <p className="text-2xl md:text-3xl font-light text-brand-dark dark:text-brand-light">30 min</p>
                <p className="text-lg md:text-xl mt-2 font-semibold text-brand-primary">$50</p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-secondary/20 dark:bg-brand-dark/50">
                <p className="text-2xl md:text-3xl font-light text-brand-dark dark:text-brand-light">45 min</p>
                <p className="text-lg md:text-xl mt-2 font-semibold text-brand-primary">$75</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg border-t border-brand-secondary/30 pt-8 text-brand-dark/70 dark:text-brand-light/70">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-brand-dark/50 dark:text-brand-light/50" />
                <p className="font-medium">Studio in Toorak, Melbourne</p>
              </div>
              <p className="hidden md:block text-brand-secondary/50">|</p>
              <p className="text-brand-dark/70 dark:text-brand-light/70">Trams 58 & 16 • Free street parking</p>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-12 bg-brand-secondary/10 dark:bg-brand-dark/30 rounded-3xl shadow-lg border border-brand-secondary/30">
          <h2 className="text-4xl font-light text-center mb-8 text-brand-dark dark:text-brand-light">Book or Inquire</h2>
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <AmebBookingForm />
            <p className="text-center mt-10 text-brand-dark/60 dark:text-brand-light/60 italic">
              Please send sheet music at least two weeks before the exam so I can prepare properly.
            </p>
          </div>
        </section>
      </main>
  );
};

export default AmebAccompanyingPage;