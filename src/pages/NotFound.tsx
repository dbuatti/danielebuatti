"use client";

import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/use-page-meta";

const NotFound = () => {
  usePageMeta(
    "Page Not Found | Daniele Buatti",
    "The page you're looking for doesn't exist.",
    { noindex: true },
  );

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-24">
      <div className="text-center max-w-md px-6">
        <p className="eyebrow text-brand-primary">404</p>
        <h1 className="mt-4 text-5xl md:text-6xl font-light text-brand-dark dark:text-brand-light">Page not found</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary/90"
          >
            Return home
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-brand-dark transition-colors hover:bg-secondary"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
