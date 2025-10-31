"use client";

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use a timeout to ensure the scroll command executes after the DOM update cycle completes.
    const timer = setTimeout(() => {
      // 1. Scroll the window (most common target)
      window.scrollTo(0, 0);
      
      // 2. Explicitly target the document element (HTML)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // 3. Explicitly target the body (fallback for older browsers/specific layouts)
      if (document.body) {
        document.body.scrollTop = 0;
      }
    }, 0); // 0ms timeout defers execution until after the current render cycle

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;