import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrangementCard } from '@/components/store/ArrangementCard';
import { CartDrawer } from '@/components/store/CartDrawer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Music, BookOpen, Download, ShieldCheck, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { CartProvider } from '@/components/store/CartProvider';
import SeoMetadata from '@/components/SeoMetadata';
import StoreStructuredData from '@/components/store/StoreStructuredData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I receive my sheet music after purchase?",
    answer: "Immediately after a successful checkout via Stripe, you will receive an automated email containing secure download links for your PDF scores and any included secondary files (like instrumental parts or audio tracks)."
  },
  {
    question: "Are these arrangements suitable for professional performance?",
    answer: "Yes. Every arrangement in the store is crafted by Daniele Buatti, a professional Music Director and Pianist, with performance practicality and musical integrity in mind. They are used regularly in professional musical theatre and cabaret settings."
  },
  {
    question: "Can I request a transposition of an existing arrangement?",
    answer: "Absolutely. If you need a specific arrangement in a different key, please use the contact form to send an inquiry. Custom transpositions are usually processed within 48 hours for a small additional fee."
  },
  {
    question: "What is included in a 'Digital Download'?",
    answer: "Most downloads include a full Piano/Vocal score in PDF format. Some arrangements also include separate instrumental parts or rehearsal backing tracks where specified in the item details."
  }
];

const StoreFaqSection: React.FC = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="mt-24 pt-16 border-t border-brand-secondary/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary mb-4">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Frequently Asked Questions</h2>
          <p className="text-brand-dark/60 dark:text-brand-light/60">Everything you need to know about our digital sheet music store.</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-brand-secondary/20">
              <AccordionTrigger className="text-left font-semibold text-brand-dark dark:text-brand-light hover:text-brand-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-brand-dark/70 dark:text-brand-light/70 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

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
        .eq('status', 'published')
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
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark">
      <SeoMetadata 
        title="Sheet Music Store | Professional Piano & Vocal Arrangements | Daniele Buatti"
        description="Browse a curated collection of professional sheet music PDFs, piano arrangements, and vocal scores. Instant digital downloads for performers and educators."
        url={`${window.location.origin}/store`}
      />
      <StoreStructuredData arrangements={arrangements} />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark dark:text-brand-light tracking-tight">
              Music Arrangement <span className="text-brand-primary">Store</span>
            </h1>
            <p className="text-lg text-brand-dark/60 dark:text-brand-light/60 max-w-2xl">
              Professional sheet music, piano transcriptions, and vocal arrangements. Digital downloads delivered instantly.
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

        {/* SEO Content Section */}
        <section className="mt-24 pt-16 border-t border-brand-secondary/20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-brand-dark dark:text-brand-light">Professional Music Arrangements & Sheet Music</h2>
              <p className="text-brand-dark/60 dark:text-brand-light/60 leading-relaxed">
                Explore a curated collection of professional sheet music PDFs designed for performers, educators, and ensembles. 
                From contemporary musical theatre vocal selections to classic jazz piano transcriptions, each arrangement is 
                crafted with professional performance standards in mind.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-bold">Expertly Crafted Scores</h3>
                <p className="text-sm text-brand-dark/60 dark:text-brand-light/60">
                  Arrangements by Daniele Buatti, drawing on over 12 years of experience as a Music Director and Pianist.
                </p>
              </div>
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="font-bold">Instant PDF Delivery</h3>
                <p className="text-sm text-brand-dark/60 dark:text-brand-light/60">
                  Receive secure download links for your sheet music instantly via email after a successful checkout.
                </p>
              </div>
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-bold">Secure Stripe Checkout</h3>
                <p className="text-sm text-brand-dark/60 dark:text-brand-light/60">
                  Safe and secure payments processed via Stripe, supporting all major credit cards globally.
                </p>
              </div>
            </div>

            <div className="bg-brand-secondary/5 p-8 rounded-[2rem] border border-brand-secondary/10">
              <h3 className="text-xl font-bold mb-4 text-center">Custom Arrangements & Transcriptions</h3>
              <p className="text-brand-dark/70 dark:text-brand-light/70 text-center leading-relaxed">
                Can't find the specific score you're looking for? I also offer custom transcription and arrangement services 
                tailored to your specific vocal range, key, and instrumentation. Whether it's a unique audition cut 
                or a full ensemble score, feel free to reach out for a custom quote.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <StoreFaqSection />
      </main>
      
      <Footer />
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