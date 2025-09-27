import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CalendarDays, Mic, Piano, Brain, HeartHandshake, Users, Monitor, Mail, Phone, GraduationCap, Award, Lightbulb, Camera, Volume2, Music, Leaf, Megaphone, Theater, Webcam, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import DynamicImage from "@/components/DynamicImage";
import BackToTopButton from "@/components/BackToTopButton";
import GumroadFollowForm from "@/components/GumroadFollowForm";
import ExpertiseItemCard from "@/components/ExpertiseItemCard";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading"; // Import the new SectionHeading component

const LandingPage = () => {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light">
      <Navbar />
      <main className="container mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <section id="home" className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto py-12">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-brand-primary">
              Unlock Your True Voice. Master Your Presence.
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-brand-dark dark:text-brand-light">
              Daniele Buatti – Embodied Coaching for Performers & Communicators
            </p>
            <p className="text-lg md:text-xl text-brand-dark/80 dark:text-brand-light/80 max-w-3xl md:max-w-none mx-auto">
              Facing a big performance, audition, or presentation? Need to master your on-camera presence? My coaching empowers you to perform and communicate with freedom, confidence, and ease. Blending world-class musical and performance training with deep body awareness and a powerful mindset approach, I help you achieve more without the usual strain, stress, or burnout. True expression begins with the willingness to voice it, and I'm here to guide that journey.
            </p>
            <Button size="lg" className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="#contact">Book a Discovery Session</a>
            </Button>
          </div>
          <div className="flex justify-center md:justify-end">
            <DynamicImage
              src="/danielepianolaugh.jpeg" // Updated image source
              alt="Daniele Buatti laughing at the piano during a performance" // Updated alt text
              className="w-full max-w-md h-auto rounded-xl shadow-2xl object-cover border-2 border-brand-secondary"
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
              src="/pinkcarpet.jpg" // Updated image source
              alt="Daniele Buatti professional headshot on pink carpet" // Updated alt text
              className="w-full max-w-sm h-auto rounded-xl shadow-2xl object-cover border-2 border-brand-secondary" // Added border
              width={400}
              height={500}
            />
          </div>
          <div className="text-center md:text-left space-y-8">
            <SectionHeading className="md:text-left">About Daniele Buatti</SectionHeading>
            <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
              For over 12 years, I've been a Music Director, Pianist, Arranger, Vocal Coach, and Educator. I offer a unique blend of artistic leadership and evidence-based methods, training versatile, industry-ready performers and communicators. My experience spans professional music theatre, vocal pedagogy, tertiary education, and holistic somatic practices. My focus is on high-quality, embodied coaching and innovative performance curricula, helping artists express themselves through a holistic approach that connects breath, body, and mind for truly embodied performance.
            </p>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-brand-primary">THOUGHT • INTENTION • BREATH • EXPRESSION</p>
              <p className="text-md text-brand-dark/70 dark:text-brand-light/70">
                I believe expression truly happens when the thought arises to express. My therapeutic approach helps students not only inform the characters they portray but also gain a deeper understanding of their own mannerisms, expressions, and thoughts, fostering authentic connection.
              </p>
            </div>
            <Button size="lg" className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="https://rxresu.me/daniele.buatti/daniele-buatti-md" target="_blank" rel="noopener noreferrer">
                View CV
              </a>
            </Button>
            <div className="grid grid-cols-1 gap-6 text-left">
              <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
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
              {/* Key Expertise Section - Now using ExpertiseItemCard */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-bold text-brand-primary">
                  <Award className="h-6 w-6" />
                  Key Expertise
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ExpertiseItemCard
                    icon={Mic}
                    title="Vocal Coaching"
                    description="Elevate your technique across contemporary, classical, and musical theatre genres."
                  />
                  <ExpertiseItemCard
                    icon={Music}
                    title="Music Direction & Conducting"
                    description="Master the art of leading and inspiring musical ensembles."
                  />
                  <ExpertiseItemCard
                    icon={Leaf}
                    title="Holistic Voice & Somatic Techniques"
                    description="Integrate Kinesiology, Breath-Body-Mind, Yoga, and Mindfulness for profound vocal freedom."
                  />
                  <ExpertiseItemCard
                    icon={Piano}
                    title="Piano & Keyboard Performance"
                    description="Enhance your instrumental skills and musicality."
                  />
                  <ExpertiseItemCard
                    icon={Megaphone}
                    title="Public Speaking & Presentation Coaching"
                    description="Cultivate confident, impactful communication."
                  />
                  <ExpertiseItemCard
                    icon={Theater}
                    title="Acting & Film Performance Coaching"
                    description="Refine your presence for stage and screen."
                  />
                  <ExpertiseItemCard
                    icon={Webcam}
                    title="On-Camera & Streaming Presence"
                    description="Develop authentic and engaging virtual communication."
                  />
                  <ExpertiseItemCard
                    icon={FileText}
                    title="Score Preparation & Technology Integration"
                    description="Streamline your musical workflow with modern tools."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Who I Work With Section */}
        <section className="max-w-6xl mx-auto text-center space-y-10">
          <SectionHeading>Who I Work With</SectionHeading>
          <div className="flex justify-center mb-8">
            <DynamicImage
              src="/daniele-smile-host-bu.jpeg"
              alt="Daniele Buatti smiling and interacting with a host at Broadway Unplugged"
              className="w-full max-w-2xl h-auto rounded-xl shadow-2xl object-cover border-2 border-brand-secondary mx-auto"
              width={800}
              height={533}
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Mic className="h-6 w-6" />
                  Singers & Musicians
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Achieve technical mastery, expressive freedom, and integrated musical skill to truly shine.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Lightbulb className="h-6 w-6" />
                  Public Speakers & Presenters
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Cultivate confident, impactful communication and authentic stage presence that captivates your audience.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <Camera className="h-6 w-6" />
                  Actors & On-Camera Talent
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Refine performances for film, stage, auditions, and streaming platforms with nuanced presence and authenticity.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
                  <HeartHandshake className="h-6 w-6" />
                  Committed Professionals
                </CardTitle>
              </CardHeader>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Dedicated to a sustainable, long-term practice that protects their body, voice, and mental well-being, preventing burnout.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* My Approach Section */}
        <section id="approach" className="max-w-4xl mx-auto space-y-10">
          <SectionHeading>My Embodied Holistic Approach</SectionHeading>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 text-center">
            All my teachings are informed by Buddhist and yogic philosophies, fostering a heart-centred, process-oriented journey focused on truth and transformation, not just the destination.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CardTitle className="text-2xl text-brand-primary">1. Embodiment & Alignment</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Rooted in Kinesiology, Yoga, and Somatic Therapy, we release tension, improve posture, and find effortless breath control. Free your body to support your voice, instrument, and presence naturally, cultivating a deeper connection between mind and body.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CardTitle className="text-2xl text-brand-primary">2. Mindset & Performance Coaching</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Utilising Mindfulness and therapeutic techniques, we manage nerves, setbacks, and creative blocks. Build consistency and unwavering confidence in practice, on stage, or on camera, understanding your mind to overcome performance anxiety.
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-center space-y-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CardTitle className="text-2xl text-brand-primary">3. Integrated Skill Development</CardTitle>
              <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
                Voice, piano, public speaking, acting, on-camera presence—tailored to your goals. Coaching is practical, creative, and always aligned with your unique vision and desired impact, helping you refine repertoire and improve musicianship.
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-xl italic text-brand-dark/70 dark:text-brand-light/70 mt-8">
            “Daniele doesn’t just teach technique—he teaches how to inhabit your artistry and presence fully.”
          </p>
        </section>

        {/* New Section for Tulips Image */}
        <section className="max-w-4xl mx-auto text-center py-12">
          <DynamicImage
            src="/tulips.jpeg"
            alt="Daniele Buatti smiling with tulips in a garden"
            className="w-full max-w-2xl h-auto rounded-xl shadow-2xl object-cover border-2 border-brand-secondary mx-auto"
            width={800}
            height={533}
          />
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Sessions & Availability Section */}
        <section id="sessions" className="max-w-4xl mx-auto text-center space-y-10">
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

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Buattiverse Section */}
        <section className="max-w-4xl mx-auto text-center space-y-10">
          <SectionHeading className="flex items-center justify-center gap-3">
            <Music className="h-8 w-8" />
            Explore Buattiverse: Sheet Music & Backing Tracks
          </SectionHeading>
          <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
            Welcome to Buattiverse — your curated source for professional vocal transcriptions, SATB arrangements, and essential music resources tailored for performers, educators, and creatives. Whether you're looking for detailed backing vocal arrangements or resources to bring your ensemble to life, you're in the right place to elevate your musical projects.
          </p>
          <GumroadFollowForm />
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="https://buattiverse.gumroad.com/" target="_blank" rel="noopener noreferrer">
                Visit Buattiverse Store
              </a>
            </Button>
          </div>
          <p className="text-md text-brand-dark/70 dark:text-brand-light/70 mt-4">
            Have a custom request or question? Get in touch: <a href="mailto:info@danielebuatti.com" className="underline hover:text-brand-primary">info@danielebuatti.com</a>
          </p>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Why Work With Me Section */}
        <section id="why-me" className="max-w-4xl mx-auto text-center space-y-10">
          <SectionHeading>Why Work With Me?</SectionHeading>
          <ul className="grid md:grid-cols-2 gap-6 text-left text-lg text-brand-dark/80 dark:text-brand-light/80">
            <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Holistic Expertise:</strong> Voice, piano, public speaking, acting, on-camera, performance coaching, kinesiology, mindset.
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Embodiment-Based:</strong> Build strength and skill without tension or burnout, rooted in Kinesiology, Yoga, and Somatic Therapy.
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Results-Oriented:</strong> Clients leave feeling more confident, expressive, and capable across all performance and communication domains.
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-brand-light dark:bg-brand-dark shadow-md rounded-lg border border-brand-secondary hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="text-brand-primary">Creative Freedom:</strong> Integrates technique with improvisation, artistry, and authentic self-expression for any medium.
              </div>
            </li>
          </ul>
        </section>

        <Separator className="max-w-3xl mx-auto bg-brand-secondary" />

        {/* Testimonials Section */}
        <section className="max-w-6xl mx-auto text-center space-y-10 py-16 bg-brand-secondary/20 dark:bg-brand-dark/50 rounded-lg">
          <SectionHeading>What My Clients Say</SectionHeading>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
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
          <SectionHeading>Ready to Transform Your Artistry & Presence?</SectionHeading>
          <p className="text-xl text-brand-dark/80 dark:text-brand-light/80">
            Let’s chat about your goals and find the best coaching path for you. Take the first step towards unlocking your full potential. Your journey to embodied performance starts here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <a href="https://danielebuatti.as.me" target="_blank" rel="noopener noreferrer">
                Book Online
              </a>
            </Button>
          </div>
          <div className="mt-8">
            <ContactForm />
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