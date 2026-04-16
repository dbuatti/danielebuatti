import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ShoppingCart, Info, Check } from 'lucide-react';
import { useCart } from './CartProvider';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ArrangementCardProps {
  arrangement: any;
}

export const ArrangementCard: React.FC<ArrangementCardProps> = ({ arrangement }) => {
  const { items } = useCart();
  const isInCart = items.some(i => i.id === arrangement.id);

  const previewUrl = arrangement.preview_image_path 
    ? supabase.storage.from('arrangement-previews').getPublicUrl(arrangement.preview_image_path).data.publicUrl 
    : null;

  const detailUrl = `/store/arrangements/${arrangement.slug || arrangement.id}`;

  return (
    <article className="h-full">
      <Link to={detailUrl} className="block h-full group">
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-brand-secondary/20 bg-white dark:bg-brand-dark-alt">
          <div className="aspect-[3/4] relative bg-brand-secondary/5 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt={`${arrangement.title} sheet music preview`} 
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
              />
            ) : (
              <Music className="h-16 w-16 text-brand-secondary/20" />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white text-brand-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Info className="h-4 w-4" /> View Details
              </div>
            </div>

            {arrangement.difficulty && (
              <div className="absolute top-4 right-4">
                <span className="bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
                  {arrangement.difficulty}
                </span>
              </div>
            )}
          </div>

          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl line-clamp-1 text-brand-dark dark:text-brand-light group-hover:text-brand-primary transition-colors">
              {arrangement.title}
            </CardTitle>
            <p className="text-sm text-brand-primary font-serif italic">
              {arrangement.composer || 'Unknown Composer'}
            </p>
          </CardHeader>

          <CardContent className="p-6 pt-0 flex-grow">
            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60 line-clamp-2 mt-2 leading-relaxed">
              {arrangement.description || 'Professional musical arrangement.'}
            </p>
            <div className="flex flex-wrap gap-1 mt-4">
              <span className="text-[9px] bg-brand-secondary/10 text-brand-dark/70 dark:text-brand-light/70 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                {arrangement.instrumentation || 'Piano/Vocal'}
              </span>
              {arrangement.key && (
                <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                  Key: {arrangement.key}
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-brand-secondary/10 mt-auto">
            <span className="text-2xl font-bold text-brand-dark dark:text-brand-light">
              A${arrangement.price?.toFixed(2)}
            </span>
            <Button 
              size="sm" 
              className={cn(
                "rounded-full px-6 font-bold transition-all",
                isInCart ? "bg-green-500 hover:bg-green-600" : "bg-brand-primary hover:bg-brand-primary/90"
              )}
            >
              {isInCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
              {isInCart ? 'In Cart' : 'Buy'}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </article>
  );
};

export default ArrangementCard;