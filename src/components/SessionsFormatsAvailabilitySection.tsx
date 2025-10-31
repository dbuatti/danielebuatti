"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Globe, Users } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const SessionsFormatsAvailabilitySection: React.FC = () => {
  return (
    <section id="session-formats" className="max-w-7xl mx-auto text-center space-y-10 py-12">
      <SectionHeading>Session Formats & Availability</SectionHeading>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center max-w-3xl mx-auto">
        My coaching is designed to be flexible and accessible, offering various formats to suit your needs and schedule.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
          <CardHeader className="p-0 pb-4">
            <Clock className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
            <CardTitle className="text-2xl text-brand-primary">Flexible 1:1 Sessions</CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
            <p>
              Personalized one-on-one coaching sessions are available in durations that fit your focus and energy:
            </p>
            <ul className="list-disc list-inside text-left mx-auto max-w-xs">
              <li>30-minute sessions</li>
              <li>45-minute sessions</li>
              <li>60-minute sessions</li>
              <li>90-minute sessions</li>
            </ul>
            <p>
              Choose the length that best supports your learning pace and specific goals.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
          <CardHeader className="p-0 pb-4">
            <Globe className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
            <CardTitle className="text-2xl text-brand-primary">Remote & In-Person</CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
            <p>
              Whether you prefer the convenience of online learning or the direct connection of in-person sessions, I offer both:
            </p>
            <ul className="list-disc list-inside text-left mx-auto max-w-xs">
              <li><strong>Remote Sessions:</strong> Available worldwide via Zoom.</li>
              <li><strong>In-Person Sessions:</strong> Held at my studio in Toorak, Melbourne.</li>
            </ul>
            <p>
              My flexible scheduling ensures you can access coaching from wherever you are.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col justify-between">
          <CardHeader className="p-0 pb-4">
            <Users className="h-12 w-12 text-brand-primary mx-auto mb-4 drop-shadow-sm" />
            <CardTitle className="text-2xl text-brand-primary">Workshops & Group Coaching</CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-3 flex-grow">
            <p>
              In addition to 1:1 coaching, I facilitate dynamic workshops and group coaching sessions focused on specific topics like public speaking, on-camera presence, and body-voice integration.
            </p>
            <p>
              These collaborative environments offer unique opportunities for shared learning and growth.
            </p>
            <div className="mt-4">
              <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
                <Link to="/projects-resources">
                  View Upcoming Workshops
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SessionsFormatsAvailabilitySection;