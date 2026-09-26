import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle, CalendarClock, CheckCircle2, ExternalLink, Globe, Loader2, PlugZap, RefreshCw, TrendingUp, Wallet,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type Metric = {
  label: string;
  value: number | string | null;
  format?: 'currency' | 'number' | 'text';
  hint?: string;
  tone?: 'good' | 'warn' | 'neutral';
};

type Activity = { title: string; subtitle?: string; date: string; amount?: number | null };

type Site = {
  id: string;
  name: string;
  description?: string;
  url?: string;
  adminUrl?: string;
  status: 'ok' | 'not_configured' | 'error';
  error?: string;
  missingSecrets?: string[];
  metrics: Metric[];
  recent: Activity[];
  revenue: { last30: number; fy: number; label: string; monthly?: { month: string; amount: number }[] } | null;
  warnings: string[];
};

type Overview = { generatedAt: string; financialYearStart: string; sites: Site[] };

const EXCLUDED_KEY = 'admin-overview-excluded-sites';

const aud = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });

function formatMetric(m: Metric) {
  if (m.value === null || m.value === undefined) return '—';
  if (m.format === 'currency') return aud(Number(m.value));
  if (m.format === 'number') return Number(m.value).toLocaleString('en-AU');
  return String(m.value);
}

function safeDate(d: string) {
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function fetchOverview(): Promise<Overview> {
  const { data, error } = await supabase.functions.invoke('fetch-business-overview');
  if (error) {
    // Pull the real message out of the function's JSON reply when there is one.
    const body = await (error as { context?: Response }).context?.json?.().catch(() => null);
    throw new Error(body?.error ?? error.message);
  }
  return data as Overview;
}

function readExcluded(): string[] {
  try {
    return JSON.parse(localStorage.getItem(EXCLUDED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

const cardClass = 'bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50 rounded-2xl';
const labelClass = 'text-xs font-bold uppercase tracking-widest text-brand-dark/50 dark:text-brand-light/50';
const mutedClass = 'text-brand-dark/60 dark:text-brand-light/60';

type MonthTotal = { month: string; total: number; parts: { name: string; amount: number }[] };

// Combined monthly income for the ticked sites, as one bar per month.
const IncomeTrend: React.FC<{ sites: Site[] }> = ({ sites }) => {
  const [active, setActive] = useState<number | null>(null);
  const months = sites[0]?.revenue?.monthly?.map((m) => m.month) ?? [];
  const data: MonthTotal[] = months.map((month, i) => {
    const parts = sites
      .map((s) => ({ name: s.name, amount: s.revenue?.monthly?.[i]?.amount ?? 0 }))
      .filter((p) => p.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    return { month, total: parts.reduce((sum, p) => sum + p.amount, 0), parts };
  });
  if (!data.length) return null;

  const max = Math.max(1, ...data.map((d) => d.total));
  const monthLabel = (m: string, long = false) => format(new Date(`${m}-01T00:00:00`), long ? 'MMMM yyyy' : 'MMM');
  const shown = active ?? data.length - 1;
  const focus = data[shown];
  const average = data.reduce((sum, d) => sum + d.total, 0) / data.length;

  return (
    <Card className={cardClass}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-xl font-bold text-brand-primary">Income · last 12 months</CardTitle>
          <p className={cn('text-sm', mutedClass)}>All ticked businesses combined. Average {aud(average)} a month.</p>
        </div>
        <div className="sm:text-right" aria-live="polite">
          <p className={labelClass}>{monthLabel(focus.month, true)}</p>
          <p className="text-2xl font-bold text-brand-dark dark:text-brand-light">{aud(focus.total)}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-48">
          {/* Recessive gridlines at the top value and halfway */}
          {[1, 0.5].map((f) => (
            <div key={f} className="absolute inset-x-0 border-t border-dashed border-brand-secondary/30" style={{ bottom: `${f * 100}%` }}>
              <span className={cn('absolute -top-4 left-0 text-[10px]', mutedClass)}>{aud(max * f)}</span>
            </div>
          ))}
          <div className="absolute inset-0 flex items-end gap-0.5 border-b border-brand-secondary/40" onMouseLeave={() => setActive(null)}>
            {data.map((d, i) => (
              <button
                key={d.month}
                type="button"
                className="group relative flex h-full flex-1 items-end focus:outline-none"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(i)}
                aria-label={`${monthLabel(d.month, true)}: ${aud(d.total)}`}
              >
                <span
                  className={cn(
                    'mx-auto block w-full max-w-10 rounded-t bg-brand-primary transition-opacity',
                    shown === i ? 'opacity-100' : 'opacity-60 group-hover:opacity-100',
                    'group-focus-visible:ring-2 group-focus-visible:ring-brand-primary group-focus-visible:ring-offset-2',
                  )}
                  style={{ height: `${(d.total / max) * 100}%`, minHeight: d.total > 0 ? 2 : 0 }}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-0.5 mt-1.5">
          {data.map((d, i) => (
            <span key={d.month} className={cn('flex-1 text-center text-[10px]', shown === i ? 'font-bold text-brand-dark dark:text-brand-light' : mutedClass)}>
              {monthLabel(d.month).slice(0, 3)}
            </span>
          ))}
        </div>

        <div className="mt-4 min-h-[3rem]">
          {focus.parts.length === 0 ? (
            <p className={cn('text-sm', mutedClass)}>No income recorded in {monthLabel(focus.month, true)}.</p>
          ) : (
            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2 text-sm">
              {focus.parts.map((p) => (
                <li key={p.name} className="flex justify-between gap-3">
                  <span className={cn('truncate', mutedClass)}>{p.name}</span>
                  <span className="font-semibold shrink-0">{aud(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <details className="mt-4 text-sm">
          <summary className={cn('cursor-pointer text-xs', mutedClass)}>Show as a table</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={cn('text-xs', mutedClass)}>
                  <th className="py-1 pr-4 font-medium">Month</th>
                  {sites.map((s) => <th key={s.id} className="py-1 pr-4 font-medium text-right whitespace-nowrap">{s.name}</th>)}
                  <th className="py-1 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((d) => (
                  <tr key={d.month} className="border-t border-brand-secondary/20">
                    <td className="py-1 pr-4 whitespace-nowrap">{monthLabel(d.month, true)}</td>
                    {sites.map((s) => (
                      <td key={s.id} className="py-1 pr-4 text-right">{aud(s.revenue?.monthly?.find((m) => m.month === d.month)?.amount ?? 0)}</td>
                    ))}
                    <td className="py-1 text-right font-semibold">{aud(d.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </CardContent>
    </Card>
  );
};

const StatTile: React.FC<{ label: string; value: string; hint?: string; icon: React.ElementType; loading?: boolean }> = ({ label, value, hint, icon: Icon, loading }) => (
  <Card className={cardClass}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className={labelClass}>{label}</CardTitle>
      <Icon className="h-4 w-4 text-brand-primary" aria-hidden />
    </CardHeader>
    <CardContent>
      <div className="text-2xl md:text-3xl font-bold text-brand-dark dark:text-brand-light">{loading ? '…' : value}</div>
      {hint && <p className={cn('text-xs mt-1', mutedClass)}>{hint}</p>}
    </CardContent>
  </Card>
);

const StatusBadge: React.FC<{ site: Site }> = ({ site }) => {
  if (site.status === 'ok') {
    return (
      <Badge variant="outline" className="gap-1 border-green-600/40 text-green-700 dark:text-green-400">
        <CheckCircle2 className="h-3 w-3" aria-hidden /> Connected
      </Badge>
    );
  }
  if (site.status === 'not_configured') {
    return (
      <Badge variant="outline" className="gap-1 border-amber-500/50 text-amber-700 dark:text-amber-400">
        <PlugZap className="h-3 w-3" aria-hidden /> Needs setup
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 border-red-500/50 text-red-600 dark:text-red-400">
      <AlertTriangle className="h-3 w-3" aria-hidden /> Error
    </Badge>
  );
};

const SiteLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) =>
  href.startsWith('/') ? (
    <Button asChild variant="ghost" size="sm" className="text-brand-primary hover:bg-brand-primary/10 rounded-full">
      <Link to={href}>{children}</Link>
    </Button>
  ) : (
    <Button asChild variant="ghost" size="sm" className="text-brand-primary hover:bg-brand-primary/10 rounded-full">
      <a href={href} target="_blank" rel="noopener noreferrer">{children} <ExternalLink className="ml-1 h-3 w-3" aria-hidden /></a>
    </Button>
  );

const SiteCard: React.FC<{ site: Site }> = ({ site }) => (
  <Card className={cn(cardClass, 'flex flex-col')}>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-xl font-bold text-brand-primary">{site.name}</CardTitle>
          {site.description && <p className={cn('text-sm mt-1', mutedClass)}>{site.description}</p>}
        </div>
        <StatusBadge site={site} />
      </div>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col gap-5">
      {site.status === 'not_configured' && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold mb-2">Not connected yet. Add these secrets in Supabase:</p>
          <ul className="space-y-1">
            {site.missingSecrets?.map((s) => (
              <li key={s}><code className="rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.5 text-xs">{s}</code></li>
            ))}
          </ul>
          <p className={cn('mt-2 text-xs', mutedClass)}>Step-by-step instructions: docs/BUSINESS_OVERVIEW_SETUP.md</p>
        </div>
      )}

      {site.status === 'error' && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">{site.error}</div>
      )}

      {site.metrics.length > 0 && (
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
          {site.metrics.map((m) => (
            <div key={m.label}>
              <dt className={cn('text-xs', mutedClass)}>{m.label}</dt>
              <dd className="flex items-center gap-1.5 text-lg font-bold text-brand-dark dark:text-brand-light">
                {m.tone === 'warn' && Number(m.value) > 0 && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" aria-label="Needs attention" />}
                {formatMetric(m)}
              </dd>
              {m.hint && <p className={cn('text-xs', mutedClass)}>{m.hint}</p>}
            </div>
          ))}
        </dl>
      )}

      {site.recent.length > 0 && (
        <div>
          <p className={cn(labelClass, 'mb-2')}>Recent</p>
          <ul className="divide-y divide-brand-secondary/20">
            {site.recent.map((a, i) => {
              const date = safeDate(a.date);
              return (
                <li key={`${a.title}-${i}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.title}</p>
                    <p className={cn('truncate text-xs', mutedClass)}>
                      {[a.subtitle, date && format(date, 'd MMM yyyy')].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {a.amount ? <span className="shrink-0 font-semibold">{aud(a.amount)}</span> : null}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {site.warnings.length > 0 && (
        <details className={cn('text-xs', mutedClass)}>
          <summary className="cursor-pointer">{site.warnings.length} number{site.warnings.length === 1 ? '' : 's'} couldn't be loaded</summary>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {site.warnings.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </details>
      )}

      <div className="mt-auto flex flex-wrap gap-1 pt-2 border-t border-brand-secondary/20">
        {site.adminUrl && <SiteLink href={site.adminUrl}>Open admin</SiteLink>}
        {site.url && site.url !== site.adminUrl && <SiteLink href={site.url}>Visit site</SiteLink>}
      </div>
    </CardContent>
  </Card>
);

const AdminOverviewPage: React.FC = () => {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const isLoading = isFetching && !data;

  const refetch = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      setData(await fetchOverview());
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [excluded, setExcluded] = useState<string[]>(readExcluded);
  useEffect(() => {
    try {
      localStorage.setItem(EXCLUDED_KEY, JSON.stringify(excluded));
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
  }, [excluded]);

  const sites = useMemo(() => data?.sites ?? [], [data]);
  const earning = sites.filter((s) => s.revenue);
  const counted = earning.filter((s) => !excluded.includes(s.id));
  const total30 = counted.reduce((sum, s) => sum + (s.revenue?.last30 ?? 0), 0);
  const totalFy = counted.reduce((sum, s) => sum + (s.revenue?.fy ?? 0), 0);
  const maxFy = Math.max(1, ...earning.map((s) => s.revenue?.fy ?? 0));
  const connected = sites.filter((s) => s.status === 'ok').length;

  const attention = sites.flatMap((s) =>
    s.metrics.filter((m) => m.tone === 'warn' && Number(m.value) > 0).map((m) => ({ site: s.name, metric: m })),
  );

  const { latest, upcoming } = useMemo(() => {
    const now = Date.now();
    const all = sites.flatMap((s) => s.recent.map((a) => ({ ...a, site: s.name })))
      .filter((a) => safeDate(a.date));
    return {
      latest: all.filter((a) => new Date(a.date).getTime() <= now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10),
      upcoming: all.filter((a) => new Date(a.date).getTime() > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 10),
    };
  }, [sites]);

  const fyLabel = data ? `since ${format(new Date(data.financialYearStart), 'd MMM yyyy')}` : 'this financial year';

  const toggleSite = (id: string) =>
    setExcluded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-brand-dark dark:text-brand-light tracking-tight">All Businesses</h2>
          <p className={cn('text-lg', mutedClass)}>
            Every site in one place.
            {data && <> Updated {formatDistanceToNow(new Date(data.generatedAt), { addSuffix: true })}.</>}
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isFetching} className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light rounded-full px-6">
          <RefreshCw className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')} aria-hidden />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/40 bg-red-50 dark:bg-red-500/10 rounded-2xl">
          <CardContent className="p-6 text-red-700 dark:text-red-300">
            <p className="font-semibold">Couldn't load the overview.</p>
            <p className="text-sm mt-1">{error.message}</p>
            <p className="text-sm mt-2">If this is the first time, the setup steps are in docs/BUSINESS_OVERVIEW_SETUP.md.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
        <StatTile label="Income · last 30 days" value={aud(total30)} hint={`${counted.length} of ${earning.length} income sources counted`} icon={Wallet} loading={isLoading} />
        <StatTile label="Income · this FY" value={aud(totalFy)} hint={fyLabel} icon={TrendingUp} loading={isLoading} />
        <StatTile label="Needs attention" value={String(attention.length)} hint="Overdue, unpaid or waiting items" icon={AlertTriangle} loading={isLoading} />
        <StatTile label="Sites connected" value={`${connected} / ${sites.length || 7}`} hint={connected < sites.length ? 'Some sites need setup' : 'Everything is connected'} icon={Globe} loading={isLoading} />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-10 w-10 animate-spin text-brand-primary" aria-label="Loading" />
        </div>
      )}

      {counted.some((s) => s.revenue?.monthly) && <IncomeTrend sites={counted} />}

      {earning.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className={cn(cardClass, 'lg:col-span-3')}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-brand-primary">Income by business · this FY</CardTitle>
              <p className={cn('text-sm', mutedClass)}>
                Untick a business to leave it out of the totals, e.g. if its quotes are also invoiced through Billing.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[...earning].sort((a, b) => (b.revenue?.fy ?? 0) - (a.revenue?.fy ?? 0)).map((s) => {
                  const included = !excluded.includes(s.id);
                  const fy = s.revenue?.fy ?? 0;
                  return (
                    <li key={s.id} className={cn(!included && 'opacity-50')}>
                      <div className="flex items-center justify-between gap-3 text-sm mb-1.5">
                        <label className="flex items-center gap-2 cursor-pointer min-w-0">
                          <Checkbox checked={included} onCheckedChange={() => toggleSite(s.id)} aria-label={`Include ${s.name} in totals`} />
                          <span className="font-medium truncate">{s.name}</span>
                          <span className={cn('hidden sm:inline text-xs truncate', mutedClass)}>{s.revenue?.label}</span>
                        </label>
                        <span className="font-semibold shrink-0">{aud(fy)}</span>
                      </div>
                      <div className="h-2.5 rounded bg-brand-secondary/20" title={`${s.name}: ${aud(fy)} this FY, ${aud(s.revenue?.last30 ?? 0)} in the last 30 days`}>
                        <div className="h-full rounded bg-brand-primary transition-all" style={{ width: `${Math.max(fy > 0 ? 1 : 0, (fy / maxFy) * 100)}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <Card className={cn(cardClass, 'lg:col-span-2')}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-brand-primary">Needs attention</CardTitle>
            </CardHeader>
            <CardContent>
              {attention.length === 0 ? (
                <p className={cn('text-sm flex items-center gap-2', mutedClass)}>
                  <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden /> Nothing waiting on you.
                </p>
              ) : (
                <ul className="space-y-3">
                  {attention.map(({ site, metric }) => (
                    <li key={`${site}-${metric.label}`} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium">{metric.label}</p>
                        <p className={cn('text-xs', mutedClass)}>{[site, metric.hint].filter(Boolean).join(' · ')}</p>
                      </div>
                      <span className="font-bold shrink-0">{formatMetric(metric)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {sites.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-2">
          {sites.map((s) => <SiteCard key={s.id} site={s} />)}
        </div>
      )}

      {(latest.length > 0 || upcoming.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {[{ title: 'Latest across all sites', items: latest, icon: TrendingUp }, { title: 'Coming up', items: upcoming, icon: CalendarClock }].map(({ title, items, icon: Icon }) => (
            <Card key={title} className={cardClass}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl font-bold text-brand-primary">{title}</CardTitle>
                <Icon className="h-4 w-4 text-brand-primary" aria-hidden />
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className={cn('text-sm', mutedClass)}>Nothing to show.</p>
                ) : (
                  <ul className="divide-y divide-brand-secondary/20">
                    {items.map((a, i) => (
                      <li key={`${a.site}-${a.title}-${i}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{a.title}</p>
                          <p className={cn('truncate text-xs', mutedClass)}>
                            {a.site} · {format(new Date(a.date), 'd MMM yyyy')}
                          </p>
                        </div>
                        {a.amount ? <span className="shrink-0 font-semibold">{aud(a.amount)}</span> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOverviewPage;
