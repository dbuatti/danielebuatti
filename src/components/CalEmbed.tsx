"use client";

import React, { useEffect } from 'react';

interface CalEmbedProps {
  calLink: string;
  layout?: "month_view" | "week_view" | "day_view";
}

const CalEmbed: React.FC<CalEmbedProps> = ({ calLink, layout = "month_view" }) => {
  useEffect(() => {
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
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // Initialize Cal.com embed
    const namespace = calLink.split('/').pop(); // Extract namespace from calLink
    if (namespace) {
      (window as any).Cal("init", namespace, { origin: "https://app.cal.com" });
      (window as any).Cal.ns[namespace]("inline", {
        elementOrSelector: `#my-cal-inline-${namespace}`,
        config: { layout: layout },
        calLink: calLink,
      });
      (window as any).Cal.ns[namespace]("ui", { "hideEventTypeDetails": false, "layout": layout });
    }

    // Clean up function (optional, but good practice if component unmounts frequently)
    return () => {
      // You might want to remove the script or reset Cal.com state here if needed
      // For a simple modal, it's often fine to leave it as is.
    };
  }, [calLink, layout]); // Re-run if calLink or layout changes

  const namespace = calLink.split('/').pop();

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'scroll' }} id={`my-cal-inline-${namespace}`}></div>
  );
};

export default CalEmbed;