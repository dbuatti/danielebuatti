"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantly to the top of the page
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run if pathname changes

  return null;
};

export default ScrollToTop;