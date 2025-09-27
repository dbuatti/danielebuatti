"use client";

import React, { useEffect } from 'react';
import { useTheme } from "next-themes"; // Import useTheme to get current theme

interface CalEmbedProps {
  calLink: string; // Expected format: "danielebuatti/30min"
  layout?: "month_view" | "week_view" | "day_view";
}

const CalEmbed: React.FC<CalEmbedProps> = ({ calLink, layout = "month_view" }) => {
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    // Extract namespace from calLink (e.g., "30min" from "danielebuatti/30min")
    const parts = calLink.split('/');
    const namespace = parts[parts.length - 1];

    if (!namespace) {
      console.error("CalEmbed: Invalid calLink provided. Could not extract namespace.");
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
          api.q = api.q || [];
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

    // Clean up function to clear the embed content when component unmounts
    return () => {
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
    <div style={{ width: '100%', height: '100%', overflow: 'scroll' }} id={embedId}></div>
  );
};

export default CalEmbed;