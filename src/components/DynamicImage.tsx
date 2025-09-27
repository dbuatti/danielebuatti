"use client";

import React, { useState, useEffect } from "react";

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check for dark mode
    checkDarkMode();

    // Set up a MutationObserver to listen for changes to the 'class' attribute on the html element
    // This allows the component to react if dark mode is toggled dynamically
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Use the dark mode specific image if in dark mode, otherwise use the provided src or placeholder
  const imageSource = isDarkMode
    ? "/public/logo-white-trans-45.png" // Image for dark mode
    : (src && src !== "/public/placeholder.svg" ? src : "/public/placeholder.svg"); // Original logic for light mode or if no src

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