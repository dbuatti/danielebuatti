"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, DollarSign } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { showError } from '@/utils/toast'; // Import toast for error handling
import { format } from 'date-fns';

const AdminDashboardPage: React.FC = () => {
  const { user } = useSession();
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [previousMonthlyRevenue, setPreviousMonthlyRevenue] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoadingRevenue(true);
      try {
        // Fetch total revenue
        const { data: totalRevenueData, error: totalRevenueError } = await supabase
          .from('invoices')
          .select('total_amount');

        if (totalRevenueError) throw totalRevenueError;
        const sumTotalRevenue = totalRevenueData.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
        setTotalRevenue(sumTotalRevenue);

        // Fetch total invoices count
        const { count: invoicesCount, error: invoicesCountError } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true });

        if (invoicesCountError) throw invoicesCountError;
        setTotalInvoices(invoicesCount || 0);

        // Calculate current month's revenue
        const now = new Date();
        const startOfMonth = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
        const endOfMonth = format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd');

        const { data: currentMonthRevenueData, error: currentMonthRevenueError } = await supabase
          .from('invoices')
          .select('total_amount')
          .gte('accepted_at', startOfMonth)
          .lte('accepted_at', endOfMonth);

        if (currentMonthRevenueError) throw currentMonthRevenueError;
        const sumCurrentMonthRevenue = currentMonthRevenueData.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
        setMonthlyRevenue(sumCurrentMonthRevenue);

        // Calculate previous month's revenue
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfPrevMonth = format(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1), 'yyyy-MM-dd');
        const endOfPrevMonth = format(new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0), 'yyyy-MM-dd');

        const { data: prevMonthRevenueData, error: prevMonthRevenueError } = await supabase
          .from('invoices')
          .select('total_amount')
          .gte('accepted_at', startOfPrevMonth)
          .lte('accepted_at', endOfPrevMonth);

        if (prevMonthRevenueError) throw prevMonthRevenueError;
        const sumPrevMonthRevenue = prevMonthRevenueData.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
        setPreviousMonthlyRevenue(sumPrevMonthRevenue);

      } catch (error) {
        console.error('Error fetching revenue data:', error);
        showError('Failed to load revenue data.');
      } finally {
        setIsLoadingRevenue(false);
      }
    };

    fetchRevenueData();
  }, []);

  const revenueDifference = monthlyRevenue - previousMonthlyRevenue;
  const revenueDifferencePercentage = previousMonthlyRevenue === 0
    ? (monthlyRevenue > 0 ? 100 : 0)
    : (revenueDifference / previousMonthlyRevenue) * 100;

  const revenueChangeText = revenueDifference >= 0
    ? `+A$${revenueDifference.toFixed(2)} (${revenueDifferencePercentage.toFixed(0)}%) since last month`
    : `-A$${Math.abs(revenueDifference).toFixed(2)} (${Math.abs(revenueDifferencePercentage).toFixed(0)}%) since last month`;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Welcome, {user?.email}!</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        This is your administration dashboard. Here you can manage various aspects of your application.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-primary">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">
              {isLoadingRevenue ? '...' : totalInvoices}
            </div>
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">
              {isLoadingRevenue ? 'Loading...' : 'All accepted quotes'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-primary">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">
              {isLoadingRevenue ? '...' : `A$${totalRevenue.toFixed(2)}`}
            </div>
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">
              {isLoadingRevenue ? 'Loading...' : revenueChangeText}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-primary">Active Users</CardTitle>
            <Users className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">1</div> {/* Assuming one admin user */}
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">Currently logged in</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 p-6 bg-brand-light dark:bg-brand-dark-alt rounded-lg shadow-inner border border-brand-secondary/30">
        <h3 className="text-2xl font-semibold text-brand-primary mb-4">Quick Actions</h3>
        <ul className="list-disc list-inside text-lg text-brand-dark/80 dark:text-brand-light/80 space-y-2">
          <li>View and manage all submitted invoices.</li>
          <li>Monitor user activity and system health.</li>
          <li>Access detailed reports (future feature).</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;