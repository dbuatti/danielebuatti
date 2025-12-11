"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import DraftList from '@/components/admin/DraftList';
import { Draft } from '@/types/draft';
import { Loader2 } from 'lucide-react';

const AdminDraftsPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrafts = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // The 'data' column is stored as JSONB, which Supabase client automatically parses.
      setDrafts(data as Draft[]);
    } catch (error: any) {
      console.error('Error fetching drafts:', error);
      showError(`Failed to load drafts: ${error.message || 'Unknown error occurred'}`);
      setDrafts([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchDrafts();
    }
  }, [isAuthLoading, fetchDrafts]);

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold">Access Denied</h3>
        <p className="text-gray-500">Please log in to view your saved drafts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Saved Quote Drafts</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        These are quotes you have saved but not yet finalized. Click 'Load' to continue editing.
      </p>
      
      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary">Draft List</CardTitle>
        </CardHeader>
        <CardContent>
          <DraftList 
            drafts={drafts} 
            isLoading={isLoading} 
            onDraftDeleted={fetchDrafts} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDraftsPage;