"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If a hash is present, scroll to the element with that ID
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Use a timeout to ensure the element is rendered and the page has settled
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      // If no hash, scroll to the top of the page
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Re-run if pathname or hash changes

  return null;
};

export default ScrollToTop;