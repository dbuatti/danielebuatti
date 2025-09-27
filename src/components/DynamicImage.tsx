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
  // Use the local placeholder.svg if src is not provided or is the placeholder itself
  const imageSource = src && src !== "/public/placeholder.svg" ? src : "/public/placeholder.svg";

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