"use client";

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Sun, Moon, LogIn, User } from 'lucide-react';
import DynamicImage from './DynamicImage';
import { useTheme } from 'next-themes';
import { useSession } from './SessionContextProvider';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useSession();
  const location = useLocation();

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  // Close sheet on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Programs', path: '/programs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-brand-light dark:bg-brand-dark border-b border-brand-secondary/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
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
            className="h-10 w-auto hidden md:block"
            width={160}
            height={40}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-lg font-medium transition-colors hover:text-brand-primary",
                location.pathname === item.path ? "text-brand-primary" : "text-brand-dark dark:text-brand-light"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button asChild size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-brand-darker rounded-full px-4 py-2 text-base">
            <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
          </Button>
          {user ? (
            <Button asChild variant="ghost" size="icon" className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20">
              <Link to="/admin">
                <User className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="icon" className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20">
              <Link to="/login">
                <LogIn className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <Button asChild variant="ghost" size="icon" className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20">
              <Link to="/admin">
                <User className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="icon" className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20">
              <Link to="/login">
                <LogIn className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light border-l border-brand-secondary/50 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <Link to="/" className="flex items-center gap-2">
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
                    className="h-10 w-auto"
                    width={160}
                    height={40}
                  />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-brand-dark dark:text-brand-light hover:bg-brand-secondary/20">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="flex flex-col gap-4 flex-grow">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "text-xl font-medium py-2 transition-colors hover:text-brand-primary",
                      location.pathname === item.path ? "text-brand-primary" : "text-brand-dark dark:text-brand-light"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild size="lg" className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-darker rounded-full px-6 py-3 text-lg">
                  <a href="https://danielebuatti.as.me/" target="_blank" rel="noopener noreferrer">
                    Book Now
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;