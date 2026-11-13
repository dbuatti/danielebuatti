"use client";

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Mail, Printer } from "lucide-react";
import { PageHeader } from "@/components/editorial";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";

interface VoucherView {
  code: string;
  recipientName: string | null;
  status: string;
  isExpired: boolean;
}

/**
 * Stripe returns the buyer here with ?code=... (the code is put in the return
 * URL by create-voucher-checkout, so no table access is needed). The webhook
 * marks the voucher paid a second or two after the redirect, so this page
 * polls the narrow public voucher endpoint rather than assuming.
 */
const GiftVoucherSuccessPage: React.FC = () => {
  // A confirmation page: never indexed, and no share image of its own.
  usePageMeta(
    "Thank you — your gift voucher | Daniele Buatti",
    "Your gift voucher is ready. View and print it, or check your inbox for the receipt.",
    { noindex: true },
  );

  const [params] = useSearchParams();
  const code = params.get("code");

  const [voucher, setVoucher] = useState<VoucherView | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "pending" | "missing">("loading");

  useEffect(() => {
    if (!code) {
      setStatus("missing");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      const { data } = await supabase.functions.invoke(
        `fetch-voucher?code=${encodeURIComponent(code)}`,
        { method: "GET" },
      );

      if (cancelled) return;

      const view = data as VoucherView | null;

      if (view?.code && view.status !== "pending") {
        setVoucher(view);
        setStatus("ready");
        return;
      }

      attempts += 1;
      // Eight seconds is enough for the webhook to land. After that the email
      // is the reliable copy, so say so rather than spinning forever.
      if (attempts >= 8) {
        if (view?.code) setVoucher(view);
        setStatus("pending");
        return;
      }
      setTimeout(poll, 1000);
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div>
      <PageHeader
        eyebrow="Thank you"
        title={
          <>
            Your gift is <em className="italic text-brand-primary">ready</em>
          </>
        }
        className="pb-10 lg:pb-12"
      />

      <section className="container pb-24 lg:pb-32">
        <div className="mx-auto max-w-xl">
          {status === "loading" && (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Confirming your payment…
            </div>
          )}

          {status === "pending" && (
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-2xl font-normal text-brand-dark">Payment received</h2>
              <p className="mt-3 text-muted-foreground">
                Your receipt with the voucher is on its way to your inbox — it should arrive within a minute
                or two.
              </p>

              {voucher && (
                <div className="mt-6">
                  <Link
                    to={`/voucher/${voucher.code}`}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary/90"
                  >
                    <Printer className="h-4 w-4" aria-hidden="true" /> View &amp; print
                  </Link>
                </div>
              )}

              <p className="mt-4 text-sm text-muted-foreground">
                Nothing arrived? Email{" "}
                <a href="mailto:info@danielebuatti.com" className="text-brand-primary underline">
                  info@danielebuatti.com
                </a>{" "}
                and I'll send it straight away.
              </p>
            </div>
          )}

          {status === "missing" && (
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-2xl font-normal text-brand-dark">Check your email</h2>
              <p className="mt-3 text-muted-foreground">
                Your receipt and printable voucher are on their way to your inbox. If it hasn't arrived in a few
                minutes, check your spam folder or get in touch.
              </p>
            </div>
          )}

          {status === "ready" && voucher && (
            <div className="rounded-2xl border border-border bg-card p-8">
              <CheckCircle2 className="h-10 w-10 text-brand-primary" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-normal text-brand-dark">
                {voucher.recipientName ? `For ${voucher.recipientName}` : "All sorted"}
              </h2>
              <p className="mt-3 text-muted-foreground">
                Your receipt is in your inbox, and the printable voucher is below.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/voucher/${voucher.code}`}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary/90"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" /> View &amp; print
                </Link>
                <Link
                  to="/book-voice-piano"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-brand-dark transition-colors hover:bg-secondary/40"
                >
                  Book a lesson
                </Link>
              </div>

              <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                <span>
                  The code is <strong className="font-medium text-brand-dark">{voucher.code}</strong>. Quote it when
                  you book.
                </span>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GiftVoucherSuccessPage;