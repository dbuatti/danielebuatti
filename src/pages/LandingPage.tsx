import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CalendarDays, Mic, Piano, Brain, HeartHandshake, Users, Monitor, Mail, Phone, GraduationCap, Award, Lightbulb, Camera, Volume2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";
import BackToTopButton from "@/components/BackToTopButton";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import DynamicImage from "@/components/DynamicImage"; // Import DynamicImage

const LandingPage = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto py-12">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-brand-primary">
              Daniele Buatti – Embodied Coaching for Performers & Communicators
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-brand-dark dark:text-brand-light">
              Refine Your Voice. Elevate Your Presence.
            </p>
            <p className="text-lg md:text-xl text-brand-dark/80 dark:text-brand-light/80 max-w-3xl md:max-w-none mx-auto">
              Got a big performance coming up? An audition, presentation, or need to nail your on-camera presence? My coaching is all about helping you perform and communicate with freedom, confidence, and ease. I blend world-class musical and performance training with deep body awareness and a powerful mindset approach. The goal? To help you achieve more, without the usual strain, stress, or burnout.
            </p>
            <Button size="lg" className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="#contact">Book a Discovery Session</a>
            </Button>
          </div>
          <div className="flex justify-center md:justify-end">
            <DynamicImage
              alt="Daniele Buatti coaching a performer"
              className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover"
              width={600}
              height={400}
            />
          </div>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* About Me Section */}
        <section id="about" className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="flex justify-center md:justify-start">
            <DynamicImage
              alt="Daniele Buatti professional headshot"
              className="w-full max-w-sm h-auto rounded-xl shadow-2xl object-cover"
              width={400}
              height={500}
            />
          </div>
          <div className="text-center md:text-left space-y-8">
            <h2 className="text-4xl font-bold text-brand-primary">About Daniele Buatti</h2>
            <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              For over 12 years, I've been working as a Music Director, Pianist, Arranger, Vocal Coach, and Educator. What I bring to the table is a unique mix of artistic leadership and evidence-based methods, all aimed at training versatile, industry-ready performers and communicators. My experience covers everything from professional music theatre and vocal pedagogy to tertiary education and holistic somatic practices. My focus is always on high-quality, embodied coaching and innovative performance curricula.
            </p>
            <div className="grid grid-cols-1 gap-6 text-left">
              <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                    <GraduationCap className="h-6 w-6" />
                    Education & Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-brand-dark/80 dark:text-brand-light/80">
                  <p className="font-semibold">Bachelor of Music</p>
                  <p>Australian Institute of Music (2014-2016)</p>
                  <p className="text-sm mt-2">Units in Arranging, Composition, Orchestration, and Piano.</p>
                  <p className="font-semibold mt-4">Diploma of Kinesiology</p>
                  <p>Specialising in mind-body integration for performance.</p>
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
                    <li>Holistic Voice & Somatic Techniques (Kinesiology, Breath-Body-Mind, Yoga, Mindfulness)</li>
                    <li>Piano & Keyboard Performance</li>
                    <li>Public Speaking & Presentation Coaching</li>
                    <li>Acting & Film Performance Coaching</li>
                    <li>On-Camera & Streaming Presence</li>
                    <li>Score Preparation & Technology Integration</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Who I Work With Section */}
        <section className="max-w-6xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-bold text-brand-primary">Who I Work With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Mic className="h-6 w-6" />
                  Singers & Musicians
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Seeking technical mastery, expressive freedom, and integrated musical skill.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Lightbulb className="h-6 w-6" />
                  Public Speakers & Presenters
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Aiming for confident, impactful communication and authentic stage presence.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Camera className="h-6 w-6" />
                  Actors & On-Camera Talent
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Refining performance for film, stage, auditions, and streaming platforms.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <HeartHandshake className="h-6 w-6" />
                  Committed Professionals
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Dedicated to a sustainable, long-term practice that protects their body, voice, and mental well-being.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* My Approach Section */}
        <section id="approach" className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-4xl font-bold text-center text-brand-primary">My Embodied Holistic Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-brand-primary">1. Embodiment & Alignment</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Rooted in Kinesiology, Yoga, and Somatic Therapy, we release tension, improve posture, and find effortless breath control. Free your body to support your voice, instrument, and presence naturally.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-brand-primary">2. Mindset & Performance Coaching</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Utilising Mindfulness and therapeutic techniques, we manage nerves, setbacks, and creative blocks. Build consistency and unwavering confidence in practice, on stage, or on camera.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4">
              <CardTitle className="text-2xl text-brand-primary">3. Integrated Skill Development</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Voice, piano, public speaking, acting, on-camera presence—tailored to your goals. Coaching is practical, creative, and always aligned with your unique vision and desired impact.
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-xl italic text-brand-dark/70 dark:text-brand-light/70 mt-8">
            “Daniele doesn’t just teach technique—he teaches how to inhabit your artistry and presence fully.”
          </p>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Sessions & Availability Section */}
        <section id="sessions" className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-bold text-brand-primary">Sessions & Availability</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <CalendarDays className="h-6 w-6" />
                  1:1 Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Personalised sessions for voice, piano, public speaking, acting, or integrated coaching. Available in 30, 60, or 90-minute durations.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
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
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Monitor className="h-6 w-6" />
                  Remote/Zoom Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Access world-class coaching from anywhere in the world, perfectly suited for on-camera performance and virtual presentations.
              </CardContent>
            </Card>
          </div>
          <p className="text-xl font-medium text-brand-primary mt-8">
            📅 November spots are now open. DM to claim your session or schedule a discovery session.
          </p>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Why Work With Me Section */}
        <section id="why-me" className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-bold text-brand-primary">Why Work With Me?</h2>
          <ul className="grid md:grid-cols-2 gap-6 text-left text-lg text-brand-dark/80 dark:text-brand-light/80">
            <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary">
              <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Holistic Expertise:</strong> Voice, piano, public speaking, acting, on-camera, performance coaching, kinesiology, mindset.
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary">
              <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Embodiment-Based:</strong> Build strength and skill without tension or burnout, rooted in Kinesiology, Yoga, and Somatic Therapy.
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary">
              <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Results-Oriented:</strong> Clients leave feeling more confident, expressive, and capable across all performance and communication domains.
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary">
              <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Creative Freedom:</strong> Integrates technique with improvisation, artistry, and authentic self-expression for any medium.
              </div>
            </li>
          </ul>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Testimonials Section */}
        <section className="max-w-6xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-bold text-brand-primary">What My Clients Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Call to Action / Booking */}
        <section id="contact" className="text-center max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-brand-primary">Ready to Transform Your Artistry & Presence?</h2>
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
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 text-brand-dark/80 dark:text-brand-light/80">
            <a href="mailto:daniele.buatti@gmail.com" className="flex items-center gap-2 hover:text-brand-primary transition-colors text-lg">
              <Mail className="h-6 w-6" /> daniele.buatti@gmail.com
            </a>
            <a href="tel:+61424174067" className="flex items-center gap-2 hover:text-brand-primary transition-colors text-lg">
              <Phone className="h-6 w-6" /> +61 424 174 067
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default LandingPage;