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

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-light mb-6">AMEB Accompanying</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            Professional piano accompaniment for your AMEB exams and rehearsals.
          </p>
        </header>

        {/* Hero Image */}
        <div className="mb-20 -mx-6">
          <DynamicImage
            src="/danieleatkeyboard.jpeg"
            alt="Daniele Buatti at the keyboard"
            className="w-full h-[500px] object-cover object-center rounded-b-3xl shadow-2xl"
            width={1200}
            height={600}
          />
        </div>

        {/* Overview */}
        <section className="mb-20 text-center">
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
            I provide calm, reliable accompaniment for AMEB exams (all grades and instruments) and optional rehearsals beforehand. My goal is to help you feel prepared and supported on the day.
          </p>
        </section>

        {/* Exam Day */}
        <section className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium flex items-center gap-4">
              <Piano className="w-10 h-10 text-gray-700 dark:text-gray-300" />
              Exam Day Accompaniment
            </h2>
            <p className="text-2xl font-semibold">$180 per exam</p>
            <ul className="space-y-3 text-lg text-gray-600 dark:text-gray-400">
              <li>• I arrive 15–20 minutes early to set up</li>
              <li>• Repertoire fully prepared in advance</li>
              <li>• Clear communication about tempo and feel</li>
              <li>• Calm, supportive presence throughout</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg">
            <p className="text-lg italic text-gray-600 dark:text-gray-400">
              “Having a reliable accompanist who knows the music inside out makes a huge difference on exam day.”
            </p>
          </div>
        </section>

        {/* Rehearsals */}
        <section className="mb-20 py-16 bg-white dark:bg-gray-900 rounded-3xl">
          <h2 className="text-3xl font-medium text-center mb-12 flex items-center justify-center gap-4">
            <Calendar className="w-10 h-10 text-gray-700 dark:text-gray-300" />
            Rehearsal Sessions (optional)
          </h2>
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-light">15 min</p>
                <p className="text-xl mt-2">$50</p>
              </div>
              <div>
                <p className="text-3xl font-light">30 min</p>
                <p className="text-xl mt-2">$90</p>
              </div>
              <div>
                <p className="text-3xl font-light">45 min</p>
                <p className="text-xl mt-2">$130</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-lg">
              <MapPin className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <div>
                <p className="font-medium">Studio in Toorak, Melbourne</p>
                <p className="text-gray-600 dark:text-gray-400">Trams 58 & 16 • Free street parking</p>
              </div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Rehearsals recommended within two weeks of the exam.
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-20">
          <h2 className="text-4xl font-light text-center mb-12">Book or Inquire</h2>
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-10">
            <AmebBookingForm />
          </div>
          <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
            Please send sheet music at least two weeks before the exam so I can prepare properly.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AmebAccompanyingPage;