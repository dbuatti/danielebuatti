import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "@/constants/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils"; // Import cn utility

const Navbar = () => {
  const activeSection = useActiveSection();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-brand-light/95 backdrop-blur supports-[backdrop-filter]:bg-brand-light/60 dark:bg-brand-dark/95 dark:supports-[backdrop-filter]:bg-brand-dark/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="inline-block font-bold text-brand-primary text-xl">Daniele Buatti</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-primary",
                activeSection === link.href.substring(1) || (link.href === "/" && activeSection === "home")
                  ? "text-brand-primary dark:text-brand-primary border-b-2 border-brand-primary pb-1" // Added border-b-2 and pb-1 for active state
                  : "text-brand-dark dark:text-brand-light"
              )}
            >
              {link.name}
            </a>
          ))}
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
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium hover:text-brand-primary",
                      activeSection === link.href.substring(1) || (link.href === "/" && activeSection === "home")
                        ? "text-brand-primary dark:text-brand-primary"
                        : "text-brand-dark dark:text-brand-light"
                    )}
                  >
                    {link.name}
                  </a>
                ))}
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