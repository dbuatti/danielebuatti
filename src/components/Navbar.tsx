"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "@/constants/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import DynamicImage from "@/components/DynamicImage";
import { useTheme } from "next-themes";

const Navbar = () => {
  const activeSection = useActiveSection();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsSheetOpen(false); // Close the sheet immediately

    if (href.startsWith('/')) {
      event.preventDefault(); // Prevent default for internal routes to use navigate
      // Add a small delay to allow the sheet to visually close before navigating
      setTimeout(() => {
        if (href === '/' && location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          navigate(href);
        }
      }, 100); // 100ms delay
    } else if (href.startsWith('#')) {
      event.preventDefault(); // Prevent default browser jump for anchor links
      event.stopPropagation(); // Prevent global useSmoothScroll from interfering
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Calculate scroll position with offset for sticky header
        const headerOffset = 64; // Height of the sticky Navbar (h-16 = 64px)
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        // Use a small timeout to ensure the sheet has closed and DOM is stable before scrolling
        setTimeout(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 50); // 50ms delay
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-brand-light/95 backdrop-blur supports-[backdrop-filter]:bg-brand-light/60 dark:bg-brand-dark/95 dark:supports-[backdrop-filter]:bg-brand-dark/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <DynamicImage
            src={brandSymbolSrc}
            alt="Daniele Buatti Brand Symbol"
            className="h-8 w-auto"
            width={32}
            height={32}
          />
          <DynamicImage
            src={textLogoSrc}
            alt="Daniele Buatti Logo"
            className="h-12 w-auto"
            width={220}
            height={48}
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith("#")
              ? (activeSection === link.href.substring(1) || (link.href === "/" && activeSection === "home"))
              : location.pathname === link.href;

            const commonClasses = cn(
              "text-sm font-medium transition-colors hover:text-brand-primary",
              isActive
                ? "font-bold text-brand-primary dark:text-brand-primary border-b-[3px] border-brand-primary pb-2"
                : "text-brand-dark dark:text-brand-light"
            );

            if (link.href.startsWith('/')) {
              return (
                <Link key={link.name} to={link.href} className={commonClasses}>
                  {link.name}
                </Link>
              );
            } else {
              return (
                <a key={link.name} href={link.href} className={commonClasses} onClick={(e) => handleLinkClick(e, link.href)}>
                  {link.name}
                </a>
              );
            }
          })}
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
            <a href="#sessions" onClick={(e) => handleLinkClick(e, "#sessions")}>Book a Lesson</a>
          </Button>
          <ThemeToggle />
        </nav>
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-dark dark:text-brand-light"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-brand-light dark:bg-brand-dark">
              <nav className="flex flex-col gap-4 pt-6">
                {navLinks.map((link) => {
                  const isActive = link.href.startsWith("#")
                    ? (activeSection === link.href.substring(1) || (link.href === "/" && activeSection === "home"))
                    : location.pathname === link.href;

                  const commonClasses = cn(
                    "text-lg font-medium hover:text-brand-primary",
                    isActive
                      ? "font-bold text-brand-primary dark:text-brand-primary"
                      : "text-brand-dark dark:text-brand-light"
                  );

                  if (link.href.startsWith('/')) {
                    return (
                      <Link key={link.name} to={link.href} className={commonClasses} onClick={(e) => handleLinkClick(e, link.href)}>
                        {link.name}
                      </Link>
                    );
                  } else {
                    return (
                      <a key={link.name} href={link.href} className={commonClasses} onClick={(e) => handleLinkClick(e, link.href)}>
                        {link.name}
                      </a>
                    );
                  }
                })}
                <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light mt-4">
                  <a href="#sessions" onClick={(e) => handleLinkClick(e, "#sessions")}>Book a Lesson</a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;