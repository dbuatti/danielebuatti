"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import DynamicImage from "@/components/DynamicImage";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";

const imagesData = [
  {
    src: "/greenroom.jpeg",
    alt: "Daniele Buatti at the Greenroom Awards",
    caption: "Daniele Buatti, part of the Greenroom Award Music Theatre panel.",
    width: 600,
    height: 800,
    imageClasses: "transform scale-105 hover:scale-100 transition-transform duration-500",
  },
  {
    src: "/daniele-smile-host-bu.jpeg",
    alt: "Daniele Buatti smiling and interacting with a host at Broadway Unplugged",
    caption: "Daniele Buatti interacting with a host at Broadway Unplugged.",
    width: 800,
    height: 533,
    imageClasses: "transform -rotate-2 hover:rotate-0 transition-transform duration-500",
  },
  {
    src: "/danielecalmatpiano.jpeg",
    alt: "Daniele Buatti playing piano with eyes closed, deeply in the moment",
    caption: "Daniele Buatti deeply immersed in playing the piano.",
    width: 800,
    height: 533,
    imageClasses: "transform rotate-2 hover:rotate-0 transition-transform duration-500",
  },
  {
    src: "/tulips.jpeg",
    alt: "Daniele Buatti smiling with tulips in a garden",
    caption: "Daniele Buatti enjoying a moment in a garden with tulips.",
    width: 800,
    height: 533,
    imageClasses: "transform scale-105 hover:scale-100 transition-transform duration-500",
  },
];

const ImageCarouselSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto text-center space-y-10 py-12">
      <SectionHeading>Daniele's Moments</SectionHeading>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {imagesData.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 flex justify-center">
              <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-4 flex flex-col items-center">
                <DynamicImage
                  src={image.src}
                  alt={image.alt}
                  className={`w-full max-w-md h-auto rounded-xl shadow-2xl object-cover border-4 border-brand-primary mx-auto ${image.imageClasses}`}
                  width={image.width}
                  height={image.height}
                />
                <CardContent className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-4 p-0">
                  {image.caption}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
};

export default ImageCarouselSection;