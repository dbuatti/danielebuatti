import { useEffect } from "react";

// This SPA has no per-route <head> management (no react-helmet), so every page
// inherits index.html's title/description unless it sets its own. Restores the
// previous values on unmount so navigating away doesn't leave this page's title
// stuck on another route.
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const descTag = document.querySelector('meta[name="description"]');
    const prevDescription = descTag?.getAttribute("content") ?? null;

    document.title = title;
    if (descTag) descTag.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      if (descTag && prevDescription !== null) descTag.setAttribute("content", prevDescription);
    };
  }, [title, description]);
}
