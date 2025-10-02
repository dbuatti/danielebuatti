"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation(); // Get both pathname and hash

  useEffect(() => {
    // Only scroll to top if there's no hash in the URL.
    // If a hash is present, the specific page component (like ServicesPage)
    // is expected to handle the scrolling to that anchor.
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Re-run if pathname or hash changes

  return null;
};

export default ScrollToTop;