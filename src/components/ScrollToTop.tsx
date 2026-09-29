"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// On navigation: jump to the #hash target if there is one (waiting briefly for
// lazy routes to mount it), otherwise to the top. Uses an instant jump so the
// page transition isn't fighting a long smooth scroll from the old position.
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    const run = () => {
      if (cancelled) return;
      if (hash) {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (tries++ < 20) {
          setTimeout(run, 50);
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    };

    const timer = setTimeout(run, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
