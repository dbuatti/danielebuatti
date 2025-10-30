import { useEffect, useState, useRef, useCallback } from "react";
import { navLinks } from "@/constants/navigation";

export function useSmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);

      if (element) {
        // Use a timeout to ensure the element is rendered and the page has settled
        // This is especially important when navigating between pages with hashes
        const timer = setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100); // Small delay to allow page to render

        return () => clearTimeout(timer);
      }
    }
    // Removed the else block that scrolled to top for the home page,
    // as ScrollToTop component now handles all general page-top scrolling.
  }, [location]); // Re-run when location object changes (including hash)
}