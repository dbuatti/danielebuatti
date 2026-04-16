import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ShoppingCart, Mail } from 'lucide-react';
import { useCart } from './CartProvider';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface ArrangementCardProps {
  arrangement: any;
}

export const ArrangementCard: React.FC<ArrangementCardProps> = ({ arrangement }) => {
  const { addToCart, items } = useCart();
  const isInCart = items.some(i => i.id === arrangement.id);

  const previewUrl = arrangement.preview_image_path 
    ? supabase.storage.from('arrangement-previews').getPublicUrl(arrangement.preview_image_path).data.publicUrl 
    : null;

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow border-brand-secondary/20 bg-white dark:bg-brand-dark-alt">
      <div className="aspect-[3/4] relative bg-brand-secondary/5 flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt={arrangement.title} className="object-cover w-full h-full" />
        ) : (
          <Music className="h-16 w-16 text-brand-secondary/20" />
        )}
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
          {arrangement.style && (
            <span className="text-[10px] bg-brand-secondary/10 text-brand-dark/70 dark:text-brand-light/70 px-1.5 py-0.5 rounded">
              {arrangement.style}
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
            onClick={() => addToCart({
              id: arrangement.id,
              title: arrangement.title,
              price: arrangement.price,
              composer: arrangement.composer || 'Unknown'
            })} 
            disabled={isInCart}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            asChild
            className="border-brand-primary text-brand-primary hover:bg-brand-primary/10"
          >
            <Link to={`/contact?subject=Inquiry: ${encodeURIComponent(arrangement.title)}&message=${encodeURIComponent(`I am interested in the arrangement: ${arrangement.title} by ${arrangement.composer || 'Unknown'}.`)}`}>
              <Mail className="h-4 w-4 mr-2" />
              Inquire
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
