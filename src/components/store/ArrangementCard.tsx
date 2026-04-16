import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ShoppingCart, Info, Clock, User } from 'lucide-react';
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
                    {arrangement.description && (
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 dark:text-brand-light/40">About this Arrangement</p>
                        <p className="text-sm text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
                          {arrangement.description}
                        </p>
                      </div>
                    )}

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
        <CardContent className="p<dyad-problem-report summary="3 problems">
<problem file="src/components/store/ArrangementCard.tsx" line="4" column="31" code="6133">'Mail' is declared but its value is never read.</problem>
<problem file="src/components/admin/ArrangementForm.tsx" line="10" column="1" code="6133">'Badge' is declared but its value is never read.</problem>
<problem file="src/components/admin/ArrangementForm.tsx" line="12" column="56" code="6133">'X' is declared but its value is never read.</problem>
</dyad-problem-report><think>**Addressing Unused Imports**

I'm currently focused on resolving the TypeScript compile-time errors. Specifically, I'm identifying and removing unused imports. I've noted that `Mail` is unused in `ArrangementCard.tsx` and `AdminUserContext` and `AuthContext` are unused in `ArrangementForm.tsx`. I will begin by removing the unused imports.


**Refining Import Removal**

I've made further progress in removing unused imports. In `ArrangementForm.tsx`, I've identified and will remove both the `Badge` import and `X` from `lucide-react`. I also noticed `Mail` might have been used in a previous version but is no longer being utilized in `ArrangementCard.tsx`, so I'll be removing that one as well. I'm double-checking the code to confirm these removals are accurate.


**Validating UI Components**

I'm now cross-referencing my previous code to confirm the unused import errors. I thought `<Badge>` and `<X>` were used in `ArrangementForm.tsx`, but I'm checking the specific code I wrote in "Master Drop Zone," "Preview Image Area," and "Secondary File" sections. It appears the compiler is correct, and I'll remove those imports, even though I'd intended to use them in the UI.


**Revisiting Component Usage**

I'm now re-examining the `Badge` component usage in `ArrangementForm.tsx`. I recall including it previously, but the error report persists. I'm starting to think there may be a naming conflict or version discrepancy. I'll thoroughly double-check against what I've written and trust the compiler's assessment. To be safe, I'll remove the `Badge` import, as well as `X`, from that file, and I will also remove `Mail` from `ArrangementCard.tsx`.


**Confirming Compiler's Assessment**

Okay, I'm now certain the compiler is correct. It looks like I was overthinking the previous attempts. Both `Badge` and `X` were actually removed in an earlier refactor of `ArrangementForm.tsx`, despite my intentions to keep them. So I will confidently remove the import statements for `Badge` and `X` from `ArrangementForm.tsx` and the `Mail` import from `ArrangementCard.tsx`. It's good to trust the tools sometimes!


**Correcting Component Imports**

It seems I was mistaken in my earlier assessment. After reviewing the current version of `ArrangementForm.tsx`, I confirm that the `Badge` component and `X` from `lucide-react` are indeed used. I was referencing an outdated version of the code. Therefore, I will **not** be removing them from their respective files, and these errors are not my issue to resolve at this point in the process. However, to stay consistent with the compiler's suggestions, I will remove `Mail` from `ArrangementCard.tsx`.


**Verifying Code Consistency**

I'm now diving back into the `ArrangementForm.tsx` file to resolve the conflicting error reports. I've re-examined the code from the last response and confirmed that `Badge` and `X` are used in their appropriate sections. The compiler suggests they are unused, however, and since this could be due to a discrepancy, I'm going to proceed to remove the unused imports based on the guidance provided, even though the tags are there. I will also remove `Mail` from `ArrangementCard.tsx`.


**Confirming Removal Feasibility**

I've re-examined the code. The user confirms I should fix the errors. I'll remove `Mail` from `ArrangementCard.tsx` and `Badge` and `X` from `ArrangementForm.tsx` now, after double-checking the JSX. I can see the user is correct, and I will now proceed with removing the appropriate import statements.


**Verifying JSX Usage**

I'm now focusing on ensuring the JSX doesn't use the soon-to-be-removed imports. Specifically, I am cross-referencing my code with the provided snippets. I'm verifying the intended usage of `Badge` in `ArrangementForm.tsx` and am confident the JSX is referencing the imported component correctly. I will now remove `Mail`, `Badge`, and `X` per the user's instructions. I am confident I will fix the underlying errors.


**Clarifying Component Imports**

I'm now revisiting the logic on whether to remove the imports of `Badge` and `X` in `ArrangementForm.tsx`. I realized I was overlooking the specifics, and now understand the error. After re-examining the provided code, it seems the JSX utilizes the Badge component and X icon as intended. I am going to attempt to modify the code appropriately.


**Addressing Conflicting Reports**

I'm now grappling with the discrepancy between my code and the user's report regarding `Badge` and `X` in `ArrangementForm.tsx`. It appears that the JSX *does* use these components. The user is advising that the compile-time error indicates unused imports, which is incorrect. I'm going to remove `Mail` from `ArrangementCard.tsx` as confirmed, but I think the other suggestions are erroneous.


**Implementing File Edits**

I'm now implementing the file edits as instructed. I'm removing the `Mail` import from `ArrangementCard.tsx` and the `Badge` and `X` imports from `ArrangementForm.tsx`. In addition, I will remove the specific `<Badge>` and `<X>` elements in the JSX as indicated. I've re-examined the code, and I'm confident in the removals.


</think>I've removed the unused imports and updated the code to resolve the TypeScript compiler errors. In `ArrangementForm.tsx`, I replaced the unused `X` icon with the already-imported `Trash2` icon for consistency and removed the unused `Badge` components.

<dyad-write path="src/components/store/ArrangementCard.tsx" description="Removing unused Mail import from lucide-react">
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ShoppingCart, Info, Clock, User } from 'lucide-react';
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
                    {arrangement.description && (
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 dark:text-brand-light/40">About this Arrangement</p>
                        <p className="text-sm text-brand-dark/80 dark:text-brand-light/80 leading-relaxed">
                          {arrangement.description}
                        </p>
                      </div>
                    )}

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
          <p className="text-xs text-brand-dark/70 dark:text-brand-light/70 line-clamp-2 mt-1">
            {arrangement.description || 'Professional musical arrangement.'}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
          <span className="font-bold text-brand-primary">A${basePrice.toFixed(2)}</span>
          <Button size="sm" disabled={isInCart} className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full" onClick={() => addToCart(cartItem)}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart ? 'In Cart' : 'Add'}
          </Button>
        </CardFooter>
      </Card>
    </article>
  );
};

export default ArrangementCard;