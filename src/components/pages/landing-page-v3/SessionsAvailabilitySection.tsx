import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Monitor } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const SessionsAvailabilitySection: React.FC = () => {
  return (
    <section id="sessions" className="max-w-7xl mx-auto text-center space-y-10 py-16">
      <SectionHeading>Sessions & Availability</SectionHeading>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
              <CalendarDays className="h-6 w-6" />
              1:1 Coaching
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
            Experience personalised 1:1 coaching tailored to your unique journey. Whether it's vocal mastery (breath work, body integration, repertoire, audition prep), supportive piano lessons (musicianship, theory), or integrated body-voice work, sessions are available in flexible 30, 45, 60, or 90-minute durations to perfectly fit your schedule and goals.
          </CardContent>
        </Card>
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
      <p className="text-xl font-medium text-brand-primary mt-8">
        📅 Limited November spots are now open. DM to claim your session or schedule a complimentary discovery call.
      </p>
    </section>
  );
};

export default SessionsAvailabilitySection;