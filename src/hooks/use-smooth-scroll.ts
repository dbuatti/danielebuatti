"use client";

import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor && anchor.getAttribute("href") !== "#") {
        const href = anchor.getAttribute("href");
        if (href) {
          const id = href.substring(1);
          const element = document.getElementById(id);

          if (element) {
            // Only prevent default and smooth scroll if it's a regular click (not Ctrl/Cmd + click)
            if (!event.ctrlKey && !event.metaKey) {
              event.preventDefault();
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
            // If Ctrl/Cmd is pressed, we do NOT prevent default.
            // We let the browser handle the navigation to the new tab with the hash,
            // which will then automatically scroll to the element.
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
}