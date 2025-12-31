"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, Gift, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface GiftCard {
  id: string;
  name: string;
  type: 'fixed' | 'open';
  value: number;
  code: string;
  email: string;
  purchased_at: string;
  redeemed_at: string | null;
  session_booked: string | null;
  remaining_balance: number;
  status: 'active' | 'redeemed';
}

const AdminGiftCardsPage: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGiftCard, setEditingGiftCard] = useState<GiftCard | null>(null);
  const [editSessionBooked, setEditSessionBooked] = useState<string>('');
  const [editRemainingBalance, setEditRemainingBalance] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchGiftCards = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .order('purchased_at', { ascending: false });

    if (error) {
      console.error('Error fetching gift cards:', error);
      showError('Failed to load gift cards.');
    } else {
      setGiftCards(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const filteredGiftCards = giftCards.filter(card => {
    const matchesStatus = filterStatus === 'all' || card.status === filterStatus;
    const matchesType = filterType === 'all' || card.type === filterType;
    const matchesSearch = searchTerm === '' ||
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.session_booked?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleMarkRedeemed = async (card: GiftCard) => {
    if (card.status === 'redeemed') {
      showError('This gift card is already marked as redeemed.');
      return;
    }
    if (!window.confirm(`Are you sure you want to mark gift card "${card.name}" (Code: ${card.code}) as redeemed?`)) {
      return;
    }

    const toastId = showLoading('Marking as redeemed...');
    try {
      const { error } = await supabase
        .from('gift_cards')
        .update({ redeemed_at: new Date().toISOString(), status: 'redeemed' })
        .eq('id', card.id);

      if (error) throw error;

      showSuccess('Gift card marked as redeemed!', { id: toastId });
      fetchGiftCards();
    } catch (error: any) {
      console.error('Error marking gift card as redeemed:', error);
      showError(`Failed to mark as redeemed: ${error.message}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const handleDeleteGiftCard = async (cardId: string) => {
    toast.promise(
      async () => {
        const { error } = await supabase
          .from('gift_cards')
          .delete()
          .eq('id', cardId);

        if (error) throw error;

        setGiftCards(prevCards => prevCards.filter(card => card.id !== cardId));
        return 'Gift card deleted successfully!';
      },
      {
        loading: 'Deleting gift card...',
        success: (message) => message,
        error: (err) => {
          console.error('Error deleting gift card:', err);
          return 'Failed to delete gift card.';
        },
        action: {
          label: 'Confirm Delete',
          onClick: () => { /* The promise handles the actual deletion */ },
        },
        description: 'Are you sure you want to delete this gift card? This action cannot be undone.',
      }
    );
  };

  const openEditModal = (card: GiftCard) => {
    setEditingGiftCard(card);
    setEditSessionBooked(card.session_booked || '');
    setEditRemainingBalance(card.remaining_balance !== null ? card.remaining_balance.toString() : card.value.toString());
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingGiftCard) return;

    setIsUpdating(true);
    const toastId = showLoading('Updating gift card...');

    try {
      const updatedRemainingBalance = parseFloat(editRemainingBalance);
      if (isNaN(updatedRemainingBalance)) {
        throw new Error('Remaining balance must be a valid number.');
      }

      const { error } = await supabase
        .from('gift_cards')
        .update({
          session_booked: editSessionBooked || null,
          remaining_balance: updatedRemainingBalance,
        })
        .eq('id', editingGiftCard.id);

      if (error) throw error;

      showSuccess('Gift card updated successfully!', { id: toastId });
      setIsEditModalOpen(false);
      fetchGiftCards();
    } catch (error: any) {
      console.error('Error updating gift card:', error);
      showError(`Failed to update gift card: ${error.message}`, { id: toastId });
    } finally {
      setIsUpdating(false);
      dismissToast(toastId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'redeemed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Gift Card Management</h2>
      <p className="text-lg text-brand-dark/80 dark:text-brand-light/80">
        Track all purchased gift cards, their redemption status, and remaining balances.
      </p>

      <Card className="bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader>
          <CardTitle className="text-xl text-brand-primary flex items-center gap-2">
            <Gift className="h-5 w-5" /> All Gift Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by name, code, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="redeemed">Redeemed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fixed">Fixed Session</SelectItem>
                <SelectItem value="open">Open Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
              <span className="sr-only">Loading gift cards...</span>
            </div>
          ) : filteredGiftCards.length === 0 ? (
            <p className="text-center text-brand-dark/70 dark:text-brand-light/70">No gift cards found matching your criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-secondary/10 dark:bg-brand-dark/50">
                    <TableHead className="text-brand-primary">Gift Card</TableHead>
                    <TableHead className="text-brand-primary">Code</TableHead>
                    <TableHead className="text-brand-primary">Value</TableHead>
                    <TableHead className="text-brand-primary">Buyer Email</TableHead>
                    <TableHead className="text-brand-primary">Purchased</TableHead>
                    <TableHead className="text-brand-primary">Redeemed</TableHead>
                    <TableHead className="text-brand-primary">Session Booked</TableHead>
                    <TableHead className="text-brand-primary">Remaining</TableHead>
                    <TableHead className="text-brand-primary">Status</TableHead>
                    <TableHead className="text-brand-primary text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGiftCards.map((card) => (
                    <TableRow key={card.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">{card.name}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{card.code}</TableCell>
                      <TableCell className="font-semibold text-brand-primary">A${card.value.toFixed(2)}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{card.email}</TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">{format(new Date(card.purchased_at), 'PPP')}</TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">
                        {card.redeemed_at ? format(new Date(card.redeemed_at), 'PPP') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{card.session_booked || 'N/A'}</TableCell>
                      <TableCell className="font-semibold text-brand-primary">A${card.remaining_balance?.toFixed(2) || card.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(card.status)}>{card.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center flex gap-2 justify-center">
                        {card.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkRedeemed(card)}
                            className="text-green-600 border-green-600 hover:bg-green-100 dark:hover:bg-green-900/50"
                            title="Mark as Redeemed"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(card)}
                          className="text-brand-primary border-brand-secondary/50 hover:bg-brand-secondary/10 dark:hover:bg-brand-dark/50"
                          title="Edit Details"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteGiftCard(card.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          title="Delete Gift Card"
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

      {/* Edit Gift Card Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
          <DialogHeader>
            <DialogTitle className="text-brand-primary">Edit Gift Card</DialogTitle>
          </DialogHeader>
          {editingGiftCard && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={editingGiftCard.name} readOnly className="col-span-3 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Code</Label>
                <Input id="code" value={editingGiftCard.code} readOnly className="col-span-3 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">Value</Label>
                <Input id="value" value={`A$${editingGiftCard.value.toFixed(2)}`} readOnly className="col-span-3 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sessionBooked" className="text-right">Session Booked</Label>
                <Input
                  id="sessionBooked"
                  value={editSessionBooked}
                  onChange={(e) => setEditSessionBooked(e.target.value)}
                  className="col-span-3 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light"
                />
              </div>
              {editingGiftCard.type === 'open' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="remainingBalance" className="text-right">Remaining Balance</Label>
                  <Input
                    id="remainingBalance"
                    type="number"
                    value={editRemainingBalance}
                    onChange={(e) => setEditRemainingBalance(e.target.value)}
                    className="col-span-3 bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isUpdating}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={isUpdating} className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGiftCardsPage;