"use client";

import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalEmbedProps {
  calLink: string; // Expected format: "danielebuatti/30min"
  layout?: "month_view" | "week_view" | "day_view";
  // Fill a fixed-height parent (e.g. a dialog) and scroll inside it. By default
  // the calendar grows to its full height and scrolls with the page, which is
  // how Cal.com's inline embed is designed to work.
  fill?: boolean;
  className?: string;
}

type CalApi = (...args: unknown[]) => void;
type CalGlobal = CalApi & { ns: Record<string, CalApi>; loaded?: boolean; q?: unknown[] };
declare global {
  interface Window {
    Cal?: CalGlobal;
  }
}

// If Cal.com hasn't reported the calendar ready by then, offer a direct link.
const FALLBACK_AFTER_MS = 12000;

// Cal.com's standard loader snippet: defines window.Cal, queues calls, and
// injects embed.js once.
function loadCal() {
  /* eslint-disable prefer-rest-params, @typescript-eslint/no-explicit-any */
  (function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any) { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal;
      const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api: any = function () { p(api, arguments); };
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
  /* eslint-enable prefer-rest-params, @typescript-eslint/no-explicit-any */
}

const CalEmbed: React.FC<CalEmbedProps> = ({ calLink, layout = "month_view", fill = false, className }) => {
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const namespace = calLink.split('/').pop() || "booking";
  const embedId = `cal-inline-${namespace}`;
  const directUrl = `https://cal.com/${calLink}`;

  useEffect(() => {
    let active = true;
    setStatus("loading");
    loadCal();
    const Cal = window.Cal!;

    Cal("init", namespace, { origin: "https://app.cal.com" });
    const api = Cal.ns[namespace];
    api("inline", {
      elementOrSelector: `#${embedId}`,
      config: { layout },
      calLink,
    });
    api("ui", {
      cssVarsPerTheme: {
        light: { "cal-brand": "#141A33" },
        dark: { "cal-brand": "#FAF7F2" },
      },
      hideEventTypeDetails: false,
      layout,
    });
    api("on", { action: "linkReady", callback: () => active && setStatus("ready") });
    api("on", { action: "linkFailed", callback: () => active && setStatus("failed") });

    const fallback = window.setTimeout(() => {
      if (active) setStatus((s) => (s === "loading" ? "failed" : s));
    }, FALLBACK_AFTER_MS);

    return () => {
      active = false;
      window.clearTimeout(fallback);
      // The target div has no React children, so clearing it is safe.
      const el = document.getElementById(embedId);
      if (el) el.innerHTML = '';
    };
  }, [calLink, layout, namespace, embedId]);

  return (
    <div className={cn("relative w-full", fill ? "h-full overflow-y-auto" : "min-h-[560px]", className)}>
      {/* Shown above (never over) the calendar, so a late-loading calendar stays usable. */}
      {status === "failed" && (
        <div className="mb-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 text-center sm:flex-row sm:gap-4">
          <p className="text-[15px] text-brand-dark">Calendar not showing?</p>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-dark px-5 text-sm font-medium text-brand-light transition-colors hover:bg-brand-primary"
          >
            Open the booking calendar <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      )}

      {/* Cal.com renders its iframe into this div. */}
      <div id={embedId} className="w-full" style={fill ? { minHeight: "100%" } : undefined} />

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background" role="status">
          <Loader2 className="h-9 w-9 animate-spin text-brand-primary" aria-hidden="true" />
          <span className="text-sm text-muted-foreground">Loading calendar…</span>
        </div>
      )}
    </div>
  );
};

export default CalEmbed;
