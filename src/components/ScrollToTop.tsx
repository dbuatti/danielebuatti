"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Only need pathname now

  useEffect(() => {
    // Always scroll to the top of the page on route changes
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run if pathname changes

  return null;
};

export default ScrollToTop;