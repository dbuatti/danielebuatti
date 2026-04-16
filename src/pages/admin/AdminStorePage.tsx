import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Music, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrangementForm } from '@/components/admin/ArrangementForm';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface Arrangement {
  id: string;
  title: string;
  composer: string | null;
  instrumentation: string | null;
  difficulty: string | null;
  price: number | null;
  is_purchasable: boolean;
  preview_image_path: string | null;
  pdf_file_path: string | null;
}

const AdminStorePage: React.FC = () => {
  const [arrangements, setArrangements] = useState<Arrangement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArrangement, setEditingArrangement] = useState<Arrangement | null>(null);

  const fetchArrangements = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('arrangements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load arrangements');
    } else {
      setArrangements(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArrangements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this arrangement?')) return;

    const { error } = await supabase.from('arrangements').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete arrangement');
    } else {
      toast.success('Arrangement deleted');
      fetchArrangements();
    }
  };

  const handleEdit = (arrangement: Arrangement) => {
    setEditingArrangement(arrangement);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingArrangement(null);
    fetchArrangements();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Store Management</h2>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingArrangement(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Arrangement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
            <DialogHeader>
              <DialogTitle className="text-brand-primary">{editingArrangement ? 'Edit Arrangement' : 'Add New Arrangement'}</DialogTitle>
              <div className="text-sm text-muted-foreground">
                Fill in the details below to manage your music arrangement.
              </div>
            </DialogHeader>
            <ArrangementForm initialData={editingArrangement} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Manage your music arrangements, upload PDFs, and use AI to extract metadata.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <Music className="h-5 w-5" /> All Arrangements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            </div>
          ) : arrangements.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No arrangements found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                    <TableHead className="text-brand-primary">Preview</TableHead>
                    <TableHead className="text-brand-primary">Title</TableHead>
                    <TableHead className="text-brand-primary">Composer</TableHead>
                    <TableHead className="text-brand-primary">Instrumentation</TableHead>
                    <TableHead className="text-brand-primary">Price</TableHead>
                    <TableHead className="text-brand-primary">Status</TableHead>
                    <TableHead className="text-brand-primary text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arrangements.map((arr) => (
                    <TableRow key={arr.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell>
                        {arr.preview_image_path ? (
                          <img 
                            src={supabase.storage.from('arrangement-previews').getPublicUrl(arr.preview_image_path).data.publicUrl} 
                            alt={arr.title} 
                            className="h-12 w-12 object-cover rounded border border-brand-secondary/30"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-brand-secondary/10 rounded flex items-center justify-center border border-brand-secondary/30">
                            <Music className="h-6 w-6 text-brand-secondary/30" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">{arr.title}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{arr.composer || 'N/A'}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{arr.instrumentation || 'N/A'}</TableCell>
                      <TableCell className="font-semibold text-brand-primary">{arr.price ? `A$${arr.price.toFixed(2)}` : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={arr.is_purchasable ? 'default' : 'secondary'}>
                          {arr.is_purchasable ? 'Purchasable' : 'Inquiry Only'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(arr)}
                          className="text-brand-primary border-brand-secondary/50 hover:bg-brand-secondary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(arr.id)}
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

export default AdminStorePage;
