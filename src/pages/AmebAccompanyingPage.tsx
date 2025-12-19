"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicImage from "@/components/DynamicImage";
import AmebBookingForm from "@/components/AmebBookingForm";
import { Piano, Calendar, MapPin } from "lucide-react";

const AmebAccompanyingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-4">AMEB Accompanying</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            Professional piano accompaniment for your AMEB exams and rehearsals.
          </p>
        </header>

        {/* Hero Image - Removed -mx-6 to keep it within max-w-5xl container */}
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
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
            I provide calm, reliable accompaniment for AMEB exams (all grades and instruments) and optional rehearsals beforehand. My goal is to help you feel prepared and supported on the day.
          </p>
        </section>

        {/* Exam Day - Styled as a full-width card to match Rehearsals */}
        <section className="mb-12 bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-medium flex items-center gap-4 text-gray-900 dark:text-white">
                <Piano className="w-10 h-10 text-gray-700 dark:text-gray-300" />
                Exam Day
              </h2>
              <div className="inline-block bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl">
                 <p className="text-2xl font-semibold">$180 per exam</p>
              </div>
              <ul className="space-y-3 text-lg text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2"><span>•</span> I arrive 15–20 minutes early to set up</li>
                <li className="flex items-start gap-2"><span>•</span> Repertoire fully prepared in advance</li>
                <li className="flex items-start gap-2"><span>•</span> Clear communication about tempo and feel</li>
                <li className="flex items-start gap-2"><span>•</span> Calm, supportive presence throughout</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
              <p className="text-xl italic text-gray-700 dark:text-gray-300 leading-relaxed">
                “Having a reliable accompanist who knows the music inside out makes a huge difference on exam day.”
              </p>
            </div>
          </div>
        </section>

        {/* Rehearsals - Full width */}
        <section className="mb-12 py-12 px-8 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-medium text-center mb-10 flex items-center justify-center gap-4 text-gray-900 dark:text-white">
            <Calendar className="w-10 h-10 text-gray-700 dark:text-gray-300" />
            Rehearsal Sessions
          </h2>
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl md:text-3xl font-light">15 min</p>
                <p className="text-lg md:text-xl mt-2 font-semibold text-brand-primary">$30</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl md:text-3xl font-light">30 min</p>
                <p className="text-lg md:text-xl mt-2 font-semibold text-brand-primary">$50</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl md:text-3xl font-light">45 min</p>
                <p className="text-lg md:text-xl mt-2 font-semibold text-brand-primary">$75</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg border-t border-gray-100 dark:border-gray-800 pt-8">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                <p className="font-medium">Studio in Toorak, Melbourne</p>
              </div>
              <p className="hidden md:block text-gray-300">|</p>
              <p className="text-gray-600 dark:text-gray-400">Trams 58 & 16 • Free street parking</p>
            </div>
          </div>
        </section>

        {/* Booking Form – Full width card container */}
        <section className="py-12 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-4xl font-light text-center mb-8">Book or Inquire</h2>
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <AmebBookingForm />
            <p className="text-center mt-10 text-gray-500 dark:text-gray-400 italic">
              Please send sheet music at least two weeks before the exam so I can prepare properly.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AmebAccompanyingPage;