"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, UserPlus, Mail, MapPin, Trash2, ExternalLink, Search } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LeadForm, { LeadFormValues } from '@/components/admin/LeadForm';
import { Lead } from '@/types/lead';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

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
    lead.venue?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Lead Management</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
              <UserPlus className="mr-2 h-4 w-4" /> Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
            <DialogHeader>
              <DialogTitle className="text-brand-primary">Add New Lead</DialogTitle>
            </DialogHeader>
            <LeadForm
              onSubmit={handleCreateLead}
              isSubmitting={isSubmitting}
              onClose={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl text-brand-primary">All Leads</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70 py-12">No leads found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                    <TableHead className="text-brand-primary">Company / Name</TableHead>
                    <TableHead className="text-brand-primary">Contact</TableHead>
                    <TableHead className="text-brand-primary">Venue</TableHead>
                    <TableHead className="text-brand-primary">Status</TableHead>
                    <TableHead className="text-brand-primary">Created</TableHead>
                    <TableHead className="text-brand-primary text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">
                        <Link to={`/admin/leads/${lead.id}`} className="hover:underline text-brand-primary">
                          {lead.company_name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-semibold">{lead.contact_name || 'N/A'}</span>
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {lead.email}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-brand-dark/80 dark:text-brand-light/80">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {lead.venue || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-brand-dark/70 dark:text-brand-light/70">
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-center flex gap-2 justify-center">
                        <Button asChild variant="outline" size="sm" className="text-brand-primary border-brand-secondary/50">
                          <Link to={`/admin/leads/${lead.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLead(lead.id)}
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

export default AdminLeadsPage;