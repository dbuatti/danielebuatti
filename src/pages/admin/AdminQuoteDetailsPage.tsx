"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Mail, Phone, CalendarDays, DollarSign, CheckCircle2, Clock, User, Info, FileText } from 'lucide-react'; // Removed XCircle
import { format } from 'date-fns';
import { showError, showSuccess } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  client_phone?: string;
  event_type: string;
  event_date: string;
  event_time: string;
  event_location: string;
  duration_hours: number;
  additional_services?: string[];
  special_requests?: string;
  status: 'pending' | 'contacted' | 'quoted' | 'booked' | 'cancelled' | 'archived' | 'finalised';
  quote_amount?: number;
  invoice_id?: string;
  notes?: string;
}

const AdminQuoteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<Quote['status'] | undefined>(undefined);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote details:', error);
        showError('Failed to load quote details.');
        setQuote(null);
      } else {
        setQuote(data as Quote);
        setNewStatus(data.status); // Initialize newStatus with current status
      }
      setIsLoading(false);
    };

    fetchQuote();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!id || !newStatus || !quote || newStatus === quote.status) return;

    setIsUpdatingStatus(true);
    const { error } = await supabase
      .from('quotes')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating quote status:', error);
      showError('Failed to update quote status.');
    } else {
      showSuccess(`Quote status updated to ${newStatus}.`);
      setQuote(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setIsUpdatingStatus(false);
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <span className="sr-only">Loading quote details...</span>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-brand-dark dark:text-brand-light">Quote not found.</p>
        <Button onClick={() => navigate('/admin/quotes')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quotes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/admin/quotes')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quotes
        </Button>
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Quote Details</h2>
        <Badge variant={getStatusBadgeVariant(quote.status)} className="text-lg px-4 py-2">
          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
        </Badge>
      </div>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-primary">Client & Event Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-brand-dark/80 dark:text-brand-light/80">
          <div className="space-y-2">
            <p className="flex items-center gap-2"><User className="h-5 w-5 text-brand-primary" /> <strong>Client Name:</strong> {quote.client_name}</p>
            <p className="flex items-center gap-2"><Mail className="h-5 w-5 text-brand-primary" /> <strong>Email:</strong> <a href={`mailto:${quote.client_email}`} className="text-brand-primary hover:underline">{quote.client_email}</a></p>
            {quote.client_phone && <p className="flex items-center gap-2"><Phone className="h-5 w-5 text-brand-primary" /> <strong>Phone:</strong> <a href={`tel:${quote.client_phone}`} className="text-brand-primary hover:underline">{quote.client_phone}</a></p>}
            <p className="flex items-center gap-2"><Info className="h-5 w-5 text-brand-primary" /> <strong>Event Type:</strong> {quote.event_type}</p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-brand-primary" /> <strong>Event Date:</strong> {format(new Date(quote.event_date), 'PPP')}</p>
            <p className="flex items-center gap-2"><Clock className="h-5 w-5 text-brand-primary" /> <strong>Event Time:</strong> {quote.event_time}</p>
            <p className="flex items-center gap-2"><FileText className="h-5 w-5 text-brand-primary" /> <strong>Location:</strong> {quote.event_location}</p>
            <p className="flex items-center gap-2"><Clock className="h-5 w-5 text-brand-primary" /> <strong>Duration:</strong> {quote.duration_hours} hours</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-primary">Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-brand-dark/80 dark:text-brand-light/80">
          {quote.additional_services && quote.additional_services.length > 0 && (
            <div>
              <h4 className="font-semibold text-brand-primary">Additional Services:</h4>
              <ul className="list-disc list-inside ml-4">
                {quote.additional_services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          )}
          {quote.special_requests && (
            <div>
              <h4 className="font-semibold text-brand-primary">Special Requests:</h4>
              <p className="ml-4 italic">{quote.special_requests}</p>
            </div>
          )}
          {quote.notes && (
            <div>
              <h4 className="font-semibold text-brand-primary">Internal Notes:</h4>
              <p className="ml-4 italic">{quote.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-primary">Quote & Status Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <DollarSign className="h-6 w-6 text-brand-primary" />
            <p className="text-xl font-semibold text-brand-dark dark:text-brand-light">
              Quote Amount: {quote.quote_amount ? `A$${quote.quote_amount.toFixed(2)}` : 'Not yet quoted'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <h4 className="font-semibold text-brand-dark dark:text-brand-light">Update Status:</h4>
            <Select onValueChange={(value: Quote['status']) => setNewStatus(value)} value={newStatus}>
              <SelectTrigger className="w-[180px] bg-brand-background border-brand-border/50 text-brand-dark dark:text-brand-light">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-brand-background text-brand-dark dark:text-brand-light">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="finalised">Finalised</SelectItem>
              </SelectContent>
            </Select>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isUpdatingStatus || newStatus === quote.status}>
                  {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Update Status
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light border-brand-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-brand-primary">Confirm Status Update</AlertDialogTitle>
                  <AlertDialogDescription className="text-brand-dark/80 dark:text-brand-light/80">
                    Are you sure you want to change the status of this quote to <strong className="text-brand-primary">{newStatus}</strong>?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-brand-secondary/20 hover:bg-brand-secondary/30 text-brand-dark dark:text-brand-light border-none">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStatusUpdate} className="bg-brand-primary hover:bg-brand-primary/90 text-brand-darker">Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuoteDetailsPage;