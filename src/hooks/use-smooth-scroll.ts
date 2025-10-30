import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    } else {
      // If no hash, and we're on the home page, ensure it's at the top
      // This might be redundant with ScrollToTop, but good for robustness
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location]); // Re-run when location object changes (including hash)
}