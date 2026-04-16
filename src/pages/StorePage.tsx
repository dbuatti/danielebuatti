import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrangementCard } from '@/components/store/ArrangementCard';
import { CartDrawer } from '@/components/store/CartDrawer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { CartProvider } from '@/components/store/CartProvider';

const StorePageContent: React.FC = () => {
  const [arrangements, setArrangements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Purchase successful! Check your email for download links.', {
        duration: 10000,
      });
    }
    if (searchParams.get('canceled')) {
      toast.error('Checkout canceled.');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchArrangements = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('arrangements')
        .select('*')
        .eq('status', 'published') // Only show published items
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load arrangements');
      } else {
        setArrangements(data || []);
      }
      setIsLoading(false);
    };

    fetchArrangements();
  }, []);

  const filteredArrangements = arrangements.filter(arr => {
    const matchesSearch = arr.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         arr.composer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstrument = instrumentFilter === 'all' || arr.instrumentation?.includes(instrumentFilter);
    const matchesDifficulty = difficultyFilter === 'all' || arr.difficulty === difficultyFilter;
    
    return matchesSearch && matchesInstrument && matchesDifficulty;
  });

  const instruments = Array.from(new Set(arrangements.map(a => a.instrumentation).filter(Boolean)));
  const difficulties = Array.from(new Set(arrangements.map(a => a.difficulty).filter(Boolean)));

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark dark:text-brand-light tracking-tight">
            Music Arrangement <span className="text-brand-primary">Store</span>
          </h1>
          <p className="text-lg text-brand-dark/60 dark:text-brand-light/60 max-w-2xl">
            Browse and purchase professional scores and arrangements. Digital downloads delivered instantly via email.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CartDrawer />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 bg-brand-secondary/5 p-4 rounded-2xl border border-brand-secondary/10">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/40" />
          <Input 
            placeholder="Search by title or composer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-brand-dark border-brand-secondary/20 h-11"
          />
        </div>
        <Select value={instrumentFilter} onValueChange={setInstrumentFilter}>
          <SelectTrigger className="bg-white dark:bg-brand-dark border-brand-secondary/20 h-11">
            <SelectValue placeholder="Instrumentation" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-brand-dark border-brand-secondary/20">
            <SelectItem value="all">All Instruments</SelectItem>
            {instruments.map(inst => (
              <SelectItem key={inst} value={inst}>{inst}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="bg-white dark:bg-brand-dark border-brand-secondary/20 h-11">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-brand-dark border-brand-secondary/20">
            <SelectItem value="all">All Difficulties</SelectItem>
            {difficulties.map(diff => (
              <SelectItem key={diff} value={diff}>{diff}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-brand-primary mb-4" />
          <p className="text-brand-dark/60 font-medium">Loading arrangements...</p>
        </div>
      ) : filteredArrangements.length === 0 ? (
        <div className="text-center py-32 bg-brand-secondary/5 rounded-3xl border-2 border-dashed border-brand-secondary/20">
          <div className="h-20 w-20 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="h-10 w-10 text-brand-secondary/30" />
          </div>
          <h3 className="text-2xl font-bold text-brand-dark dark:text-brand-light mb-2">No arrangements found</h3>
          <p className="text-brand-dark/60 dark:text-brand-light/60 max-w-md mx-auto">
            We couldn't find any arrangements matching your current search or filters. Try clearing them or searching for something else.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredArrangements.map((arr) => (
            <ArrangementCard key={arr.id} arrangement={arr} />
          ))}
        </div>
      )}
    </div>
  );
};

const StorePage: React.FC = () => {
  return (
    <CartProvider>
      <StorePageContent />
    </CartProvider>
  );
};

export default StorePage;