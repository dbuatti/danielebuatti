"use client";

import React from "react";

interface DynamicImageProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const DynamicImage: React.FC<DynamicImageProps> = ({
  src,
  alt,
  className,
  width = 600,
  height = 400,
}) => {
  const placeholderSrc = `https://picsum.photos/seed/${Math.random() * 1000}/${width}/${height}`;
  const imageSource = src && src !== "/public/placeholder.svg" ? src : placeholderSrc;

  return (
    <img
      src={imageSource}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  );
};

export default DynamicImage;