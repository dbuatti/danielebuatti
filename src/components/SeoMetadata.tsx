"use client";

import React, { useEffect } from 'react';

interface SeoMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  canonical?: string; // Added canonical prop
}

const SeoMetadata: React.FC<SeoMetadataProps> = ({ title, description, image, url, canonical }) => {
  useEffect(() => {
    const originalTitle = document.title;
    const originalDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const originalOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const originalOgDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const originalOgImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const originalOgUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');

    // Helper to set or update a meta tag
    const setMeta = (property: string, content?: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or update canonical link
    const setCanonical = (href?: string) => {
      let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!href) {
        if (element) element.remove();
        return;
      }
      if (!element) {
        element = document.createElement('link');
        element.rel = 'canonical';
        document.head.appendChild(element);
      }
      element.href = href;
    };

    // Update Title
    if (title) {
      document.title = title;
    }

    // Update OG and Twitter tags
    setMeta('og:title', title);
    setMeta('twitter:title', title);
    setMeta('og:description', description);
    setMeta('twitter:description', description);
    setMeta('og:image', image);
    setMeta('twitter:image', image);
    setMeta('og:url', url);
    setMeta('twitter:url', url);
    
    // Update Canonical
    setCanonical(canonical || url);

    // Cleanup function to restore original metadata when component unmounts
    return () => {
      if (originalTitle) document.title = originalTitle;
      if (originalDescription) setMeta('name="description"', originalDescription);
      if (originalOgTitle) setMeta('og:title', originalOgTitle);
      if (originalOgDescription) setMeta('og:description', originalOgDescription);
      if (originalOgImage) setMeta('og:image', originalOgImage);
      if (originalOgUrl) setMeta('og:url', originalOgUrl);
      setCanonical(undefined);
    };
  }, [title, description, image, url, canonical]);

  return null;
};

export default SeoMetadata;