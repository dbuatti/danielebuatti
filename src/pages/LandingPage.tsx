import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CalendarDays, Mic, Piano, Brain, HeartHandshake, Users, Monitor, Mail, Phone, GraduationCap, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6 py-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-brand-primary">
            Daniele Buatti – Embodied Coaching for Singers & Pianists
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-brand-dark dark:text-brand-light">
            Unlock Your Voice. Unlock Your Potential.
          </p>
          <p className="text-lg md:text-xl text-brand-dark/80 dark:text-brand-light/80 max-w-3xl mx-auto">
            Whether you’re preparing for a performance, audition, or your personal growth as a musician, my coaching helps you perform with freedom, confidence, and ease. I combine world-class musical training with body awareness and performance mindset, so you can achieve more without strain, stress, or burnout.
          </p>
          <Button size="lg" className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Book a Discovery Session
          </Button>
        </section>

        <Separator className="max-w-2xl mx-auto bg-brand-secondary" />

        {/* About Me Section */}
        <section id="about" className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-brand-primary">About Daniele Buatti</h2>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
            As an accomplished Music Director, Pianist, Arranger, Vocal Coach, and Educator with over 12 years of experience, I bring a unique blend of artistic leadership and evidence-based approaches to training versatile, industry-ready performers. My work spans professional music theatre, vocal pedagogy, and tertiary/adolescent education, always with an emphasis on high-quality, embodied vocal coaching and innovative music theatre curricula.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <GraduationCap className="h-6 w-6" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                <p className="font-semibold">Bachelor of Music</p>
                <p>Australian Institute of Music (2014-2016)</p>
                <p className="text-sm mt-2">Units in Arranging, Composition, Orchestration, and Piano.</p>
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Award className="h-6 w-6" />
                  Key Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                <ul className="list-disc list-inside space-y-1">
                  <li>Vocal Coaching (Contemporary, Classical, Musical Theatre)</li>
                  <li>Music Direction & Conducting</li>
                  <li>Holistic Voice & Somatic Techniques (Kinesiology, Breath-Body-Mind)</li>
                  <li>Piano & Keyboard Performance</li>
                  <li>Score Preparation & Technology Integration</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="max-w-2xl mx-auto bg-brand-secondary" />

        {/* Who I Work With Section */}
        <section className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-brand-primary">Who I Work With</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Mic className="h-6 w-6" />
                  Singers & Pianists
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                Seeking technical mastery and expressive freedom.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Brain className="h-6 w-6" />
                  Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                Dealing with stage anxiety or creative blocks.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Piano className="h-6 w-6" />
                  Integrated Musicians
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                Who want voice, piano, composition, and arranging—all in one place.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <HeartHandshake className="h-6 w-6" />
                  Committed Artists
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                Committed to a sustainable, long-term practice that protects their body and their voice.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="max-w-2xl mx-auto bg-brand-secondary" />

        {/* My Approach Section */}
        <section id="approach" className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-center text-brand-primary">My Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-brand-primary">1. Embodiment & Alignment</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Release tension, improve posture, and find effortless breath control. Free your body to support your voice and piano playing naturally.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-brand-primary">2. Mindset & Performance Coaching</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Manage nerves, setbacks, and creative blocks. Build consistency and confidence in practice and on stage.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-brand-primary">3. Integrated Musical Skill Development</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Voice, piano, composition, arranging—tailored to your goals. Coaching is practical, creative, and always aligned with your vision.
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-xl italic text-brand-dark/70 dark:text-brand-light/70 mt-8">
            “Daniele doesn’t just teach technique—he teaches how to inhabit your artistry fully.”
          </p>
        </section>

        <Separator className="max-w-2xl mx-auto bg-brand-secondary" />

        {/* Sessions & Availability Section */}
        <section id="sessions" className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-brand-primary">Sessions & Availability</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <CalendarDays className="h-6 w-6" />
                  1:1 Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                Personalized sessions for voice, piano, or integrated coaching. Available in 30, 60, or 90-minute durations.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Users className="h-6 w-6" />
                  Workshops & Group Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                Join the "Body Voice Sound Workshop" for movement, improvisation, and sound exploration.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Monitor className="h-6 w-6" />
                  Remote/Zoom Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                Access world-class coaching from anywhere in the world.
              </CardContent>
            </Card>
          </div>
          <p className="text-xl font-medium text-brand-primary mt-8">
            📅 November spots are now open. DM to claim your session or schedule a discovery session.
          </p>
        </section>

        <Separator className="max-w-2xl mx-auto bg-brand-secondary" />

        {/* Why Work With Me Section */}
        <section id="why-me" className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-brand-primary">Why Work With Me?</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-left text-lg text-brand-dark/80 dark:text-brand-light/80">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Holistic Expertise:</strong> Voice, piano, performance coaching, kinesiology, mindset.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Embodiment-Based:</strong> Build strength and skill without tension or burnout.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Results-Oriented:</strong> Students leave feeling more confident, expressive, and capable.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Creative Freedom:</strong> Integrates technique with improvisation and artistry.
              </div>
            </li>
          </ul>
        </section>

        <Separator className="max-w-2xl mx-auto bg-brand-secondary" />

        {/* Testimonials Section */}
        <section className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-brand-primary">What My Clients Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Daniele's coaching transformed my vocal stamina and stage presence. Truly holistic!"
              author="Sarah L."
              title="Musical Theatre Performer"
            />
            <TestimonialCard
              quote="I finally understand how to connect my body and voice. No more tension!"
              author="Mark T."
              title="Concert Pianist"
            />
            <TestimonialCard
              quote="His approach to performance anxiety is a game-changer. I feel so much more confident."
              author="Emily R."
              title="Emerging Singer-Songwriter"
            />
          </div>
        </section>

        <Separator className="max-w-2xl mx-auto bg-brand-secondary" />

        {/* Call to Action / Booking */}
        <section id="contact" className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold text-brand-primary">Ready to Transform Your Artistry?</h2>
          <p className="text-xl text-brand-dark/80 dark:text-brand-light/80">
            Let’s chat about your goals and find the best coaching path for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="https://danielebuatti.as.me" target="_blank" rel="noopener noreferrer">
                Book Online
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="mailto:daniele.buatti@gmail.com">
                DM me
              </a>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 text-brand-dark/80 dark:text-brand-light/80">
            <a href="mailto:daniele.buatti@gmail.com" className="flex items-center gap-2 hover:text-brand-primary transition-colors">
              <Mail className="h-5 w-5" /> daniele.buatti@gmail.com
            </a>
            <a href="tel:+61424174067" className="flex items-center gap-2 hover:text-brand-primary transition-colors">
              <Phone className="h-5 w-5" /> +61 424 174 067
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;