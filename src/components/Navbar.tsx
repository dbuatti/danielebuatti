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
// Removed DropdownMenu imports as it's no longer needed for Services

const Navbar = () => {
  const activeSection = useActiveSection();
  const location = useLocation();
  const { theme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  // Removed isServicesDropdownOpen state as it's no longer needed

  // Close the mobile sheet whenever the route changes
  React.useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  // Define main navigation links (excluding service-related ones and the new programs page)
  const mainNavLinks = navLinks.filter(link => 
    !link.href.startsWith("#") && // Exclude anchor links (though none exist now)
    link.name !== "Services" && 
    link.name !== "Programs" && 
    link.name !== "AMEB Accompanying" && 
    link.name !== "Live Piano Services"
  );

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
                  <Link key={link.name} to={link.href} className={commonClasses}>
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

          {/* Services Link for Desktop (no dropdown) */}
          <Link
            to="/services"
            className={cn(
              "text-sm font-medium transition-colors hover:text-brand-primary",
              location.pathname === "/services"
                ? "font-bold text-brand-primary dark:text-brand-primary border-b-[3px] border-brand-primary pb-2"
                : "text-brand-dark dark:text-brand-light"
            )}
          >
            Services
          </Link>

          {/* Programs Link */}
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

                {/* Services Link for Mobile (no dropdown) */}
                <Link
                  to="/services"
                  className={cn(
                    "text-lg font-medium hover:text-brand-primary",
                    location.pathname === "/services"
                      ? "font-bold text-brand-primary dark:text-brand-primary"
                      : "text-brand-dark dark:text-brand-light"
                  )}
                  onClick={() => setIsSheetOpen(false)}
                >
                  Services
                </Link>

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