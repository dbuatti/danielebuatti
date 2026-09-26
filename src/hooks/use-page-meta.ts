import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL, pageMeta, type PagePath } from "@/seo/pages";

type MetaAttr = "name" | "property";

// Sets a <meta> tag's content, creating the tag if needed. Returns a function
// that restores the tag to its previous state.
function setMeta(attr: MetaAttr, key: string, content: string): () => void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  const created = !tag;
  const prev = tag?.getAttribute("content") ?? null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);

  return () => {
    if (created) tag!.remove();
    else if (prev !== null) tag!.setAttribute("content", prev);
  };
}

interface PageMetaOptions {
  // Keep this page out of search results (404s, confirmation pages, etc.).
  noindex?: boolean;
  // Share image path under /public, e.g. "/og/home.jpg".
  image?: string;
}

// This SPA has no per-route <head> management (no react-helmet), so every page
// inherits index.html's title/description unless it sets its own. Also keeps the
// Open Graph / Twitter tags and canonical URL in step so shared links and search
// results show this page rather than the homepage. Restores the previous values
// on unmount so navigating away doesn't leave this page's meta stuck on another
// route.
export function usePageMeta(title: string, description: string, options: PageMetaOptions = {}) {
  const { pathname } = useLocation();
  const { noindex = false, image } = options;

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const url = `${SITE_URL}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
    const restorers = [
      setMeta("name", "description", description),
      setMeta("property", "og:title", title),
      setMeta("property", "og:description", description),
      setMeta("property", "og:url", url),
      setMeta("property", "twitter:title", title),
      setMeta("property", "twitter:description", description),
      setMeta("property", "twitter:url", url),
    ];
    if (noindex) restorers.push(setMeta("name", "robots", "noindex, follow"));
    if (image) {
      restorers.push(setMeta("property", "og:image", `${SITE_URL}${image}`));
      restorers.push(setMeta("property", "twitter:image", `${SITE_URL}${image}`));
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonical;
    const prevCanonical = canonical?.getAttribute("href") ?? null;
    if (!noindex) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    } else if (canonical) {
      // A noindex page shouldn't claim the canonical URL index.html ships with.
      canonical.remove();
    }

    return () => {
      document.title = prevTitle;
      restorers.forEach((restore) => restore());
      if (!canonical) return;
      if (noindex) {
        document.head.appendChild(canonical);
      } else if (createdCanonical) {
        canonical.remove();
      } else if (prevCanonical !== null) {
        canonical.setAttribute("href", prevCanonical);
      }
    };
  }, [title, description, pathname, noindex, image]);
}

// Applies a public page's entry from src/seo/pages.ts.
export function useRouteMeta(path: PagePath) {
  const { title, description, image } = pageMeta[path];
  usePageMeta(title, description, { image });
}
