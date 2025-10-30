"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Attempt to scroll both document.documentElement (for modern browsers)
      // and document.body (for older browsers/quirks mode)
      document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      document.body.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100); // Keeping the 100ms delay

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;