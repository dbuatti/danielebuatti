// @ts-nocheck
// Gathers headline numbers from every one of Daniele's sites into one response
// for the /admin/overview page. Each site lives in its own database, so the keys
// for those databases are stored as Supabase secrets (see docs/BUSINESS_OVERVIEW_SETUP.md)
// and never reach the browser.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { neon } from 'npm:@neondatabase/serverless@0.10.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAY = 24 * 60 * 60 * 1000;

// ---------- helpers ----------

const env = (name: string) => (Deno.env.get(name) ?? '').trim();

const now = () => new Date();
const daysAgo = (n: number) => new Date(Date.now() - n * DAY);
const todayIso = () => now().toISOString().slice(0, 10);

// Australian financial year starts 1 July.
function financialYearStart(): Date {
  const d = now();
  const year = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  return new Date(Date.UTC(year, 6, 1));
}

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const lower = (v: unknown) => String(v ?? '').trim().toLowerCase();

const inRange = (date: unknown, from: Date) => {
  if (!date) return false;
  const t = new Date(date as string).getTime();
  return Number.isFinite(t) && t >= from.getTime();
};

// First day of the month, 11 months back: 12 whole months including this one.
function trendStart(): Date {
  const d = now();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 11, 1));
}

// Earliest date any income figure needs (FY start or the 12-month trend).
const historyStart = () => new Date(Math.min(financialYearStart().getTime(), trendStart().getTime()));

type Income = { date: unknown; amount: number };

// Turns a site's dated income entries into the totals and 12-month trend the page shows.
function revenueSummary(label: string, entries: Income[]) {
  const start = trendStart();
  const monthly = Array.from({ length: 12 }, (_, i) => {
    const m = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
    return { month: m.toISOString().slice(0, 7), amount: 0 };
  });
  const index = Object.fromEntries(monthly.map((m, i) => [m.month, i]));
  for (const e of entries) {
    if (!e.date) continue;
    const d = new Date(e.date as string);
    if (Number.isNaN(d.getTime())) continue;
    const i = index[d.toISOString().slice(0, 7)];
    if (i !== undefined) monthly[i].amount += e.amount;
  }
  const since = (from: Date) => entries.reduce((s, e) => (inRange(e.date, from) ? s + e.amount : s), 0);
  return { label, last30: since(daysAgo(30)), fy: since(financialYearStart()), monthly };
}

// Signup dates from the site's login system (the profiles tables don't record them).
async function signupDates(client): Promise<string[]> {
  const dates: string[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`auth users: ${error.message}`);
    const users = data?.users ?? [];
    dates.push(...users.map((u) => u.created_at));
    if (users.length < 1000) break;
  }
  return dates;
}

const sumWhere = <T>(rows: T[], amount: (r: T) => number, date: (r: T) => unknown, from: Date) =>
  rows.reduce((s, r) => (inRange(date(r), from) ? s + amount(r) : s), 0);

function remoteClient(urlVar: string, keyVar: string) {
  const url = env(urlVar);
  const key = env(keyVar);
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Reads every row of a table (Supabase caps each request at 1000 rows).
async function selectAll(client, table: string, columns: string, apply?: (q) => any) {
  const pageSize = 1000;
  const rows = [];
  for (let from = 0; from < 50000; from += pageSize) {
    let q = client.from(table).select(columns).range(from, from + pageSize - 1);
    if (apply) q = apply(q);
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

async function count(client, table: string, apply?: (q) => any) {
  let q = client.from(table).select('*', { count: 'exact', head: true });
  if (apply) q = apply(q);
  const { count: c, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return c ?? 0;
}

// Runs one lookup; if a table or column doesn't exist the rest of the site still loads.
function makeSafe(warnings: string[]) {
  return async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await fn();
    } catch (e) {
      warnings.push((e as Error).message);
      return fallback;
    }
  };
}

type Metric = { label: string; value: number | string | null; format?: 'currency' | 'number' | 'text'; hint?: string; tone?: 'good' | 'warn' | 'neutral' };
type Activity = { title: string; subtitle?: string; date: string; amount?: number | null };

function site(id: string, name: string, description: string, url: string, adminUrl: string) {
  return { id, name, description, url, adminUrl };
}

const notConfigured = (meta, secrets: string[]) => ({
  ...meta,
  status: 'not_configured',
  missingSecrets: secrets,
  metrics: [],
  recent: [],
  revenue: null,
  warnings: [],
});

function done(meta, metrics: Metric[], recent: Activity[], revenue, warnings: string[]) {
  recent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { ...meta, status: 'ok', metrics, recent: recent.slice(0, 6), revenue, warnings };
}

// ---------- sites ----------

async function danieleBuatti() {
  const meta = site('danielebuatti', 'Daniele Buatti', 'Quotes, leads, gift cards & AMEB bookings', 'https://danielebuatti.com', '/admin');
  const client = remoteClient('SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY');
  if (!client) return notConfigured(meta, ['SUPABASE_SERVICE_ROLE_KEY']);
  const warnings: string[] = [];
  const safe = makeSafe(warnings);
  const d30 = daysAgo(30), fy = financialYearStart();

  const [quotes, leads, giftCards, amebUpcoming, messages30] = await Promise.all([
    safe(() => selectAll(client, 'invoices', 'id, client_name, event_title, total_amount, accepted_at, rejected_at, created_at'), []),
    safe(() => selectAll(client, 'leads', 'id, status, estimated_value'), []),
    safe(() => selectAll(client, 'gift_cards', 'id, value, payment_status, created_at'), []),
    safe(() => count(client, 'ameb_bookings', (q) => q.gte('exam_date', todayIso())), null),
    safe(() => count(client, 'contact_messages', (q) => q.gte('created_at', d30.toISOString())), null),
  ]);

  const accepted = quotes.filter((q) => q.accepted_at);
  const pending = quotes.filter((q) => !q.accepted_at && !q.rejected_at);
  const paidCards = giftCards.filter((g) => lower(g.payment_status) === 'paid');
  const openLeads = leads.filter((l) => !['lost', 'converted'].includes(lower(l.status)));

  const revenue = revenueSummary('Accepted quotes + gift cards', [
    ...accepted.map((q) => ({ date: q.accepted_at, amount: num(q.total_amount) })),
    ...paidCards.map((g) => ({ date: g.created_at, amount: num(g.value) })),
  ]);

  const metrics: Metric[] = [
    { label: 'Accepted quotes (FY)', value: sumWhere(accepted, (q) => num(q.total_amount), (q) => q.accepted_at, fy), format: 'currency' },
    { label: 'Quotes awaiting reply', value: pending.length, format: 'number', tone: pending.length ? 'warn' : 'neutral' },
    { label: 'Open leads', value: openLeads.length, format: 'number', hint: `${leads.filter((l) => lower(l.status) === 'new').length} new` },
    { label: 'Pipeline value', value: openLeads.reduce((s, l) => s + num(l.estimated_value), 0), format: 'currency' },
    { label: 'Gift card sales (FY)', value: sumWhere(paidCards, (g) => num(g.value), (g) => g.created_at, fy), format: 'currency' },
    { label: 'Upcoming AMEB exams', value: amebUpcoming, format: 'number' },
    { label: 'Contact messages (30d)', value: messages30, format: 'number' },
  ];

  const recent: Activity[] = [
    ...accepted.map((q) => ({ title: `Quote accepted: ${q.client_name ?? 'Client'}`, subtitle: q.event_title, date: q.accepted_at, amount: num(q.total_amount) })),
    ...pending.map((q) => ({ title: `Quote sent: ${q.client_name ?? 'Client'}`, subtitle: q.event_title, date: q.created_at, amount: num(q.total_amount) })),
  ];

  return done(meta, metrics, recent, revenue, warnings);
}

async function resonance() {
  const meta = site('resonance', 'Resonance with Daniele', 'Choir members, events & ticket sales', 'https://resonance-with-daniele.vercel.app', 'https://resonance-with-daniele.vercel.app/admin');
  const client = remoteClient('RESONANCE_SUPABASE_URL', 'RESONANCE_SERVICE_ROLE_KEY');
  if (!client) return notConfigured(meta, ['RESONANCE_SUPABASE_URL', 'RESONANCE_SERVICE_ROLE_KEY']);
  const warnings: string[] = [];
  const safe = makeSafe(warnings);
  const d30 = daysAgo(30), fy = financialYearStart();

  const [members, newMembers, interest, events, orders, expenses, suggestions] = await Promise.all([
    safe(() => count(client, 'profiles'), null),
    safe(async () => (await signupDates(client)).filter((d) => inRange(d, d30)).length, null),
    safe(() => count(client, 'interest_submissions'), null),
    safe(() => selectAll(client, 'events', 'id, title, date, location'), []),
    safe(() => selectAll(client, 'event_orders', 'event_id, first_name, last_name, order_date, valid_tickets, your_earnings, status'), []),
    safe(() => selectAll(client, 'event_expenses', 'event_id, amount'), []),
    safe(() => count(client, 'song_suggestions'), null),
  ]);

  const today = todayIso();
  const upcoming = events.filter((e) => e.date && String(e.date).slice(0, 10) >= today)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const validOrders = orders.filter((o) => !['cancelled', 'refunded'].includes(lower(o.status)));
  const eventTitle = Object.fromEntries(events.map((e) => [e.id, e.title]));

  const revenue = revenueSummary('Ticket earnings', validOrders.map((o) => ({ date: o.order_date, amount: num(o.your_earnings) })));
  const totalEarnings = validOrders.reduce((s, o) => s + num(o.your_earnings), 0);
  const totalExpenses = expenses.reduce((s, e) => s + num(e.amount), 0);

  const metrics: Metric[] = [
    { label: 'Members', value: members, format: 'number', hint: newMembers != null ? `+${newMembers} in 30 days` : undefined },
    { label: 'Interest sign-ups', value: interest, format: 'number' },
    { label: 'Upcoming events', value: upcoming.length, format: 'number', hint: upcoming[0] ? `Next: ${upcoming[0].title}` : undefined },
    { label: 'Tickets sold (FY)', value: validOrders.filter((o) => inRange(o.order_date, fy)).reduce((s, o) => s + num(o.valid_tickets), 0), format: 'number' },
    { label: 'Ticket earnings (FY)', value: revenue.fy, format: 'currency' },
    { label: 'Profit, all events', value: totalEarnings - totalExpenses, format: 'currency', tone: totalEarnings - totalExpenses >= 0 ? 'good' : 'warn', hint: `after ${totalExpenses.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })} expenses` },
    { label: 'Song suggestions', value: suggestions, format: 'number' },
  ];

  const recent: Activity[] = [
    ...upcoming.slice(0, 3).map((e) => ({ title: `Upcoming: ${e.title}`, subtitle: e.location, date: e.date })),
    ...validOrders.map((o) => ({ title: `Ticket order: ${[o.first_name, o.last_name].filter(Boolean).join(' ') || 'Guest'}`, subtitle: eventTitle[o.event_id], date: o.order_date, amount: num(o.your_earnings) })),
  ];

  return done(meta, metrics, recent, revenue, warnings);
}

// db-it and Invoicify share one database.
function dbItClient() {
  return remoteClient('DBIT_SUPABASE_URL', 'DBIT_SERVICE_ROLE_KEY');
}

async function dbIt() {
  const meta = site('db-it', 'db-it', 'IT support tickets & clients', 'https://db-it.vercel.app', 'https://db-it.vercel.app/tickets');
  const client = dbItClient();
  if (!client) return notConfigured(meta, ['DBIT_SUPABASE_URL', 'DBIT_SERVICE_ROLE_KEY']);
  const warnings: string[] = [];
  const safe = makeSafe(warnings);
  const d30 = daysAgo(30);

  const [tickets, itClients] = await Promise.all([
    safe(() => selectAll(client, 'tickets', 'id, ticket_number, title, status, priority, client_display_name, actual_hours, created_at, updated_at'), []),
    safe(() => count(client, 'clients', (q) => q.eq('is_it_client', true)), null),
  ]);

  const isClosed = (t) => ['resolved', 'closed'].includes(lower(t.status));
  const open = tickets.filter((t) => !isClosed(t));
  const urgent = open.filter((t) => ['high', 'urgent', 'critical'].includes(lower(t.priority)));
  const resolved30 = tickets.filter((t) => isClosed(t) && inRange(t.updated_at, d30));

  const metrics: Metric[] = [
    { label: 'Open tickets', value: open.length, format: 'number', tone: open.length ? 'warn' : 'good', hint: `${open.filter((t) => lower(t.status) === 'in_progress').length} in progress` },
    { label: 'High priority', value: urgent.length, format: 'number', tone: urgent.length ? 'warn' : 'neutral' },
    { label: 'New tickets (30d)', value: tickets.filter((t) => inRange(t.created_at, d30)).length, format: 'number' },
    { label: 'Resolved (30d)', value: resolved30.length, format: 'number', tone: 'good' },
    { label: 'Hours logged (30d)', value: Math.round(resolved30.reduce((s, t) => s + num(t.actual_hours), 0) * 10) / 10, format: 'number' },
    { label: 'IT clients', value: itClients, format: 'number' },
  ];

  const recent: Activity[] = tickets.map((t) => ({
    title: `#${t.ticket_number ?? '–'} ${t.title}`,
    subtitle: [t.client_display_name, t.status].filter(Boolean).join(' · '),
    date: t.created_at,
  }));

  return done(meta, metrics, recent, null, warnings);
}

async function billing() {
  const meta = site('billing', 'Billing (Invoicify)', 'Invoices, payments & outstanding balances', 'https://billing.danielebuatti.com', 'https://billing.danielebuatti.com');
  const client = dbItClient();
  if (!client) return notConfigured(meta, ['DBIT_SUPABASE_URL', 'DBIT_SERVICE_ROLE_KEY']);
  const warnings: string[] = [];
  const safe = makeSafe(warnings);
  const d30 = daysAgo(30), fy = financialYearStart();
  const owner = env('BILLING_OWNER_USER_ID');

  const invoices = await safe(() => selectAll(client, 'invoices', 'id, number, client_display_name, invoice_date, due_date, status, type, total_amount, owner_user_id',
    (q) => (owner ? q.eq('owner_user_id', owner) : q)), []);

  const customer = invoices.filter((i) => lower(i.type) !== 'vendor bill');
  const paid = customer.filter((i) => lower(i.status) === 'paid');
  const outstanding = customer.filter((i) => ['posted', 'partially paid'].includes(lower(i.status)));
  const overdue = outstanding.filter((i) => i.due_date && String(i.due_date).slice(0, 10) < todayIso());
  const drafts = customer.filter((i) => lower(i.status) === 'draft');

  const revenue = revenueSummary('Paid invoices', paid.map((i) => ({ date: i.invoice_date, amount: num(i.total_amount) })));

  const metrics: Metric[] = [
    { label: 'Paid (FY)', value: revenue.fy, format: 'currency', tone: 'good' },
    { label: 'Paid (30d)', value: revenue.last30, format: 'currency' },
    { label: 'Outstanding', value: outstanding.reduce((s, i) => s + num(i.total_amount), 0), format: 'currency', hint: `${outstanding.length} invoice${outstanding.length === 1 ? '' : 's'}` },
    { label: 'Overdue', value: overdue.length, format: 'number', tone: overdue.length ? 'warn' : 'good', hint: overdue.length ? overdue.reduce((s, i) => s + num(i.total_amount), 0).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) : undefined },
    { label: 'Drafts', value: drafts.length, format: 'number' },
    { label: 'Invoices this FY', value: customer.filter((i) => inRange(i.invoice_date, fy)).length, format: 'number' },
  ];

  const recent: Activity[] = customer.map((i) => ({
    title: `${i.number ?? 'Invoice'} · ${i.client_display_name ?? 'Client'}`,
    subtitle: i.status,
    date: i.invoice_date,
    amount: num(i.total_amount),
  }));

  return done(meta, metrics, recent, revenue, warnings);
}

async function kinesiology() {
  const meta = site('kinesiology', 'Kinesiology App', 'Voice, piano & kinesiology clients and sessions', 'https://kinesiology-app.vercel.app', 'https://kinesiology-app.vercel.app');
  const client = remoteClient('KINESIOLOGY_SUPABASE_URL', 'KINESIOLOGY_SERVICE_ROLE_KEY');
  if (!client) return notConfigured(meta, ['KINESIOLOGY_SUPABASE_URL', 'KINESIOLOGY_SERVICE_ROLE_KEY']);
  const warnings: string[] = [];
  const safe = makeSafe(warnings);
  const d30 = daysAgo(30), fy = financialYearStart();
  const fromIso = historyStart().toISOString();

  const [clients, appointments, voice] = await Promise.all([
    safe(() => selectAll(client, 'clients', 'id, name, lifecycle_status, created_at'), []),
    safe(() => selectAll(client, 'appointments', 'id, client_id, date, tag, status, price_amount, is_paid, payment_received', (q) => q.gte('date', fromIso)), []),
    safe(() => selectAll(client, 'voice_bookings', 'id, student_name, lesson_date, discipline, cost, status', (q) => q.gte('lesson_date', fromIso.slice(0, 10))), []),
  ]);

  const clientName = Object.fromEntries(clients.map((c) => [c.id, c.name]));
  const t = Date.now();
  const cancelled = (s) => ['cancelled', 'canceled', 'no show'].includes(lower(s));
  const liveAppts = appointments.filter((a) => !cancelled(a.status));
  const liveVoice = voice.filter((v) => !cancelled(v.status));
  const upcomingAppts = liveAppts.filter((a) => new Date(a.date).getTime() >= t);
  const upcomingVoice = liveVoice.filter((v) => new Date(v.lesson_date).getTime() >= t - DAY);
  const paidAppts = liveAppts.filter((a) => a.payment_received || a.is_paid);
  const pastVoice = liveVoice.filter((v) => new Date(v.lesson_date).getTime() < t);

  const revenue = revenueSummary('Paid sessions + lessons', [
    ...paidAppts.map((a) => ({ date: a.date, amount: num(a.price_amount) })),
    ...pastVoice.map((v) => ({ date: v.lesson_date, amount: num(v.cost) })),
  ]);

  const disciplineCount = (name: string) => upcomingVoice.filter((v) => lower(v.discipline).includes(name)).length;
  const unpaid = liveAppts.filter((a) => new Date(a.date).getTime() < t && !(a.payment_received || a.is_paid) && num(a.price_amount) > 0);

  const metrics: Metric[] = [
    { label: 'Clients', value: clients.length, format: 'number', hint: `${clients.filter((c) => lower(c.lifecycle_status) === 'active').length} active` },
    { label: 'At risk / lapsed', value: clients.filter((c) => ['at_risk', 'lapsed'].includes(lower(c.lifecycle_status))).length, format: 'number', tone: 'warn' },
    { label: 'Upcoming kinesiology', value: upcomingAppts.length, format: 'number' },
    { label: 'Upcoming lessons', value: upcomingVoice.length, format: 'number', hint: `${disciplineCount('voice')} voice · ${disciplineCount('piano')} piano` },
    { label: 'Sessions (30d)', value: liveAppts.filter((a) => inRange(a.date, d30) && new Date(a.date).getTime() < t).length + pastVoice.filter((v) => inRange(v.lesson_date, d30)).length, format: 'number' },
    { label: 'Unpaid sessions', value: unpaid.length, format: 'number', tone: unpaid.length ? 'warn' : 'good', hint: unpaid.length ? unpaid.reduce((s, a) => s + num(a.price_amount), 0).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) : undefined },
    { label: 'Session income (FY)', value: revenue.fy, format: 'currency' },
  ];

  const recent: Activity[] = [
    ...upcomingAppts.map((a) => ({ title: `${a.tag || 'Kinesiology'}: ${clientName[a.client_id] ?? 'Client'}`, subtitle: 'Upcoming', date: a.date, amount: num(a.price_amount) || null })),
    ...upcomingVoice.map((v) => ({ title: `${v.discipline || 'Lesson'}: ${v.student_name ?? 'Student'}`, subtitle: 'Upcoming', date: v.lesson_date, amount: num(v.cost) || null })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Upcoming sessions read best soonest-first, so skip done()'s newest-first sort.
  return { ...done(meta, metrics, [], revenue, warnings), recent: recent.slice(0, 6) };
}

async function pianoBackings() {
  const meta = site('piano-backings', 'Piano Backings by Daniele', 'Shop sales, custom track requests & customers', 'https://pianobackings.danielebuatti.com', 'https://pianobackings.danielebuatti.com/admin');
  const client = remoteClient('PIANO_BACKINGS_SUPABASE_URL', 'PIANO_BACKINGS_SERVICE_ROLE_KEY');
  if (!client) return notConfigured(meta, ['PIANO_BACKINGS_SUPABASE_URL', 'PIANO_BACKINGS_SERVICE_ROLE_KEY']);
  const warnings: string[] = [];
  const safe = makeSafe(warnings);
  const d30 = daysAgo(30), fy = financialYearStart();

  const [orders, requests, activeProducts, customers, newCustomers] = await Promise.all([
    safe(() => selectAll(client, 'orders', 'id, amount, status, customer_email, created_at, products(title)'), []),
    safe(() => selectAll(client, 'backing_requests', 'id, name, song_title, musical_or_artist, status, is_paid, cost, delivery_date, created_at'), []),
    safe(() => count(client, 'products', (q) => q.eq('is_active', true)), null),
    safe(() => count(client, 'profiles'), null),
    safe(async () => (await signupDates(client)).filter((d) => inRange(d, d30)).length, null),
  ]);

  const sales = orders.filter((o) => ['completed', 'paid'].includes(lower(o.status)));
  const paidRequests = requests.filter((r) => r.is_paid && lower(r.status) !== 'cancelled');
  const queue = requests.filter((r) => ['pending', 'in-progress', 'in_progress'].includes(lower(r.status)));

  const revenue = revenueSummary('Shop orders + paid requests', [
    ...sales.map((o) => ({ date: o.created_at, amount: num(o.amount) })),
    ...paidRequests.map((r) => ({ date: r.created_at, amount: num(r.cost) })),
  ]);

  const metrics: Metric[] = [
    { label: 'Sales (FY)', value: revenue.fy, format: 'currency', tone: 'good' },
    { label: 'Shop orders (30d)', value: sales.filter((o) => inRange(o.created_at, d30)).length, format: 'number', hint: sumWhere(sales, (o) => num(o.amount), (o) => o.created_at, d30).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) },
    { label: 'Requests in queue', value: queue.length, format: 'number', tone: queue.length ? 'warn' : 'good', hint: `${queue.filter((r) => lower(r.status) === 'pending').length} not started` },
    { label: 'Custom requests (30d)', value: requests.filter((r) => inRange(r.created_at, d30)).length, format: 'number' },
    { label: 'Unpaid requests', value: requests.filter((r) => !r.is_paid && lower(r.status) !== 'cancelled').length, format: 'number' },
    { label: 'Products for sale', value: activeProducts, format: 'number' },
    { label: 'Customers', value: customers, format: 'number', hint: newCustomers != null ? `+${newCustomers} in 30 days` : undefined },
  ];

  const recent: Activity[] = [
    ...sales.map((o) => ({ title: `Shop sale: ${o.products?.title ?? 'Product'}`, subtitle: o.customer_email, date: o.created_at, amount: num(o.amount) })),
    ...requests.map((r) => ({ title: `Request: ${r.song_title}`, subtitle: [r.name, r.status].filter(Boolean).join(' · '), date: r.created_at, amount: num(r.cost) || null })),
  ];

  return done(meta, metrics, recent, revenue, warnings);
}

async function guidebook() {
  const meta = site('guidebook', 'The Accompanist Guidebook', 'Course members, sales & lesson progress', 'https://theauditionguidebook.vercel.app', 'https://theauditionguidebook.vercel.app/admin/users');
  const dbUrl = env('GUIDEBOOK_DATABASE_URL');
  if (!dbUrl) return notConfigured(meta, ['GUIDEBOOK_DATABASE_URL']);
  const warnings: string[] = [];
  const safe = makeSafe(warnings);
  const sql = neon(dbUrl);
  const d30 = daysAgo(30), fy = financialYearStart();

  const [users, purchases, lessonStats, completions30] = await Promise.all([
    safe(() => sql`select name, email, is_paid, created_at from users`, []),
    safe(() => sql`select email, amount_total, created_at from purchases`, []),
    safe(() => sql`select count(*) filter (where is_published)::int as published, count(*)::int as total from lessons`, [{ published: null, total: null }]),
    safe(() => sql`select count(*)::int as n from progress where completed_at >= ${d30.toISOString()}`, [{ n: null }]),
  ]);

  // Stripe stores amounts in cents.
  const dollars = (p) => num(p.amount_total) / 100;
  const revenue = revenueSummary('Course sales', purchases.map((p) => ({ date: p.created_at, amount: dollars(p) })));
  const paidUsers = users.filter((u) => u.is_paid);

  const metrics: Metric[] = [
    { label: 'Members', value: users.length, format: 'number', hint: `+${users.filter((u) => inRange(u.created_at, d30)).length} in 30 days` },
    { label: 'Paid members', value: paidUsers.length, format: 'number', tone: 'good', hint: users.length ? `${Math.round((paidUsers.length / users.length) * 100)}% conversion` : undefined },
    { label: 'Sales (FY)', value: revenue.fy, format: 'currency' },
    { label: 'Sales (30d)', value: revenue.last30, format: 'currency', hint: `${purchases.filter((p) => inRange(p.created_at, d30)).length} purchases` },
    { label: 'Lessons published', value: lessonStats[0]?.published ?? null, format: 'number', hint: lessonStats[0]?.total != null ? `of ${lessonStats[0].total} planned` : undefined },
    { label: 'Lessons completed (30d)', value: completions30[0]?.n ?? null, format: 'number' },
  ];

  const recent: Activity[] = [
    ...purchases.map((p) => ({ title: 'Guidebook purchase', subtitle: p.email, date: new Date(p.created_at).toISOString(), amount: dollars(p) })),
    ...users.map((u) => ({ title: `New member: ${u.name || u.email}`, subtitle: u.is_paid ? 'Paid' : 'Free', date: new Date(u.created_at).toISOString() })),
  ];

  return done(meta, metrics, recent, revenue, warnings);
}

const SITES = [danieleBuatti, resonance, dbIt, billing, kinesiology, pianoBackings, guidebook];
const SITE_NAMES = ['Daniele Buatti', 'Resonance with Daniele', 'db-it', 'Billing (Invoicify)', 'Kinesiology App', 'Piano Backings by Daniele', 'The Accompanist Guidebook'];

// ---------- handler ----------

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    // Anyone can create an account on the site, so only listed emails get the numbers.
    const admins = env('HUB_ADMIN_EMAILS').toLowerCase().split(',').map((e) => e.trim()).filter(Boolean);
    if (!admins.length) {
      return json({ error: 'HUB_ADMIN_EMAILS secret is not set. Add your login email to it in Supabase → Edge Functions → Secrets.' }, 403);
    }
    if (!admins.includes((user.email ?? '').toLowerCase())) return json({ error: 'Forbidden' }, 403);

    const results = await Promise.allSettled(SITES.map((fn) => fn()));
    const sites = results.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : { id: SITES[i].name, name: SITE_NAMES[i], status: 'error', error: (r.reason as Error)?.message ?? 'Unknown error', metrics: [], recent: [], revenue: null, warnings: [] },
    );

    return json({ generatedAt: new Date().toISOString(), financialYearStart: financialYearStart().toISOString(), sites });
  } catch (error: unknown) {
    console.error('[fetch-business-overview] error:', (error as Error).message);
    return json({ error: (error as Error).message }, 500);
  }
});
