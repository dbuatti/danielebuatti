"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Mail, Phone, MapPin, Edit, Trash2, User, Info, Target, MessageSquare, Calendar, Users, TrendingUp, DollarSign, Clock, Briefcase } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { format } from 'date-fns';
import { Lead } from '@/types/lead';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LeadForm, { LeadFormValues } from '@/components/admin/LeadForm';
import { cn } from '@/lib/utils';

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
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto text-red-500">
          <Info className="h-10 w-10" />
        </div>
        <p className="text-2xl font-bold text-brand-dark dark:text-brand-light">Lead not found.</p>
        <Button onClick={() => navigate('/admin/leads')} className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light rounded-full px-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <Button onClick={() => navigate('/admin/leads')} variant="ghost" className="text-brand-dark/60 dark:text-brand-light/60 hover:text-brand-primary transition-colors rounded-full">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Pipeline
        </Button>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="border-brand-secondary/50 rounded-full px-6">
            <Edit className="mr-2 h-4 w-4" /> Edit Details
          </Button>
          <Button onClick={handleDeleteLead} variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-full px-6">
            <Trash2 className="mr-2 h-4 w-4" /> Delete Lead
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-brand-dark text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Users className="h-48 w-48" />
        </div>
        <CardContent className="p-10 md:p-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={getStatusBadgeVariant(lead.status)} className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest bg-brand-primary text-white border-none">
                  {lead.status}
                </Badge>
                <Badge variant="outline" className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border-white/20 text-white",
                  lead.lead_type === 'Tech' ? "bg-blue-600/20" : "bg-brand-primary/20"
                )}>
                  {lead.sector || lead.lead_type}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{lead.company_name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand-primary" />
                  <span>Added {format(new Date(lead.created_at), 'MMMM d, yyyy')}</span>
                </div>
                {lead.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-primary" />
                    <span>{lead.venue}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {lead.email && (
                <Button asChild className="bg-white text-brand-dark hover:bg-white/90 rounded-full px-8 py-6 text-lg font-bold">
                  <a href={`mailto:${lead.email}`}>
                    <Mail className="mr-2 h-5 w-5" /> Send Email
                  </a>
                </Button>
              )}
              {lead.phone && (
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6">
                  <a href={`tel:${lead.phone}`}>
                    <Phone className="mr-2 h-5 w-5" /> Call Contact
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial & Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/30 rounded-3xl overflow-hidden">
          <CardContent className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40 font-bold">Est. Value</p>
              <p className="text-2xl font-bold text-brand-dark dark:text-brand-light">${(lead.estimated_value || 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/30 rounded-3xl overflow-hidden">
          <CardContent className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40 font-bold">Probability</p>
              <p className="text-2xl font-bold text-brand-dark dark:text-brand-light">{lead.probability || 0}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/30 rounded-3xl overflow-hidden">
          <CardContent className="p-8 flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              lead.follow_up_date && new Date(lead.follow_up_date) < new Date() ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-600"
            )}>
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40 font-bold">Follow-up</p>
              <p className={cn(
                "text-2xl font-bold",
                lead.follow_up_date && new Date(lead.follow_up_date) < new Date() ? "text-red-500" : "text-brand-dark dark:text-brand-light"
              )}>
                {lead.follow_up_date ? format(new Date(lead.follow_up_date), 'MMM d, yyyy') : 'Not set'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Contact & Context */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/30 rounded-3xl overflow-hidden">
            <CardHeader className="bg-brand-secondary/5 dark:bg-brand-dark/50 border-b border-brand-secondary/10 p-6">
              <CardTitle className="text-xl font-bold text-brand-primary flex items-center gap-2">
                <User className="h-5 w-5" /> Primary Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40 font-bold">Name</p>
                <p className="text-xl font-semibold text-brand-dark dark:text-brand-light">{lead.contact_name || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40 font-bold">Email Address</p>
                <p className="text-lg text-brand-dark/80 dark:text-brand-light/80 break-all">{lead.email || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40 font-bold">Phone Number</p>
                <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">{lead.phone || '—'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/30 rounded-3xl overflow-hidden">
            <CardHeader className="bg-brand-secondary/5 dark:bg-brand-dark/50 border-b border-brand-secondary/10 p-6">
              <CardTitle className="text-xl font-bold text-brand-primary flex items-center gap-2">
                <Briefcase className="h-5 w-5" /> Business Context
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40 font-bold">Sector</p>
                <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">{lead.sector || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-brand-dark/40 dark:text-brand-light/40 font-bold">Source / Referral</p>
                <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">{lead.source || '—'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Strategy & Notes */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/30 rounded-3xl overflow-hidden">
            <CardHeader className="bg-brand-secondary/5 dark:bg-brand-dark/50 border-b border-brand-secondary/10 p-6">
              <CardTitle className="text-xl font-bold text-brand-primary flex items-center gap-2">
                <Target className="h-5 w-5" /> Goal & Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="bg-brand-primary/5 dark:bg-brand-primary/10 p-8 rounded-[2rem] border border-brand-primary/20">
                <p className="text-xl text-brand-dark/90 dark:text-brand-light/90 whitespace-pre-wrap leading-relaxed italic">
                  {lead.goal || 'Define the next steps for this connection...'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-brand-dark-alt shadow-lg border-brand-secondary/30 rounded-3xl overflow-hidden">
            <CardHeader className="bg-brand-secondary/5 dark:bg-brand-dark/50 border-b border-brand-secondary/10 p-6">
              <CardTitle className="text-xl font-bold text-brand-primary flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> General Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <p className="text-lg text-brand-dark/70 dark:text-brand-light/70 whitespace-pre-wrap leading-relaxed">
                {lead.notes || 'No additional notes provided.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-brand-primary">Edit Lead: {lead.company_name}</DialogTitle>
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
              lead_type: lead.lead_type,
              sector: lead.sector || '',
              estimated_value: lead.estimated_value,
              probability: lead.probability,
              follow_up_date: lead.follow_up_date || '',
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadDetailsPage;