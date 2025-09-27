"use client";

import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      // Ensure it's a valid anchor link and not just '#'
      if (anchor && anchor.getAttribute("href") !== "#") {
        const href = anchor.getAttribute("href");
        if (href) {
          const id = href.substring(1);
          const element = document.getElementById(id);

          // Only perform smooth scroll for regular left-clicks (not Ctrl/Cmd + click)
          if (element && event.button === 0 && !event.ctrlKey && !event.metaKey) {
            event.preventDefault(); // Prevent default jump
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
          // If it's a Ctrl/Cmd click, or not a left-click, or element not found,
          // we do NOT call preventDefault(). The browser's default behavior will take over.
          // For Ctrl/Cmd click, this means opening in a new tab and letting the browser
          // handle the hash navigation in that new tab.
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
}