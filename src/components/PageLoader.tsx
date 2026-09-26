import { Loader2 } from "lucide-react";

// Suspense fallback shown while a lazily loaded route's code is downloading.
const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
    <Loader2 className="h-8 w-8 animate-spin text-brand-primary" aria-hidden="true" />
    <span className="sr-only">Loading…</span>
  </div>
);

export default PageLoader;
