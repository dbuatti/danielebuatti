import { useEffect, useState, useRef } from "react";
import { navLinks } from "@/constants/navigation";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "-50% 0px -50% 0px", // Trigger when 50% of the section is in view
        threshold: 0,
      },
    );

    const sections = navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => document.getElementById(link.href.substring(1)))
      .filter(Boolean) as HTMLElement[];

    sections.forEach((section) => {
      if (observer.current) {
        observer.current.observe(section);
      }
    });

    // Handle initial load if no section is intersecting (e.g., at the very top)
    const handleScroll = () => {
      if (window.scrollY === 0 && activeSection !== "home") {
        setActiveSection("home");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => {
      if (observer.current) {
        sections.forEach((section) => {
          if (observer.current) {
            observer.current.unobserve(section);
          }
        });
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]); // Re-run if activeSection changes to ensure correct initial state

  return activeSection;
}