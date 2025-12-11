"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteDraft {
  id: string;
  title: string;
  updated_at: string;
}

interface DraftLoaderProps {
  drafts: QuoteDraft[];
  isLoading: boolean;
  onLoadDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
  currentDraftId: string | undefined;
}

const DraftLoader: React.FC<DraftLoaderProps> = ({
  drafts,
  isLoading,
  onLoadDraft,
  onDeleteDraft,
  currentDraftId,
}) => {
  const handleSelectChange = (draftId: string) => {
    if (draftId) {
      onLoadDraft(draftId);
    }
  };

  const selectedDraft = drafts.find(d => d.id === currentDraftId);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-brand-secondary/10 dark:bg-brand-dark/50 rounded-lg border border-brand-secondary/30">
      <FileText className="h-6 w-6 text-brand-primary flex-shrink-0" />
      <div className="flex-grow">
        <p className="font-semibold text-brand-dark dark:text-brand-light">Load Existing Draft</p>
        {selectedDraft && (
          <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">
            Currently loaded: <span className="font-medium">{selectedDraft.title}</span> (Updated: {new Date(selectedDraft.updated_at).toLocaleTimeString()})
          </p>
        )}
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <Select onValueChange={handleSelectChange} value={currentDraftId || ""}>
          <SelectTrigger className="w-full md:w-[250px] bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light">
            <SelectValue placeholder={isLoading ? 'Loading drafts...' : 'Select a saved draft'} />
          </SelectTrigger>
          <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
            {isLoading ? (
              <SelectItem value="loading" disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
              </SelectItem>
            ) : drafts.length === 0 ? (
              <SelectItem value="no-drafts" disabled>No drafts saved</SelectItem>
            ) : (
              drafts.map((draft) => (
                <SelectItem key={draft.id} value={draft.id}>
                  {draft.title} ({new Date(draft.updated_at).toLocaleDateString()})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        {currentDraftId && (
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={() => onDeleteDraft(currentDraftId)}
            title="Delete current draft"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DraftLoader;