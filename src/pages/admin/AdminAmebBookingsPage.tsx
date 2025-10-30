"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, Mail, CalendarDays, GraduationCap } from 'lucide-react'; // Removed CheckCircle2, XCircle
import { showError } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';

interface AmebBooking {
  id: string;
  created_at: string;
  student_parent_name: string;
  contact_email: string;
  exam_date: string;
  exam_time: string;
  exam_board_grade: string;
  teacher_name?: string;
  service_required: string[];
  status: string;
}

const AdminAmebBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<AmebBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ameb_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching AMEB bookings:', error);
        showError('Failed to load AMEB bookings.');
      } else {
        setBookings(data || []);
      }
      setIsLoading(false);
    };

    fetchBookings();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'default';
      case 'contacted':
        return 'secondary';
      case 'booked':
        return 'outline'; // Changed from 'success' to 'outline'
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">AMEB Bookings</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        View and manage all AMEB accompanying service inquiries.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">All AMEB Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
              <span className="sr-only">Loading AMEB bookings...</span>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No AMEB bookings found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                    <TableHead className="text-brand-primary">Client Name</TableHead>
                    <TableHead className="text-brand-primary">Email</TableHead>
                    <TableHead className="text-brand-primary">Exam Details</TableHead>
                    <TableHead className="text-brand-primary">Services</TableHead>
                    <TableHead className="text-brand-primary">Status</TableHead>
                    <TableHead className="text-brand-primary">Inquired On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">{booking.student_parent_name}</TableCell>
                      <TableCell>
                        <a href={`mailto:${booking.contact_email}`} className="text-brand-primary hover:underline flex items-center gap-1">
                          <Mail className="h-4 w-4" /> {booking.contact_email}
                        </a>
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" /> {format(new Date(booking.exam_date), 'PPP')} at {booking.exam_time}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <GraduationCap className="h-4 w-4" /> {booking.exam_board_grade}
                        </div>
                        {booking.teacher_name && (
                          <div className="text-sm text-brand-dark/70 dark:text-brand-light/70 mt-1">
                            Teacher: {booking.teacher_name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                        <ul className="list-disc list-inside text-sm">
                          {booking.service_required.map((service, idx) => (
                            <li key={idx}>{service}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">
                        {format(new Date(booking.created_at), 'PPP p')}
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

export default AdminAmebBookingsPage;