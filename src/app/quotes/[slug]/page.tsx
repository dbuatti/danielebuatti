import { Metadata } from 'next'; // Fix TS2307
import { fetchQuoteBySlug } from '@/lib/data'; 
import QuoteDisplay from '@/components/admin/QuoteDisplay';
import NotFoundPage from '@/components/NotFoundPage'; 
// ... rest of the file