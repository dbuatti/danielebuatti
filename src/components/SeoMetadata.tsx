"use client";

import React, { useEffect } from 'react';

interface SeoMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  canonical?: string;
}

const SeoMetadata: React.FC<SeoMetadataProps> = ({ title, description, image, url, canonical }) => {
  useEffect(() => {
    const originalTitle = document.title;
    const originalDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');

    // Helper to set or update a meta tag by property (OG/Twitter)
    const setMetaProperty = (property: string, content?: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or update a meta tag by name (Standard SEO)
    const setMetaName = (name: string, content?: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
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

    // Update Standard Description
    setMetaName('description', description);

    // Update OG and Twitter tags
    setMetaProperty('og:title', title);
    setMetaProperty('twitter:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('twitter:description', description);
    setMetaProperty('og:image', image);
    setMetaProperty('twitter:image', image);
    setMetaProperty('og:url', url);
    setMetaProperty('twitter:url', url);
    
    // Update Canonical
    setCanonical(canonical || url);

    // Cleanup function to restore original metadata when component unmounts
    return () => {
      if (originalTitle) document.title = originalTitle;
      if (originalDescription) setMetaName('description', originalDescription);
      setCanonical(undefined);
    };
  }, [title, description, image, url, canonical]);

  return null;
};

export default SeoMetadata;