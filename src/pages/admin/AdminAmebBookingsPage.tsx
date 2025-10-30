"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, Mail, CalendarDays, GraduationCap, Copy, Trash2 } from 'lucide-react'; // Added Trash2 icon
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast'; // Import toast utilities
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select components
import { Button } from '@/components/ui/button'; // Import Button
import { toast } from 'sonner'; // Import toast from sonner for promise

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

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const toastId = showLoading('Updating status...');
    const { error } = await supabase
      .from('ameb_bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating AMEB booking status:', error);
      showError('Failed to update status.', { id: toastId });
    } else {
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      showSuccess('Status updated successfully!', { id: toastId });
    }
    dismissToast(toastId);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    toast.promise(
      async () => {
        const { error } = await supabase
          .from('ameb_bookings')
          .delete()
          .eq('id', bookingId);

        if (error) {
          throw error;
        }

        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
        return 'Booking deleted successfully!';
      },
      {
        loading: 'Deleting booking...',
        success: (message) => message,
        error: (err) => {
          console.error('Error deleting AMEB booking:', err);
          return 'Failed to delete booking.';
        },
        action: {
          label: 'Confirm Delete',
          onClick: () => { /* The promise handles the actual deletion */ },
        },
        description: 'Are you sure you want to delete this AMEB booking? This action cannot be undone.',
      }
    );
  };

  const handleCopyAndEmail = async (booking: AmebBooking) => {
    const emailBody = `Hi ${booking.student_parent_name},

Thank you for your AMEB accompanying inquiry!

Yes, I'm available for your exam. Please book a rehearsal via these links:

15 Minutes (A$30): https://danielebuatti.as.me/rehearsal-15
30 Minutes (A$50): https://danielebuatti.as.me/rehearsal-30
45 Minutes (A$75): https://danielebuatti.as.me/rehearsal-45

Please attach/send your sheet music before the rehearsal.

Looking forward to working with you!

Best,
Daniele Buatti`;

    try {
      await navigator.clipboard.writeText(emailBody);
      showSuccess('Email template copied to clipboard!');
      // Open mailto link
      window.open(`mailto:${booking.contact_email}?subject=AMEB Accompanying Inquiry Reply&body=${encodeURIComponent(emailBody)}`, '_blank');
    } catch (err) {
      console.error('Failed to copy email text:', err);
      showError('Failed to copy email. Please copy manually.');
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
                    <TableHead className="text-brand-primary text-center">Actions</TableHead>
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
                        <Select
                          value={booking.status}
                          onValueChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-brand-dark dark:text-brand-light border-brand-secondary/50 bg-brand-light dark:bg-brand-dark-alt">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">
                        {format(new Date(booking.created_at), 'PPP p')}
                      </TableCell>
                      <TableCell className="text-center flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyAndEmail(booking)}
                          className="text-brand-primary border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50"
                        >
                          <Copy className="h-4 w-4 mr-2" /> Reply
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
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

export default AdminAmebBookingsPage;