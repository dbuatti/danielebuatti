"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, UserPlus, Trash2, ExternalLink, Search, Users, TrendingUp, CheckCircle2, Clock, DollarSign, Filter, ArrowUpDown } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LeadForm, { LeadFormValues } from '@/components/admin/LeadForm';
import { Lead } from '@/types/lead';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

type SortConfig = {
  key: keyof Lead;
  direction: 'asc' | 'desc';
};

const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at', direction: 'desc' });
  
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

  const handleUpdateLeadField = async (leadId: string, field: keyof Lead, value: any) => {
    const toastId = showLoading(`Updating ${field}...`);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ [field]: value })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, [field]: value } : l));
      showSuccess('Updated successfully!', { id: toastId });
    } catch (error: any) {
      showError(`Update failed: ${error.message}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const handleSort = (key: keyof Lead) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

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

  const filteredAndSortedLeads = useMemo(() => {
    return leads
      .filter(lead => {
        const matchesSearch = lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.sector?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
        const matchesType = typeFilter === 'all' || lead.lead_type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesPriority && matchesType;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        const modifier = sortConfig.direction === 'asc' ? 1 : -1;
        return aValue < bValue ? -1 * modifier : 1 * modifier;
      });
  }, [leads, searchTerm, statusFilter, priorityFilter, typeFilter, sortConfig]);

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
      showError(`Failed to create lead: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    toast.promise(
      async () => {
        const { error } = await supabase.from('leads').delete().eq('id', leadId);
        if (error) throw error;
        setLeads(prev => prev.filter(l => l.id !== leadId));
      },
      {
        loading: 'Deleting lead...',
        success: 'Lead deleted successfully!',
        error: 'Failed to delete lead.',
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-brand-dark dark:text-brand-light tracking-tight">Lead Pipeline</h2>
          <p className="text-lg text-brand-dark/60 dark:text-brand-light/60">Dynamic management of your professional network.</p>
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
            <LeadForm onSubmit={handleCreateLead} isSubmitting={isSubmitting} onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Pipeline Value', value: `$${stats.pipelineValue.toLocaleString()}`, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
          { label: 'Weighted Value', value: `$${Math.round(stats.weightedValue).toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-500/10' },
          { label: 'Converted', value: stats.converted, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-500/10' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/50 dark:bg-brand-dark-alt/50 backdrop-blur-sm border-brand-secondary/30 shadow-sm rounded-2xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-dark/60 dark:text-brand-light/60 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-brand-dark dark:text-brand-light">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Table */}
      <Card className="bg-white dark:bg-brand-dark-alt shadow-xl border-brand-secondary/50 rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-brand-secondary/20 p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <CardTitle className="text-2xl font-bold text-brand-primary flex items-center gap-2">
              <Filter className="h-6 w-6" /> Active Pipeline
            </CardTitle>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search company, contact, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-brand-secondary/10 dark:bg-brand-dark border-none rounded-full text-brand-dark dark:text-brand-light placeholder:text-gray-500 focus-visible:ring-brand-primary"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] rounded-full bg-brand-secondary/10 border-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[160px] rounded-full bg-brand-secondary/10 border-none">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] rounded-full bg-brand-secondary/10 border-none">
                <SelectValue placeholder="Lead Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Tech">Tech</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setTypeFilter('all'); setSearchTerm(''); }} className="text-brand-dark/40 hover:text-brand-primary">
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/5 dark:bg-brand-dark/50 border-none">
                    <TableHead className="py-6 pl-8">
                      <Button variant="ghost" onClick={() => handleSort('company_name')} className="font-bold text-brand-primary p-0 hover:bg-transparent">
                        Company / Lead <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="py-6">Priority</TableHead>
                    <TableHead className="py-6">Sector</TableHead>
                    <TableHead className="py-6">
                      <Button variant="ghost" onClick={() => handleSort('estimated_value')} className="font-bold text-brand-primary p-0 hover:bg-transparent">
                        Value <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="py-6">Status</TableHead>
                    <TableHead className="py-6">
                      <Button variant="ghost" onClick={() => handleSort('follow_up_date')} className="font-bold text-brand-primary p-0 hover:bg-transparent">
                        Follow-up <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="py-6 text-center pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedLeads.map((lead) => (
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
                        <Select value={lead.priority} onValueChange={(val) => handleUpdateLeadField(lead.id, 'priority', val)}>
                          <SelectTrigger className={cn(
                            "w-[110px] h-8 rounded-full border-none text-xs font-bold uppercase tracking-wider",
                            lead.priority === 'High' ? "bg-red-500 text-white" : lead.priority === 'Medium' ? "bg-yellow-500/20 text-yellow-700" : "bg-gray-100 text-gray-500"
                          )}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-6">
                        <Badge variant="outline" className="px-3 py-1 rounded-full font-medium border-brand-secondary/50">
                          {lead.sector || lead.lead_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-dark/80 dark:text-brand-light/80">${(lead.estimated_value || 0).toLocaleString()}</span>
                          <span className="text-xs text-brand-dark/40 dark:text-brand-light/40">{lead.probability || 0}% Prob.</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <Select value={lead.status} onValueChange={(val) => handleUpdateLeadField(lead.id, 'status', val)}>
                          <SelectTrigger className={cn(
                            "w-[130px] h-8 rounded-full border-none text-xs font-bold",
                            lead.status === 'Converted' ? "bg-green-500 text-white" : "bg-brand-secondary/20 text-brand-dark/70"
                          )}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLead(lead.id)} className="rounded-full hover:bg-red-500/10 hover:text-red-500">
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