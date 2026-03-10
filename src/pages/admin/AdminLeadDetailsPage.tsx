"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Mail, Phone, MapPin, Edit, Trash2, User, Info, Target, MessageSquare } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { format } from 'date-fns';
import { Lead } from '@/types/lead';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LeadForm, { LeadFormValues } from '@/components/admin/LeadForm';
import { Separator } from '@/components/ui/separator';

const AdminLeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLead = async () => {
    if (!id) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lead:', error);
      showError('Failed to load lead details.');
      setLead(null);
    } else {
      setLead(data as Lead);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleUpdateLead = async (values: LeadFormValues) => {
    if (!lead) return;
    setIsSubmitting(true);
    const toastId = showLoading('Updating lead...');

    try {
      const { error } = await supabase
        .from('leads')
        .update(values)
        .eq('id', lead.id);

      if (error) throw error;

      showSuccess('Lead updated successfully!', { id: toastId });
      setIsEditModalOpen(false);
      fetchLead();
    } catch (error: any) {
      console.error('Error updating lead:', error);
      showError(`Failed to update lead: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const handleDeleteLead = async () => {
    if (!lead) return;
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    const toastId = showLoading('Deleting lead...');
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);

      if (error) throw error;

      showSuccess('Lead deleted successfully!', { id: toastId });
      navigate('/admin/leads');
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      showError(`Failed to delete lead: ${error.message}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Converted': return 'default';
      case 'Lost': return 'destructive';
      case 'Contacted': return 'secondary';
      case 'Qualified': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-brand-dark dark:text-brand-light">Lead not found.</p>
        <Button onClick={() => navigate('/admin/leads')} className="mt-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-brand-light dark:bg-brand-dark-alt min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate('/admin/leads')} variant="outline" className="bg-brand-secondary hover:bg-brand-secondary/90 text-brand-light border-none">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="border-brand-secondary/50">
            <Edit className="mr-2 h-4 w-4" /> Edit Lead
          </Button>
          <Button onClick={handleDeleteLead} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Card className="bg-brand-card dark:bg-brand-card-dark text-brand-dark dark:text-brand-light border-brand-secondary/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-brand-secondary/20">
          <div>
            <CardTitle className="text-3xl font-bold text-brand-primary">{lead.company_name}</CardTitle>
            <p className="text-sm text-brand-dark/60 dark:text-brand-light/60 mt-1">
              Created on {format(new Date(lead.created_at), 'PPP p')}
            </p>
          </div>
          <Badge variant={getStatusBadgeVariant(lead.status)} className="text-lg px-4 py-1">
            {lead.status}
          </Badge>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-brand-primary flex items-center gap-2">
                <User className="h-5 w-5" /> Contact Information
              </h3>
              <div className="space-y-3 bg-brand-secondary/5 dark:bg-brand-dark/30 p-4 rounded-xl border border-brand-secondary/20">
                <p className="flex items-center gap-3">
                  <span className="font-semibold w-24">Name:</span> 
                  <span>{lead.contact_name || 'N/A'}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold w-24">Email:</span> 
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="text-brand-primary hover:underline flex items-center gap-1">
                      <Mail className="h-4 w-4" /> {lead.email}
                    </a>
                  ) : 'N/A'}
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold w-24">Phone:</span> 
                  {lead.phone ? (
                    <a href={`tel:${lead.phone}`} className="text-brand-primary hover:underline flex items-center gap-1">
                      <Phone className="h-4 w-4" /> {lead.phone}
                    </a>
                  ) : 'N/A'}
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold w-24">Venue:</span> 
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {lead.venue || 'N/A'}</span>
                </p>
              </div>
            </div>

            {/* Source & Outcome */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-brand-primary flex items-center gap-2">
                <Info className="h-5 w-5" /> Connection Details
              </h3>
              <div className="space-y-3 bg-brand-secondary/5 dark:bg-brand-dark/30 p-4 rounded-xl border border-brand-secondary/20">
                <div>
                  <p className="font-semibold text-sm uppercase tracking-wider text-brand-dark/60 dark:text-brand-light/60 mb-1">Source / Referral</p>
                  <p>{lead.source || 'N/A'}</p>
                </div>
                <Separator className="bg-brand-secondary/20" />
                <div>
                  <p className="font-semibold text-sm uppercase tracking-wider text-brand-dark/60 dark:text-brand-light/60 mb-1">Outcome of Contact</p>
                  <p className="whitespace-pre-wrap">{lead.outcome || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-brand-primary flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> General Notes / About
              </h3>
              <div className="bg-brand-secondary/5 dark:bg-brand-dark/30 p-4 rounded-xl border border-brand-secondary/20 min-h-[150px]">
                <p className="whitespace-pre-wrap text-brand-dark/80 dark:text-brand-light/80">
                  {lead.notes || 'No notes provided.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-brand-primary flex items-center gap-2">
                <Target className="h-5 w-5" /> Goal / Next Steps
              </h3>
              <div className="bg-brand-secondary/5 dark:bg-brand-dark/30 p-4 rounded-xl border border-brand-secondary/20 min-h-[150px]">
                <p className="whitespace-pre-wrap text-brand-dark/80 dark:text-brand-light/80">
                  {lead.goal || 'No goals defined.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
          <DialogHeader>
            <DialogTitle className="text-brand-primary">Edit Lead: {lead.company_name}</DialogTitle>
          </DialogHeader>
          <LeadForm
            onSubmit={handleUpdateLead}
            isSubmitting={isSubmitting}
            onClose={() => setIsEditModalOpen(false)}
            initialData={{
              company_name: lead.company_name,
              contact_name: lead.contact_name || '',
              email: lead.email || '',
              phone: lead.phone || '',
              venue: lead.venue || '',
              source: lead.source || '',
              outcome: lead.outcome || '',
              notes: lead.notes || '',
              goal: lead.goal || '',
              status: lead.status,
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadDetailsPage;