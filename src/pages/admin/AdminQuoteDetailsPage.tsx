import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Quote } from '@/types/quote';
// ... other imports

// Removed local interface QuoteWithStatus as the global Quote now includes 'Created'
// interface QuoteWithStatus extends Quote {
//   status: 'Draft' | 'Created' | 'Sent' | 'Accepted' | 'Rejected';
// }

const AdminQuoteDetailsPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  // Use Quote type directly
  const [quote, setQuote] = useState<Quote | null>(null);
  // ...

  // Fix for TS2345: The spread operator ensures all properties of Quote are present, 
  // and the updated Quote type now allows null for accepted_at/rejected_at.
  const handleResetQuote = useCallback(async () => {
    try {
      // ... API call
      showSuccess('Quote status reset to Created.');
      // Manually update state to reflect change without full refetch
      setQuote(prev => prev ? { ...prev, accepted_at: null, rejected_at: null, status: 'Created' } : null);
    } catch (error: any) {
      showError(`Failed to reset quote: ${error.message}`);
    }
  }, []);
  // ... rest of the component
};

export default AdminQuoteDetailsPage;