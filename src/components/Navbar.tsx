"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DynamicImage from './DynamicImage';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { name: "Coaching", href: "/coaching" },
  { name: "Live Piano", href: "/live-piano-services" },
  { name: "Resources", href: "/projects-resources" },
  { name: "Contact", href: "/contact" },
];

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800 transition-colors">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-5xl mx-auto">
        {/* Logo/Home Link */}
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <DynamicImage src="/gold-36.png" alt="Daniele Buatti Logo" className="h-8 w-8" width={32} height={32} />
          <span className="hidden sm:inline-block font-semibold text-lg text-gray-900 dark:text-white">Daniele Buatti</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-brand-primary dark:hover:text-brand-primary text-gray-600 dark:text-gray-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-950">
            <div className="flex flex-col space-y-4 pt-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-lg font-medium py-2 text-gray-800 dark:text-gray-200 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;