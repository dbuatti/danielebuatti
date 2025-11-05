"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Mail, CalendarDays, GraduationCap, User } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import EmailComposerModal from '@/components/admin/EmailComposerModal';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AmebBooking {
  id: string;
  created_at: string;
  student_parent_name: string;
  contact_email: string;
  exam_date: string;
  exam_time: string;
  exam_board_grade: string;
  teacher_name?: string | null;
  service_required: string[];
  status: string;
}

const AdminAmebBookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<AmebBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ameb_bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching AMEB booking:', error);
        showError('Failed to load booking details.');
        setBooking(null);
      } else {
        setBooking(data as AmebBooking);
      }
      setIsLoading(false);
    };

    fetchBooking();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!booking) return;

    setIsUpdatingStatus(true);
    const { error } = await supabase
      .from('ameb_bookings')
      .update({ status: newStatus })
      .eq('id', booking.id);

    if (error) {
      console.error(`Error updating booking status to ${newStatus}:`, error);
      showError(`Failed to update booking status to ${newStatus}.`);
    } else {
      showSuccess(`Booking status updated to ${newStatus}.`);
      setBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setIsUpdatingStatus(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'booked':
        return 'secondary';
      case 'contacted':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'pending':
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-brand-dark dark:text-brand-light">AMEB Booking not found.</p>
        <Button onClick={() => navigate('/admin/ameb-bookings')} className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
        </Button>
      </div>
    );
  }

  const dynamicEmailDetails = {
    student_parent_name: booking.student_parent_name,
    contact_email: booking.contact_email,
    exam_date: booking.exam_date,
    exam_time: booking.exam_time,
    exam_board_grade: booking.exam_board_grade,
    teacher_name: booking.teacher_name || 'N/A',
    service_required: booking.service_required,
    status: booking.status,
    created_at: format(new Date(booking.created_at), 'PPP p'),
  };

  const handleCloseEmailComposer = () => {
    setIsEmailModalOpen(false);
  };

  return (
    <div className="p-6 bg-brand-light dark:bg-brand-dark-alt min-h-screen">
      <Button onClick={() => navigate('/admin/ameb-bookings')} className="mb-6 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-light">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to AMEB Bookings
      </Button>

      <Card className="bg-brand-card dark:bg-brand-card-dark text-brand-dark dark:text-brand-light border-brand-secondary/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-brand-primary">AMEB Booking Details</CardTitle>
          <Badge variant={getStatusBadgeVariant(booking.status)} className="text-lg px-3 py-1">
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-brand-primary flex items-center gap-2"><User className="h-5 w-5" /> Client Information</h3>
              <p><strong>Name:</strong> {booking.student_parent_name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${booking.contact_email}`} className="text-brand-primary hover:underline">{booking.contact_email}</a></p>
              <p><strong>Teacher:</strong> {booking.teacher_name || 'N/A'}</p>
              <p><strong>Inquired On:</strong> {format(new Date(booking.created_at), 'PPP p')}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-brand-primary flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Exam Details</h3>
              <p><strong>Date:</strong> {format(new Date(booking.exam_date), 'PPP')}</p>
              <p><strong>Time:</strong> {booking.exam_time}</p>
              <p><strong>Board & Grade:</strong> {booking.exam_board_grade}</p>
              <p className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                <strong>Services Required:</strong>
              </p>
              <ul className="list-disc list-inside ml-6 text-brand-dark/80 dark:text-brand-light/80">
                {booking.service_required.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-brand-secondary/50">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Update Status:</span>
              <Select
                value={booking.status}
                onValueChange={handleStatusChange}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger className="w-[140px] h-10 text-brand-dark dark:text-brand-light border-brand-secondary/50 bg-brand-light dark:bg-brand-dark-alt">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {isUpdatingStatus && <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />}
            </div>

            <Button
              onClick={() => setIsEmailModalOpen(true)}
              className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light"
            >
              <Mail className="mr-2 h-4 w-4" /> Compose Reply
            </Button>
          </div>
        </CardContent>
      </Card>

      <EmailComposerModal
        isOpen={isEmailModalOpen}
        onClose={handleCloseEmailComposer}
        initialRecipientEmail={booking.contact_email}
        initialSubject={`Regarding your AMEB booking inquiry for ${booking.exam_board_grade}`}
        dynamicDetails={dynamicEmailDetails}
      />
    </div>
  );
};

export default AdminAmebBookingDetailsPage;