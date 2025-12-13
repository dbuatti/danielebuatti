// ... imports

// ... mapFormValuesToQuote function

const mapQuoteToFormValues = (quote: Quote): QuoteFormValues => {
  // ... existing logic

  return {
    // ... existing fields
    
    // Fixed: null is now allowed (Error 12, 13)
    accepted_at: quote?.accepted_at || null, 
    rejected_at: quote?.rejected_at || null,
    created_at: quote?.created_at || new Date().toISOString(),
    
    // Fixed: 'Created' is now allowed (Error 14)
    status: quote?.status || 'Created', 
  };
};

// ... rest of the component