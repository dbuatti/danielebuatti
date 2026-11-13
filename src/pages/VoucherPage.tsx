"use client";

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, Loader2, Printer } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
import "@/voucher.css";

interface VoucherView {
  code: string;
  recipientName: string | null;
  buyerFirstName: string | null;
  what: string;
  description: string | null;
  message: string | null;
  sessionsTotal: number | null;
  sessionsRemaining: number | null;
  sessionLengthMinutes: number | null;
  amountLabel: string | null;
  expiresOn: string;
  status: string;
  isExpired: boolean;
  bookingEmail: string;
  bookingUrl: string;
}

/**
 * The printable voucher. A5 portrait (148 × 210mm) so it prints on a single
 * sheet at home or a print shop, with a screen-friendly frame around it.
 *
 * The print stylesheet lives in src/voucher.css and is imported once here, so
 * the rest of the site's styles never have to carry print rules.
 */
const VoucherPage: React.FC = () => {
  // Printable per-voucher page: public but never indexed.
  usePageMeta(
    "Your gift voucher | Daniele Buatti",
    "View and print your Daniele Buatti gift voucher.",
    { noindex: true },
  );

  const { code = "" } = useParams();
  const [voucher, setVoucher] = useState<VoucherView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error: fnError } = await supabase.functions.invoke(
        `fetch-voucher?code=${encodeURIComponent(code)}`,
        { method: "GET" },
      );

      if (cancelled) return;

      if (fnError || (data as { error?: string })?.error) {
        // A 404 comes back as a FunctionsHttpError whose body supabase-js
        // doesn't parse, so fall back to wording a buyer can act on rather
        // than the library's "non-2xx status code" message.
        const message =
          (data as { error?: string })?.error ||
          (fnError ? "That voucher code wasn't found. Check the spelling and try again." : "Voucher not found.");
        setError(message);
        return;
      }

      setVoucher(data as VoucherView);
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-10 w-10 text-brand-primary" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-3xl font-light text-brand-dark">Voucher not found</h1>
        <p className="mt-3 max-w-md text-muted-foreground">{error}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Check the code and try again, or email{" "}
          <a href="mailto:info@danielebuatti.com" className="text-brand-primary underline">
            info@danielebuatti.com
          </a>
          .
        </p>
        <Link
          to="/gift"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-8 text-sm font-medium text-white"
        >
          Back to vouchers
        </Link>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" aria-hidden="true" />
        <span className="sr-only">Loading voucher</span>
      </div>
    );
  }

  const greeting = voucher.recipientName ? `For ${voucher.recipientName}` : "A gift for you";

  return (
    <div className="container py-10 lg:py-16">
      {/* Screen-only toolbar */}
      <div className="no-print mx-auto mb-8 flex max-w-[148mm] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Gift voucher</p>
          <h1 className="mt-2 font-serif text-3xl font-light text-brand-dark">{greeting}</h1>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-7 text-sm font-medium text-white transition-colors hover:bg-brand-primary/90"
          >
            <Printer className="h-4 w-4" aria-hidden="true" /> Print / save as PDF
          </button>
        </div>
      </div>

      <p className="no-print mx-auto mb-6 max-w-[148mm] text-sm leading-relaxed text-muted-foreground">
        Choose <strong className="font-medium text-brand-dark">Save as PDF</strong> as the printer to keep a digital
        copy, or print it on A5. The voucher is valid until {voucher.expiresOn}.
      </p>

      {/* ---------------------------------------------------- the voucher */}
      <article className="voucher-sheet mx-auto">
        <div className="voucher-inner">
          <header className="voucher-header">
            <img
              src="/blue-pink-ontrans.png"
              alt="Daniele Buatti"
              className="voucher-logo"
              width={220}
              height={56}
            />
            <p className="voucher-eyebrow">Gift voucher</p>
          </header>

          <div className="voucher-body">
            <p className="voucher-for">{greeting}</p>

            <h2 className="voucher-what">{voucher.what}</h2>

            {voucher.description && <p className="voucher-description">{voucher.description}</p>}

            {voucher.amountLabel && !voucher.sessionsTotal && (
              <p className="voucher-value">{voucher.amountLabel}</p>
            )}

            {voucher.message && <blockquote className="voucher-message">“{voucher.message}”</blockquote>}

            {voucher.sessionsTotal && voucher.sessionsRemaining != null && (
              <p className="voucher-sessions">
                <strong>{voucher.sessionsRemaining}</strong> of {voucher.sessionsTotal} sessions remaining
              </p>
            )}

            <div className="voucher-code-block">
              <p className="voucher-code-label">Voucher code</p>
              <p className="voucher-code">{voucher.code}</p>
            </div>

            <dl className="voucher-meta">
              <div>
                <dt>Valid until</dt>
                <dd>{voucher.expiresOn}</dd>
              </div>
              {voucher.buyerFirstName && (
                <div>
                  <dt>Given by</dt>
                  <dd>{voucher.buyerFirstName}</dd>
                </div>
              )}
            </dl>
          </div>

          <footer className="voucher-footer">
            <p className="voucher-booking">
              To book, email{" "}
              <a href={`mailto:${voucher.bookingEmail}`}>{voucher.bookingEmail}</a> or book online at{" "}
              <span>{voucher.bookingUrl.replace(/^https?:\/\//, "")}</span>, and quote your code.
            </p>
            {voucher.isExpired && (
              <p className="voucher-expired">This voucher expired on {voucher.expiresOn}.</p>
            )}
          </footer>
        </div>
      </article>

      <div className="no-print mx-auto mt-10 max-w-[148mm] text-center">
        <Link to="/book-voice-piano" className="text-sm text-brand-primary underline underline-offset-4">
          Book a lesson
        </Link>
      </div>
    </div>
  );
};

export default VoucherPage;