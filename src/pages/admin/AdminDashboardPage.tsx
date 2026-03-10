"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, DollarSign, ExternalLink, Loader2, TrendingUp } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Quote {
  id: string;
  client_name: string;
  invoice_type: string;
  event_title: string; // Added event_title
  event_date?: string;
  total_amount: number;
  accepted_at: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useSession();
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [pipelineValue, setPipelineValue] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch total revenue (accepted invoices)
        const { data: revenueData } = await supabase
          .from('invoices')
          .select('total_amount')
          .not('accepted_at', 'is', null);
        
        const sumRevenue = revenueData?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
        setTotalRevenue(sumRevenue);

        // 2. Fetch pipeline value (leads)
        const { data: leadsData } = await supabase
          .from('leads')
          .select('estimated_value')
          .not('status', 'eq', 'Lost');
        
        const sumPipeline = leadsData?.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0) || 0;
        setPipelineValue(sumPipeline);

        // 3. Fetch total invoices count
        const { count } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true });
        setTotalInvoices(count || 0);

        // 4. Fetch recent accepted quotes
        const { data: quotes } = await supabase
          .from('invoices')
          .select('id, client_name, invoice_type, event_title, event_date, total_amount, accepted_at') // Added event_title to select
          .not('accepted_at', 'is', null)
          .order('accepted_at', { ascending: false })
          .limit(5);
        setRecentQuotes(quotes || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-brand-dark dark:text-brand-light tracking-tight">Admin Dashboard</h2>
          <p className="text-lg text-brand-dark/60 dark:text-brand-light/60">Welcome back, {user?.email}.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light rounded-full px-6">
            <Link to="/admin/create-quote">Create New Quote</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-dark dark:text-brand-light">
              {isLoading ? '...' : `A$${totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mt-1">Accepted invoices</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-dark dark:text-brand-light">
              {isLoading ? '...' : `A$${pipelineValue.toLocaleString()}`}
            </div>
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mt-1">Active leads</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-dark dark:text-brand-light">
              {isLoading ? '...' : totalInvoices}
            </div>
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40">Active Users</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-dark dark:text-brand-light">1</div>
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mt-1">System administrator</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-brand-dark-alt shadow-xl border-brand-secondary/50 rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-brand-secondary/20">
          <CardTitle className="text-2xl font-bold text-brand-primary">Recent Accepted Quotes</CardTitle>
          <Button asChild variant="ghost" className="text-brand-primary hover:bg-brand-primary/10 rounded-full">
            <Link to="/admin/quotes">View All <ExternalLink className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            </div>
          ) : recentQuotes.length === 0 ? (
            <div className="p-12 text-center text-brand-dark/60 dark:text-brand-light/60">No recent accepted quotes found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/5 dark:bg-brand-dark/50 border-none">
                    <TableHead className="py-6 pl-8 text-brand-primary font-bold">Client</TableHead>
                    <TableHead className="py-6 text-brand-primary font-bold">Event</TableHead>
                    <TableHead className="py-6 text-brand-primary font-bold text-right">Amount</TableHead>
                    <TableHead className="py-6 text-brand-primary font-bold text-center pr-8">Accepted On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentQuotes.map((quote) => (
                    <TableRow key={quote.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30 transition-colors border-b border-brand-secondary/10 last:border-none">
                      <TableCell className="py-6 pl-8 font-bold">{quote.client_name}</TableCell>
                      <TableCell className="py-6 text-brand-dark/70 dark:text-brand-light/70">{quote.event_title}</TableCell>
                      <TableCell className="py-6 text-right font-bold text-brand-primary">A${quote.total_amount.toLocaleString()}</TableCell>
                      <TableCell className="py-6 text-center pr-8 text-brand-dark/50 dark:text-brand-light/50">{format(new Date(quote.accepted_at), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;