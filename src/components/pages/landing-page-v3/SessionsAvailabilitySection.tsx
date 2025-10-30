import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react"; // Removed Monitor
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SessionsAvailabilitySection: React.FC = () => {
  return (
    <section id="sessions" className="max-w-7xl mx-auto text-center space-y-10 py-12">
      <SectionHeading>Sessions & Availability</SectionHeading>
      <div className="space-y-8">
        {/* Consolidated 1:1 Coaching and Remote/Zoom into a single call-to-action */}
        <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-brand-primary justify-center md:justify-start">
              <CalendarDays className="h-6 w-6" />
              Ready to start your journey?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0 space-y-4">
            <p>
              Explore all available 1:1 coaching sessions, including vocal mastery, piano, integrated body-voice work, and remote/Zoom options. Find the perfect fit for your schedule and goals.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Link to="/coaching">
                  View All Sessions & Availability
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SessionsAvailabilitySection;