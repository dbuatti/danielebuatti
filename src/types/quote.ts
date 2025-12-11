export interface QuoteItem {
  id: string;
  name: string; // Short title/name of the item
  description?: string; // Detailed description (new field)
  quantity: number;
  price: number; // Cost per unit
}

export interface QuoteDetails {
  depositPercentage: number;
  paymentTerms: string;
  bankDetails: {
    bsb: string;
    acc: string;
  };
  addOns: QuoteItem[];
  compulsoryItems: QuoteItem[];
  currencySymbol: string;
  eventTime?: string;
  theme: 'default' | 'livePiano'; // New field for theme selection
  headerImageUrl?: string; // New field for header image
}

export interface Quote {
  id: string;
  client_name: string;
  client_email: string;
  event_title: string;
  invoice_type: string;
  event_date: string;
  event_location: string;
  prepared_by: string;
  total_amount: number;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
  slug: string; // Added slug (Fix Error 6)
  details: QuoteDetails;
}