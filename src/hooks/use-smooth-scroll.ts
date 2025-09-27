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
            // Only prevent default if not trying to open in a new tab (e.g., Ctrl/Cmd + click)
            if (!event.ctrlKey && !event.metaKey) {
              event.preventDefault();
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            } else {
              // If Ctrl/Cmd is pressed, let the browser handle the default navigation
              // to open in a new tab with the hash.
              // We still want to scroll in the current tab if it's a regular click.
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
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