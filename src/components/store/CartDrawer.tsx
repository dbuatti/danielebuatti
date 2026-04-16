import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { useCart } from './CartProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const CartDrawer: React.FC = () => {
  const { items, removeFromCart, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { items },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed: ' + error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative border-brand-primary text-brand-primary hover:bg-brand-primary/10 bg-white dark:bg-brand-dark">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-brand-light dark:bg-brand-dark-alt border-l border-brand-secondary/20">
        <SheetHeader className="pb-4 border-b border-brand-secondary/10">
          <SheetTitle className="text-brand-primary flex items-center gap-2 text-2xl">
            <ShoppingCart className="h-6 w-6" /> Your Cart
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto py-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="h-20 w-20 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-brand-secondary/30" />
              </div>
              <p className="text-brand-dark/60 dark:text-brand-light/60">Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-brand-dark rounded-xl border border-brand-secondary/20 shadow-sm transition-all hover:shadow-md">
                <div className="flex-grow">
                  <h4 className="font-semibold text-brand-dark dark:text-brand-light leading-tight">{item.title}</h4>
                  <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 mt-0.5">{item.composer}</p>
                  <p className="text-sm font-bold text-brand-primary mt-2">A${item.price.toFixed(2)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-brand-secondary/20 pt-6 pb-8 space-y-6">
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-lg font-medium text-brand-dark dark:text-brand-light">Total</span>
              <span className="text-3xl font-bold text-brand-primary">A${total.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white h-14 text-lg font-bold shadow-lg shadow-brand-primary/20 rounded-full" 
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Checkout with Stripe'}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart} 
                className="text-brand-dark/40 dark:text-brand-light/40 hover:text-red-500 transition-colors w-full"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};