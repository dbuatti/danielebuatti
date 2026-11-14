"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Gift, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/editorial";
import { useRouteMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface Pack {
  key: string;
  label: string;
  discipline: string;
  description: string | null;
  sessions_total: number | null;
  session_length_minutes: number | null;
  price_cents: number;
  next_price_cents: number | null;
  next_price_from: string | null;
  is_custom_amount: boolean;
  min_cents: number | null;
  max_cents: number | null;
}

/** The price that applies today: a scheduled rise wins once its date passes. */
function priceForToday(pack: Pack): number {
  if (pack.next_price_cents != null && pack.next_price_from) {
    const from = new Date(`${pack.next_price_from}T00:00:00Z`);
    if (!Number.isNaN(from.getTime()) && from <= new Date()) return pack.next_price_cents;
  }
  return pack.price_cents;
}

const dollars = (cents: number) =>
  (cents / 100).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] text-brand-dark placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40";

const GiftVouchersPage: React.FC = () => {
  useRouteMeta("/gift");

  const [packs, setPacks] = useState<Pack[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);

  const [packKey, setPackKey] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendRecipientOn, setSendRecipientOn] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("voucher_packs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Failed to load voucher packs:", error);
        setError("The voucher list could not be loaded. Please refresh, or email info@danielebuatti.com.");
      } else {
        setPacks((data ?? []) as Pack[]);
        const first = (data ?? [])[0];
        if (first) setPackKey(first.key);
      }
      setLoadingPacks(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(() => packs.find((p) => p.key === packKey) ?? null, [packs, packKey]);

  const groups = useMemo(() => {
    const order = ["piano", "voice", "kinesiology", "credit"];
    const titles: Record<string, string> = {
      piano: "Piano",
      voice: "Voice",
      kinesiology: "Kinesiology",
      credit: "Dollar credit",
    };
    return order
      .map((discipline) => ({
        discipline,
        title: titles[discipline] ?? discipline,
        items: packs.filter((p) => p.discipline === discipline),
      }))
      .filter((g) => g.items.length > 0);
  }, [packs]);

  const totalCents = selected?.is_custom_amount
    ? Math.round((Number.parseFloat(customAmount) || 0) * 100)
    : selected
      ? priceForToday(selected)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selected) {
      setError("Choose a voucher.");
      return;
    }
    if (buyerName.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (selected.is_custom_amount && (!Number.isFinite(totalCents) || totalCents < (selected.min_cents ?? 5000))) {
      setError(`The minimum custom amount is ${dollars(selected.min_cents ?? 5000)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-voucher-checkout", {
        body: {
          packKey: selected.key,
          customAmount: selected.is_custom_amount ? Number.parseFloat(customAmount) || 0 : undefined,
          buyerName,
          buyerEmail,
          recipientName,
          recipientEmail,
          message,
          sendRecipientOn,
        },
      });

      if (fnError) {
        // supabase-js hides the function's own message behind a generic
        // "non-2xx status code" error; read it from the response instead.
        let detail: string | undefined;
        try {
          const ctx = (fnError as { context?: Response }).context;
          if (ctx && typeof ctx.json === "function") detail = (await ctx.json())?.error;
        } catch {
          /* fall through to the generic message */
        }
        throw new Error(detail || fnError.message);
      }
      if (!data?.url) throw new Error("The checkout link was not returned.");

      window.location.href = data.url;
    } catch (err) {
      const message = (err as Error).message || "Something went wrong. Please try again.";
      setError(message);
      showError(message);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gift vouchers"
        title={
          <>
            Give the gift of a <em className="italic text-brand-primary">lesson</em>
          </>
        }
        lede="Lesson and session packs, wrapped as a printed voucher. Choose a pack, add a message, and I'll email a printable voucher you can give in person — or send it straight to them on the day."
      >
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-brand-dark/75">
          <li className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand-primary" aria-hidden="true" /> Secure Stripe checkout
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand-primary" aria-hidden="true" /> Printable voucher PDF
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-primary" aria-hidden="true" /> Valid for 12 months
          </li>
        </ul>
      </PageHeader>

      <section className="container pb-24 lg:pb-32">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10 [&>*]:min-w-0">
          {/* ---------------------------------------------- pack picker */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">
              1. Choose a voucher
            </h2>

            {loadingPacks ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading vouchers…
              </div>
            ) : packs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-border bg-card p-8">
                <p className="text-muted-foreground">
                  Vouchers aren't available right now. Email{" "}
                  <a href="mailto:info@danielebuatti.com" className="text-brand-primary underline">
                    info@danielebuatti.com
                  </a>{" "}
                  and I'll sort you out.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-8">
                {groups.map((group) => (
                  <fieldset key={group.discipline}>
                    <legend className="mb-3 text-lg font-normal text-brand-dark">{group.title}</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {group.items.map((pack) => {
                        const active = pack.key === packKey;
                        const price = priceForToday(pack);
                        const isCustom = pack.is_custom_amount;

                        return (
                          <label
                            key={pack.key}
                            className={cn(
                              "relative flex cursor-pointer flex-col justify-between gap-3 rounded-2xl border p-5 transition-all duration-300",
                              active
                                ? "border-brand-primary bg-brand-primary/[0.06] shadow-soft"
                                : "border-border bg-card hover:border-brand-primary/40",
                            )}
                          >
                            <input
                              type="radio"
                              name="pack"
                              value={pack.key}
                              checked={active}
                              onChange={() => setPackKey(pack.key)}
                              className="sr-only"
                            />
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-medium text-brand-dark">{pack.label}</p>
                                <p className="mt-1 text-sm leading-snug text-muted-foreground">
                                  {pack.description}
                                </p>
                              </div>
                              {active && (
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                </span>
                              )}
                            </div>
                            <p className="font-serif text-2xl font-light text-brand-dark">
                              {isCustom ? "From" : ""} {dollars(price)}
                            </p>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
          </div>

          {/* ---------------------------------------------- details form */}
          <form onSubmit={handleSubmit} className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">
                2. Who's it for?
              </h2>

              <div className="mt-6 space-y-5">
                {selected?.is_custom_amount && (
                  <div>
                    <label htmlFor="customAmount" className="mb-1.5 block text-sm font-medium text-brand-dark">
                      Amount (AUD)
                    </label>
                    <input
                      id="customAmount"
                      type="number"
                      inputMode="decimal"
                      min={(selected.min_cents ?? 5000) / 100}
                      max={(selected.max_cents ?? 500000) / 100}
                      step="5"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="100"
                      className={inputClass}
                      required
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Between {dollars(selected.min_cents ?? 5000)} and {dollars(selected.max_cents ?? 500000)}.
                    </p>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="buyerName" className="mb-1.5 block text-sm font-medium text-brand-dark">
                      Your name
                    </label>
                    <input
                      id="buyerName"
                      type="text"
                      autoComplete="name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="buyerEmail" className="mb-1.5 block text-sm font-medium text-brand-dark">
                      Your email
                    </label>
                    <input
                      id="buyerEmail"
                      type="email"
                      autoComplete="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                      required
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">Where the receipt goes.</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="recipientName" className="mb-1.5 block text-sm font-medium text-brand-dark">
                      Their name
                    </label>
                    <input
                      id="recipientName"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Who's it for?"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="recipientEmail" className="mb-1.5 block text-sm font-medium text-brand-dark">
                      Their email <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <input
                      id="recipientEmail"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="them@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-brand-dark">
                    Message <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Happy birthday! Can't wait to hear you play."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] text-brand-dark placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
                  />
                </div>

                {recipientEmail && (
                  <div className="rounded-xl border border-border bg-secondary/20 p-4">
                    <p className="text-sm font-medium text-brand-dark">When should they get it?</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Leave blank to email it now. Pick a date to schedule it — handy for birthdays.
                    </p>
                    <input
                      id="sendRecipientOn"
                      type="date"
                      value={sendRecipientOn}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setSendRecipientOn(e.target.value)}
                      className={cn(inputClass, "mt-3")}
                    />
                  </div>
                )}

                {error && (
                  <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="border-t border-border pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-serif text-3xl font-light text-brand-dark">
                      {dollars(totalCents)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !selected}
                    className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-8 text-base font-medium text-white transition-all duration-300 hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Opening checkout…
                      </>
                    ) : (
                      <>
                        Continue to payment <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" aria-hidden="true" /> Payment is processed by Stripe. I never see
                    your card details.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 px-2 text-sm leading-relaxed text-muted-foreground">
              Paying by bank transfer, or buying several at once?{" "}
              <Link to="/contact" className="text-brand-primary underline underline-offset-4">
                Get in touch
              </Link>{" "}
              and I'll issue them directly.
            </p>
          </form>
        </div>

        <div className="mt-16 flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-5 text-sm text-brand-dark/80">
          <Gift className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" aria-hidden="true" />
          <p>
            <strong className="font-medium">How it works.</strong> You pay now and get a receipt straight away. The
            voucher itself arrives as a printable PDF you can wrap, plus a code the recipient quotes when they book.
            Vouchers are valid for 12 months and can be used one session at a time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default GiftVouchersPage;