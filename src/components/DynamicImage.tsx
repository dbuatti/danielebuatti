"use client";

import React from "react";
import { Link } from "react-router-dom";

interface DynamicImageProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  href?: string; // Added optional href prop for linking
  // Above-the-fold images (heroes) load eagerly with high fetch priority.
  priority?: boolean;
}

const DynamicImage: React.FC<DynamicImageProps> = ({
  src,
  alt,
  className,
  width = 600,
  height = 400,
  style,
  href, // Destructure href
  priority = false,
}) => {
  // Use the local placeholder.svg if src is not provided or is the placeholder itself
  const imageSource = src && src !== "/public/placeholder.svg" ? src : "/public/placeholder.svg";

  const imageElement = (
    <img
      src={imageSource}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? { fetchpriority: "high" } : {})}
      style={style}
    />
  );

  // If href is provided, wrap the image in a Link component
  if (href) {
    return (
      <Link to={href}>
        {imageElement}
      </Link>
    );
  }

  return imageElement;
};

export default DynamicImage;