"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Music, ShoppingCart, Clock, User, ArrowLeft, ShieldCheck, Download, Info } from 'lucide-react';
import { useCart } from '@/components/store/CartProvider';
import { CartDrawer } from '@/components/store/CartDrawer'; // Import CartDrawer
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SeoMetadata from '@/components/SeoMetadata';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ArrangementDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [arrangement, setArrangement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchArrangement = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('arrangements')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        console.error('Error fetching arrangement:', error);
        toast.error('Arrangement not found');
        navigate('/store');
      } else {
        setArrangement(data);
        setSelectedKeys([data.key].filter(Boolean));
      }
      setIsLoading(false);
    };

    if (slug) fetchArrangement();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!arrangement) return null;

  const isInCart = items.some(i => i.id === arrangement.id);
  const previewUrl = arrangement.preview_image_path 
    ? supabase.storage.from('arrangement-previews').getPublicUrl(arrangement.preview_image_path).data.publicUrl 
    : null;

  const basePrice = arrangement.price || 0;
  const additionalPrice = arrangement.additional_key_price || 0;
  const currentPrice = selectedKeys.length > 0 
    ? basePrice + (Math.max(0, selectedKeys.length - 1) * additionalPrice)
    : basePrice;

  const allAvailableKeys = [
    { key: arrangement.key, isDefault: true },
    ...(arrangement.key_variants || []).map((v: any) => ({ key: v.key, isDefault: false }))
  ].filter(k => k.key);

  const toggleKey = (keyName: string) => {
    setSelectedKeys(prev => 
      prev.includes(keyName) 
        ? prev.filter(k => k !== keyName) 
        : [...prev, keyName]
    );
  };

  const handleAddToCart = () => {
    addToCart({
      id: arrangement.id,
      title: arrangement.title,
      price: currentPrice,
      composer: arrangement.composer || 'Unknown',
      selectedKeys: selectedKeys,
    });
    toast.success('Added to cart!');
  };

  // SEO Title & Description
  const seoTitle = `${arrangement.title} - ${arrangement.composer} - Sheet Music Arrangement | Daniele Buatti`;
  const seoDescription = `Professional ${arrangement.instrumentation || 'piano'} arrangement of ${arrangement.title} by ${arrangement.composer}. Available in ${allAvailableKeys.map(k => k.key).join(', ')}. Instant digital download.`;

  // Structured Data for Google Product Search
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": arrangement.title,
    "image": previewUrl,
    "description": arrangement.description || seoDescription,
    "brand": {
      "@type": "Brand",
      "name": "Daniele Buatti"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "AUD",
      "price": basePrice,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark">
      <SeoMetadata 
        title={seoTitle}
        description={seoDescription}
        image={previewUrl || undefined}
        url={window.location.href}
      />
      <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" className="hover:bg-brand-secondary/10">
            <Link to="/store">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
            </Link>
          </Button>
          <CartDrawer />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Preview Image */}
          <div className="space-y-6">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden border-4 border-brand-secondary/20 shadow-2xl bg-white dark:bg-brand-dark-alt">
              {previewUrl ? (
                <img src={previewUrl} alt={`${arrangement.title} Score Preview`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="h-24 w-24 text-brand-secondary/20" />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-brand-secondary/5 border border-brand-secondary/10 text-center">
                <Clock className="h-5 w-5 mx-auto mb-2 text-brand-primary" />
                <p className="text-[10px] uppercase font-bold opacity-40">Duration</p>
                <p className="text-sm font-bold">{arrangement.duration || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-secondary/5 border border-brand-secondary/10 text-center">
                <User className="h-5 w-5 mx-auto mb-2 text-brand-primary" />
                <p className="text-[10px] uppercase font-bold opacity-40">Difficulty</p>
                <p className="text-sm font-bold">{arrangement.difficulty || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-secondary/5 border border-brand-secondary/10 text-center">
                <Music className="h-5 w-5 mx-auto mb-2 text-brand-primary" />
                <p className="text-[10px] uppercase font-bold opacity-40">Format</p>
                <p className="text-sm font-bold">PDF</p>
              </div>
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-dark dark:text-brand-light tracking-tight">
                {arrangement.title}
              </h1>
              <p className="text-2xl text-brand-primary font-serif italic">
                Arrangement by {arrangement.composer || 'Unknown'}
              </p>
            </div>

            {arrangement.description && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-brand-dark/70 dark:text-brand-light/70 leading-relaxed">
                  {arrangement.description}
                </p>
              </div>
            )}

            <Separator className="bg-brand-secondary/20" />

            {/* Key Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-dark/40 dark:text-brand-light/40">
                  Available Keys
                </h3>
                {additionalPrice > 0 && (
                  <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full font-bold">
                    +A${additionalPrice.toFixed(2)} per extra key
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAvailableKeys.map((k) => (
                  <div 
                    key={k.key} 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
                      selectedKeys.includes(k.key) 
                        ? "border-brand-primary bg-brand-primary/5 shadow-md" 
                        : "border-brand-secondary/20 hover:border-brand-primary/30"
                    )}
                    onClick={() => toggleKey(k.key)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={selectedKeys.includes(k.key)} className="data-[state=checked]:bg-brand-primary" />
                      <span className="font-bold text-sm">{k.key}</span>
                    </div>
                    {k.isDefault && <span className="text-[8px] uppercase font-black opacity-30">Orig</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-brand-secondary/10 dark:bg-brand-dark-alt border border-brand-secondary/20 space-y-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold uppercase tracking-widest opacity-40">Total Investment</span>
                <div className="text-right">
                  <p className="text-4xl font-bold text-brand-primary">A${currentPrice.toFixed(2)}</p>
                  {selectedKeys.length > 1 && (
                    <p className="text-[10px] font-bold opacity-40 mt-1">{selectedKeys.length} Keys Selected</p>
                  )}
                </div>
              </div>

              {arrangement.is_purchasable ? (
                <Button 
                  size="lg" 
                  className="w-full h-16 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white text-xl font-bold shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.02]"
                  onClick={handleAddToCart}
                  disabled={selectedKeys.length === 0}
                >
                  <ShoppingCart className="mr-2 h-6 w-6" />
                  {isInCart ? 'Add Another Set' : 'Add to Cart'}
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="w-full h-16 rounded-full border-brand-primary text-brand-primary" asChild>
                  <Link to={`/contact?subject=Inquiry: ${encodeURIComponent(arrangement.title)}`}>
                    Inquire for Purchase
                  </Link>
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                  <ShieldCheck className="h-4 w-4 text-green-500" /> Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                  <Download className="h-4 w-4 text-blue-500" /> Instant Download
                </div>
              </div>
            </div>

            {arrangement.lyrics && (
              <div className="p-6 rounded-3xl bg-brand-secondary/5 border border-brand-secondary/10 italic text-brand-dark/60 dark:text-brand-light/60">
                <p className="text-[10px] uppercase font-bold not-italic mb-3 opacity-40 tracking-widest">Lyrics Snippet</p>
                "{arrangement.lyrics}"
              </div>
            )}
          </div>
        </div>

        {/* Trust Section */}
        <section className="mt-24 grid md:grid-cols-3 gap-8 border-t border-brand-secondary/20 pt-16">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
              <Download className="h-5 w-5" />
            </div>
            <h4 className="font-bold">Instant Delivery</h4>
            <p className="text-sm text-brand-dark/60 dark:text-brand-light/60">Receive your PDF scores immediately via email after a successful checkout.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
              <Music className="h-5 w-5" />
            </div>
            <h4 className="font-bold">Professional Quality</h4>
            <p className="text-sm text-brand-dark/60 dark:text-brand-light/60">Arrangements used in professional musical theatre and cabaret settings.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
              <Info className="h-5 w-5" />
            </div>
            <h4 className="font-bold">Custom Requests</h4>
            <p className="text-sm text-brand-dark/60 dark:text-brand-light/60">Need a specific key or instrumentation? Contact Daniele for custom transpositions.</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArrangementDetailsPage;