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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


const Navbar = () => {
  const activeSection = useActiveSection();
  const location = useLocation();
  const { theme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Close the mobile sheet whenever the route changes
  React.useEffect(() => {
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

    if (link.type === "dropdown" && link.subLinks) {
      return (
        <DropdownMenu key={link.name}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn(commonClasses, "h-auto px-0 py-0")}>
              {link.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
            {link.subLinks.map((subLink, index) => (
              <React.Fragment key={subLink.name}>
                <DropdownMenuItem asChild>
                  {subLink.href.startsWith('/') ? (
                    <Link to={subLink.href} className="block px-2 py-1.5 text-sm text-brand-dark dark:text-brand-light hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50" onClick={() => setIsSheetOpen(false)}>
                      {subLink.name}
                    </Link>
                  ) : (
                    <a href={subLink.href} className="block px-2 py-1.5 text-sm text-brand-dark dark:text-brand-light hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50" onClick={() => setIsSheetOpen(false)}>
                      {subLink.name}
                    </a>
                  )}
                </DropdownMenuItem>
                {index < link.subLinks.length - 1 && <DropdownMenuSeparator className="bg-brand-secondary/30" />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else if (link.href) {
      if (link.href.startsWith('/')) {
        return (
          <Link key={link.name} to={link.href} className={commonClasses} onClick={() => isMobile && setIsSheetOpen(false)}>
            {link.name}
          </Link>
        );
      } else {
        return (
          <a key={link.name} href={link.href} className={commonClasses} onClick={() => isMobile && setIsSheetOpen(false)}>
            {link.name}
          </a>
        );
      }
    }
    return null;
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
          {navLinks.map((link) => renderNavLink(link))}
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
                {navLinks.map((link) => {
                  if (link.type === "dropdown" && link.subLinks) {
                    return (
                      <div key={link.name} className="space-y-2">
                        <h3 className="text-lg font-bold text-brand-primary">{link.name}</h3>
                        <ul className="ml-4 space-y-1">
                          {link.subLinks.map((subLink) => (
                            <li key={subLink.name}>
                              {subLink.href.startsWith('/') ? (
                                <Link to={subLink.href} className="text-brand-dark dark:text-brand-light hover:text-brand-primary text-base" onClick={() => setIsSheetOpen(false)}>
                                  {subLink.name}
                                </Link>
                              ) : (
                                <a href={subLink.href} className="text-brand-dark dark:text-brand-light hover:text-brand-primary text-base" onClick={() => setIsSheetOpen(false)}>
                                  {subLink.name}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return renderNavLink(link, true);
                })}

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