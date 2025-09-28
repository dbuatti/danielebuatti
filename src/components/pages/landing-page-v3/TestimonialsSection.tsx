import React from "react";
import SectionHeading from "@/components/SectionHeading";
import TestimonialCard from "@/components/TestimonialCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const testimonials = [ // Added export keyword
  {
    quote: "Daniele's clear, direct, and thoughtful communication is truly exceptional. I deeply appreciate the concise clarity and transparency, which makes working together an absolute pleasure. This approach not only benefits our current project but also sets a wonderful foundation for future collaborations. I wish every creative worked with such professionalism and insight.",
    author: "Em",
    title: "Creative Collaborator",
  },
  {
    quote: "This program has been eye-opening; I've grown leaps and bounds as an artist. Daniele's dedication to championing the arts and supporting emerging talent is incredible, creating a space where artists are treated as equals and truly shine.",
    author: "Ben",
    title: "Emerging Artist",
  },
  {
    quote: "Daniele has a wonderfully positive aura and a very friendly, engaging presence. His thoughtful organization and willingness to step in as a host are truly appreciated.",
    author: "Helge Hansmann",
    title: "Participant",
  },
  {
    quote: "Daniele is an awesome Music Director, guiding us with such thought and care. His positive energy makes every session a joy, and I always look forward to returning.",
    author: "Joanne Duckworth & Anna Robinson",
    title: "Choir Members",
  },
  {
    quote: "The show was awesome! Daniele's energy and piano playing were amazing, truly had me grooving along. An unforgettable performance.",
    author: "Alex Glenk",
    title: "Audience Member",
  },
  {
    quote: "Daniele is an exceptional teacher, leader, and encourager. His infectious enthusiasm, clear communication, and empowering use of imagery make every session delightful and truly transformative. A real treasure!",
    author: "Experienced Educator",
    title: "Colleague",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="max-w-7xl mx-auto text-center space-y-10 py-12 bg-brand-secondary/20 dark:bg-brand-dark/50 rounded-xl shadow-lg">
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