import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Monitor } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // Import cn for utility classes
import AdditionalProgramBanner from "@/components/AdditionalProgramBanner"; // Import AdditionalProgramBanner

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"> {/* Changed to grid for side-by-side cards */}
              {/* Book Voice & Piano Card */}
              <Link to="/book-voice-piano" className="block">
                <Card className={cn(
                  "flex items-center justify-center h-40 p-6 rounded-xl shadow-lg",
                  "bg-brand-primary text-brand-light",
                  "hover:bg-brand-primary/90 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                )}>
                  <CardContent className="p-0 text-3xl font-extrabold">
                    Book Voice & Piano
                  </CardContent>
                </Card>
              </Link>

              {/* Book Healing Sessions Card */}
              <Link to="/book-healing" className="block">
                <Card className={cn(
                  "flex items-center justify-center h-40 p-6 rounded-xl shadow-lg",
                  "bg-brand-dark text-brand-light",
                  "hover:bg-brand-dark-alt hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                )}>
                  <CardContent className="p-0 text-3xl font-extrabold">
                    Book Healing Sessions
                  </CardContent>
                </Card>
              </Link>
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
        📅 Limited November spots are now open. DM to claim your session or schedule a complimentary discovery call.
      </p>

      {/* Pink header */}
      <AdditionalProgramBanner
        title={<span className="text-brand-primary">Online Drop-In Audition Cut Sessions</span>}
        description="A quick, focused 15-minute online session to run through your 16–32 bar audition cut with an experienced pianist and vocal coach. Get immediate feedback to ensure you're polished and performance-ready for only A$30."
        link="https://danielebuatti.as.me/audition-cut-playthrough-15"
        linkText="Book a Playthrough"
        bgColorClass="bg-brand-dark" // Dark blue background
        textColorClass="text-brand-light" // Light text for description
        buttonBgClass="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
        // Make it full width and add more vertical padding
        className="w-screen -mx-4 py-16" // Full width, negative margins, increased padding
        titleClassName="text-5xl md:text-6xl font-extrabold" // Larger, bolder title
      />
    </section>
  );
};

export default SessionsAvailabilitySection;