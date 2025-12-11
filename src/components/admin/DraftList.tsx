"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Draft } from '@/types/draft';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

interface DraftListProps {
  drafts: Draft[];
  isLoading: boolean;
  onDraftDeleted: () => void;
}

const DraftList: React.FC<DraftListProps> = ({ drafts, isLoading, onDraftDeleted }) => {
  const navigate = useNavigate();

  const handleDeleteDraft = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the draft: "${title}"?`)) {
      return;
    }

    const toastId = showLoading(`Deleting draft: ${title}...`);

    try {
      const { error } = await supabase
        .from('quote_drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showSuccess('Draft deleted successfully.', { id: toastId });
      onDraftDeleted(); // Notify parent to refresh the list
    } catch (error: any) {
      console.error('Error deleting draft:', error);
      showError(`Failed to delete draft: ${error.message || 'Unknown error occurred'}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const handleLoadDraft = (id: string) => {
    // Navigate to the quote builder page, passing the draft ID as a state parameter
    navigate('/admin/quote-builder', { state: { draftId: id } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
        <span className="ml-2 text-gray-500">Loading drafts...</span>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed rounded-lg text-gray-500">
        No saved drafts found. Start building a quote!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drafts.map((draft) => (
            <TableRow key={draft.id}>
              <TableCell className="font-medium">{draft.title}</TableCell>
              <TableCell>{format(new Date(draft.updated_at), 'MMM dd, yyyy HH:mm')}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleLoadDraft(draft.id)}>
                  <Edit className="h-4 w-4 mr-2" /> Load
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteDraft(draft.id, draft.title)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DraftList;