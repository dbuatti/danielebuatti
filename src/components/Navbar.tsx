import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "@/constants/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import DynamicImage from "@/components/DynamicImage";

const Navbar = () => {
  const activeSection = useActiveSection();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-brand-light/95 backdrop-blur supports-[backdrop-filter]:bg-brand-light/60 dark:bg-brand-dark/95 dark:supports-[backdrop-filter]:bg-brand-dark/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <DynamicImage
            src="/blue-pink-ontrans.png"
            alt="Daniele Buatti Brand Symbol"
            className="h-8 w-auto"
            width={32}
            height={32}
          />
          <DynamicImage
            src="/logo-dark-blue-transparent-25.png"
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
                <a key={link.name} href={link.href} className={commonClasses}>
                  {link.name}
                </a>
              );
            }
          })}
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
            <a href="#contact">Book a Session</a>
          </Button>
          <ThemeToggle />
        </nav>
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Sheet>
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
                <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light mt-4">
                  <a href="#contact">Book a Session</a>
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