"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from "next-themes"; // Import useTheme to get current theme
import { Loader2 } from 'lucide-react'; // Import a loading icon

interface CalEmbedProps {
  calLink: string; // Expected format: "danielebuatti/30min"
  layout?: "month_view" | "week_view" | "day_view";
}

const CalEmbed: React.FC<CalEmbedProps> = ({ calLink, layout = "month_view" }) => {
  const { theme } = useTheme(); // Get the current theme
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Extract namespace from calLink (e.g., "30min" from "danielebuatti/30min")
    const parts = calLink.split('/');
    const namespace = parts[parts.length - 1];

    if (!namespace) {
      console.error("CalEmbed: Invalid calLink provided. Could not extract namespace.");
      setIsLoading(false); // Stop loading if invalid link
      return;
    }

    const embedId = `my-cal-inline-${namespace}`;

    // Ensure Cal.com embed script is loaded
    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const ns = ar[1];
          // @ts-ignore
          api.q = api.q || []; // Suppress TS7022 error for external script
          if (typeof ns === "string") {
            cal.ns[ns] = cal.ns[ns] || api;
            p(cal.ns[ns], ar);
            p(cal, ["initNamespace", ns]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // Initialize Cal.com embed using the provided structure
    (window as any).Cal("init", namespace, { origin: "https://app.cal.com" });

    (window as any).Cal.ns[namespace]("inline", {
      elementOrSelector: `#${embedId}`,
      config: { layout: layout },
      calLink: calLink, // This is the relative path, e.g., "danielebuatti/30min"
    });

    (window as any).Cal.ns[namespace]("ui", {
      cssVarsPerTheme: {
        light: { "cal-brand": "#00022D" },
        dark: { "cal-brand": "#fafafa" }
      },
      hideEventTypeDetails: false,
      layout: layout
    });

    // Set loading to false after a short delay to ensure the embed has time to render
    // A small delay helps prevent flickering if the embed loads very quickly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust delay as needed

    // Clean up function to clear the embed content when component unmounts
    return () => {
      clearTimeout(timer);
      const embedElement = document.getElementById(embedId);
      if (embedElement) {
        embedElement.innerHTML = ''; // Clear content
      }
    };
  }, [calLink, layout, theme]); // Re-run if calLink, layout, or theme changes

  const parts = calLink.split('/');
  const namespace = parts[parts.length - 1];
  const embedId = `my-cal-inline-${namespace}`;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'scroll', position: 'relative' }} id={embedId}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-light dark:bg-brand-dark z-10">
          <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
          <span className="sr-only">Loading calendar...</span>
        </div>
      )}
    </div>
  );
};

export default CalEmbed;