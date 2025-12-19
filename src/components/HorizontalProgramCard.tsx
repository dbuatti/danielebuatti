"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import DynamicImage from "@/components/DynamicImage";
import { Link } from "react-router-dom";

interface HorizontalProgramCardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  imageSrc: string;
}

const HorizontalProgramCard: React.FC<HorizontalProgramCardProps> = ({ title, description, link, linkText, imageSrc }) => {
  const isInternalLink = link.startsWith("/") || link.startsWith("#");

  return (
    <div className="group relative h-96 rounded-3xl overflow-hidden shadow-2xl">
      {/* Image */}
      <DynamicImage
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        width={1200}
        height={600}
      />

      {/* Gradient overlay – dark at bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content – aligned to bottom left */}
      <div className="relative z-10 h-full flex flex-col justify-end p-10 text-left">
        <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">
          {title}
        </h3>
        <p className="text-xl text-white/95 mb-8 max-w-2xl drop-shadow-lg">
          {description}
        </p>
        <Button asChild size="lg" className="w-fit bg-white hover:bg-gray-100 text-gray-900 text-lg px-10 py-6 rounded-full shadow-xl">
          {isInternalLink ? (
            <Link to={link}>{linkText}</Link>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          )}
        </Button>
      </div>
    </div>
  );
};

export default HorizontalProgramCard;