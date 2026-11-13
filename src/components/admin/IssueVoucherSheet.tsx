"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
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
  is_active: boolean;
  sort_order: number;
}

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

/** Price in force today: a scheduled rise wins once its date has passed. */
function priceToday(pack: Pack): number {
  if (pack.next_price_cents != null && pack.next_price_from) {
    const from = new Date(`${pack.next_price_from}T00:00:00Z`);
    if (!Number.isNaN(from.getTime()) && from <= new Date()) return pack.next_price_cents;
  }
  return pack.price_cents;
}

const field =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-[15px] text-brand-dark placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40";
const label = "mb-1.5 block text-sm font-medium text-brand-dark dark:text-brand-light";

type Tab = "issue" | "prices";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssued: () => void;
}

/**
 * Issue a voucher by hand — for bank transfers and payment links, where no
 * Stripe checkout runs. Also hosts the editable price list, so a price rise
 * (e.g. kinesiology on 1 Jan 2027) is data rather than a deploy.
 */
export const IssueVoucherSheet: React.FC<Props> = ({ open, onOpenChange, onIssued }) => {
  const [tab, setTab] = useState<Tab>("issue");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [saving, setSaving] = useState(false);

  const [packKey, setPackKey] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendRecipientOn, setSendRecipientOn] = useState("");
  const [paidOn, setPaidOn] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  const [sendNow, setSendNow] = useState(true);

  // Price editing state, keyed by pack key, in dollars for the input.
  const [draftPrices, setDraftPrices] = useState<Record<string, { price: string; next: string; from: string }>>({});

  const loadPacks = async () => {
    setLoadingPacks(true);
    const { data, error } = await supabase.from("voucher_packs").select("*").order("sort_order");

    if (error) {
      showError("Could not load the price list.");
      setLoadingPacks(false);
      return;
    }

    const list = (data ?? []) as Pack[];
    setPacks(list);

    const drafts: Record<string, { price: string; next: string; from: string }> = {};
    for (const p of list) {
      drafts[p.key] = {
        price: (p.price_cents / 100).toFixed(p.price_cents % 100 === 0 ? 0 : 2),
        next: p.next_price_cents != null ? (p.next_price_cents / 100).toFixed(0) : "",
        from: p.next_price_from ?? "",
      };
    }
    setDraftPrices(drafts);
    setLoadingPacks(false);
  };

  useEffect(() => {
    if (open) {
      loadPacks();
      setTab("issue");
    }
  }, [open]);

  const selected = packs.find((p) => p.key === packKey) ?? null;

  const resetForm = () => {
    setPackKey(packs[0]?.key ?? "");
    setCustomAmount("");
    setRecipientName("");
    setRecipientEmail("");
    setBuyerName("");
    setBuyerEmail("");
    setMessage("");
    setSendRecipientOn("");
    setPaidOn(format(new Date(), "yyyy-MM-dd"));
    setNotes("");
    setSendNow(true);
  };

  useEffect(() => {
    if (!packKey && packs.length > 0) setPackKey(packs[0].key);
  }, [packs, packKey]);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      showError("Choose a voucher type.");
      return;
    }
    if (buyerName.trim().length < 2) {
      showError("Enter the buyer's name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail.trim())) {
      showError("Enter a valid buyer email.");
      return;
    }

    setSaving(true);
    try {
      const amountCents = selected.is_custom_amount
        ? Math.round((Number.parseFloat(customAmount) || 0) * 100)
        : null;

      if (selected.is_custom_amount && (!amountCents || amountCents < (selected.min_cents ?? 5000))) {
        showError(`The minimum custom amount is ${money(selected.min_cents ?? 5000)}.`);
        setSaving(false);
        return;
      }

      const { data: code, error: codeError } = await supabase.rpc("generate_voucher_code", {
        p_discipline: selected.discipline,
      });
      if (codeError || !code) throw new Error(codeError?.message ?? "Could not generate a code.");

      const paidAt = new Date(`${paidOn}T${format(new Date(), "HH:mm:ss")}`).toISOString();
      const expires = new Date();
      expires.setUTCFullYear(expires.getUTCFullYear() + 1);

      const { data: voucher, error: insertError } = await supabase
        .from("gift_vouchers")
        .insert({
          code,
          pack_key: selected.key,
          discipline: selected.discipline,
          label: selected.label,
          description: selected.description,
          sessions_total: selected.sessions_total,
          sessions_remaining: selected.sessions_total,
          session_length_minutes: selected.session_length_minutes,
          amount_cents: amountCents,
          buyer_name: buyerName.trim(),
          buyer_email: buyerEmail.trim(),
          recipient_name: recipientName.trim() || null,
          recipient_email: recipientEmail.trim() || null,
          message: message.trim() || null,
          send_recipient_on: sendRecipientOn || null,
          status: "paid",
          paid_at: paidAt,
          expires_at: expires.toISOString().slice(0, 10),
          issued_manually: true,
          internal_notes: notes.trim() || null,
        })
        .select("id, code")
        .single();

      if (insertError) throw insertError;

      // A manual voucher is real the moment it's marked paid, so send now
      // unless the user unchecks it.
      if (sendNow) {
        await Promise.all([
          supabase.functions.invoke("send-voucher-email", {
            body: { voucherId: voucher.id, kind: "receipt" },
          }),
          ...(recipientEmail.trim() && !sendRecipientOn
            ? [
                supabase.functions.invoke("send-voucher-email", {
                  body: { voucherId: voucher.id, kind: "recipient" },
                }),
              ]
            : []),
        ]);
      }

      showSuccess(`Voucher ${voucher.code} issued.`);
      resetForm();
      onOpenChange(false);
      onIssued();
    } catch (e) {
      showError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrice = async (pack: Pack) => {
    const draft = draftPrices[pack.key];
    if (!draft) return;

    const priceCents = Math.round((Number.parseFloat(draft.price) || 0) * 100);
    if (priceCents <= 0) {
      showError("Enter a price greater than zero.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("voucher_packs")
        .update({
          price_cents: priceCents,
          next_price_cents: draft.next ? Math.round(Number.parseFloat(draft.next) * 100) : null,
          next_price_from: draft.from || null,
        })
        .eq("key", pack.key);

      if (error) throw error;
      showSuccess(`${pack.label} updated.`);
      await loadPacks();
    } catch (e) {
      showError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto bg-brand-light p-0 dark:bg-brand-dark-alt sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="text-brand-dark dark:text-brand-light">Vouchers</SheetTitle>
          <SheetDescription>
            Issue one by hand for bank transfers and payment links, or update prices.
          </SheetDescription>

          <div className="mt-3 flex gap-1 rounded-full border border-border bg-card p-1">
            {(
              [
                { value: "issue", label: "Issue manually" },
                { value: "prices", label: "Prices" },
              ] as { value: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={cn(
                  "h-9 flex-1 rounded-full text-sm font-medium transition-colors",
                  tab === t.value
                    ? "bg-brand-primary text-white"
                    : "text-brand-dark/70 hover:text-brand-dark",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        {tab === "issue" ? (
          <form onSubmit={handleIssue} className="flex-1 space-y-5 px-5 py-5">
            {loadingPacks ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
              </div>
            ) : (
              <>
                <div>
                  <label className={label} htmlFor="packKey">
                    Voucher type
                  </label>
                  <select
                    id="packKey"
                    value={packKey}
                    onChange={(e) => setPackKey(e.target.value)}
                    className={field}
                  >
                    {packs
                      .filter((p) => p.is_active)
                      .map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.label}
                          {p.is_custom_amount ? "" : ` — ${money(priceToday(p))}`}
                        </option>
                      ))}
                  </select>
                </div>

                {selected?.is_custom_amount && (
                  <div>
                    <label className={label} htmlFor="customAmount">
                      Amount (AUD)
                    </label>
                    <Input
                      id="customAmount"
                      type="number"
                      inputMode="decimal"
                      min={(selected.min_cents ?? 5000) / 100}
                      step="5"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="100"
                      className={field}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Min {money(selected.min_cents ?? 5000)} · max {money(selected.max_cents ?? 500000)}
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Buyer
                  </p>
                  <div className="mt-2 space-y-3">
                    <Input
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Buyer's name"
                      className={field}
                    />
                    <Input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="buyer@example.com"
                      className={field}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Recipient <span className="font-normal normal-case">(optional)</span>
                  </p>
                  <div className="mt-2 space-y-3">
                    <Input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Recipient's name"
                      className={field}
                    />
                    <Input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient@example.com"
                      className={field}
                    />
                  </div>
                </div>

                <div>
                  <label className={label} htmlFor="message">
                    Message <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Happy birthday!"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[15px] text-brand-dark placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
                  />
                </div>

                {recipientEmail && (
                  <div>
                    <label className={label} htmlFor="sendOn">
                      Send to recipient on{" "}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <Input
                      id="sendOn"
                      type="date"
                      value={sendRecipientOn}
                      onChange={(e) => setSendRecipientOn(e.target.value)}
                      className={field}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Leave blank to send immediately.
                    </p>
                  </div>
                )}

                <div>
                  <label className={label} htmlFor="paidOn">
                    Date paid
                  </label>
                  <Input
                    id="paidOn"
                    type="date"
                    value={paidOn}
                    onChange={(e) => setPaidOn(e.target.value)}
                    className={field}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Income is counted on this date.
                  </p>
                </div>

                <div>
                  <label className={label} htmlFor="notes">
                    Internal notes <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Bank transfer, ref 1234"
                    className={field}
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-3">
                  <input
                    type="checkbox"
                    checked={sendNow}
                    onChange={(e) => setSendNow(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#DB4CA3]"
                  />
                  <span className="text-sm text-brand-dark dark:text-brand-light">
                    Email it now
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Buyer receipt always. Recipient too, unless a send date is set.
                    </span>
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={saving}
                  className="h-12 w-full rounded-full bg-brand-primary text-base text-white hover:bg-brand-primary/90"
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Issue voucher
                </Button>
              </>
            )}
          </form>
        ) : (
          <div className="flex-1 space-y-4 px-5 py-5">
            <p className="text-sm text-muted-foreground">
              Prices apply to new vouchers. A scheduled price takes over automatically on its date — the
              kinesiology rise to $285 on 1 January 2027 is set this way.
            </p>

            {loadingPacks ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
              </div>
            ) : (
              <ul className="space-y-3">
                {packs.map((p) => {
                  const draft = draftPrices[p.key];
                  if (!draft) return null;

                  const scheduled = p.next_price_cents != null && p.next_price_from;
                  const isFuture = scheduled
                    ? new Date(`${p.next_price_from}T00:00:00Z`) > new Date()
                    : false;

                  return (
                    <li key={p.key} className="rounded-xl border border-border bg-card p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-brand-dark dark:text-brand-light">
                            {p.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.sessions_total
                              ? `${p.sessions_total} × ${p.session_length_minutes} min`
                              : "Dollar credit"}
                          </p>
                        </div>
                        {isFuture && (
                          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-900">
                            rises {format(new Date(`${p.next_price_from}T00:00:00`), "d MMM yyyy")}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-end gap-2">
                        <div className="flex-1">
                          <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`price-${p.key}`}>
                            Price (AUD)
                          </label>
                          <Input
                            id={`price-${p.key}`}
                            type="number"
                            inputMode="decimal"
                            step="5"
                            min="0"
                            value={draft.price}
                            onChange={(e) =>
                              setDraftPrices((prev) => ({
                                ...prev,
                                [p.key]: { ...prev[p.key], price: e.target.value },
                              }))
                            }
                            className={field}
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleSavePrice(p)}
                          disabled={saving}
                          variant="outline"
                          className="h-11 shrink-0"
                        >
                          Save
                        </Button>
                      </div>

                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-muted-foreground">
                          Schedule a future price
                        </summary>
                        <div className="mt-2 flex items-end gap-2">
                          <div className="flex-1">
                            <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`next-${p.key}`}>
                              New price (AUD)
                            </label>
                            <Input
                              id={`next-${p.key}`}
                              type="number"
                              inputMode="decimal"
                              step="5"
                              min="0"
                              value={draft.next}
                              onChange={(e) =>
                                setDraftPrices((prev) => ({
                                  ...prev,
                                  [p.key]: { ...prev[p.key], next: e.target.value },
                                }))
                              }
                              placeholder="285"
                              className={field}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`from-${p.key}`}>
                              From
                            </label>
                            <Input
                              id={`from-${p.key}`}
                              type="date"
                              value={draft.from}
                              onChange={(e) =>
                                setDraftPrices((prev) => ({
                                  ...prev,
                                  [p.key]: { ...prev[p.key], from: e.target.value },
                                }))
                              }
                              className={field}
                            />
                          </div>
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default IssueVoucherSheet;