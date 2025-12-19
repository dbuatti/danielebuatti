"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Star } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetOverlay } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import DynamicImage from "@/components/DynamicImage";
import { useTheme } from "next-themes";
import { navLinks } from "@/constants/navigation";

const Navbar = () => {
  const activeSection = useActiveSection();
  const location = useLocation();
  const { theme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Announcement Bar State
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed it in this browser session
    const isDismissed = localStorage.getItem("live-piano-banner-dismissed");
    if (!isDismissed) {
      setShowBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem("live-piano-banner-dismissed", "true");
  };

  useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  const renderNavLink = (link: typeof navLinks[0], isMobile = false) => {
    const commonClasses = cn(
      "font-medium transition-colors hover:text-brand-primary",
      isMobile ? "text-lg" : "text-sm",
      link.href && (link.href.startsWith("#")
        ? (activeSection === link.href.substring(1) || (link.href === "/" && activeSection === "home"))
        : location.pathname === link.href)
        ? "font-bold text-brand-primary dark:text-brand-primary" + (!isMobile ? " border-b-[3px] border-brand-primary pb-2" : "")
        : "text-brand-dark dark:text-brand-light"
    );

    if (link.href) {
      return (
        <Link 
          key={link.name} 
          to={link.href} 
          className={commonClasses} 
          onClick={() => isMobile && setIsSheetOpen(false)}
        >
          {link.name}
        </Link>
      );
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 1. THE BLACK BAR (Re-added here) */}
      {showBanner && (
        <div className="w-full bg-black text-white py-2.5 px-4 flex items-center justify-between border-b border-yellow-900/30 shadow-lg">
          <div className="flex-1 flex justify-center items-center gap-2.5 text-[10px] md:text-xs tracking-[0.2em] font-light">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="uppercase tracking-widest">Signature Live Piano & Vocals</span>
            <Link 
              to="/live-piano-services" 
              className="ml-3 text-yellow-500 hover:text-yellow-400 underline underline-offset-4 transition-colors font-medium"
            >
              EXPLORE THE GALLERY
            </Link>
          </div>
          <button 
            onClick={dismissBanner}
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. THE MAIN NAVBAR */}
      <div className="w-full border-b bg-brand-light/95 backdrop-blur supports-[backdrop-filter]:bg-brand-light/60 dark:bg-brand-dark/95 dark:supports-[backdrop-filter]:bg-brand-dark/60">
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
            {navLinks.map((link) => renderNavLink(link))}
            <Button asChild size="sm" className="h-9 px-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light rounded-full transition-transform hover:scale-105">
              <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
                Book Now
              </a>
            </Button>
          </nav>

          <div className="flex items-center md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-brand-dark dark:text-brand-light">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetOverlay className="bg-black/60 dark:bg-black/90" />
              <SheetContent side="right" className="w-[300px] bg-brand-light dark:bg-brand-dark">
                <nav className="flex flex-col gap-4 pt-8">
                  {navLinks.map((link) => renderNavLink(link, true))}
                  <Button asChild size="lg" className="h-12 px-6 py-3 bg-brand-primary text-brand-light mt-6 rounded-full">
                    <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
                      Book Now
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;