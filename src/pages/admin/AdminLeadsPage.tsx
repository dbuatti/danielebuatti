"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, UserPlus, Trash2, ExternalLink, Search, Users, TrendingUp, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LeadForm, { LeadFormValues } from '@/components/admin/LeadForm';
import { Lead } from '@/types/lead';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      showError('Failed to load leads.');
    } else {
      setLeads(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const stats = useMemo(() => {
    const totalValue = leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);
    const weightedValue = leads.reduce((sum, l) => sum + ((l.estimated_value || 0) * ((l.probability || 0) / 100)), 0);

    return {
      total: leads.length,
      new: leads.filter(l => l.status === 'New').length,
      converted: leads.filter(l => l.status === 'Converted').length,
      pipelineValue: totalValue,
      weightedValue: weightedValue,
    };
  }, [leads]);

  const handleCreateLead = async (values: LeadFormValues) => {
    setIsSubmitting(true);
    const toastId = showLoading('Creating lead...');

    try {
      const { error } = await supabase
        .from('leads')
        .insert([values]);

      if (error) throw error;

      showSuccess('Lead created successfully!', { id: toastId });
      setIsCreateModalOpen(false);
      fetchLeads();
    } catch (error: any) {
      console.error('Error creating lead:', error);
      showError(`Failed to create lead: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    toast.promise(
      async () => {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', leadId);

        if (error) throw error;

        setLeads(prev => prev.filter(l => l.id !== leadId));
        return 'Lead deleted successfully!';
      },
      {
        loading: 'Deleting lead...',
        success: (msg) => msg,
        error: 'Failed to delete lead.',
        action: {
          label: 'Confirm',
          onClick: () => {},
        },
        description: 'Are you sure you want to delete this lead?',
      }
    );
  };

  const filteredLeads = leads.filter(lead => 
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Converted': return 'default';
      case 'Lost': return 'destructive';
      case 'Contacted': return 'secondary';
      case 'Qualified': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return <Badge className="bg-red-500 hover:bg-red-600 text-white border-none">High</Badge>;
      case 'Medium': return <Badge variant="secondary">Medium</Badge>;
      case 'Low': return <Badge variant="outline" className="opacity-50">Low</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-brand-dark dark:text-brand-light tracking-tight">Lead Management</h2>
          <p className="text-lg text-brand-dark/60 dark:text-brand-light/60">Track and nurture your professional connections.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light rounded-full px-8 py-6 text-lg shadow-lg transition-all hover:scale-105">
              <UserPlus className="mr-2 h-5 w-5" /> Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-brand-primary">Create New Lead Entry</DialogTitle>
            </DialogHeader>
            <LeadForm
              onSubmit={handleCreateLead}
              isSubmitting={isSubmitting}
              onClose={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-brand-dark-alt/50 backdrop-blur-sm border-brand-secondary/30 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-dark/60 dark:text-brand-light/60 uppercase tracking-wider">Total Leads</p>
              <p className="text-3xl font-bold text-brand-dark dark:text-brand-light">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-brand-dark-alt/50 backdrop-blur-sm border-brand-secondary/30 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-dark/60 dark:text-brand-light/60 uppercase tracking-wider">Pipeline Value</p>
              <p className="text-3xl font-bold text-brand-dark dark:text-brand-light">${stats.pipelineValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-brand-dark-alt/50 backdrop-blur-sm border-brand-secondary/30 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-dark/60 dark:text-brand-light/60 uppercase tracking-wider">Weighted Value</p>
              <p className="text-3xl font-bold text-brand-dark dark:text-brand-light">${Math.round(stats.weightedValue).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-brand-dark-alt/50 backdrop-blur-sm border-brand-secondary/30 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-dark/60 dark:text-brand-light/60 uppercase tracking-wider">Converted</p>
              <p className="text-3xl font-bold text-brand-dark dark:text-brand-light">{stats.converted}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="bg-white dark:bg-brand-dark-alt shadow-xl border-brand-secondary/50 rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-brand-secondary/20 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <CardTitle className="text-2xl font-bold text-brand-primary flex items-center gap-2">
              <TrendingUp className="h-6 w-6" /> Pipeline Overview
            </CardTitle>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by company, contact, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-brand-secondary/10 dark:bg-brand-dark border-none rounded-full text-brand-dark dark:text-brand-light placeholder:text-gray-500 focus-visible:ring-brand-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <Users className="h-16 w-16 mx-auto text-gray-300" />
              <p className="text-xl text-brand-dark/60 dark:text-brand-light/60">No leads found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/5 dark:bg-brand-dark/50 border-none">
                    <TableHead className="text-brand-primary font-bold py-6 pl-8">Company / Lead</TableHead>
                    <TableHead className="text-brand-primary font-bold py-6">Priority</TableHead>
                    <TableHead className="text-brand-primary font-bold py-6">Sector</TableHead>
                    <TableHead className="text-brand-primary font-bold py-6">Value / Prob.</TableHead>
                    <TableHead className="text-brand-primary font-bold py-6">Status</TableHead>
                    <TableHead className="text-brand-primary font-bold py-6">Follow-up</TableHead>
                    <TableHead className="text-brand-primary font-bold py-6 text-center pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="group hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30 transition-colors border-b border-brand-secondary/10 last:border-none">
                      <TableCell className="py-6 pl-8">
                        <Link to={`/admin/leads/${lead.id}`} className="block">
                          <span className="text-lg font-bold text-brand-dark dark:text-brand-light group-hover:text-brand-primary transition-colors">
                            {lead.company_name}
                          </span>
                          <p className="text-xs text-brand-dark/40 dark:text-brand-light/40 mt-1 italic">{lead.contact_name || 'No contact'}</p>
                        </Link>
                      </TableCell>
                      <TableCell className="py-6">
                        {getPriorityBadge(lead.priority)}
                      </TableCell>
                      <TableCell className="py-6">
                        <Badge variant="outline" className="px-3 py-1 rounded-full font-medium border-brand-secondary/50">
                          {lead.sector || lead.lead_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-dark/80 dark:text-brand-light/80">${(lead.estimated_value || 0).toLocaleString()}</span>
                          <span className="text-xs text-brand-dark/40 dark:text-brand-light/40">{lead.probability || 0}% Probability</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <Badge variant={getStatusBadgeVariant(lead.status)} className="px-3 py-1 rounded-full font-medium">
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6 text-sm">
                        {lead.follow_up_date ? (
                          <div className={cn(
                            "flex items-center gap-2",
                            new Date(lead.follow_up_date) < new Date() ? "text-red-500 font-bold" : "text-brand-dark/50 dark:text-brand-light/50"
                          )}>
                            <Clock className="h-4 w-4" />
                            {format(new Date(lead.follow_up_date), 'MMM d')}
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="py-6 text-center pr-8">
                        <div className="flex items-center justify-center gap-2">
                          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-brand-primary/10 hover:text-brand-primary">
                            <Link to={`/admin/leads/${lead.id}`}>
                              <ExternalLink className="h-5 w-5" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
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

export default AdminLeadsPage;