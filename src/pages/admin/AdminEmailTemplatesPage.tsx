"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import EmailTemplateForm, { EmailTemplateFormValues } from '@/components/admin/EmailTemplateForm';
import { toast } from 'sonner'; // For promise-based toast

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at: string;
}

const AdminEmailTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching email templates:', error);
      showError('Failed to load email templates.');
    } else {
      setTemplates(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateOrUpdateTemplate = async (values: EmailTemplateFormValues) => {
    setIsSubmitting(true);
    const toastId = showLoading(editingTemplate ? 'Updating template...' : 'Creating template...');

    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from('email_templates')
          .update(values)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        showSuccess('Template updated successfully!', { id: toastId });
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert(values);

        if (error) throw error;
        showSuccess('Template created successfully!', { id: toastId });
      }
      await fetchTemplates(); // Refresh list
      setIsDialogOpen(false);
      setEditingTemplate(null);
    } catch (error: any) {
      console.error('Error saving template:', error);
      showError(`Failed to save template: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
      dismissToast(toastId);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    toast.promise(
      async () => {
        const { error } = await supabase
          .from('email_templates')
          .delete()
          .eq('id', templateId);

        if (error) throw error;
        await fetchTemplates();
        return 'Template deleted successfully!';
      },
      {
        loading: 'Deleting template...',
        success: (message) => message,
        error: (err) => {
          console.error('Error deleting template:', err);
          return 'Failed to delete template.';
        },
        action: {
          label: 'Confirm Delete',
          onClick: () => { /* The promise handles the actual deletion */ },
        },
        description: 'Are you sure you want to delete this email template? This action cannot be undone.',
      }
    );
  };

  const openCreateDialog = () => {
    setEditingTemplate(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Email Templates</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
            <DialogHeader>
              <DialogTitle className="text-brand-primary">{editingTemplate ? 'Edit Email Template' : 'Create New Email Template'}</DialogTitle>
              <DialogDescription className="text-brand-dark/70 dark:text-brand-light/70">
                {editingTemplate ? 'Make changes to your template here.' : 'Add a new reusable email template.'}
              </DialogDescription>
            </DialogHeader>
            <EmailTemplateForm
              initialData={editingTemplate || undefined}
              onSubmit={handleCreateOrUpdateTemplate}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Manage your reusable email templates for quick communication with clients.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">All Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
              <span className="sr-only">Loading templates...</span>
            </div>
          ) : templates.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No email templates found yet. Create one!</p>
          ) : (
            <div className="grid gap-4">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 border border-brand-secondary/30 rounded-md bg-brand-secondary/10 dark:bg-brand-dark/30">
                  <div>
                    <h3 className="font-semibold text-lg text-brand-primary">{template.name}</h3>
                    <p className="text-sm text-brand-dark/80 dark:text-brand-light/80">Subject: {template.subject}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(template)}
                      className="text-brand-dark dark:text-brand-light border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmailTemplatesPage;