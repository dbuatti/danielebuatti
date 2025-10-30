"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Defer scrolling to ensure it happens after the new page content has rendered.
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0); 

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run if pathname changes

  return null;
};

export default ScrollToTop;