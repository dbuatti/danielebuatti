import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ShoppingCart, Mail, Info, Clock, User } from 'lucide-react';
import { useCart } from './CartProvider';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ArrangementCardProps {
  arrangement: any;
}

export const ArrangementCard: React.FC<ArrangementCardProps> = ({ arrangement }) => {
  const { addToCart, items } = useCart();
  
  // State for selected keys
  const [selectedKeys, setSelectedKeys] = useState<string[]>([arrangement.key].filter(Boolean));

  const isInCart = items.some(i => i.id === arrangement.id);

  const previewUrl = arrangement.preview_image_path 
    ? supabase.storage.from('arrangement-previews').getPublicUrl(arrangement.preview_image_path).data.publicUrl 
    : null;

  // Calculate dynamic price based on selected keys
  const basePrice = arrangement.price || 0;
  const additionalPrice = arrangement.additional_key_price || 0;
  const currentPrice = selectedKeys.length > 0 
    ? basePrice + (Math.max(0, selectedKeys.length - 1) * additionalPrice)
    : basePrice;

  const cartItem = {
    id: arrangement.id,
    title: arrangement.title,
    price: currentPrice,
    composer: arrangement.composer || 'Unknown',
    selectedKeys: selectedKeys,
  };

  const toggleKey = (keyName: string) => {
    setSelectedKeys(prev => 
      prev.includes(keyName) 
        ? prev.filter(k => k !== keyName) 
        : [...prev, keyName]
    );
  };

  const allAvailableKeys = [
    { key: arrangement.key, isDefault: true },
    ...(arrangement.key_variants || []).map((v: any) => ({ key: v.key, isDefault: false }))
  ].filter(k => k.key);

  return (
    <article className="h-full">
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 border-brand-secondary/20 bg-white dark:bg-brand-dark-alt group">
        <div className="aspect-[3/4] relative bg-brand-secondary/5 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt={`${arrangement.title} sheet music preview`} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <Music className="h-16 w-16 text-brand-secondary/20" />
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="rounded-full bg-white/90 hover:bg-white text-brand-dark">
                  <Info className="h-4 w-4 mr-2" /> Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/20">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-brand-primary">{arrangement.title}</DialogTitle>
                  <DialogDescription className="text-brand-dark/60 dark:text-brand-light/60 italic">
                    Arrangement by {arrangement.composer || 'Unknown'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid md:grid-cols-2 gap-8 py-4">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden border border-brand-secondary/20 shadow-lg">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Score Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-secondary/10 flex items-center justify-center">
                        <Music className="h-12 w-12 text-brand-secondary/30" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 dark:text-brand-light/40">Duration</p>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="h-4 w-4 text-brand-primary" /> {arrangement.duration || 'N/A'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 dark:text-brand-light/40">Difficulty</p>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-4 w-4 text-brand-primary" /> {arrangement.difficulty || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-brand-secondary/20" />

                    {/* Key Selection Section */}
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 dark:text-brand-light/40">Select Keys</p>
                      <div className="grid grid-cols-2 gap-2">
                        {allAvailableKeys.map((k) => (
                          <div 
                            key={k.key} 
                            className={cn(
                              "flex items-center space-x-2 p-2 rounded-lg border transition-colors cursor-pointer",
                              selectedKeys.includes(k.key) 
                                ? "bg-brand-primary/10 border-brand-primary" 
                                : "bg-brand-secondary/5 border-transparent hover:bg-brand-secondary/10"
                            )}
                            onClick={() => toggleKey(k.key)}
                          >
                            <Checkbox 
                              checked={selectedKeys.includes(k.key)} 
                              onCheckedChange={() => toggleKey(k.key)}
                              className="data-[state=checked]:bg-brand-primary"
                            />
                            <span className="text-xs font-medium">{k.key}</span>
                          </div>
                        ))}
                      </div>
                      {additionalPrice > 0 && (
                        <p className="text-[10px] text-brand-dark/60 italic">
                          * First key: A${basePrice.toFixed(2)}. Additional keys: A${additionalPrice.toFixed(2)} each.
                        </p>
                      )}
                    </div>
                    
                    <Separator className="bg-brand-secondary/20" />
                    
                    {arrangement.lyrics && (
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 dark:text-brand-light/40">Lyrics Snippet</p>
                        <p className="text-sm italic text-brand-dark/70 dark:text-brand-light/70 leading-relaxed">
                          "{arrangement.lyrics}"
                        </p>
                      </div>
                    )}

                    <div className="pt-4">
                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-3xl font-bold text-brand-primary">A${currentPrice.toFixed(2)}</p>
                        {selectedKeys.length > 1 && (
                          <span className="text-xs text-brand-dark/40">({selectedKeys.length} keys)</span>
                        )}
                      </div>
                      {arrangement.is_purchasable ? (
                        <Button 
                          className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full h-12"
                          onClick={() => addToCart(cartItem)}
                          disabled={isInCart || selectedKeys.length === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isInCart ? 'Already in Cart' : 'Add to Cart'}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full rounded-full h-12 border-brand-primary text-brand-primary" asChild>
                          <Link to="/contact">Inquire for Purchase</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {arrangement.difficulty && (
            <div className="absolute top-2 right-2">
              <span className="bg-brand-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow uppercase tracking-wider">
                {arrangement.difficulty}
              </span>
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-1 text-brand-dark dark:text-brand-light">{arrangement.title}</CardTitle>
          <p className="text-sm text-brand-dark/60 dark:text-brand-light/60 italic">{arrangement.composer || 'Unknown Composer'}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded font-bold">
              {allAvailableKeys.length} {allAvailableKeys.length === 1 ? 'Key' : 'Keys'} Available
            </span>
            {arrangement.instrumentation && (
              <span className="text-[10px] bg-brand-secondary/10 text-brand-dark/70 dark:text-brand-light/70 px-1.5 py-0.5 rounded">
                {arrangement.instrumentation}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
          <span className="font-bold text-brand-primary">
            {arrangement.is_purchasable ? `A$${basePrice.toFixed(2)}` : 'Inquiry'}
          </span>
          {arrangement.is_purchasable ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  disabled={isInCart}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart ? 'In Cart' : 'Add'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] bg-brand-light dark:bg-brand-dark-alt">
                <DialogHeader>
                  <DialogTitle>Select Keys for {arrangement.title}</DialogTitle>
                  <DialogDescription>Choose which keys you would like to purchase.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    {allAvailableKeys.map((k) => (
                      <div 
                        key={k.key} 
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                          selectedKeys.includes(k.key) ? "border-brand-primary bg-brand-primary/5" : "border-brand-secondary/20"
                        )}
                        onClick={() => toggleKey(k.key)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox checked={selectedKeys.includes(k.key)} />
                          <span className="font-medium">{k.key} {k.isDefault && "(Original)"}</span>
                        </div>
                        {selectedKeys.includes(k.key) && selectedKeys.indexOf(k.key) > 0 && (
                          <span className="text-xs text-brand-primary font-bold">+A${additionalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold">Total: A${currentPrice.toFixed(2)}</span>
                    <Button 
                      onClick={() => addToCart(cartItem)}
                      className="bg-brand-primary rounded-full"
                      disabled={selectedKeys.length === 0}
                    >
                      Confirm & Add
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              asChild
              className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-full"
            >
              <Link to={`/contact?subject=Inquiry: ${encodeURIComponent(arrangement.title)}`}>
                <Mail className="h-4 w-4 mr-2" />
                Inquire
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </article>
  );
};

export default ArrangementCard;