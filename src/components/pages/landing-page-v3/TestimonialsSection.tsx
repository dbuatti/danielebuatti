import React from "react";
import SectionHeading from "@/components/SectionHeading";
import TestimonialCard from "@/components/TestimonialCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "Daniele's coaching transformed my vocal stamina and stage presence. Truly holistic!",
    author: "Sarah L.",
    title: "Musical Theatre Performer",
  },
  {
    quote: "I finally understand how to connect my body and voice. No more tension!",
    author: "Mark T.",
    title: "Concert Pianist",
  },
  {
    quote: "His approach to performance anxiety is a game-changer. I feel so much more confident.",
    author: "Emily R.",
    title: "Emerging Singer-Songwriter",
  },
  {
    quote: "Working with Daniele helped me find my authentic voice for public speaking. Highly recommend!",
    author: "Jessica P.",
    title: "Corporate Trainer",
  },
  {
    quote: "The blend of Kinesiology and vocal technique was revolutionary for my performance.",
    author: "David K.",
    title: "Opera Singer",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="max-w-7xl mx-auto text-center space-y-10 py-12 bg-brand-secondary/20 dark:bg-brand-dark/50 rounded-xl shadow-lg"> {/* Changed from py-16 to py-12 */}
      <SectionHeading>What My Clients Say</SectionHeading>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent className="-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <TestimonialCard
                quote={testimonial.quote}
                author={testimonial.author}
                title={testimonial.title}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
};

export default TestimonialsSection;