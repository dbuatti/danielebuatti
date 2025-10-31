"use client";

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant', // Use instant behavior for immediate reset
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;