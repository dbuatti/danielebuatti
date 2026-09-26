import { useEffect } from "react";

// Site-wide scroll reveal. Tags each top-level <section> inside `root` (plus
// anything marked data-reveal) and fades it up the first time it enters the
// viewport. Content already on screen is revealed immediately so first paint
// never flashes. Opt a subtree out with data-no-reveal. The CSS lives in
// globals.css and only applies when the user allows motion.
const ScrollReveal = ({ root }: { root: React.RefObject<HTMLElement> }) => {
  useEffect(() => {
    const container = root.current;
    if (!container || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const arm = () => {
      const candidates = container.querySelectorAll<HTMLElement>("section, [data-reveal]");
      candidates.forEach((el) => {
        if (el.dataset.revealBound) return;
        if (el.closest("[data-no-reveal]")) return;
        // Only the outermost section animates; nested ones ride along.
        if (el.tagName === "SECTION" && el.parentElement?.closest("section")) return;
        el.dataset.revealBound = "1";
        el.setAttribute("data-reveal", "");
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-revealed");
        } else {
          io.observe(el);
        }
      });
    };

    arm();
    container.classList.add("reveal-armed");
    // Lazy routes and data-driven sections mount after this effect runs.
    const mo = new MutationObserver(arm);
    mo.observe(container, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [root]);

  return null;
};

export default ScrollReveal;
