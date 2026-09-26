"use client";

import { Suspense, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLoader from '@/components/PageLoader';
import ScrollReveal from '@/components/ScrollReveal';

const RootLayout = () => {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  // Admin sub-pages share one layout, so don't replay the page transition
  // (and remount AdminLayout) on every admin navigation.
  const transitionKey = pathname.startsWith('/admin') ? 'admin' : pathname;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-dark focus:px-4 focus:py-2 focus:text-brand-light"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" ref={mainRef} className="flex-1">
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </motion.div>
        </main>
        <ScrollReveal root={mainRef} />
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default RootLayout;
