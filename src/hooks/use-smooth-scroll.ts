import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Added useLocation import

export function useSmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);

      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [location]);
}