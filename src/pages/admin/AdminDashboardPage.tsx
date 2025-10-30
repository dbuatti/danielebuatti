"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, FileText, Users } from 'lucide-react'; // Removed CalendarDays
import { showError } from '@/utils/toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Added missing import

interface Quote {
  id: string;
  created_at: string;
  client_name: string;
  event_date: string;
  status: string;
  quote_amount?: number;
}

interface AmebBooking {
  id: string;
  created_at: string;
  student_parent_name: string;
  exam_date: string;
  status: string;
}

const AdminDashboardPage: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [pendingQuotesCount, setPendingQuotesCount] = useState<number | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [recentAmebBookings, setRecentAmebBookings] = useState<AmebBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch total revenue from 'quotes' table where status is 'booked' or 'finalised'
        const { data: revenueData, error: revenueError } = await supabase
          .from('quotes')
          .select('quote_amount')
          .in('status', ['booked', 'finalised']);

        if (revenueError) {
          throw revenueError;
        }
        const calculatedRevenue = revenueData.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);
        setTotalRevenue(calculatedRevenue);

        // Fetch pending quotes count
        const { count: pendingQuotesCountData, error: pendingQuotesError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact' })
          .eq('status', 'pending');

        if (pendingQuotesError) {
          throw pendingQuotesError;
        }
        setPendingQuotesCount(pendingQuotesCountData);

        // Fetch recent quotes
        const { data: recentQuotesData, error: recentQuotesError } = await supabase
          .from('quotes')
          .select('id, created_at, client_name, event_date, status, quote_amount')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentQuotesError) {
          throw recentQuotesError;
        }
        setRecentQuotes(recentQuotesData || []);

        // Fetch recent AMEB bookings
        const { data: recentAmebBookingsData, error: recentAmebBookingsError } = await supabase
          .from('ameb_bookings')
          .select('id, created_at, student_parent_name, exam_date, status')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentAmebBookingsError) {
          throw recentAmebBookingsError;
        }
        setRecentAmebBookings(recentAmebBookingsData || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => { // Explicitly define return type
    switch (status.toLowerCase()) {
      case 'pending':
        return 'default';
      case 'contacted':
        return 'secondary';
      case 'quoted':
        return 'outline';
      case 'booked':
        return 'outline'; // Mapped 'success' to 'outline'
      case 'cancelled':
        return 'destructive';
      case 'archived':
        return 'secondary'; // Mapped 'info' to 'secondary'
      case 'finalised':
        return 'outline'; // Mapped 'success' to 'outline'
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Admin Dashboard</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        A quick overview of your business performance and recent activities.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
          <span className="sr-only">Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-brand-primary">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">
                  {totalRevenue !== null ? `A$${totalRevenue.toFixed(2)}` : 'N/A'}
                </div>
                <p className="text-xs text-brand-dark/70 dark:text-brand-light/70">
                  From booked and finalised quotes
                </p>
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-brand-primary">Pending Quotes</CardTitle>
                <FileText className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">
                  {pendingQuotesCount !== null ? pendingQuotesCount : 'N/A'}
                </div>
                <p className="text-xs text-brand-dark/70 dark:text-brand-light/70">
                  Quotes awaiting your attention
                </p>
              </CardContent>
            </Card>
            <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-brand-primary">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-brand-dark/70 dark:text-brand-light/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-dark dark:text-brand-light">
                  {/* This would require a more complex query to count unique clients */}
                  N/A
                </div>
                <p className="text-xs text-brand-dark/70 dark:text-brand-light/70">
                  Unique clients across all services
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-brand-primary">Recent Quotes</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/quotes">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentQuotes.length === 0 ? (
                  <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No recent quotes.</p>
                ) : (
                  <ul className="space-y-4">
                    {recentQuotes.map((quote) => (
                      <li key={quote.id} className="flex items-center justify-between border-b border-brand-secondary/20 pb-2 last:border-b-0 last:pb-0">
                        <div>
                          <Link to={`/admin/quotes/${quote.id}`} className="font-medium text-brand-primary hover:underline">
                            {quote.client_name}
                          </Link>
                          <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">
                            {format(new Date(quote.event_date), 'PPP')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {quote.quote_amount && (
                            <span className="text-brand-dark dark:text-brand-light font-semibold">
                              A${quote.quote_amount.toFixed(2)}
                            </span>
                          )}
                          <Badge variant={getStatusBadgeVariant(quote.status)}>
                            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-brand-primary">Recent AMEB Bookings</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/ameb-bookings">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentAmebBookings.length === 0 ? (
                  <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No recent AMEB bookings.</p>
                ) : (
                  <ul className="space-y-4">
                    {recentAmebBookings.map((booking) => (
                      <li key={booking.id} className="flex items-center justify-between border-b border-brand-secondary/20 pb-2 last:border-b-0 last:pb-0">
                        <div>
                          <Link to={`/admin/ameb-bookings`} className="font-medium text-brand-primary hover:underline">
                            {booking.student_parent_name}
                          </Link>
                          <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">
                            Exam: {format(new Date(booking.exam_date), 'PPP')}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;