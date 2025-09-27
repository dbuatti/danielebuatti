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
            event.preventDefault();
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
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