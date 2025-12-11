"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { formatCurrency } from '@/lib/utils';
import { showError } from '@/utils/toast';
import { 
  FileText, 
  Users, 
  DollarSign, 
  Calendar,
  Mail,
  CheckCircle
} from 'lucide-react';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [acceptedQuotes, setAcceptedQuotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total quotes count
        const { count: totalQuotesCount, error: countError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTotalQuotes(totalQuotesCount || 0);

        // Fetch accepted quotes and calculate revenue
        const { data: acceptedQuotesData, error: acceptedError } = await supabase
          .from('quotes')
          .select('total_amount, accepted_at')
          .not('accepted_at', 'is', null);
        
        if (acceptedError) throw acceptedError;
        
        setAcceptedQuotes(acceptedQuotesData.length);
        
        const revenue = acceptedQuotesData.reduce((sum, quote) => sum + (quote.total_amount || 0), 0);
        setTotalRevenue(revenue);

        // Fetch recent accepted quotes (limit to 5)
        const { data: recentQuotes, error: quotesError } = await supabase
          .from('quotes')
          .select('*')
          .not('accepted_at', 'is', null)
          .order('accepted_at', { ascending: false })
          .limit(5);
        
        if (quotesError) throw quotesError;
        setQuotes(recentQuotes as Quote[]);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        showError(`Failed to load dashboard data: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Admin Dashboard</h1>
        <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 mt-2">
          Welcome to your administration dashboard. Here you can manage various aspects of your application.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Quotes</CardTitle>
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalQuotes}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">All created quotes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Accepted Quotes</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{acceptedQuotes}</div>
            <p className="text-xs text-green-700 dark:text-green-300">All accepted quotes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">From accepted quotes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200">Active Users</CardTitle>
            <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">1</div>
            <p className="text-xs text-amber-700 dark:text-amber-300">Currently logged in</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-brand-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/admin/quotes')} 
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <FileText className="h-6 w-6" />
              <span>Manage Quotes</span>
            </Button>
            <Button 
              onClick={() => navigate('/admin/ameb-bookings')} 
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Calendar className="h-6 w-6" />
              <span>AMEB Bookings</span>
            </Button>
            <Button 
              onClick={() => navigate('/admin/email-templates')} 
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Mail className="h-6 w-6" />
              <span>Email Templates</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Accepted Quotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-brand-primary">Recent Accepted Quotes</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin/quotes')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotes.length > 0 ? (
                quotes.map((quote) => (
                  <div 
                    key={quote.id} 
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => navigate(`/admin/quotes/${quote.slug}`)}
                  >
                    <div>
                      <p className="font-medium text-sm">{quote.client_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {quote.invoice_type} • {new Date(quote.event_date || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(quote.total_amount || 0)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {quote.accepted_at ? new Date(quote.accepted_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No accepted quotes yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;