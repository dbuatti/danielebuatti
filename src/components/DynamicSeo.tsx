"use client";

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// --- Favicon Paths ---
const COACH_FAVICON_PATH = '/blue-pink-ontrans.png?v=1';
const PIANO_FAVICON_PATH = '/gold-36.png';

// --- SEO Metadata Definitions ---
const COACH_SEO = {
  title: "Daniele Buatti | Embodied Coaching for Performers & Communicators",
  description: "Unlock your true voice and master your presence with Daniele Buatti's holistic coaching. Blending musical training with body awareness and mindset techniques for confident, authentic expression.",
  image: "https://danielebuatti.com/headshot.jpeg", // Using a coach-related image
};

const PIANO_SEO = {
  title: "Daniele Buatti | Premium Live Piano & Music Director Services",
  description: "Elevate your event with professional live piano music. Offering bespoke entertainment for weddings, corporate events, and private parties, delivered with elegance and versatility.",
  image: "https://danielebuatti.com/blacktie.avif", // Using a piano/entertainer image
};

const DynamicSeo: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    // Determine if we are on a "Piano/Black & Gold" themed page
    const isPianoTheme = path.startsWith('/live-piano-services') || path.startsWith('/quotes/');
    
    const { title, description, image } = isPianoTheme ? PIANO_SEO : COACH_SEO;
    const faviconPath = isPianoTheme ? PIANO_FAVICON_PATH : COACH_FAVICON_PATH;

    // 1. Update Favicon
    const ensureFavicon = (rel: string, path: string) => {
      let link: HTMLLinkElement | null = document.querySelector(`link[rel*='${rel}']`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      
      if (link.href.indexOf(path) === -1) {
          link.href = path;
      }
    };

    ensureFavicon('icon', faviconPath);
    ensureFavicon('shortcut icon', faviconPath);

    // 2. Update Title
    document.title = title;

    // 3. Update Meta Tags
    const updateMeta = (property: string, content: string, isName = false) => {
      const selector = isName ? `meta[name='${property}']` : `meta[property='${property}']`;
      let meta: HTMLMetaElement | null = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (isName) {
          meta.name = property;
        } else {
          meta.setAttribute('property', property);
        }
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.content = content;
    };

    // Open Graph / Facebook
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:url', `https://danielebuatti.com${path}`);

    // Twitter
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:url', `https://danielebuatti.com${path}`);
    updateMeta('twitter:card', 'summary_large_image'); // Ensure card type is set

  }, [path]);

  return null;
};

export default DynamicSeo;