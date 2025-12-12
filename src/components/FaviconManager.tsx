"use client";

import { useEffect } from 'react';

const BRAND_FAVICON_PATH = '/blue-pink-ontrans.png?v=1';

const FaviconManager: React.FC = () => {
  useEffect(() => {
    // Function to ensure a specific link element exists and points to the correct favicon path
    const ensureFavicon = (rel: string, path: string) => {
      let link: HTMLLinkElement | null = document.querySelector(`link[rel*='${rel}']`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      
      // Only update if the path is different to avoid unnecessary DOM manipulation
      if (link.href.indexOf(path) === -1) {
          link.href = path;
      }
    };

    // Ensure both 'icon' and 'shortcut icon' are set
    ensureFavicon('icon', BRAND_FAVICON_PATH);
    ensureFavicon('shortcut icon', BRAND_FAVICON_PATH);

  }, []);

  return null;
};

export default FaviconManager;