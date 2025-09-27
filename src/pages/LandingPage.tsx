import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CalendarDays, Mic, Piano, Brain, HeartHandshake } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 text-gray-900 dark:text-gray-50">
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-blue-700 dark:text-blue-300">
            Daniele Buatti – Embodied Coaching for Singers & Pianists
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
            Unlock Your Voice. Unlock Your Potential.
          </p>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Whether you’re preparing for a performance, audition, or your personal growth as a musician, my coaching helps you perform with freedom, confidence, and ease. I combine world-class musical training with body awareness and performance mindset, so you can achieve more without strain, stress, or burnout.
          </p>
          <Button size="lg" className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Book a Discovery Session
          </Button>
        </section>

        <Separator className="max-w-2xl mx-auto" />

        {/* Who I Work With Section */}
        <section className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Who I Work With</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-blue-700 dark:text-blue-300">
                  <Mic className="h-6 w-6" />
                  Singers & Pianists
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Seeking technical mastery and expressive freedom.
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-blue-700 dark:text-blue-300">
                  <Brain className="h-6 w-6" />
                  Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Dealing with stage anxiety or creative blocks.
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-blue-700 dark:text-blue-300">
                  <Piano className="h-6 w-6" />
                  Integrated Musicians
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Who want voice, piano, composition, and arranging—all in one place.
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-blue-700 dark:text-blue-300">
                  <HeartHandshake className="h-6 w-6" />
                  Committed Artists
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Committed to a sustainable, long-term practice that protects their body and their voice.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="max-w-2xl mx-auto" />

        {/* My Approach Section */}
        <section className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400">My Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-blue-700 dark:text-blue-300">1. Embodiment & Alignment</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Release tension, improve posture, and find effortless breath control. Free your body to support your voice and piano playing naturally.
              </CardDescription>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-blue-700 dark:text-blue-300">2. Mindset & Performance Coaching</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Manage nerves, setbacks, and creative blocks. Build consistency and confidence in practice and on stage.
              </CardDescription>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-blue-700 dark:text-blue-300">3. Integrated Musical Skill Development</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Voice, piano, composition, arranging—tailored to your goals. Coaching is practical, creative, and always aligned with your vision.
              </CardDescription>
            </Card>
          </div>
          <p className="text-center text-xl italic text-gray-600 dark:text-gray-400 mt-8">
            “Daniele doesn’t just teach technique—he teaches how to inhabit your artistry fully.”
          </p>
        </section>

        <Separator className="max-w-2xl mx-auto" />

        {/* Sessions & Availability Section */}
        <section className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Sessions & Availability</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-blue-700 dark:text-blue-300">
                  <CalendarDays className="h-6 w-6" />
                  1:1 Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Personalized sessions for voice, piano, or integrated coaching. Available in 30, 60, or 90-minute durations.
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-blue-700 dark:text-blue-300">
                  <Users className="h-6 w-6" />
                  Workshops & Group Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Join the "Body Voice Sound Workshop" for movement, improvisation, and sound exploration.
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-blue-700 dark:text-blue-300">
                  <Monitor className="h-6 w-6" />
                  Remote/Zoom Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                Access world-class coaching from anywhere in the world.
              </CardContent>
            </Card>
          </div>
          <p className="text-xl font-medium text-blue-700 dark:text-blue-300 mt-8">
            📅 November spots are now open. DM to claim your session or schedule a discovery session.
          </p>
        </section>

        <Separator className="max-w-2xl mx-auto" />

        {/* Why Work With Me Section */}
        <section className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Why Work With Me?</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-left text-lg text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-blue-700 dark:text-blue-300">Holistic Expertise:</strong> Voice, piano, performance coaching, kinesiology, mindset.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-blue-700 dark:text-blue-300">Embodiment-Based:</strong> Build strength and skill without tension or burnout.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-blue-700 dark:text-blue-300">Results-Oriented:</strong> Students leave feeling more confident, expressive, and capable.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-blue-700 dark:text-blue-300">Creative Freedom:</strong> Integrates technique with improvisation and artistry.
              </div>
            </li>
          </ul>
        </section>

        <Separator className="max-w-2xl mx-auto" />

        {/* Call to Action / Booking */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Ready to Transform Your Artistry?</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Let’s chat about your goals and find the best coaching path for you.
          </p>
          <Button size="lg" className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            DM me or Book Online
          </Button>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default LandingPage;