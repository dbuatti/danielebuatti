"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame for better timing with browser rendering,
    // and ensure we target the document's scrollable element.
    const performScroll = () => {
      window.requestAnimationFrame(() => {
        document.documentElement.scrollTo({
          top: 0,
          behavior: "instant", // Ensure instant behavior, overriding any smooth-scroll
        });
        document.body.scrollTo({ // Also try body for compatibility
          top: 0,
          behavior: "instant",
        });
      });
    };

    // A small timeout can still be beneficial to ensure all DOM updates are processed
    const timer = setTimeout(performScroll, 50); // A slightly longer delay

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;