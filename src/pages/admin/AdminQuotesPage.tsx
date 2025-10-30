"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, Mail, CalendarDays } from 'lucide-react'; // Removed DollarSign, FileText
import { showError } from '@/utils/toast';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Added missing import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Quote {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  event_type: string;
  event_date: string;
  status: 'pending' | 'contacted' | 'quoted' | 'booked' | 'cancelled' | 'archived' | 'finalised';
  quote_amount?: number;
}

const AdminQuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      let query = supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching quotes:', error);
        showError('Failed to load quotes.');
      } else {
        setQuotes(data || []);
      }
      setIsLoading(false);
    };

    fetchQuotes();
  }, [filterStatus]);

  const filteredQuotes = quotes.filter(quote =>
    quote.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: Quote['status']): "default" | "destructive" | "outline" | "secondary" => { // Explicitly define return type
    switch (status) {
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
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Quotes</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        View and manage all client quote requests.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by client name, email, or event type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-brand-background border-brand-border/50 text-brand-dark dark:text-brand-light placeholder:text-brand-dark/60 dark:placeholder:text-brand-light/60"
        />
        <Select onValueChange={setFilterStatus} value={filterStatus}>
          <SelectTrigger className="w-[180px] bg-brand-background border-brand-border/50 text-brand-dark dark:text-brand-light">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-brand-background text-brand-dark dark:text-brand-light">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="finalised">Finalised</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">All Quote Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
              <span className="sr-only">Loading quotes...</span>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No quotes found matching your criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                    <TableHead className="text-brand-primary">Client Name</TableHead>
                    <TableHead className="text-brand-primary">Email</TableHead>
                    <TableHead className="text-brand-primary">Event Type</TableHead>
                    <TableHead className="text-brand-primary">Event Date</TableHead>
                    <TableHead className="text-brand-primary">Amount</TableHead>
                    <TableHead className="text-brand-primary">Status</TableHead>
                    <TableHead className="text-brand-primary">Inquired On</TableHead>
                    <TableHead className="text-brand-primary">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow key={quote.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">{quote.client_name}</TableCell>
                      <TableCell>
                        <a href={`mailto:${quote.client_email}`} className="text-brand-primary hover:underline flex items-center gap-1">
                          <Mail className="h-4 w-4" /> {quote.client_email}
                        </a>
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{quote.event_type}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80 flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" /> {format(new Date(quote.event_date), 'PPP')}
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                        {quote.quote_amount ? `A$${quote.quote_amount.toFixed(2)}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(quote.status)}>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</Badge>
                      </TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">
                        {format(new Date(quote.created_at), 'PPP p')}
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/admin/quotes/${quote.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
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

export default AdminQuotesPage;