"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Only need pathname now

  useEffect(() => {
    // Use a timeout to ensure the scroll happens after the DOM is fully updated
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100); // Increased delay to 100ms

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run if pathname changes

  return null;
};

export default ScrollToTop;