"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

const BackToTopButton = () => {
  const isVisible = useScrollVisibility(300); // Show button after scrolling 300px

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-20 right-6 z-50 transition-opacity duration-300 motion-reduce:transition-none md:bottom-8 md:right-8 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Button
        size="icon"
        className="rounded-full bg-brand-primary hover:bg-brand-primary/90 text-brand-light shadow-lg"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default BackToTopButton;