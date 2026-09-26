"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Gift, Menu, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { bookingHref, navLinks, serviceLinks } from "@/constants/navigation";

const BANNER_KEY = "live-piano-banner-dismissed";
const ease = [0.16, 1, 0.3, 1] as const;

const Logo = ({ className }: { className?: string }) => (
  <Link to="/" className={cn("flex items-center gap-2.5 shrink-0", className)} aria-label="Daniele Buatti, home">
    <img src="/blue-pink-ontrans.png" alt="" className="h-8 w-8" width={32} height={32} />
    <img src="/logo-dark-blue-transparent-25.png" alt="Daniele Buatti" className="h-10 w-auto" width={122} height={40} />
  </Link>
);

// Announcement strip for the Live Piano service. Dismissal lasts the session.
const AnnouncementBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!sessionStorage.getItem(BANNER_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(BANNER_KEY, "true");
    } catch {
      /* storage unavailable; dismissal just won't persist */
    }
  };

  return (
    <div className="relative bg-[#0b0b0d] text-white/90">
      <div className="container flex h-10 items-center justify-center gap-3 text-[11px] tracking-[0.18em] uppercase">
        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" aria-hidden="true" />
        <span className="hidden sm:inline">Signature live piano & vocals</span>
        <Link
          to="/live-piano-services"
          className="text-yellow-500 underline-offset-4 hover:underline hover:text-yellow-400 transition-colors"
        >
          Explore the gallery
        </Link>
      </div>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/50 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

// Shared underline that glides between the active desktop nav items.
const ActiveIndicator = () => (
  <motion.span
    layoutId="nav-active-indicator"
    className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-brand-primary"
    transition={{ type: "spring", stiffness: 420, damping: 36 }}
  />
);

const Navbar = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number>();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const isServiceActive = serviceLinks.some((s) => pathname.startsWith(s.href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes whichever menu is open; clicks outside close the mega-menu.
  useEffect(() => {
    if (!menuOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen, mobileOpen]);

  // Lock page scroll behind the full-screen mobile menu.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const openMenu = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMenuOpen(true);
  }, []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), 140);
  }, []);

  const linkBase =
    "relative inline-flex h-10 items-center px-3 text-[15px] font-medium transition-colors hover:text-brand-dark";

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300",
          scrolled || menuOpen
            ? "border-b border-border/70 bg-background/80 shadow-[0_1px_0_hsl(var(--border)/0.4),0_10px_30px_-20px_hsl(229_44%_14%/0.35)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-background",
        )}
      >
        <div className="container flex h-[72px] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            <div ref={menuRef} className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
              <button
                type="button"
                className={cn(linkBase, isServiceActive || menuOpen ? "text-brand-dark" : "text-brand-dark/70")}
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => setMenuOpen((o) => !o)}
              >
                Work with me
                <ChevronDown
                  className={cn("ml-1 h-4 w-4 transition-transform duration-300", menuOpen && "rotate-180")}
                  aria-hidden="true"
                />
                {isServiceActive && <ActiveIndicator />}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    id={menuId}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.22, ease }}
                    className="absolute left-1/2 top-full z-50 w-[760px] -translate-x-1/2 pt-3"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lifted">
                      <div className="grid grid-cols-[1fr_220px]">
                        <ul className="grid grid-cols-2 gap-1 p-3">
                          {serviceLinks.map((s, i) => {
                            const active = pathname.startsWith(s.href);
                            return (
                              // Lessons (the main offering) takes the full top row.
                              <li key={s.href} className={i === 0 ? "col-span-2" : undefined}>
                                <Link
                                  to={s.href}
                                  className={cn(
                                    "group flex gap-3 rounded-xl p-3 transition-colors hover:bg-secondary",
                                    active && "bg-secondary",
                                  )}
                                >
                                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-brand-dark/70 transition-colors group-hover:border-brand-primary/30 group-hover:text-brand-primary">
                                    <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                                  </span>
                                  <span>
                                    <span className="block text-[15px] font-medium text-brand-dark">{s.name}</span>
                                    <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                                      {s.description}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="flex flex-col justify-between border-l border-border bg-secondary/60 p-5">
                          <div>
                            <p className="eyebrow">New students</p>
                            <p className="mt-2 font-serif text-xl leading-snug text-brand-dark">
                              Book a lesson in Toorak or online.
                            </p>
                          </div>
                          <div className="space-y-3">
                            <Link
                              to={bookingHref}
                              className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary"
                            >
                              Check availability
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link
                              to="/gift-cards"
                              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-dark transition-colors"
                            >
                              <Gift className="h-4 w-4" aria-hidden="true" /> Gift cards
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(linkBase, active ? "text-brand-dark" : "text-brand-dark/70")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.name}
                  {active && <ActiveIndicator />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to={bookingHref}
              className="hidden sm:inline-flex h-10 items-center rounded-full bg-brand-dark px-5 text-sm font-medium text-brand-light transition-all hover:bg-brand-primary hover:shadow-soft"
            >
              Book a lesson
            </Link>
            <button
              type="button"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-dark hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>{mobileOpen && <MobileMenu pathname={pathname} onClose={() => setMobileOpen(false)} />}</AnimatePresence>
    </>
  );
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

const MobileMenu = ({ pathname, onClose }: { pathname: string; onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-[60] flex flex-col bg-background lg:hidden"
    role="dialog"
    aria-modal="true"
    aria-label="Menu"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease }}
  >
    <div className="container flex h-[72px] items-center justify-between">
      <Logo />
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-dark hover:bg-secondary transition-colors"
        aria-label="Close menu"
        autoFocus
      >
        <X className="h-6 w-6" />
      </button>
    </div>

    <motion.nav
      className="container flex-1 overflow-y-auto pb-10 pt-4"
      variants={listVariants}
      initial="hidden"
      animate="show"
      aria-label="Main"
    >
      <motion.p variants={itemVariants} className="eyebrow mb-3">
        Work with me
      </motion.p>
      <ul className="space-y-1">
        {serviceLinks.map((s) => (
          <motion.li key={s.href} variants={itemVariants}>
            <Link
              to={s.href}
              className={cn(
                "flex items-baseline justify-between gap-4 border-b border-border/70 py-3",
                pathname.startsWith(s.href) ? "text-brand-primary" : "text-brand-dark",
              )}
            >
              <span className="font-serif text-[26px] leading-tight">{s.name}</span>
            </Link>
          </motion.li>
        ))}
      </ul>

      <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
        {[...navLinks, { name: "Gift Cards", href: "/gift-cards" }].map((link) => (
          <motion.li key={link.href} variants={itemVariants}>
            <Link
              to={link.href}
              className={cn(
                "text-lg",
                pathname === link.href ? "text-brand-primary font-medium" : "text-brand-dark/80",
              )}
            >
              {link.name}
            </Link>
          </motion.li>
        ))}
      </ul>

      <motion.div variants={itemVariants} className="mt-10">
        <Link
          to={bookingHref}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-dark text-base font-medium text-brand-light"
        >
          Book a lesson <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </motion.nav>
  </motion.div>
);

export default Navbar;
