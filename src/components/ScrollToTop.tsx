"use client";

import { useEffect, type PropsWithChildren } from 'react'; // Import PropsWithChildren
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC<PropsWithChildren> = ({ children }) => { // Accept children prop
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>; // Render children
};

export default ScrollToTop;