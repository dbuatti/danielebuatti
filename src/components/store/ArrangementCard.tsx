import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ShoppingCart, Mail, Info, Clock, Key, User } from 'lucide-react';
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

interface ArrangementCardProps {
  arrangement: any;
}

export const ArrangementCard: React.FC<ArrangementCardProps> = ({ arrangement }) => {
  const { addToCart, items } = useCart();
  const isInCart = items.some(i => i.id === arrangement.id);

  const previewUrl = arrangement.preview_image_path 
    ? supabase.storage.from('arrangement-previews').getPublicUrl(arrangement.preview_image_path).data.publicUrl 
    : null;

  const cartItem = {
    id: arrangement.id,
    title: arrangement.title,
    price: arrangement.price,
    composer: arrangement.composer || 'Unknown'
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 border-brand-secondary/20 bg-white dark:bg-brand-dark-alt group">
      <div className="aspect-[3/4] relative bg-brand-secondary/5 flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt={arrangement.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <Music className="h-16 w-16 text-brand-secondary/20" />
        )}
        
        {/* Overlay with Quick View */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="rounded-full bg-white/90 hover:bg-white text-brand-dark">
                <Info className="h-4 w-4 mr-2" /> Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-brand-light dark:bg-brand-dark-alt border-brand-secondary/20">
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
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 dark:text-brand-light/40">Key</p>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Key className="h-4 w-4 text-brand-primary" /> {arrangement.key || 'N/A'}
                      </div>
                    </div>
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
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 dark:text-brand-light/40">Instrumentation</p>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Music className="h-4 w-4 text-brand-primary" /> {arrangement.instrumentation || 'N/A'}
                      </div>
                    </div>
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
                    <p className="text-2xl font-bold text-brand-primary mb-4">A${arrangement.price.toFixed(2)}</p>
                    {arrangement.is_purchasable ? (
                      <Button 
                        className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full h-12"
                        onClick={() => addToCart(cartItem)}
                        disabled={isInCart}
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
          {arrangement.instrumentation && (
            <span className="text-[10px] bg-brand-secondary/10 text-brand-dark/70 dark:text-brand-light/70 px-1.5 py-0.5 rounded">
              {arrangement.instrumentation}
            </span>
          )}
          {arrangement.genre && (
            <span className="text-[10px] bg-brand-secondary/10 text-brand-dark/70 dark:text-brand-light/70 px-1.5 py-0.5 rounded">
              {arrangement.genre}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <span className="font-bold text-brand-primary">
          {arrangement.is_purchasable ? `A$${arrangement.price.toFixed(2)}` : 'Inquiry'}
        </span>
        {arrangement.is_purchasable ? (
          <Button 
            size="sm" 
            onClick={() => addToCart(cartItem)} 
            disabled={isInCart}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart ? 'In Cart' : 'Add'}
          </Button>
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
  );
};