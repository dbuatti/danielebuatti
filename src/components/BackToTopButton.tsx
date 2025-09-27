"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

const BackToTopButton = () => {
  const isVisible = useScrollVisibility(300); // Show button after scrolling 300px

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-opacity duration-300 ${
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