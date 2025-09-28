"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetOverlay } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "@/constants/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import DynamicImage from "@/components/DynamicImage";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const activeSection = useActiveSection();
  const location = useLocation();
  const { theme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = React.useState(false);

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  const serviceLinks = [
    { name: "Services Overview", href: "/services" },
    { name: "Voice & Piano Coaching", href: "/voice-piano-services" },
    { name: "Healing & Body-Voice Integration", href: "/book-healing" },
    { name: "AMEB Accompanying", href: "/ameb-accompanying" },
    { name: "Live Piano Services", href: "/live-piano-services" },
  ];

  // Define main navigation links (excluding service-related ones)
  const mainNavLinks = navLinks.filter(link => 
    !serviceLinks.some(service => service.href === link.href) && 
    link.name !== "Services" && // Exclude the main "Services" link if it's handled by dropdown
    !link.href.startsWith("/book-") // Exclude direct booking links from main nav
  );

  // Define common classes for the custom trigger
  const servicesTriggerClasses = cn(
    "text-sm font-medium transition-colors hover:text-brand-primary",
    "px-3 py-2 rounded-md cursor-pointer",
    "bg-transparent hover:bg-transparent",
    "font-bold text-brand-primary dark:text-brand-primary border-2 border-brand-primary"
  );

  // Timeout ref for delayed closing
  const timeoutRef = React.useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-brand-light/95 backdrop-blur supports-[backdrop-filter]:bg-brand-light/60 dark:bg-brand-dark/95 dark:supports-[backdrop-filter]:bg-brand-dark/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={scrollToTop}> {/* Added onClick={scrollToTop} */}
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
          {mainNavLinks.map((link) => {
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
                  <Link key={link.name} to={link.href} className={commonClasses} onClick={link.href === "/" ? scrollToTop : undefined}> {/* Added onClick for Home link */}
                    {link.name}
                  </Link>
                );
              } else {
                return (
                  <a key={link.name} href={link.href} className={commonClasses}>
                    {link.name}
                  </a>
                );
              }
            })}

          {/* Services Dropdown for Desktop */}
          <DropdownMenu open={isServicesDropdownOpen} onOpenChange={setIsServicesDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <span
                className={servicesTriggerClasses}
                role="button"
                tabIndex={0}
                onPointerEnter={handleMouseEnter}
                onPointerLeave={handleMouseLeave}
                aria-label="Toggle services menu"
              >
                Services
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-brand-light dark:bg-brand-dark border-brand-secondary"
              onPointerEnter={handleMouseEnter}
              onPointerLeave={handleMouseLeave}
            >
              {serviceLinks.map((service) => (
                <DropdownMenuItem key={service.name} asChild>
                  <Link to={service.href} className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark-alt">
                    {service.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
            Book a session
          </Link>
          <ThemeToggle />
        </nav>
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Sheet key={location.pathname} open={isSheetOpen} onOpenChange={setIsSheetOpen}> {/* Added key={location.pathname} */}
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-dark dark:text-brand-light"
                aria-label="Open main menu"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetOverlay className="bg-black/60 dark:bg-black/90" />
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-brand-light dark:bg-brand-dark">
              <nav className="flex flex-col gap-4 pt-6">
                {mainNavLinks.map((link) => {
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
                        <Link key={link.name} to={link.href} className={commonClasses} onClick={link.href === "/" ? () => { scrollToTop(); setIsSheetOpen(false); } : () => setIsSheetOpen(false)}> {/* Added onClick for Home link and close sheet */}
                          {link.name}
                        </Link>
                      );
                    } else {
                      return (
                        <a key={link.name} href={link.href} className={commonClasses} onClick={() => setIsSheetOpen(false)}>
                          {link.name}
                        </a>
                      );
                    }
                  })}

                {/* Services Dropdown for Mobile (inside Sheet) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span
                      className={cn(
                        "text-lg font-medium justify-start w-full px-4 py-2 rounded-md cursor-pointer",
                        "bg-transparent hover:bg-transparent",
                        "font-bold text-brand-primary dark:text-brand-primary border-2 border-brand-primary"
                      )}
                      role="button"
                      tabIndex={0}
                      aria-label="Toggle services menu"
                    >
                      Services
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-brand-light dark:bg-brand-dark border-brand-secondary w-[calc(100%-2rem)] ml-4">
                    {serviceLinks.map((service) => (
                      <DropdownMenuItem key={service.name} asChild>
                        <Link to={service.href} className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20 dark:hover:bg-brand-dark-alt" onClick={() => setIsSheetOpen(false)}>
                          {service.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/services" onClick={() => setIsSheetOpen(false)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-brand-light mt-4">
                  Book a session
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;