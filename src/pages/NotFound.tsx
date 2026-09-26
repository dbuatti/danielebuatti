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
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
        <p className="text-xl text-brand-dark/70 dark:text-brand-light/70 mb-6">Oops! Page not found</p>
        <Link to="/" className="text-brand-primary hover:text-brand-primary/80 underline font-medium">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
