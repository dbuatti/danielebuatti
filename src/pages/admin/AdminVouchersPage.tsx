"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CalendarClock,
  Check,
  ChevronDown,
  Loader2,
  Mail,
  Minus,
  Plus,
  Search,
  Send,
  Ticket,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";
import { IssueVoucherSheet } from "@/components/admin/IssueVoucherSheet";
import { cn } from "@/lib/utils";

type VoucherStatus = "pending" | "paid" | "partly_used" | "used" | "expired" | "cancelled";

interface Voucher {
  id: string;
  code: string;
  label: string;
  discipline: string;
  sessions_total: number | null;
  sessions_remaining: number | null;
  amount_cents: number | null;
  buyer_name: string;
  buyer_email: string;
  recipient_name: string | null;
  recipient_email: string | null;
  message: string | null;
  send_recipient_on: string | null;
  recipient_sent_at: string | null;
  buyer_receipt_sent_at: string | null;
  status: VoucherStatus;
  paid_at: string | null;
  expires_at: string;
  issued_manually: boolean;
  internal_notes: string | null;
  created_at: string;
}

interface Redemption {
  id: string;
  voucher_id: string;
  sessions_used: number;
  used_on: string;
  note: string | null;
  created_at: string;
}

const money = (cents: number | null) =>
  cents == null
    ? ""
    : (cents / 100).toLocaleString("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      });

const shortDate = (iso: string | null) =>
  iso ? format(new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso), "d MMM yyyy") : "—";

const STATUS_STYLES: Record<VoucherStatus, string> = {
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
  paid: "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200",
  partly_used: "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-200",
  used: "bg-secondary text-brand-dark/70 dark:text-brand-light/70",
  expired: "bg-stone-200 text-stone-700 dark:bg-stone-500/20 dark:text-stone-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
};

const STATUS_LABEL: Record<VoucherStatus, string> = {
  pending: "Unpaid",
  paid: "Paid",
  partly_used: "Part used",
  used: "Used",
  expired: "Expired",
  cancelled: "Cancelled",
};

const FILTERS: { value: string; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "all", label: "All" },
  { value: "pending", label: "Unpaid" },
  { value: "used", label: "Used" },
  { value: "expired", label: "Expired" },
];

const matchesFilter = (v: Voucher, filter: string) => {
  if (filter === "all") return true;
  if (filter === "active") return v.status === "paid" || v.status === "partly_used";
  return v.status === filter;
};

const AdminVouchersPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [redemptions, setRedemptions] = useState<Record<string, Redemption[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [issueOpen, setIssueOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Inline "use one session" state, keyed by voucher id.
  const [useFor, setUseFor] = useState<string | null>(null);
  const [useDate, setUseDate] = useState(new Date().toISOString().slice(0, 10));
  const [useNote, setUseNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);

    const [{ data: rows, error }, { data: reds }] = await Promise.all([
      supabase.from("gift_vouchers").select("*").order("created_at", { ascending: false }),
      supabase
        .from("voucher_redemptions")
        .select("*")
        .order("used_on", { ascending: false })
        .limit(2000),
    ]);

    if (error) {
      console.error("Failed to load vouchers:", error);
      showError("Could not load vouchers. Check you're logged in as an admin.");
      setLoading(false);
      return;
    }

    const list = (rows ?? []) as Voucher[];
    setVouchers(list);

    const grouped: Record<string, Redemption[]> = {};
    for (const r of (reds ?? []) as Redemption[]) {
      (grouped[r.voucher_id] ??= []).push(r);
    }
    setRedemptions(grouped);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vouchers.filter((v) => {
      if (!matchesFilter(v, filter)) return false;
      if (!q) return true;
      return (
        v.code.toLowerCase().includes(q) ||
        v.buyer_name.toLowerCase().includes(q) ||
        v.buyer_email.toLowerCase().includes(q) ||
        (v.recipient_name ?? "").toLowerCase().includes(q) ||
        (v.recipient_email ?? "").toLowerCase().includes(q)
      );
    });
  }, [vouchers, filter, search]);

  const counts = useMemo(
    () => ({
      active: vouchers.filter((v) => matchesFilter(v, "active")).length,
      pending: vouchers.filter((v) => v.status === "pending").length,
    }),
    [vouchers],
  );

  /** One-click "Use 1 session", with an optional note. */
  const handleUseSession = async (v: Voucher) => {
    setBusyId(v.id);
    try {
      const { data, error } = await supabase.rpc("redeem_voucher_session", {
        p_voucher_id: v.id,
        p_used_on: useDate,
        p_note: useNote.trim() || null,
        p_sessions: 1,
      });

      if (error) throw error;

      const updated = data as Voucher;
      setVouchers((prev) => prev.map((x) => (x.id === v.id ? { ...x, ...updated } : x)));

      setRedemptions((prev) => ({
        ...prev,
        [v.id]: [
          {
            id: `local-${Date.now()}`,
            voucher_id: v.id,
            sessions_used: 1,
            used_on: useDate,
            note: useNote.trim() || null,
            created_at: new Date().toISOString(),
          },
          ...(prev[v.id] ?? []),
        ],
      }));

      showSuccess(
        updated.sessions_remaining === 0
          ? `${v.code} is now fully used.`
          : `${v.code}: ${updated.sessions_remaining} of ${updated.sessions_total} left.`,
      );

      setUseFor(null);
      setUseNote("");
      setUseDate(new Date().toISOString().slice(0, 10));
    } catch (e) {
      showError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkPaid = async (v: Voucher) => {
    setBusyId(v.id);
    try {
      const { data, error } = await supabase
        .from("gift_vouchers")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", v.id)
        .eq("status", "pending")
        .select("*")
        .single();

      if (error) throw error;

      setVouchers((prev) => prev.map((x) => (x.id === v.id ? { ...x, ...data } : x)));
      showSuccess(`${v.code} marked paid.`);

      // A manual voucher becomes real the moment it's paid, so send both emails.
      await Promise.all([
        supabase.functions.invoke("send-voucher-email", { body: { voucherId: v.id, kind: "receipt" } }),
        ...(v.recipient_email && !v.send_recipient_on
          ? [supabase.functions.invoke("send-voucher-email", { body: { voucherId: v.id, kind: "recipient" } })]
          : []),
      ]);
    } catch (e) {
      showError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const handleSendRecipient = async (v: Voucher) => {
    setBusyId(v.id);
    try {
      const { error } = await supabase.functions.invoke("send-voucher-email", {
        body: { voucherId: v.id, kind: "recipient" },
      });
      if (error) throw error;
      showSuccess(`Recipient email sent for ${v.code}.`);
      await load();
    } catch (e) {
      showError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (v: Voucher) => {
    if (!window.confirm(`Cancel ${v.code}? This can't be undone.`)) return;

    setBusyId(v.id);
    try {
      const { error } = await supabase
        .from("gift_vouchers")
        .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("id", v.id);

      if (error) throw error;
      showSuccess(`${v.code} cancelled.`);
      await load();
    } catch (e) {
      showError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light sm:text-3xl">
            Gift vouchers
          </h2>
          <p className="mt-1 text-sm text-brand-dark/70 dark:text-brand-light/70">
            {counts.active} active · {counts.pending} unpaid
          </p>
        </div>
        <Button
          onClick={() => setIssueOpen(true)}
          className="h-11 rounded-full bg-brand-primary px-5 text-brand-light hover:bg-brand-primary/90"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Issue manually
        </Button>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code, name or email"
            className="h-12 rounded-xl pl-11"
            inputMode="search"
          />
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                filter === f.value
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-border bg-card text-brand-dark/75 hover:border-brand-primary/40",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          <span className="sr-only">Loading vouchers</span>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <Ticket className="h-8 w-8 text-brand-primary/50" aria-hidden="true" />
            <p className="text-brand-dark/70 dark:text-brand-light/70">
              {vouchers.length === 0
                ? "No vouchers yet."
                : "No vouchers match that search."}
            </p>
            {vouchers.length === 0 && (
              <p className="max-w-sm text-sm text-muted-foreground">
                Buyers appear here once they pay through the gift page. You can also issue one yourself.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {filtered.map((v) => {
            const isOpen = expanded === v.id;
            const history = redemptions[v.id] ?? [];
            const canUse =
              v.status === "paid" || v.status === "partly_used";
            const isUsing = useFor === v.id;

            return (
              <li key={v.id}>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Summary row */}
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : v.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/20"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold tracking-wide text-brand-primary">
                            {v.code}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-medium",
                              STATUS_STYLES[v.status],
                            )}
                          >
                            {STATUS_LABEL[v.status]}
                          </span>
                          {v.issued_manually && (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-brand-dark/70">
                              Manual
                            </span>
                          )}
                        </div>

                        <p className="mt-1.5 truncate text-[15px] font-medium text-brand-dark dark:text-brand-light">
                          {v.recipient_name ? `For ${v.recipient_name}` : v.buyer_name}
                        </p>

                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {v.label}
                          {v.amount_cents && !v.sessions_total ? ` · ${money(v.amount_cents)}` : ""}
                        </p>

                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {v.sessions_total
                            ? `${v.sessions_remaining} of ${v.sessions_total} sessions left`
                            : v.amount_cents
                              ? money(v.amount_cents)
                              : ""}
                          {v.paid_at ? ` · paid ${shortDate(v.paid_at)}` : ""}
                          {` · expires ${shortDate(v.expires_at)}`}
                        </p>
                      </div>

                      <ChevronDown
                        className={cn(
                          "mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {/* The one-tap action, always visible on active vouchers */}
                    {canUse && !isOpen && (
                      <div className="px-4 pb-4">
                        <button
                          type="button"
                          onClick={() => {
                            setUseFor(isUsing ? null : v.id);
                            setUseDate(new Date().toISOString().slice(0, 10));
                            setUseNote("");
                          }}
                          className={cn(
                            "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors",
                            isUsing
                              ? "bg-secondary text-brand-dark"
                              : "bg-brand-primary text-white hover:bg-brand-primary/90",
                          )}
                        >
                          {isUsing ? (
                            <>
                              <X className="h-4 w-4" /> Cancel
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" /> Use 1 session
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="border-t border-border bg-secondary/10 px-4 py-4">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                          <div>
                            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Buyer</dt>
                            <dd className="mt-0.5 break-words text-brand-dark dark:text-brand-light">
                              {v.buyer_name}
                              <br />
                              <a href={`mailto:${v.buyer_email}`} className="text-brand-primary">
                                {v.buyer_email}
                              </a>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Recipient</dt>
                            <dd className="mt-0.5 break-words text-brand-dark dark:text-brand-light">
                              {v.recipient_name || "—"}
                              {v.recipient_email && (
                                <>
                                  <br />
                                  <a href={`mailto:${v.recipient_email}`} className="text-brand-primary">
                                    {v.recipient_email}
                                  </a>
                                </>
                              )}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Paid</dt>
                            <dd className="mt-0.5 text-brand-dark dark:text-brand-light">
                              {shortDate(v.paid_at)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Expires</dt>
                            <dd className="mt-0.5 text-brand-dark dark:text-brand-light">
                              {shortDate(v.expires_at)}
                            </dd>
                          </div>
                          {v.message && (
                            <div className="col-span-2">
                              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Message</dt>
                              <dd className="mt-0.5 italic text-brand-dark/85 dark:text-brand-light/85">
                                “{v.message}”
                              </dd>
                            </div>
                          )}
                          {v.send_recipient_on && (
                            <div className="col-span-2">
                              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                                <CalendarClock className="h-3.5 w-3.5" /> Recipient send
                              </dt>
                              <dd className="mt-0.5 text-brand-dark dark:text-brand-light">
                                Scheduled for {shortDate(v.send_recipient_on)}
                                {v.recipient_sent_at
                                  ? ` · sent ${shortDate(v.recipient_sent_at)}`
                                  : " · not sent yet"}
                              </dd>
                            </div>
                          )}
                        </dl>

                        {/* Redemption history */}
                        {v.sessions_total != null && (
                          <div className="mt-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              History
                            </p>
                            {history.length === 0 ? (
                              <p className="mt-1 text-sm text-muted-foreground">No sessions used yet.</p>
                            ) : (
                              <ul className="mt-1.5 space-y-1.5">
                                {history.map((r) => (
                                  <li
                                    key={r.id}
                                    className="flex items-start justify-between gap-3 rounded-lg bg-card px-3 py-2 text-sm"
                                  >
                                    <span className="text-brand-dark dark:text-brand-light">
                                      {format(new Date(`${r.used_on}T00:00:00`), "d MMM yyyy")}
                                      {r.note && (
                                        <span className="block text-xs text-muted-foreground">{r.note}</span>
                                      )}
                                    </span>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                      −{r.sessions_used}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* Use-session controls */}
                        {canUse && (
                          <div className="mt-4 rounded-xl border border-border bg-card p-3">
                            {isUsing ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <label className="flex-1 text-sm text-brand-dark dark:text-brand-light">
                                    Date used
                                  </label>
                                  <input
                                    type="date"
                                    value={useDate}
                                    max={new Date().toISOString().slice(0, 10)}
                                    onChange={(e) => setUseDate(e.target.value)}
                                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={useNote}
                                  onChange={(e) => setUseNote(e.target.value)}
                                  placeholder="Optional note (e.g. first lesson)"
                                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUseSession(v)}
                                  disabled={busyId === v.id}
                                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-medium text-white disabled:opacity-60"
                                >
                                  {busyId === v.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                  Confirm 1 session used
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setUseFor(v.id);
                                  setUseDate(new Date().toISOString().slice(0, 10));
                                  setUseNote("");
                                }}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-medium text-white"
                              >
                                <Check className="h-4 w-4" /> Use 1 session
                              </button>
                            )}
                          </div>
                        )}

                        {/* Secondary actions */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={`/voucher/${v.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-brand-dark hover:bg-secondary/30"
                          >
                            <Ticket className="h-4 w-4" /> View voucher
                          </a>

                          {v.status === "pending" && (
                            <button
                              type="button"
                              onClick={() => handleMarkPaid(v)}
                              disabled={busyId === v.id}
                              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-emerald-600 px-3 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                            >
                              <Check className="h-4 w-4" /> Mark paid
                            </button>
                          )}

                          {v.recipient_email && !v.recipient_sent_at && v.status !== "pending" && (
                            <button
                              type="button"
                              onClick={() => handleSendRecipient(v)}
                              disabled={busyId === v.id}
                              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-brand-dark hover:bg-secondary/30 disabled:opacity-60"
                            >
                              <Send className="h-4 w-4" />
                              {v.send_recipient_on ? "Send now" : "Resend"}
                            </button>
                          )}

                          {v.buyer_receipt_sent_at && (
                            <span className="inline-flex h-10 items-center gap-1.5 px-1 text-xs text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" /> receipt sent{" "}
                              {shortDate(v.buyer_receipt_sent_at)}
                            </span>
                          )}

                          {v.status !== "cancelled" && v.status !== "used" && (
                            <button
                              type="button"
                              onClick={() => handleCancel(v)}
                              disabled={busyId === v.id}
                              className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              <Minus className="h-4 w-4" /> Cancel
                            </button>
                          )}
                        </div>

                        {v.internal_notes && (
                          <p className="mt-3 rounded-lg bg-secondary/30 px-3 py-2 text-xs text-brand-dark/80">
                            {v.internal_notes}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <IssueVoucherSheet
        open={issueOpen}
        onOpenChange={setIssueOpen}
        onIssued={load}
      />
    </div>
  );
};

export default AdminVouchersPage;