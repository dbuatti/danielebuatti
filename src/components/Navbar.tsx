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

  // Close the mobile sheet whenever the route changes
  React.useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  const serviceLinks = [
    { name: "Services Overview", href: "/services" },
    { name: "Voice & Piano Coaching", href: "/book-voice-piano" },
    { name: "Healing & Body-Voice Integration", href: "/book-healing" },
    { name: "Presence & Communication", href: "/book-presence-communication" }, // New link
  ];

  // Define main navigation links (excluding service-related ones and the new programs page)
  const mainNavLinks = navLinks.filter(link => 
    !serviceLinks.some(service => service.href === link.href) && 
    link.name !== "Services" && 
    link.name !== "Programs" && // Exclude Programs from the direct main nav links
    !link.href.startsWith("/book-") &&
    link.name !== "AMEB Accompanying" && // Exclude from main nav
    link.name !== "Live Piano Services" // Exclude from main nav
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-brand-light/95 backdrop-blur supports-[backdrop-filter]:bg-brand-light/60 dark:bg-brand-dark/95 dark:supports-[backdrop-filter]:bg-brand-dark/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={() => window.scrollTo(0, 0)}>
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
                  <Link key={link.name} to={link.href} className={commonClasses} onClick={link.href === "/" ? () => window.scrollTo(0, 0) : undefined}>
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

          {/* New Programs Link */}
          <Link to="/programs" className={cn(
            "text-sm font-medium transition-colors hover:text-brand-primary",
            location.pathname === "/programs"
              ? "font-bold text-brand-primary dark:text-brand-primary border-b-[3px] border-brand-primary pb-2"
              : "text-brand-dark dark:text-brand-light"
          )}>
            Programs
          </Link>

          <Button asChild size="sm" className="h-9 px-3 bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
            <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
              Book a session
            </a>
          </Button>
          <ThemeToggle />
        </nav>
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Sheet key={isSheetOpen ? "open" : "closed"} open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                        <Link key={link.name} to={link.href} className={commonClasses} onClick={() => setIsSheetOpen(false)}>
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

                {/* New Programs Link for Mobile */}
                <Link to="/programs" onClick={() => setIsSheetOpen(false)} className={cn(
                  "text-lg font-medium hover:text-brand-primary",
                  location.pathname === "/programs"
                    ? "font-bold text-brand-primary dark:text-brand-primary"
                    : "text-brand-dark dark:text-brand-light"
                )}>
                  Programs
                </Link>

                <Button asChild size="lg" className="h-12 px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-brand-light mt-4">
                  <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer" onClick={() => setIsSheetOpen(false)}>
                    Book a session
                  </a>
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