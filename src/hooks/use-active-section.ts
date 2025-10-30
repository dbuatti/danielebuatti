import { useEffect, useState, useRef, useCallback } from "react";
import { navLinks } from "@/constants/navigation";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeSectionStateRef = useRef<string | null>(null); // Ref to hold the current activeSection state for the observer callback

  // Update the ref whenever activeSection state changes
  useEffect(() => {
    activeSectionStateRef.current = activeSection;
  }, [activeSection]);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  }, []); // No dependencies, so this function is stable

  useEffect(() => {
    // Initialize observer only once
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        handleIntersect, // Use the stable callback
        {
          root: null, // viewport
          rootMargin: "-50% 0px -50% 0px", // Trigger when 50% of the section is in view
          threshold: 0,
        },
      );
    }

    // Flatten all anchor links from navLinks and subLinks
    const allAnchorHrefs: string[] = [];
    navLinks.forEach(link => {
      if (typeof link.href === 'string' && link.href.startsWith('#')) {
        allAnchorHrefs.push(link.href);
      }
      if (link.type === 'dropdown' && link.subLinks) {
        link.subLinks.forEach(subLink => {
          if (typeof subLink.href === 'string' && subLink.href.startsWith('#')) {
            allAnchorHrefs.push(subLink.href);
          }
        });
      }
    });

    const sections = allAnchorHrefs
      .map((href) => document.getElementById(href.substring(1)))
      .filter(Boolean) as HTMLElement[];

    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    // Handle initial load if no section is intersecting (e.g., at the very top)
    const handleScroll = () => {
      if (window.scrollY === 0 && activeSectionStateRef.current !== "home") { // Use ref here
        setActiveSection("home");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => {
      if (observerRef.current) {
        sections.forEach((section) => {
          if (observerRef.current) {
            observerRef.current.unobserve(section);
          }
        });
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleIntersect]); // Dependency on handleIntersect, which is stable due to useCallback

  return activeSection;
}