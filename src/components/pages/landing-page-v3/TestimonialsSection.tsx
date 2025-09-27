import React from "react";
import SectionHeading from "@/components/SectionHeading";
import TestimonialCard from "@/components/TestimonialCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "Daniele's clear, direct, and thoughtful communication is truly exceptional. I deeply appreciate the concise clarity and transparency, which makes working together an absolute pleasure. This approach not only benefits our current project but also sets a wonderful foundation for future collaborations. I wish every creative worked with such professionalism and insight.",
    author: "Em",
    title: "Creative Collaborator",
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