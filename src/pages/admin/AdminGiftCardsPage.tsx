"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2, Gift, CheckCircle, Edit, Trash2, PlusCircle, Link as LinkIcon, Mail } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GiftCardForm, { GiftCardFormValues } from '@/components/admin/GiftCardForm'; // Import the new form

interface GiftCard {
  id: string;
  name: string;
  type: 'fixed_session' | 'open_credit' | 'discount';
  value: number;
  code: string;
  email: string;
  purchased_at: string;
  redeemed_at: string | null;
  session_booked: string | null;
  remaining_balance: number;
  status: 'active' | 'redeemed'; // This is derived, but kept for simplicity in UI
  payment_status: 'paid' | 'pending' | 'refunded'; // NEW
  redemption_status: 'unused' | 'partially_used' | 'redeemed'; // NEW
  amount_redeemed: number; // NEW
  expiration_date: string | null; // NEW
  notes: string | null; // NEW
  stripe_product_id: string | null; // NEW
  stripe_payment_link: string | null; // NEW
  stripe_checkout_session_id: string | null; // NEW
  manual_redeemed: boolean; // NEW
}

const AdminGiftCardsPage: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all'); // NEW filter
  const [filterRedemptionStatus, setFilterRedemptionStatus] = useState<string>('all'); // NEW filter
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGiftCard, setEditingGiftCard] = useState<GiftCard | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
    const matchesPaymentStatus = filterPaymentStatus === 'all' || card.payment_status === filterPaymentStatus;
    const matchesRedemptionStatus = filterRedemptionStatus === 'all' || card.redemption_status === filterRedemptionStatus;
    
    const matchesSearch = searchTerm === '' ||
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.session_booked?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.stripe_checkout_session_id?.toLowerCase().includes(searchTerm.toLowerCase()); // NEW: Search by session ID
      
    return matchesStatus && matchesType && matchesPaymentStatus && matchesRedemptionStatus && matchesSearch;
  });

  const handleMarkRedeemed = async (card: GiftCard) => {
    if (card.redemption_status === 'redeemed') {
      showError('This gift card is already marked as fully redeemed.');
      return;
    }
    if (!window.confirm(`Are you sure you want to mark gift card "${card.name}" (Code: ${card.code}) as fully redeemed? This will set remaining balance to 0.`)) {
      return;
    }

    const toastId = showLoading('Marking as redeemed...');
    try {
      const { error } = await supabase
        .from('gift_cards')
        .update({ 
          redeemed_at: new Date().toISOString(), 
          redemption_status: 'redeemed',
          amount_redeemed: card.value, // Mark full value as redeemed
          remaining_balance: 0, // Set remaining balance to 0
        })
        .eq('id', card.id);

      if (error) throw error;

      showSuccess('Gift card marked as fully redeemed!', { id: toastId });
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

  const handleSendEmail = async (card: GiftCard) => {
    const toastId = showLoading(`Sending confirmation email to ${card.email}...`);

    try {
      // Use supabase.functions.invoke for correct Edge Function calling
      const { error } = await supabase.functions.invoke('send-gift-card-email', {
        body: {
          buyerEmail: card.email,
          giftCardName: card.name,
          value: card.value,
          redemptionCode: card.code,
          expirationDate: card.expiration_date || null,
          type: card.type,
        },
      });

      if (error) throw error;

      showSuccess('Confirmation email sent successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error sending gift card email:', error);
      showError(`Failed to send email: ${error.message}`, { id: toastId });
    } finally {
      dismissToast(toastId);
    }
  };

  const openEditModal = (card: GiftCard) => {
    setEditingGiftCard(card);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (values: GiftCardFormValues) => {
    if (!editingGiftCard) return;

    setIsUpdating(true);
    const toastId = showLoading('Updating gift card...');

    try {
      const { error } = await supabase
        .from('gift_cards')
        .update({
          name: values.name,
          type: values.type,
          value: values.value,
          code: values.code,
          email: values.email,
          purchased_at: values.purchased_at,
          payment_status: values.payment_status,
          redemption_status: values.redemption_status,
          amount_redeemed: values.amount_redeemed,
          remaining_balance: values.type === 'open_credit' ? (values.value - values.amount_redeemed) : 0,
          expiration_date: values.expiration_date || null,
          notes: values.notes || null,
          stripe_payment_link: values.stripe_payment_link || null,
          manual_redeemed: values.manual_redeemed,
          stripe_checkout_session_id: values.stripe_checkout_session_id || null,
          // redeemed_at and session_booked are updated via specific actions or manually in the UI
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
  
  const handleCreateGiftCard = async (values: GiftCardFormValues) => {
    setIsCreating(true);
    const toastId = showLoading('Creating new gift card...');

    try {
      // 1. Insert into DB
      const { error } = await supabase
        .from('gift_cards')
        .insert({
          name: values.name,
          type: values.type,
          value: values.value,
          code: values.code,
          email: values.email,
          purchased_at: values.purchased_at,
          payment_status: values.payment_status,
          redemption_status: values.redemption_status,
          amount_redeemed: values.amount_redeemed,
          remaining_balance: values.type === 'open_credit' ? (values.value - values.amount_redeemed) : 0,
          expiration_date: values.expiration_date || null,
          notes: values.notes || null,
          stripe_payment_link: values.stripe_payment_link || null,
          manual_redeemed: values.manual_redeemed,
          stripe_checkout_session_id: values.stripe_checkout_session_id || null,
          status: 'active', // New gift cards are always active
        });

      if (error) throw error;

      // 2. Send the gift card email using invoke
      const { error: emailError } = await supabase.functions.invoke('send-gift-card-email', {
        body: {
          buyerEmail: values.email,
          giftCardName: values.name,
          value: values.value,
          redemptionCode: values.code,
          expirationDate: values.expiration_date || null,
          type: values.type,
        },
      });

      if (emailError) {
        console.error('Failed to send gift card email:', emailError);
        // Log the error but don't fail the whole operation since the card is created
        showError('Gift card created, but failed to send confirmation email.', { id: toastId });
      } else {
        showSuccess('Gift card created and confirmation email sent!', { id: toastId });
      }

      setIsCreateModalOpen(false);
      fetchGiftCards(); // Refresh the list
    } catch (error: any) {
      console.error('Error creating gift card:', error);
      showError(`Failed to create gift card: ${error.message}`, { id: toastId });
    } finally {
      setIsCreating(false);
      dismissToast(toastId);
    }
  };
  
  const getRedemptionStatusBadgeVariant = (status: GiftCard['redemption_status']) => {
    switch (status) {
      case 'unused': return 'outline';
      case 'partially_used': return 'default';
      case 'redeemed': return 'secondary';
      default: return 'outline';
    }
  };

  const getPaymentStatusBadgeVariant = (status: GiftCard['payment_status']) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'refunded': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Gift Card Management</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Gift Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
            <DialogHeader>
              <DialogTitle className="text-brand-primary">Create New Gift Card</DialogTitle>
            </DialogHeader>
            <GiftCardForm
              onSubmit={handleCreateGiftCard}
              isSubmitting={isCreating}
              onClose={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
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
          <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
            <Input
              placeholder="Search by name, code, email, or notes..."
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
                <SelectItem value="fixed_session">Fixed Session</SelectItem>
                <SelectItem value="open_credit">Open Credit</SelectItem>
                <SelectItem value="discount">Discount Code</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
              <SelectTrigger className="w-[180px] bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light">
                <SelectValue placeholder="Filter by Payment" />
              </SelectTrigger>
              <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRedemptionStatus} onValueChange={setFilterRedemptionStatus}>
              <SelectTrigger className="w-[180px] bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light">
                <SelectValue placeholder="Filter by Redemption" />
              </SelectTrigger>
              <SelectContent className="bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/50">
                <SelectItem value="all">All Redemptions</SelectItem>
                <SelectItem value="unused">Unused</SelectItem>
                <SelectItem value="partially_used">Partially Used</SelectItem>
                <SelectItem value="redeemed">Redeemed</SelectItem>
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
                    <TableHead className="text-brand-primary">Expires</TableHead>
                    <TableHead className="text-brand-primary">Payment</TableHead>
                    <TableHead className="text-brand-primary">Redemption</TableHead>
                    <TableHead className="text-brand-primary">Redeemed Amt</TableHead>
                    <TableHead className="text-brand-primary">Remaining</TableHead>
                    <TableHead className="text-brand-primary">Session Booked</TableHead>
                    <TableHead className="text-brand-primary">Notes</TableHead>
                    <TableHead className="text-brand-primary">Stripe Session ID</TableHead>
                    <TableHead className="text-brand-primary text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGiftCards.map((card) => (
                    <TableRow key={card.id} className="hover:bg-brand-secondary/5 dark:hover:bg-brand-dark/30">
                      <TableCell className="font-medium text-brand-dark dark:text-brand-light">
                        {card.name} ({card.type.replace('_', ' ')})
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{card.code}</TableCell>
                      <TableCell className="font-semibold text-brand-primary">A${card.value.toFixed(2)}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{card.email}</TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">{format(new Date(card.purchased_at), 'PPP')}</TableCell>
                      <TableCell className="text-brand-dark/70 dark:text-brand-light/70">
                        {card.expiration_date ? format(new Date(card.expiration_date), 'PPP') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusBadgeVariant(card.payment_status)}>{card.payment_status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRedemptionStatusBadgeVariant(card.redemption_status)}>{card.redemption_status.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">A${card.amount_redeemed.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-brand-primary">A${card.remaining_balance?.toFixed(2)}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">{card.session_booked || 'N/A'}</TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                        {card.notes || 'N/A'}
                        {card.stripe_payment_link && (
                          <a href={card.stripe_payment_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-brand-primary hover:underline text-xs mt-1">
                            <LinkIcon className="h-3 w-3 mr-1" /> Stripe Link
                          </a>
                        )}
                        {card.manual_redeemed && (
                          <Badge variant="outline" className="mt-1 text-xs">Manually Redeemed</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-brand-dark/80 dark:text-brand-light/80">
                        {card.stripe_checkout_session_id ? (
                          <span title={card.stripe_checkout_session_id}>
                            {card.stripe_checkout_session_id.substring(0, 8)}...
                          </span>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-center flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendEmail(card)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                          title="Resend Confirmation Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        {card.redemption_status !== 'redeemed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkRedeemed(card)}
                            className="text-green-600 border-green-600 hover:bg-green-100 dark:hover:bg-green-900/50"
                            title="Mark as Fully Redeemed"
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-brand-light dark:bg-brand-dark-alt text-brand-dark dark:text-brand-light border-brand-secondary/50">
          <DialogHeader>
            <DialogTitle className="text-brand-primary">Edit Gift Card</DialogTitle>
          </DialogHeader>
          {editingGiftCard && (
            <GiftCardForm
              initialData={{
                ...editingGiftCard,
                // Format dates for input type="date"
                purchased_at: editingGiftCard.purchased_at ? new Date(editingGiftCard.purchased_at).toISOString().split('T')[0] : '',
                expiration_date: editingGiftCard.expiration_date ? new Date(editingGiftCard.expiration_date).toISOString().split('T')[0] : '',
                // Ensure nullable fields are undefined if null for Zod's optional()
                notes: editingGiftCard.notes || undefined,
                stripe_payment_link: editingGiftCard.stripe_payment_link || undefined,
                stripe_checkout_session_id: editingGiftCard.stripe_checkout_session_id || undefined, // Ensure this is passed
              }}
              onSubmit={handleSaveEdit}
              isSubmitting={isUpdating}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGiftCardsPage;