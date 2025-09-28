import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Monitor } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const SessionsAvailabilitySection: React.FC = () => {
  return (
    <section id="sessions" className="max-w-7xl mx-auto text-center space-y-10 py-12">
      <SectionHeading>Sessions & Availability</SectionHeading>
      <div className="space-y-8"> {/* Container for hero and smaller cards */}
        {/* Hero Card: 1:1 Coaching */}
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-brand-primary justify-center md:justify-start">
              <CalendarDays className="h-6 w-6" />
              1:1 Coaching
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
            <p>
              Experience personalised 1:1 coaching tailored to your unique journey. Whether it's vocal mastery (breath work, body integration, repertoire, audition prep), supportive piano lessons (musicianship, theory), or integrated body-voice work, sessions are available in flexible 30, 45, 60, or 90-minute durations to perfectly fit your schedule and goals.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Link to="/voice-piano-services">
                  Learn More & Book 1:1 Sessions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Smaller Cards: Workshops & Remote/Zoom */}
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                <Users className="h-6 w-6" />
                Workshops & Group Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
              Join the "Body Voice Sound Workshop" for movement, improvisation, and sound exploration, or specialised group sessions for public speaking and on-camera presence.
            </CardContent>
          </Card>
          <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                <Monitor className="h-6 w-6" />
                Remote/Zoom Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
              Receive world-class coaching from anywhere in the world. Ideal for refining on-camera performance, mastering virtual presentations, quick online audition cuts, or Kinesiology to uncover subconscious patterns and cultivate a holistic mind-body connection. Plus, complimentary 15-minute discovery calls are always available to explore your potential.
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="text-xl font-medium text-brand-primary mt-8">
        📅 Limited November spots are now open. Schedule a complimentary discovery call to explore your potential.
      </p>
    </section>
  );
};

export default SessionsAvailabilitySection;